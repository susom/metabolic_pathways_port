import storeNames from './storeNames';

import sidebar from './sidebar';
import focusPane from './focusPane';
import filterPane from './filterPane';

export default {
  [storeNames.FOCUSPANE_STORE]: focusPane,
  [storeNames.FILTERPANE_STORE]: filterPane,
  [storeNames.SIDEBAR_STORE]: sidebar,
};
