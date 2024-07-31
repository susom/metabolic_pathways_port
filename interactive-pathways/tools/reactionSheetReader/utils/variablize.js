const R = require('ramda');
const S = require('underscore.string.fp');

module.exports = R.compose(
  S.camelize,
  R.replace(/[^A-z\s\d]*(\b\d)*/g, ''),
  S.clean,
);
