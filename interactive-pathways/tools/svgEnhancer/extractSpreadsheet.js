const config = {
    spreadSheetId: '1k8xIVzpx5aV839SHc-FzGTSHTDyLhYl8yVqyCjPj5ck',
    spreadSheetTabName: 'Unique Text Dump',
    spreadSheetRange: 'A1:I',
    typeColumnOffset: 3,
};

const {
    createGreekEquivalentNames,
    replaceGreekPhoneticWithGreekLetters,
} = require('./utils/greek');

const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

const R = require('ramda');
const S = require('underscore.string.fp');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const TOKEN_PATH = 'token.json';

fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    authorize(JSON.parse(content), getSubstancesAndTypes);
});

function authorize(credentials, callback) {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getNewToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    });
}

function getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this URL:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error while trying to retrieve access token', err);
            oAuth2Client.setCredentials(token);
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
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

        const heading = R.head(rows);

        const substanceTypeCollection = R.compose(
            R.addIndex(R.reduce)(
                (acc, name, idx) => {
                    const id = idx + 1;
                    return {
                        ...acc,
                        [id]: name,
                    };
                },
                {},
            ),
            R.reject(R.isEmpty),
            R.drop(config.typeColumnOffset),
        )(heading);

        const substanceList = R.compose(
            R.addIndex(R.map)((row, idx) => {
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

                const equivalentNameList = R.compose(
                    R.chain(w => [w, R.replace(/-/g, '', w)]),
                    R.chain(w => [w, R.replace(/\s/g, '', w)]),
                )(nameList);

                return {
                    equivalentNameList,
                    id,
                    name: replaceGreekPhoneticWithGreekLetters(name),
                    nameList,
                    substanceTypeId,
                };
            }),
            R.tail,
        )(rows);

        fs.writeFile(
            './out/substanceTypeCollection.json',
            JSON.stringify(substanceTypeCollection),
            { encoding: 'utf8' },
            () => console.log('Wrote substanceTypeCollection.json')
        );

        // Commenting out this section as it's no longer needed
        // fs.writeFile(
        //   './substanceList.json',
        //   JSON.stringify(substanceList),
        //   { encoding: 'utf8' },
        //   () => console.log('Wrote substanceList.json')
        // );
    });
}
