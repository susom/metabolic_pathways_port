import {
  replace,
} from 'ramda';
/** escapeRegExp :: String -> String */
// $& means the whole matched string
export default replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
