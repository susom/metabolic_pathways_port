import types from './types';
import storeKeys from './storeKeys';

import {
  map,
  F,
} from 'ramda';

import substanceTypeCollection from 'assets/substanceTypeCollection.json';

const initialState = {
  // FILTER_COLLECTION - true to remove from map.
  [storeKeys.FILTER_COLLECTION]: map(F, substanceTypeCollection),
  [storeKeys.PLACEHOLDER_SWITCH_BOOL]: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.UPDATE_FILTER:
      return ({
        ...state,
        [storeKeys.FILTER_COLLECTION]: {
          ...state[storeKeys.FILTER_COLLECTION],
          ...action.payload,
        },
      });
    case types.PLACEHOLDER_SWITCH_FILTER:
      return ({
        ...state,
        [storeKeys.PLACEHOLDER_SWITCH_BOOL]:
          !state[storeKeys.PLACEHOLDER_SWITCH_BOOL],
      });
    case types.RESET_FILTER:
      return initialState;
    default:
      return state;
  }
};
