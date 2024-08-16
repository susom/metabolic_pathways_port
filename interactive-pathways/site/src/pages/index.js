import React from 'react';
import {
    BrowserRouter as Router,
    Route, Routes,
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
            <Routes>
                <Route path="/" element={<AsyncHome />} />
                <Route path="*" element={<AsyncNoMatch />} />
            </Routes>
        </Router>
    );
};

export default App;
