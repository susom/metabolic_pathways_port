import React, {
  Component,
} from 'react';
import injectSheet from 'react-jss';
import {
  Button,
  Search,
} from 'semantic-ui-react';

import * as R from 'ramda';

import {
  event,
  select,
} from 'd3-selection';
import {
  zoom,
  zoomIdentity,
} from 'd3-zoom';

import BoldTerm from './components/BoldTerm';

import isMatchKeyword from 'utils/isMatchKeyword';
import matchingIndex from 'utils/matchingIndex';

import colors from 'config/styles/colors';

import textCollection from 'assets/textCollection.json';
import keywordList from 'assets/keywordList.json';

import homeConfig from '../Home.config';

const {
  nextButtonId,
  plotLayerId,
  previousButtonId,
  svgId,
} = homeConfig;

const config = {
  xOffset: 10,
  yOffset: -10,
  maxZoomScale: 5,
};

const styles = {
  container: {},
  mapPinIcon: {
    fill: colors.cardinal,
  },
  /* mapPinText styles e2f0358 */
  listItem: {
    paddingBottom: 0.5,
  },
  tooltip: {
    opacity: 0,
    pointerEvents: 'none',
    borderRadius: 10,
    backgroundColor: 'white',
    color: colors.offBlack,
    padding: 5,
    transition: `left 0.5s ease 0s, top 0.5s ease 0s, opacity 0.5s ease 0s, transform 1s ease 0s`,
    boxShadow: `1px 1px 1px 1px ${colors.darkGray}`,
  },
  button: {
    position: 'absolute',
    right: 0,
    top: '2px',
    color: 'gray !important',
    backgroundColor: 'transparent !important',
    boxShadow: 'none !important',
  },
};

const toolTipId = 'subway-map-tool-tip';
const plotResultClassName = 'plot-search-result';
const mapPinIdPrefix = 'map-pin-id-';

const zoomAllMapPinIcons = () => {
  const svg = select(document.getElementById(svgId));

  const viewBox = svg.attr('viewBox').split(' ');

  const size = viewBox.slice(2);

  const width = size[0];

  const height = size[1];

  const box = select(document.getElementById(plotLayerId)).node().getBBox();

  const dx = box.width;

  const dy = box.height;

  const x = box.x + dx / 2;

  const y = box.y + dy / 2;

  const scale = Math.max(
    1,
    Math.min(config.maxZoomScale, 0.9 / Math.max(dx / width, dy / height))
  );

  const translate = [
    width / 2 - scale * x,
    height / 2 - scale * y,
  ];

  const g = svg.select('g');

  const z = zoom()
    .scaleExtent([
      1 / 2,
      8,
    ])
    .on('zoom', () => g.attr('transform', event.transform));

  svg.transition()
    .duration(750)
    .call(
      z.transform,
      zoomIdentity.translate(translate[0], translate[1]).scale(scale)
    );
};

const zoomPin = (x, y) => {
  const svg = select(document.getElementById(svgId));

  const viewBox = svg.attr('viewBox').split(' ');

  const size = viewBox.slice(2);

  const width = size[0];

  const height = size[1];

  const scale = config.maxZoomScale;

  const g = svg.select('g');

  const translate = [
    width / 2 - scale * x,
    height / 2 - scale * y,
  ];

  const z = zoom()
    .scaleExtent([
      1 / 2,
      8,
    ])
    .on('zoom', () => g.attr('transform', event.transform));

  svg.transition()
    .duration(750)
    .call(
      z.transform,
      zoomIdentity.translate(translate[0], translate[1]).scale(scale)
    );
};

const resetZoom = () => {
  const svg = select(document.getElementById(svgId));

  const g = svg.select('g');

  const z = zoom()
    .scaleExtent([
      1 / 2,
      8,
    ])
    .on('zoom', () => g.attr('transform', event.transform));

  svg.transition()
    .duration(750)
    .call(z.transform, zoomIdentity);
};

class SearchPane extends Component {
  currentIndex = -1;
  plotLayer = null;
  toolTip = null;

  state = {
    term: '',
    idList: [],
  };

  setup = callback => {
    const {
      classes,
    } = this.props;
    const svg = select(document.getElementById(svgId));
    const plotLayerElement = document.getElementById(plotLayerId);
    const toolTipElement = document.getElementById(toolTipId);

    this.plotLayer = (
      plotLayerElement
        ? select(plotLayerElement)
        : svg.select('g').append('g').attr('id', plotLayerId)
    );

    this.toolTip = (
      toolTipElement
        ? select(toolTipElement)
        : select(document.getElementsByTagName('body')[0])
          .append('div')
          .attr('id', toolTipId)
          .classed(classes.tooltip, true)
          .style('position', 'absolute')
    );

    this.clearPlotLayer();
    callback && callback();
  }

  clearPlotLayer = () => {
    if (!this.plotLayer) { return; }
    this.plotLayer.selectAll(`.${plotResultClassName}`).remove();
    resetZoom();
  }

  // Number -> Element -> void
  changePinSize = size => ele => {
    const transform = ele.getAttribute('transform');
    ele.setAttribute('transform', R.replace(/\d(\.\d+)? 0 0 \d(\.\d+)?/g, `${size} 0 0 ${size}`, transform));
  }

