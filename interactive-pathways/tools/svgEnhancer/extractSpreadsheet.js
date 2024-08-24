const { google } = require('googleapis');
const fs = require('fs');
const R = require('ramda');
const S = require('underscore.string.fp');
const { createGreekEquivalentNames, replaceGreekPhoneticWithGreekLetters } = require('./utils/greek');

const config = {
    spreadSheetId: '1k8xIVzpx5aV839SHc-FzGTSHTDyLhYl8yVqyCjPj5ck',
    spreadSheetTabName: 'Unique Text Dump',
    spreadSheetRange: 'A1:I',
    typeColumnOffset: 3,
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

        fs.writeFile(
            './substanceList.json',
            JSON.stringify(substanceList),
            { encoding: 'utf8' },
            () => console.log('Wrote substanceList.json')
        );
    });
}

(async () => {
    const auth = await authenticate();
    if (auth) {
        getSubstancesAndTypes(auth);
    }
})();
