// [Stings] -> [Strings]
const uniqueKeywords = R.compose(
  R.dropRepeats,
  arr => arr.sort(),
  R.filter(item => item.length > 2),
  R.reject(R.isEmpty),
);

module.exports = {
  uniqueKeywords,
};
