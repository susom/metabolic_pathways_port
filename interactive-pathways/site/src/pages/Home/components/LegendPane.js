import React from 'react';
import injectSheet from 'react-jss';
import { Container } from 'semantic-ui-react';
import colors from 'config/styles/colors';
import legendImage from 'assets/images/legendImage.png'; // Importing image with ES6 syntax

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1,
    width: '100vw',
  },
  mapContainer: {
    display: 'flex',
    position: 'relative',
    flexGrow: 1,
  },
  sidebarButton: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  carbohydrates: {
    fill: colors.carbohydrates,
  },
};

class LegendPane extends React.Component {
  state = { activeIndex: 0 };

  handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;

    this.setState({ activeIndex: newIndex });
  };

  render() {
    return (
      <Container>
        <img
          src={legendImage} // Using the imported image
          width={260}
          alt="Legend"
        />
      </Container>
    );
  }
}

export default injectSheet(styles)(LegendPane);
