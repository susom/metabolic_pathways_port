import {
  applyMiddleware,
  combineReducers,
  createStore,
} from 'redux';
import thunk from 'redux-thunk';
import {
  routerMiddleware,
} from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import {
  composeWithDevTools,
} from 'redux-devtools-extension/developmentOnly';

import reducers from './modules';

const enhancer = (...middleware) => composeWithDevTools(
  // Middleware you want to use in development:
  applyMiddleware(...middleware),
);

export default function configureStore (initialState) {
  const rootReducer = combineReducers(reducers);

  const store = createStore(
    rootReducer,
    initialState,
    enhancer(
      routerMiddleware(createHistory()),
      thunk
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
