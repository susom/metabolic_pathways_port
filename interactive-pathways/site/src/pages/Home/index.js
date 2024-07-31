import {
  connect,
} from 'react-redux';

import {
  closeSidebar,
  openSidebar,
} from 'redux/modules/sidebar/actions';

import storeNames from 'redux/modules/storeNames';

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
