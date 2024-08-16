import React, {
  PureComponent,
} from 'react';
import injectSheet from 'react-jss';
import {
  Checkbox,
  Divider,
  Form,
  Radio,
} from 'semantic-ui-react';

import * as R from 'ramda';

import colors from 'config/styles/colors';

import homeConfig from '../../Home.config';

import {
  cycleCollection,
  cycleNameCollection,
  neighborhoodCollection,
  neighborhoodCoverCollection,
} from 'config/focusCoverNameCollection';

const config = {
  fastingId: 'state_x5F_fasting',
  fedId: 'state_x5F_well-fed',
};

const styles = {
  container: {
    maxHeight: '45vh !important',
  },
  neighborhoodCheckbox: {
    fontWeight: 'bold',
  },
  cycleCheckbox: {
    marginLeft: '10px !important',
  },
  fedFastingSwitch: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: colors.offWhite,
    borderRadius: '100px',
    padding: '5px',
  },
};

// boolean -> string -> void
const setVisibility = visible => eleId => {
  const ele = document.getElementById(eleId);
  (visible
    ? ele && ele.setAttribute('class', '')
    : ele && ele.setAttribute('class', homeConfig.svgDisplayNoneClass)
  );
};

class FocusPane extends PureComponent {
  showChecked = (checkedObject = this.props.collection) => {
    R.compose(
      R.forEach(([
        name,
        visible,
      ]) => {
        setVisibility(!visible)(cycleCollection[name]);
      }),
      R.toPairs,
      R.ifElse(
        R.compose( // if all are false
          R.all(R.equals(false)),
          R.values,
        ),
        R.map(R.T), // set all true
        R.identity, // pass data through
      ),
      R.filter(R.is(Boolean)),
    )(checkedObject);
  }

  showFedFastingState = (
    showFed = this.props.showFed,
    showFasting = this.props.showFasting,
  ) => {
    setVisibility(showFed)(config.fedId);
    setVisibility(showFasting)(config.fastingId);
  }

  toggleCycleCheck = cycleKey => {
    const item = this.props.collection[cycleKey];
    (item
      ? this.props.update({
        [cycleKey]: false,
      })
      : this.props.update({
        [cycleKey]: true,
      })
    );
  }

  setNeighborhoodCheck = (neighborhoodKey, visibility) =>
    R.compose(
      R.forEach(cycleKey =>
        this.props.update({
          [cycleKey]: visibility,
        })
      ),
      R.keys,
    )(neighborhoodCoverCollection[neighborhoodKey]);

  reset = () => {
    this.props.reset();
    R.compose(
      this.showChecked,
      R.map(R.T), // show all regions when tab is switched
      R.filter(R.is(Boolean)),
    )(this.props.collection);
  }

  // string -> boolean
  checkNeighborhood = neighborhood =>
    R.compose(
      R.all(R.equals(true)),
      R.flip(R.props)(this.props.collection),
      R.keys,
    )(neighborhoodCoverCollection[neighborhood]);


  componentDidMount () {
    let el = document.getElementById(homeConfig.resetId);
    el.addEventListener('click', this.reset, false);
  }

  componentDidUpdate () {
    this.showChecked();
    this.showFedFastingState();
  }

  render () {
    const aminos = this.checkNeighborhood(neighborhoodCollection.aminos);
    const carbs = this.checkNeighborhood(neighborhoodCollection.carbs);
    const heme = this.checkNeighborhood(neighborhoodCollection.heme);
    const lipids = this.checkNeighborhood(neighborhoodCollection.lipids);
    const nucleotides =
      this.checkNeighborhood(neighborhoodCollection.nucleotides);
    const oxidative = this.checkNeighborhood(neighborhoodCollection.oxidative);

    const {
      classes,
      collection,
      showFasting,
      showFed,
      switchFastingState,
      switchFedState,
    } = this.props;

    const NeighborhoodChecklist = ({
      checked,
      label,
      collectionKey,
    }) => {
      return (
        <div
          key={label}
        >
          <Form.Field>
            <Checkbox
              className={classes.neighborhoodCheckbox}
              checked={checked}
              label={label}
              onChange={() =>
                this.setNeighborhoodCheck(collectionKey, !checked)
              }
            />
          </Form.Field>
          {
            R.compose(
              R.map(([
                cycleKey,
                visible
              ]) => (
                <Form.Field
                  className={classes.cycleCheckbox}
                  key={cycleKey}
                >
                  <Checkbox
                    key={cycleKey}
                    checked={visible}
                    label={cycleNameCollection[cycleKey]}
                    onChange={() =>
                      this.toggleCycleCheck(cycleKey)
                    }
                  />
                </Form.Field>
              )),
              R.toPairs,
              R.pick(
                R.keys(neighborhoodCoverCollection[collectionKey])
              ),
            )(collection)
          }
          <Divider />
        </div>
      );
    };

    return (
      <Form
        className={classes.container}
      >
        <Form.Field
          className={classes.fedFastingSwitch}
        >
          Highlight well-fed state
          <Radio
            toggle
            checked={showFed}
            onChange={switchFedState}
          />
        </Form.Field>
        <Form.Field
          className={classes.fedFastingSwitch}
        >
          Highlight fasting state
          <Radio
            toggle
            checked={showFasting}
            onChange={switchFastingState}
          />
        </Form.Field>
        <Divider />
        <Form.Field>
          <b>
            Select the neighborhoods or cycles you want to be shown.
          </b>
        </Form.Field>
        <Divider />
        <NeighborhoodChecklist
          checked={carbs}
          label="Carbohydrates"
          collectionKey={neighborhoodCollection.carbs}
        />
        <NeighborhoodChecklist
          checked={aminos}
          label='Amino acids'
          collectionKey={neighborhoodCollection.aminos}
        />
        <NeighborhoodChecklist
          checked={oxidative}
          label='Oxidative metabolism'
          collectionKey={neighborhoodCollection.oxidative}
        />
        <NeighborhoodChecklist
          checked={lipids}
          label='Lipids'
          collectionKey={neighborhoodCollection.lipids}
        />
        <NeighborhoodChecklist
          checked={nucleotides}
          label='Nucleotides'
          collectionKey={neighborhoodCollection.nucleotides}
        />
        <NeighborhoodChecklist
          checked={heme}
          label='Heme metabolism'
          collectionKey={neighborhoodCollection.heme}
        />
      </Form>
    );
  }
};

export default injectSheet(styles)(FocusPane);
