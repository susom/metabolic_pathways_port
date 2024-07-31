import React from 'react';
import injectSheet from 'react-jss';

import {
  addIndex,
  chain,
  compose,
  identity,
  isEmpty,
  map,
  match,
  prepend,
  reject,
  split,
  zip,
} from 'ramda';

const styles = {
  bold: {
    fontWeight: '700',
  },
};

const BoldTerm = ({
  classes,
  term,
  text,
}) => {
  const regxTerm = RegExp(term, 'gi');
  const notTerm = split(regxTerm, text);
  const matchList = match(regxTerm, text);

  const boldList = compose(
    (matchList.length !== notTerm.length ? prepend('') : identity),
    map(
      match => (
        <b
          className={classes.bold}
        >
          {match}
        </b>
      )
    ),
  )(matchList);

  return (
    <span>
      {
        compose(
          addIndex(map)(
            (t, idx) => (<span key={idx}>{t}</span>)
          ),
          reject(isEmpty),
          chain(identity),
          zip(boldList),
        )(notTerm)
      }
    </span>
  );
};

export default injectSheet(styles)(BoldTerm);
