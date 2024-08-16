import {
  connect,
} from 'react-redux';

import {
  closeSidebar,
  openSidebar,
} from 'reduxLocal/modules/sidebar/actions';

import storeNames from 'reduxLocal/modules/storeNames';

import Component from './components';

const mapStateToProps = ({
  [storeNames.SIDEBAR_STORE]: store,
}) => ({
  ...store,
});

const mapDispatchToProps = dispatch => ({
  closeSidebar: () => dispatch(closeSidebar()),
  openSidebar: () => dispatch(openSidebar()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Component);
