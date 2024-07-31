import React from 'react';
import ReactDOM from 'react-dom';

import {
  AppContainer,
} from 'react-hot-loader';
import {
  Provider,
} from 'react-redux';

import {
  create as createJss,
} from 'jss';
import {
  createGenerateClassName,
  JssProvider,
} from 'react-jss';
import jssPreset from 'jss-preset-default';
import vendorPrefixer from 'jss-vendor-prefixer';

import App from './pages';
import configureStore from 'redux/store';

const jss = createJss(jssPreset());
jss.use(vendorPrefixer());

const initialState = {};
export const store = configureStore(initialState);

/* `remove()` polyfill
 * from:https://github.com/jserz/js_piece/blob/master/DOM/ChildNode/remove()/remove().md */
(function (arr) {
  arr.forEach(function (item) {
    if (item.hasOwnProperty('remove')) {
      return;
    }
    Object.defineProperty(item, 'remove', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function remove () {
        if (this.parentNode !== null) {
          this.parentNode.removeChild(this);
        }
      },
    });
  });
})([
  Element.prototype,
  CharacterData.prototype,
  DocumentType.prototype,
]);

/** Retrackable copyright footer code in 0bc5b77 */

const render = Component =>
  ReactDOM.render( // eslint-disable-line react/no-render-return-value
    <AppContainer>
      <JssProvider
        jss={jss}
        generateClassName={createGenerateClassName()}
      >
        <Provider store={store}>
          <Component />
        </Provider>
      </JssProvider>
    </AppContainer>,
    document.getElementById('root')
  );

render(App);
if (module.hot) module.hot.accept('./pages', () => render(App));
