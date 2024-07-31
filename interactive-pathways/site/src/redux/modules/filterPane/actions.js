import types from './types';

export const updateFilter = dispatch => update =>
  dispatch({
    type: types.UPDATE_FILTER,
    payload: update,
  });

export const switchFilterPlaceholders = dispatch => () =>
  dispatch({
    type: types.PLACEHOLDER_SWITCH_FILTER,
  });

export const resetFilter = dispatch => () =>
  dispatch({
    type: types.RESET_FILTER,
  });
