import {
  compose,
  map,
  replace,
  split,
  trim,
} from 'ramda';

// String -> [String]
export default compose(
  map(trim),
  map(replace(/\)/g, '')),
  split('('),
);
