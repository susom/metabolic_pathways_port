import {
  connect,
} from 'react-redux';

import storeNames from 'reduxLocal/modules/storeNames';

import filterStoreKeys from 'reduxLocal/modules/filterPane/storeKeys';

import {
  updateFilter,
  switchFilterPlaceholders,
  resetFilter,
} from 'reduxLocal/modules/filterPane/actions';

import FilterPane from './components/index';

const mapStateToProps = ({
  [storeNames.FILTERPANE_STORE]: {
    [filterStoreKeys.FILTER_COLLECTION]: collection,
    [filterStoreKeys.PLACEHOLDER_SWITCH_BOOL]: showPlaceholders,
  },
}) => {
  return ({
    collection,
    showPlaceholders,
  });
};

const mapDispatchToProps = (dispatch) => {
  return ({
    update: updateFilter(dispatch),
    switchPlaceholders: switchFilterPlaceholders(dispatch),
    reset: resetFilter(dispatch),
  });
};

export default connect(mapStateToProps, mapDispatchToProps)(FilterPane);
