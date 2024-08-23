import {
  applyMiddleware,
  combineReducers,
  createStore,
} from 'redux';
import { thunk } from 'redux-thunk';

import {
  routerMiddleware,
} from 'react-router-redux';
import { createBrowserHistory } from 'history';
import {
  composeWithDevTools,
} from '@redux-devtools/extension';

import reducers from './modules';

const enhancer = (...middleware) => composeWithDevTools(
  applyMiddleware(...middleware),
);

export default function configureStore(initialState) {
  const rootReducer = combineReducers(reducers);

  const store = createStore(
    rootReducer,
    initialState,
    enhancer(
      routerMiddleware(createBrowserHistory()),
      thunk  // Updated to use 'thunk'
    )
  );

  // Hot reload reducers (requires Webpack or Browserify HMR to be enabled)
  if (module.hot) {
    module.hot.accept('./modules', () =>
      store.replaceReducer(require('./modules')/* .default if you use Babel 6+ */)
    );
  }

  return store;
}
