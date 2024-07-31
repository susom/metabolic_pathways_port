import types from './types';

export const updateFocus = dispatch => update =>
  dispatch({
    type: types.UPDATE_FOCUS,
    payload: update,
  });

export const switchFastingState = dispatch => () =>
  dispatch({
    type: types.FASTING_FOCUS,
  });

export const switchFedState = dispatch => () =>
  dispatch({
    type: types.FED_FOCUS,
  });

export const resetFocus = dispatch => () =>
  dispatch({
    type: types.RESET_FOCUS,
  });
