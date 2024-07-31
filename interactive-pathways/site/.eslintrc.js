module.exports = {
    env: {
        browser: true,
    },
    extends: [
      'standard',
      'plugin:react/recommended',
    ],
    parser: 'babel-eslint',
    parserOptions: {
      sourceType: 'module',
      allowImportExportEverywhere: true,
    },
    settings: {
      react: {
        version: 16.4,
      },
    },
    rules: {
      'comma-dangle': [
        'error',
        'always'
      ],
      semi: [
        'error',
        'always',
      ],
      'react/prop-types': [
        'off',
        'ignore',
      ],
      'react/display-name': [
        'off',
        'ignore',
      ],
    },
};
