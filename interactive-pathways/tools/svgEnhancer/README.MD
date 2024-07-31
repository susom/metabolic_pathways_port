Steps to run this project

1. Install packages via `npm ci`
2. Get Google Sheets API credentials.
- Go here `https://developers.google.com/sheets/api/quickstart/nodejs`
3. Put fresh unmodified SVG here and call it `map.svg`.
4. Make sure the config object in `extractSpreadsheet.js` is correct.
5. Run `npm start`

Output files:
- out/enhanced.svg
- out/textCollection.json
- out/keywordList.json
- out/substanceIdCollection.json
- out/substanceTypeCollection.json
- substanceList.json # not used by site
