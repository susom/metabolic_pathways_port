import React from 'react';
import injectSheet from 'react-jss';
import {
  Button,
} from 'semantic-ui-react';

import sizes from 'config/styles/sizes';

import homeConfig from './Home.config';

const styles = {
  container: {
    display: 'flex',
    position: 'absolute',
    zIndex: 1,
    transitionDuration: '.3s',
    marginTop: '5px',
    marginRight: '10px',
    borderTopLeftRadius: '4px',
    borderBottomLeftRadius: '4px',
  },
  sidebarButtonContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '107px', // default height of `SearchPane`
  },
  sidebarButton: {
    marginLeft: '5px !important',
    color: 'gray !important',
    backgroundColor: 'white !important',

    [`@media (max-width: ${sizes.xs}px)`]: {
      height: '50px', // about half the default height of `SearchPane`
      width: '10vw',
      margin: '0 !important',
      padding: '0 !important',
    },
  },
  open: {
    marginLeft: 30,

    [`@media (max-width: ${sizes.xs}px)`]: {
      margin: 0,
    },
  },
  close: {
    marginLeft: '-300px',

    [`@media (max-width: ${sizes.xs}px)`]: {
      margin: '0 0 0 -90vw',
    },
  },
};

const Sidebar = ({
  children,
  classes,
  className,
  closeSidebar,
  open,
  openSidebar,
}) => (
  <div
    className={`${className} ${classes.container} ${(open ? classes.open : classes.close)}`}
  >
    {children}
    <div
      className={classes.sidebarButtonContainer}
    >
      <Button
        className={classes.sidebarButton}
        icon={`chevron ${open ? 'left' : 'right'}`}
        onClick={(open ? closeSidebar : openSidebar)}
      />
      <Button
        data-tooltip="Remove filters and focus."
        id={homeConfig.resetId}
        className={classes.sidebarButton}
        icon='eraser'
      />
    </div>
  </div>
);

export default injectSheet(styles)(Sidebar);
