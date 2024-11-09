import React from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import { create as createJss } from 'jss';
import { createGenerateId } from 'jss';
import { JssProvider } from 'react-jss';
import jssPreset from 'jss-preset-default';

import App from './pages';
import configureStore from './redux/store'; // Use relative path

// Import the precompiled Semantic UI CSS
import 'semantic-ui-css/semantic.min.css'; 

const jss = createJss(jssPreset());

import './styling/main.scss'; // Import the SCSS file here
import './styling/custom.scss';

const initialState = {};

export const store = configureStore(initialState);

const rootElement = document.getElementById('root');

if (!rootElement) {
    console.error('Root element not found! Rendering will fail.');
}

console.log("REACT_APP_API_URL: ", process.env.REACT_APP_API_URL, "REACT_APP_SVG_ENDPOINT: ", process.env.REACT_APP_SVG_ENDPOINT);

const render = (Component) => {
    try {
        const root = createRoot(rootElement);
        root.render(
            <JssProvider jss={jss} generateId={createGenerateId()}>
                <Provider store={store}>
                    <Component />
                </Provider>
            </JssProvider>
        );
    } catch (error) {
        console.error('Error during rendering:', error);
    }
};

render(App);

if (module.hot) {
    module.hot.accept('./pages', () => {
        render(App);
    });
}
