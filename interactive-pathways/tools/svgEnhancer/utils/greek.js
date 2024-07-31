const R = require('ramda');
const S = require('underscore.string.fp');

const greekAlphabet = 'αβγδ';
const latinTransliteration = ['a','b','g','d'];
const greekEnglishPhoneticAlphabet = ['alpha','beta','gamma','delta'];
const bioChemGreekEquivalentNumbers = R.range(2,6);

// String -> Boolean
const hasGreek = R.test(/[\u0370-\u03FF]/ig);

// String -> Boolean
const hasGreekPhonetic = word => R.any(
  l => R.test(new RegExp(l, 'gi'), word)
)(greekEnglishPhoneticAlphabet);

// [String] -> [String] -> String -> String
const replaceCharacters = characterSetA => characterSetB => word =>
  R.compose(
    R.addIndex(R.reduce)(
      (acc, l, i) => R.replace(new RegExp(l, 'gi'), characterSetB[i], acc),
      word
    ),
  )(characterSetA);

// [String] -> String -> String
const replaceGreekAlphabet = replaceCharacters(greekAlphabet);

// [String] -> String -> String
const replaceGreekPhoneticAlphabet =
  replaceCharacters(greekEnglishPhoneticAlphabet);

// [String] -> String -> String
const replaceBothGreekAndGreekPhoneticAlphabets = characterSet => R.compose(
  replaceGreekAlphabet(characterSet),
  replaceGreekPhoneticAlphabet(characterSet),
);

// String -> [String]
const createGreekEquivalentNames = name => {
  if (!hasGreek(name) && !hasGreekPhonetic(name)) { return [name] };

  const nameWithLatinTrans =
    replaceBothGreekAndGreekPhoneticAlphabets(latinTransliteration)(name);
  const nameWithGreekNumberEquivalent =
    replaceBothGreekAndGreekPhoneticAlphabets
      (bioChemGreekEquivalentNumbers)
      (name);
  const nameWithBlankGreek = R.compose(
    S.trim('-'),
    replaceBothGreekAndGreekPhoneticAlphabets
      (R.repeat('', greekEnglishPhoneticAlphabet.length)),
  )(name);

  const nameWithGreekPhoentic =
    replaceGreekAlphabet(greekEnglishPhoneticAlphabet)(name);
  const nameWithGreek = replaceGreekPhoneticAlphabet(greekAlphabet)(name);

  return [
    nameWithGreek,
    nameWithGreekPhoentic,
    nameWithLatinTrans,
    nameWithGreekNumberEquivalent,
    nameWithBlankGreek,
  ];
};

// String -> String
const replaceGreekPhoneticWithGreekLetters =
  replaceGreekPhoneticAlphabet(greekAlphabet);

module.exports = {
  createGreekEquivalentNames,
  replaceGreekPhoneticWithGreekLetters,
};
