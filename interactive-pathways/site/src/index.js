import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';

import { create as createJss } from 'jss';
import { createGenerateId } from 'jss';

import { JssProvider } from 'react-jss';
import jssPreset from 'jss-preset-default';

import App from './pages';
import configureStore from './redux/store'; // Use relative path

const jss = createJss(jssPreset());
import './styling/main.scss'; // Import the SCSS file here

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
      value: function remove() {
        if (this.parentNode !== null) {
          this.parentNode.removeChild(this);
        }
      },
    });
  });
})([Element.prototype, CharacterData.prototype, DocumentType.prototype]);

/** Retrackable copyright footer code in 0bc5b77 */

const render = (Component) =>
    ReactDOM.render(
        // eslint-disable-line react/no-render-return-value
        <AppContainer>
          <JssProvider jss={jss} generateId={createGenerateId()}>
            <Provider store={store}>
              <Component />
            </Provider>
          </JssProvider>
        </AppContainer>,
        document.getElementById('root')
    );

render(App);
if (module.hot) module.hot.accept('./pages', () => render(App));
