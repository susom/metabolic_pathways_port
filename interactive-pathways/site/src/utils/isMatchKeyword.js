import {
  is,
  compose,
  test,
  trim,
} from 'ramda';

import escapeRegExp from 'utils/escapeRegExp';

// String -> String -> Boolean
export default input => keyword =>
  !!input &&
  !!keyword &&
  is(String, input) &&
  is(String, keyword) &&
  compose(
    test(new RegExp(escapeRegExp(input), 'i')),
    trim,
  )(keyword);
