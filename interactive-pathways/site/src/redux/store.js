import { applyMiddleware, combineReducers, createStore } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import { createBrowserHistory } from 'history';
import reducers from './modules';

const history = createBrowserHistory();
const routerMW = routerMiddleware(history);

const enhancer = (...middleware) => applyMiddleware(...middleware);

export default function configureStore(initialState) {
  const rootReducer = combineReducers(reducers);

  const store = createStore(
      rootReducer,
      initialState,
      enhancer(routerMW)
  );

  if (module.hot) {
    module.hot.accept('./modules', () => {
      const nextRootReducer = require('./modules'); // Use .default if you use Babel 6+
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
