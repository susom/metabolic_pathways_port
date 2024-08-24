const config = {
  spreadSheetId: '1k8xIVzpx5aV839SHc-FzGTSHTDyLhYl8yVqyCjPj5ck',
  spreadSheetTabName: 'Unique Text Dump',
  // Double check that `spreadSheetRange` and `typeColumnOffset` are correct!
  spreadSheetRange: 'A1:I',
  typeColumnOffset: 3,
};

const {
  createGreekEquivalentNames,
  replaceGreekPhoneticWithGreekLetters,
} = require('./utils/greek');

const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

const R = require('ramda');
const S = require('underscore.string.fp');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Sheets API.
  authorize(JSON.parse(content), getSubstancesAndTypes);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error while trying to retrieve access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Creates substanceTypeCollection.json and substanceList.json
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
function getSubstancesAndTypes(auth) {
  const sheets = google.sheets({version: 'v4', auth});
  sheets.spreadsheets.values.get({
    spreadsheetId: config.spreadSheetId,
    range: `${config.spreadSheetTabName}!${config.spreadSheetRange}`,
  }, (err, res) => {
    if (err) { return console.log('The API returned an error: ' + err); }
    const rows = res.data.values;
    if (!rows.length) { return console.log('No data found.'); }

    const heading = R.head(rows);

    const substanceTypeCollection =
      R.compose(
        R.addIndex(R.reduce)(
          (acc, name, idx) => {
            const id = idx + 1;
            return ({
              ...acc,
              [id]: name,
            });
          },
          {},
        ),
        R.reject(R.isEmpty),
        R.drop(config.typeColumnOffset),
      )(heading);

    // [{ id, name, equivalentNameList, substanceTypeId }]
    const substanceList = R.compose(
      R.addIndex(R.map)(
        (row, idx) => {
          const id = idx + 1;
          const substanceTypeId = row.length - config.typeColumnOffset;
          const name = row[0];
          const alternateNames = row[1] && R.compose(
            R.map(S.clean),
            R.split(/,/g),
          )(row[1]) || [];
          const drugDiseaseNames = row[2] && R.compose(
            R.map(S.clean),
            R.split(/,/g),
          )(row[2]) || [];

          const nameList = R.compose(
            R.reject(R.isEmpty),
            R.dropRepeats,
            arr => arr.sort(),
            R.chain(createGreekEquivalentNames),
            R.map(S.clean),
            R.map(R.replace(/\)/g, '')),
            R.chain(R.split('(')),
          )(R.concat(
            [name],
            R.concat(
              alternateNames,
              drugDiseaseNames,
            ),
          ));

          // [String] -> [String]
          const equivalentNameList = R.compose(
            // keep word and create a version without dashes
            R.chain(w => [w, R.replace(/-/g, '', w)]),
            // keep word and create a version without spaces
            R.chain(w => [w, R.replace(/\s/g, '', w)]),
          )(nameList);

          return ({
            equivalentNameList,
            id,
            name: replaceGreekPhoneticWithGreekLetters(name),
            nameList,
            substanceTypeId,
          });
        }
      ),
      R.tail, // removes heading
    )(rows);

    fs.writeFile(
      './out/substanceTypeCollection.json',
      JSON.stringify(substanceTypeCollection),
      {
        encoding: 'utf8',
      },
      () => console.log('Wrote substanceTypeCollection.json')
    );

    // fs.writeFile(
    //   './substanceList.json',
    //   JSON.stringify(substanceList),
    //   {
    //     encoding: 'utf8',
    //   },
    //   () => console.log('Wrote substanceList.json')
    // );
  });
}
