const { google } = require('googleapis');
const fs = require('fs');
const R = require('ramda');
const S = require('underscore.string.fp');
const variablize = require('./utils/variablize');

const config = {
  spreadSheetId: '1k8xIVzpx5aV839SHc-FzGTSHTDyLhYl8yVqyCjPj5ck',
  spreadSheetTabName: 'Jon',
  spreadSheetRange: 'A1:Z',
};

async function authenticate() {
  const auth = new google.auth.JWT({
    keyFile: './credentials.json', // Path to your service account key file
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  try {
    await auth.authorize();
    console.log('Successfully connected!');
    return auth;
  } catch (error) {
    console.error('Error connecting to Google Sheets API:', error);
  }
}

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
        { encoding: 'utf8' },
        () => console.log('Wrote reactionList.json')
    );

  });
}

(async () => {
  const auth = await authenticate();
  if (auth) {
    getSubstancesAndTypes(auth);
  }
})();