  mouseoverPin = (id, title) => {
    const pin = document.getElementsByClassName(`${mapPinIdPrefix}${id}`)[0];
    pin.setAttribute('fill-opacity', 0.5);
    this.changePinSize(1.5)(pin);

    if (!title || !event || !event.pageX || !event.pageY) { return; }

    this.toolTip
      .style('opacity', 1)
      .style('top', `${event.pageY - 15}px`)
      .style('left', `${event.pageX + 15}px`)
      .html(title);
  }

  mouseoutPin = id => {
    const pin = document.getElementsByClassName(`${mapPinIdPrefix}${id}`)[0];
    pin.removeAttribute('fill-opacity');
    this.changePinSize(1)(pin);
    this.toolTip.style('opacity', 0);
  }

  nextPin = () => {
    const {
      idList,
    } = this.state;

    if (R.isEmpty(idList)) { return; }

    // UNSAFE mutation
    this.currentIndex += 1;

    if (this.currentIndex >= idList.length) { this.currentIndex = 0; }

    const id = idList[this.currentIndex];
    const {
      x,
      y,
    } = R.prop(id, textCollection);

    zoomPin(x, y);
  }

  previousPin = () => {
    const {
      idList,
    } = this.state;

    if (R.isEmpty(idList)) { return; }

    // UNSAFE mutation
    this.currentIndex -= 1;

    if (this.currentIndex < 0) { this.currentIndex = idList.length - 1; }

    const id = idList[this.currentIndex];
    const {
      x,
      y,
    } = R.prop(id, textCollection);

    zoomPin(x, y);
  }

  // [{ x, y, id, text }] -> void
  plotAllPins = data => {
    const {
      classes,
    } = this.props;

    let mapPin = this.plotLayer.selectAll(`g.${plotResultClassName}`)
      .data(data)
      .enter().append('g')
      .attr('class', ({ id, }) => `${mapPinIdPrefix}${id}`)
      .attr(
        'transform',
        ({ x, y, }) =>
          `matrix(1 0 0 1 ${
            parseFloat(x) + config.xOffset
          } ${
            parseFloat(y) + config.yOffset
          })`
      )
      .on('mouseover', ({ id, text, }) => this.mouseoverPin(id, text))
      .on('mouseout', ({ id, }) => this.mouseoutPin(id))
      .on('click', ({ x, y, }) => zoomPin(x, y))
      .classed(plotResultClassName, true);

    mapPin
      .append('use')
      .attr('xlink:href', '#map-pin')
      .classed(classes.mapPinIcon, true);
  }

  componentDidUpdate () {
    const {
      idList,
    } = this.state;

    if (idList && idList.length) {
      document.getElementById(nextButtonId).style.display = 'inline';
      document.getElementById(previousButtonId).style.display = 'inline';
    }

    if (!idList || !idList.length || idList.length === 1) {
      document.getElementById(nextButtonId).style.display = 'none';
      document.getElementById(previousButtonId).style.display = 'none';
    }
  }

  componentDidMount () {
    this.setup();

    document.getElementById(nextButtonId).style.display = 'none';
    document.getElementById(previousButtonId).style.display = 'none';

    select(document.getElementById(nextButtonId))
      .on('click', this.nextPin);

    select(document.getElementById(previousButtonId))
      .on('click', this.previousPin);

    // disables Safari spellcheck feature
    document.querySelector('div.search input.prompt').spellcheck = false;
  }

  componentWillUnmount () {
    this.clearPlotLayer();
    this.toolTip.remove();

    document.getElementById(nextButtonId).style.display = 'none';
    document.getElementById(previousButtonId).style.display = 'none';
  }

  render () {
    const {
      classes,
    } = this.props;

    const {
      term,
      idList,
    } = this.state;

    idList &&
    idList.length &&
    textCollection &&
    R.compose(
      this.plotAllPins,
      R.props(idList),
    )(textCollection);

    return (
      <div>
        <Search
          value={term}
          onResultSelect={(e, { result, }) =>
            this.setup(() => {
              this.setState({
                term: result && result.title,
                idList: result && result.idlist,
              },
              () => setTimeout(zoomAllMapPinIcons, 200)
              );
            })
          }
          onSearchChange={(e, { value, }) => this.setState({ term: value, })}
          results={
            R.compose(
              R.map(({
                name,
                textIdList: idlist,
              }) => ({
                title: name,
                idlist,
                key: name,
              })),
              // most matching word with the fewest letters first
              R.sortWith([
                R.descend(R.prop('matchingIndex')),
                ({ name, }) => name.length,
              ]),
              R.reject(({ matchingIndex, }) => matchingIndex <= 0),
              R.map(({
                nameList,
                ...rest
              }) => ({
                ...rest,
                matchingIndex: matchingIndex(term)(nameList),
              })),
              R.dropRepeatsWith(R.eqBy(R.prop('name'))),
              R.sortBy(R.prop('name')),
              R.filter(({ keyword, }) => isMatchKeyword(term)(keyword)),
            )(keywordList)
          }
          resultRenderer={
            ({ title, }) => (
              <BoldTerm
                text={title}
                term={term}
              />
            )
          }
          icon={
            <Button
              className={classes.button}
              icon={term ? 'close' : 'search'}
              size='small'
              circular
              onClick={
                () => this.setState({
                  term: '',
                  idList: [],
                }, this.clearPlotLayer)
              }
            />
          }
          fluid
          selectFirstResult
        />
      </div>
    );
  }
};

export default injectSheet(styles)(SearchPane);
