import {
  connect,
} from 'react-redux';

import storeNames from 'reduxLocal/modules/storeNames';

import focusStoreKeys from 'reduxLocal/modules/focusPane/storeKeys';

import {
  resetFocus,
  switchFastingState,
  switchFedState,
  updateFocus,
} from 'reduxLocal/modules/focusPane/actions';

import FocusPane from './components/index';

const mapStateToProps = ({
  [storeNames.FOCUSPANE_STORE]: {
    [focusStoreKeys.FOCUS_COLLECTION]: collection,
    [focusStoreKeys.FED_STATE_BOOL]: showFed,
    [focusStoreKeys.FASTING_STATE_BOOL]: showFasting,
  },
}) => {
  return ({
    collection,
    showFed,
    showFasting,
  });
};

const mapDispatchToProps = (dispatch) => {
  return ({
    reset: resetFocus(dispatch),
    switchFastingState: switchFastingState(dispatch),
    switchFedState: switchFedState(dispatch),
    update: updateFocus(dispatch),
  });
};

export default connect(mapStateToProps, mapDispatchToProps)(FocusPane);
