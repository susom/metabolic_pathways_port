import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import importedComponent from 'react-imported-component';

import Loading from './Loading';

const AsyncHome = importedComponent(
  () => import(/* webpackChunkName:'Home' */ './Home'),
  {
    LoadingComponent: Loading,
  }
);

const AsyncNoMatch = importedComponent(
  () => import(/* webpackChunkName:'NoMatch' */ './NoMatch'),
  {
    LoadingComponent: Loading,
  }
);

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={AsyncHome} />
        <Route component={AsyncNoMatch} />
      </Switch>
    </Router>
  );
};

export default App;
