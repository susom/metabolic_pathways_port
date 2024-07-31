import types from './types';

const initialState = {
  open: true,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.OPEN_SIDEBAR:
      return ({
        ...state,
        open: true,
      });
    case types.CLOSE_SIDEBAR:
      return ({
        ...state,
        open: false,
      });
    default:
      return state;
  }
};
