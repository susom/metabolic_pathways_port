const config = {
  spreadSheetId: '1k8xIVzpx5aV839SHc-FzGTSHTDyLhYl8yVqyCjPj5ck',
  spreadSheetTabName: 'Jon',
  spreadSheetRange: 'A1:Z',
};

const fs = require('fs');
const { google } = require('googleapis');
const R = require('ramda');
const S = require('underscore.string.fp');
const variablize = require('./utils/variablize');

// Initialize Google Auth with service account credentials
async function initializeGoogleAuth() {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: './credentials.json', // Path to your service account key file
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const client = await auth.getClient();
    console.log("Successfully connected!");

    // Call the function to get substances and types
    getSubstancesAndTypes(client);
  } catch (err) {
    console.error("Failed to initialize GoogleAuth:", err);
  }
}

/**
 * Creates reactionList.json from the Google Sheets data
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
function getSubstancesAndTypes(auth) {
  const sheets = google.sheets({ version: 'v4', auth });
  sheets.spreadsheets.values.get({
    spreadsheetId: config.spreadSheetId,
    range: `${config.spreadSheetTabName}!${config.spreadSheetRange}`,
  }, (err, res) => {
    if (err) { return console.log('The API returned an error: ' + err); }
    const rows = res.data.values;
    if (!rows.length) { return console.log('No data found.'); }

    const cleanHeading = R.map(
        variablize,
        R.head(rows)
    );

    const reactionList = R.map(
        R.zipObj(cleanHeading),
        R.tail(rows)
    );

    fs.writeFile(
        './reactionList.json',
        JSON.stringify(reactionList),
        {
          encoding: 'utf8',
        },
        () => console.log('Wrote reactionList.json')
    );

  });
}

// Initialize GoogleAuth and run the script
initializeGoogleAuth();
