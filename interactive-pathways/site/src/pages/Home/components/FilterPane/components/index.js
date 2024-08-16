import React, {
  PureComponent,
} from 'react';
import {
  Checkbox,
  Divider,
  Form,
  Radio,
} from 'semantic-ui-react';
import injectSheet from 'react-jss';

import {
  select,
} from 'd3-selection';
import {
  scaleSequential,
} from 'd3-scale';
import {
  interpolateRgb,
} from 'd3-interpolate';

import * as R from 'ramda';

import textCollection from 'assets/textCollection.json';
import substanceIdCollection from 'assets/substanceIdCollection.json';
import substanceTypeCollection from 'assets/substanceTypeCollection.json';

import colors from 'config/styles/colors';

import scaleCheckRect from 'config/scaleCheckRect';

import homeConfig from '../../Home.config';

const config = {
  mapMarkerClass: 'map-marker-substance',
  markerRadius: 10,
  xOffset: 0,
  yOffset: 0,
};

const styles = {
  substanceSwitchContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: colors.offWhite,
    borderRadius: '100px',
    padding: '5px',
  },
};

/** getColor :: Int -> RGB */
const getColor = scaleSequential(
  interpolateRgb(colors.substanceMarkerStart, colors.substanceMarkerEnd)
).domain([ 1, R.keys(substanceTypeCollection).length, ]);

class FocusPane extends PureComponent {
  state = {
    ...R.map(R.F, substanceTypeCollection),
    extra: { plot: false, },
  };

  showAllText = () => R.forEach(
    element => element.style.opacity = 1, // eslint-disable-line no-return-assign
    document.querySelectorAll('[data-sid]')
  );

  clearPlotLayer = () => {
    R.forEach(
      element => element.remove(),
      document.querySelectorAll(`g.${config.mapMarkerClass}`)
    );
  };

  plotResult = ({ substanceId, id, }) => {
    const {
      showPlaceholders,
    } = this.props;

    if (!showPlaceholders) { return; }

    const scaleCheckElement = document.getElementById(scaleCheckRect.id);
    const boundingRectScaleCheck = scaleCheckElement && scaleCheckElement.getBoundingClientRect();

    const widthScale = scaleCheckRect.width / boundingRectScaleCheck.width;

    const textGroup = document.querySelector(`g[data-id="${id}"]`);
    if (!textGroup) { return; }
    const boundingTextGroup = textGroup && textGroup.getBoundingClientRect();

    const textGroupD3 = textGroup && select(textGroup);

    const xTranslate = (boundingTextGroup.width * widthScale) / 2;

    let mapPin = textGroupD3
      .append('g')
      .attr('transform', `translate(${xTranslate})`)
      .classed(config.mapMarkerClass, true)
      .classed(`${config.mapMarkerClass}-${substanceId}`, true);

    mapPin
      .append('circle')
      .attr('r', config.markerRadius)
      .attr('fill', () => getColor(substanceId));

    mapPin
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('y', 5)
      .attr('fill', '#FFF')
      .text(R.head(substanceTypeCollection[substanceId]));
  };

  reset = () => {
    this.props.reset();
    this.clearPlotLayer();
    this.showAllText();
  };

  componentDidMount () {
    let el = document.getElementById(homeConfig.resetId);
    el.addEventListener('click', this.reset, false);
  }

  componentDidUpdate (prevProps, prevState) {
    const {
      collection,
    } = this.props;

    this.clearPlotLayer();

    substanceIdCollection &&
    textCollection &&
    R.compose(
      R.tap(
        R.compose(
          R.forEach(this.plotResult),
          R.map(element => {
            const id = parseInt(element.parentNode.getAttribute('data-id'));
            const substanceId = parseInt(element.getAttribute('data-sid'));

            return ({ id, substanceId, });
          }),
          R.chain(({ substanceId, }) =>
            document.querySelectorAll(`[data-sid="${substanceId}"]`)),
          R.reject(({ willShowText, }) => R.equals(willShowText, true)),
        )
      ),
      R.tap(
        R.forEach(
          R.ifElse(
            R.propEq('willShowText', true),
            R.compose(
              R.forEach(element => element.style.opacity = 1), // eslint-disable-line no-return-assign
              ({ substanceId, }) =>
                document.querySelectorAll(`[data-sid="${substanceId}"]`),
            ),
            R.compose(
              R.forEach(element => element.style.opacity = 0), // eslint-disable-line no-return-assign
              ({ substanceId, }) =>
                document.querySelectorAll(`[data-sid="${substanceId}"]`),
            )
          )
        )
      ),
      R.values,
      R.mapObjIndexed(
        (value, key) => ({
          substanceId: key,
          willShowText: !value,
        })
      ),
      // { 1: Boolean, 2: Boolean, ... }
      R.filter(R.is(Boolean)),
    )(collection);
  }

  render () {
    const {
      classes,
      collection,
      update,
      showPlaceholders,
      switchPlaceholders,
    } = this.props;

    return (
      <Form>
        <Form.Field>
          <b>
            Select a substance you want to be shown.
          </b>
        </Form.Field>
        <Form.Field
          className={classes.substanceSwitchContainer}
        >
          Show substance placeholders
          <Radio
            toggle
            checked={showPlaceholders}
            onChange={switchPlaceholders}
          />
        </Form.Field>
        <Divider />
        {
          R.compose(
            R.map(({
              id,
              title,
            }) => {
              return (
                <div
                  key={id}
                >
                  <Form.Field>
                    <Checkbox
                      checked={!collection[id]}
                      label={title}
                      onChange={() =>
                        update(({ [id]: !collection[id], }))
                      }
                    />
                  </Form.Field>
                  <Divider />
                </div>
              );
            }),
            R.values,
            R.mapObjIndexed((value, key) => ({ id: key, title: value, })),
          )(substanceTypeCollection)
        }
      </Form>
    );
  }
};

export default injectSheet(styles)(FocusPane);
