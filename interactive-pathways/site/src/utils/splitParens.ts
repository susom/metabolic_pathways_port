import {
  compose,
  map,
  replace,
  split,
  trim,
} from 'ramda';

// String -> [String]
export default (str: string) : string[] =>
  compose(
    map(trim),
    map(replace(/\)/g, '')),
    split('('),
  )(str);
