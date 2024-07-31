import {
  map,
} from 'ramda';

import types from './types';
import storeKeys from './storeKeys';

import {
  cycleCollection,
  neighborhoodCollection,
} from 'config/focusCoverNameCollection';

const showByDefault = false;

const initialState = {
  [storeKeys.FOCUS_COLLECTION]: map(() => showByDefault, cycleCollection),
  [storeKeys.FED_STATE_BOOL]: false,
  [storeKeys.FASTING_STATE_BOOL]: false,
};


export default (state = initialState, action) => {
  switch (action.type) {
    case types.UPDATE_FOCUS:
      return ({
        ...state,
        [storeKeys.FOCUS_COLLECTION]: {
          ...state[storeKeys.FOCUS_COLLECTION],
          ...action.payload,
        },
      });
    case types.FASTING_FOCUS:
      return ({
        ...state,
        [storeKeys.FASTING_STATE_BOOL]: !state[storeKeys.FASTING_STATE_BOOL],
        [storeKeys.FED_STATE_BOOL]: false,
      });
    case types.FED_FOCUS:
      return ({
        ...state,
        [storeKeys.FASTING_STATE_BOOL]: false,
        [storeKeys.FED_STATE_BOOL]: !state[storeKeys.FED_STATE_BOOL],
      });
    case types.RESET_FOCUS:
      return initialState;
    default:
      return state;
  }
};
