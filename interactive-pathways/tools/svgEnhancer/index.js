const config = { };

const fs = require('fs');

const R = require('ramda');
const S = require('underscore.string.fp');

const { JSDOM } = require('jsdom');

const svg = fs.readFileSync(
  '../../map.svg', // in the root of the project
  {
    encoding: 'utf8',
  }
);

// [{ id, name, equivalentNameList, substanceTypeId }]
const substanceList = JSON.parse(
  fs.readFileSync(
    './substanceList.json',
    {
      encoding: 'utf8',
    }
  )
);

const {
  window,
} = new JSDOM(svg);

const document = window.document;

// Element -> Element -> Element -> void
const wrapText = (parent, wrapper, element) => {
  if (!element || element.tagName !== 'text') { return; }

  const {
    x: wx,
    y: wy,
  } = getCoordsFromTransform(wrapper);
  const {
    x: ex,
    y: ey,
  } = getCoordsFromTransform(element);

  const newX = ex - wx;
  const newY = ey - wy;

  const elementTransform = element.getAttribute('transform');

  element.setAttribute(
    'transform',
    R.replace(
      /\s\d+(\.\d+)?\s\d+(\.\d+)?\)/g,
      ` ${newX || 0} ${newY || 0})`,
      elementTransform || 'matrix(1 0 0 1 0.0 0.0)'
    )
  );

  // get nextSibling before moving
  const nextSibling = element.nextElementSibling;

  parent.removeChild(element);
  wrapper.appendChild(element);

  return wrapText(parent, wrapper, nextSibling);
};

const getCoordsFromTransform = element => {
  const transform = element.getAttribute('transform');
  if (!transform) { return ({ x: 0, y: 0 }); }

  const coords = transform && transform.split(' ').slice(4, 6);

  const x = coords && coords[0];
  const y = coords && coords[1] && coords[1].slice(0, -1);

  return ({ x, y });
};

// Element -> Int
const getId = wrapper => {
  const rect = wrapper.querySelector('rect');
  const x = rect.getAttribute('x');
  const y = rect.getAttribute('y');

  return R.compose(
    parseInt,
    R.join(''),
    R.split(/\./g),
  )(`${x}${y}`)
};

// String -> RegExp
const escapeRegExp = R.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const stripText = R.compose(
  R.replace(/-/g, ''), // remove dashes
  R.replace(/\s/g, ''), // remove spaces
  R.toLower,
);

// String -> Boolean
const isStrictMatch = list => text => {
  const term = stripText(text);

  return R.compose(
    R.any(R.equals(true)),
    R.map(R.equals(term)),
    R.map(R.toLower),
    R.map(R.trim),
  )(list);
};

// String -> [String]
const paranList = R.compose(
  R.map(R.replace(/\)/g, '')),
  R.split('('),
);

// [String] -> [a] -> [a]
const findMatches = equivalentList =>
  R.filter(
    R.compose(
      // [Boolean] -> Boolean
      R.any(R.equals(true)),
      // [String] -> [Boolean]
      R.map(isStrictMatch(equivalentList)),
      // [String] -> [String]
      paranList,
      // [{ text: String }] -> [String]
      R.prop('text'),
    )
  );

// [String] -> [Int]
const getIdList = equivalentList =>
  R.compose(
    R.values,
    R.map(R.prop('id')),
    findMatches(equivalentList),
  );

// [Int] -> String
const buildQueryString =
  R.addIndex(R.reduce)(
    (acc, id, idx) =>
      `${acc}${idx !== 0 ? ',' : ''} g[data-id="${id}"]>text`,
    ''
  );

// [Element] -> { id: { id, x, y, text } }
const svgTextCollection = R.compose(
  // [{ id, x, y, text }] -> { id: { id, x, y, text } }
  R.reduce((acc, val) => ({ [val.id]: val, ...acc }), {}),
  R.reject(R.isNil),
  // [Element] -> [{ id, x, y, text }]
  R.addIndex(R.chain)((element, id) => {
    // TODO remove side effects from this map function
    const nextSibling = element.nextElementSibling;
    if (!nextSibling) { return null; }
    const nextSiblingTag = element.nextElementSibling.tagName;
    if (nextSiblingTag !== 'text') { return null; }

    let parent = element.parentNode;
    let wrapper = document.createElement('g');

    const nextSiblingTransform = nextSibling.getAttribute('transform');
    if (nextSiblingTransform) {
      wrapper.setAttribute('transform', nextSiblingTransform);
    }

    parent.appendChild(wrapper);

    // wraps elements in `g` tag wrapper
    wrapText(parent, wrapper, nextSibling);

    wrapper.dataset.id = id;

    const {
      x,
      y,
    } = getCoordsFromTransform(wrapper);

    const text = R.compose(
      S.clean,
      R.replace(/^\d+\s+/g, ''), // remove beginning coefficients
      R.replace(/[xX]\d/g, ''), // remove x number coefficients
      S.clean,
    )(wrapper.textContent);

    return ({
      id,
      x,
      y,
      text,
    });
  }),
  // [Element]
)(document.querySelectorAll('rect,polygon,g,path,polyline'));

// [{ equivalentNameList, name, nameList }] -> [{ id, name, keyword, textIdList }]
const keywordList =
  R.compose(
    R.chain(({
      nameList,
      equivalentNameList,
      name,
    }) =>
      R.map(n => ({
        keyword: n,
        name,
        nameList,
        textIdList: getIdList(equivalentNameList)(svgTextCollection),
      }))(nameList)
    ),
  )(substanceList);

const substanceIdCollection =
  R.reduce(
    (acc, { id, substanceTypeId }) => ({
      ...acc,
      [substanceTypeId]: R.append(id, acc[substanceTypeId] || []),
    }),
    ({}),
    substanceList,
  );

// add substanceId to elements
R.compose(
  R.forEach(
    ({ queryString, substanceTypeId }) => {
      if (!queryString) { return; }
      const textNodeList = document.querySelectorAll(queryString);
      R.forEach(
        element => element.dataset.sid = substanceTypeId,
        textNodeList
      );
    },
  ),
  // [{ queryString, substanceTypeId }]
  R.map(
    ({ equivalentNameList, substanceTypeId }) => ({
      queryString: R.compose(
          buildQueryString,
          getIdList(equivalentNameList),
        )(svgTextCollection),
      substanceTypeId,
    })
  ),
  // [{ id, name, equivalentNameList, substanceTypeId }]
)(substanceList);

fs.writeFile(
  './out/textCollection.json',
  JSON.stringify(svgTextCollection),
  {
    encoding: 'utf8',
  },
  () => console.log('Wrote textCollection.json')
);

fs.writeFile(
  './out/keywordList.json',
  JSON.stringify(keywordList),
  {
    encoding: 'utf8',
  },
  () => console.log('Wrote keywordList.json')
);

fs.writeFile(
  './out/substanceIdCollection.json',
  JSON.stringify(substanceIdCollection),
  {
    encoding: 'utf8',
  },
  () => console.log('Wrote substanceIdCollection.json')
);

fs.writeFile(
  './out/map.svg.inner.html',
  document.getElementsByTagName('svg')[0].innerHTML,
  {
    encoding: 'utf8',
  },
  error => {
    if (error) { throw(error); }
    console.log('Wrote map.svg.inner.html');
  },
);
