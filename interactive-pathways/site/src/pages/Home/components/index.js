import React, {
  PureComponent,
} from 'react';
import injectSheet from 'react-jss';

import {
  Button,
  Tab,
} from 'semantic-ui-react';

import Sidebar from './Sidebar';
import Map from './Map';

import FilterPane from './FilterPane';
import FocusPane from './FocusPane';
import LegendPane from './LegendPane';
import SearchPane from './SearchPane';

import homeConfig from './Home.config';

import colors from 'config/styles/colors';
import sizes from 'config/styles/sizes';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1,
    overflow: 'hidden',
    width: '100vw',
  },
  sideToolBar: { },
  tabPaneContainer: {
    width: '300px',
    backgroundColor: colors.white,
    boxShadow: '0px 1px 2px 0 rgba(34, 36, 38, 0.15)',
    borderRadius: '0.28571429rem',
    border: '1px solid rgba(34, 36, 38, 0.15)',

    [`@media (max-width: ${sizes.xs}px)`]: {
      width: '90vw',
    },
  },
  mapContainer: {
    display: 'flex',
    position: 'relative',
    width: '100vw',
  },
  controlsContainer: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    right: 30,
    bottom: 30,
    zIndex: 1,

    [`@media (max-width: ${sizes.s}px)`]: {
      flexDirection: 'row',
    },
  },
  zoomButtons: {
    marginBottom: '5px !important',
    color: 'gray !important',
    backgroundColor: 'white !important',
  },
  previousButton: {
    position: 'absolute',
    left: 30,
    bottom: '50%',
    zIndex: 1,
    color: 'gray !important',
    backgroundColor: 'white !important',
  },
  nextButton: {
    position: 'absolute',
    right: 30,
    bottom: '50%',
    zIndex: 1,
    color: 'gray !important',
    backgroundColor: 'white !important',
  },
};

const panes = [
  {
    menuItem: 'Search',
    render: () => (
      <Tab.Pane
        attached={false}
      >
        <SearchPane />
      </Tab.Pane>
    ),
  },
  {
    menuItem: 'Filter',
    render: () => (
      <Tab.Pane
        attached={false}
      >
        <FilterPane />
      </Tab.Pane>
    ),
  },
  {
    menuItem: 'Focus',
    render: () => (
      <Tab.Pane
        attached={false}
      >
        <FocusPane />
      </Tab.Pane>
    ),
  },
  {
    menuItem: 'Legend',
    render: () => (
      <Tab.Pane
        attached={false}
      >
        <LegendPane />
      </Tab.Pane>
    ),
  },
];

class MapTools extends PureComponent {
  componentDidMount () {
    // detect IE8 and above, and edge
    if (document.documentMode || /Edge/.test(navigator.userAgent)) {
      setTimeout(
        () => alert(
          'Use Mozilla Firefox or Google Chrome for optimized experience.'),
        5000
      );
    }
  }

  render () {
    const {
      classes,
      closeSidebar,
      open,
      openSidebar,
    } = this.props;

    return (
      <div
        className={classes.container}
      >
        <Sidebar
          className={classes.sideToolBar}
          open={open}
          openSidebar={openSidebar}
          closeSidebar={closeSidebar}
        >
          <Tab
            className={classes.tabPaneContainer}
            menu={{
              secondary: true,
              pointing: true,
            }}
            defaultActiveIndex={0}
            panes={panes}
          />
        </Sidebar>
        <div
          className={classes.mapContainer}
        >
          <Button
            id={homeConfig.previousButtonId}
            className={classes.previousButton}
            icon='arrow left'
          />
          <Button
            id={homeConfig.nextButtonId}
            className={classes.nextButton}
            icon='arrow right'
          />
          <div
            className={classes.controlsContainer}
          >
            <Button
              id={homeConfig.screenShotId}
              className={classes.zoomButtons}
              icon='photo'
            />
            <Button
              id={homeConfig.zoomInId}
              className={classes.zoomButtons}
              icon='plus'
            />
            <Button
              id={homeConfig.zoomOutId}
              className={classes.zoomButtons}
              icon='minus'
            />
          </div>
          <Map />
        </div>
      </div>
    );
  }
}

export default injectSheet(styles)(MapTools);
