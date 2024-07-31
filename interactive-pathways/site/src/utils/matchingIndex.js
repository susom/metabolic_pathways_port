import {
  compose,
  join,
  map,
  match,
  max,
  reduce,
} from 'ramda';

/* calcMatchIndex :: String -> String -> Float
 * word :: string we're finding matchings in
 * matcher :: string we're searching for */
const calcMatchIndex = matcher => word => compose(
  ls => ls.length / word.length,
  join(''),
  match(new RegExp(matcher, 'gi')),
)(word);

// String -> [String] -> Float
export default term => compose(
  reduce(max, -Infinity),
  map(calcMatchIndex(term)),
);
