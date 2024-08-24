import React from 'react';
import ReactDOM from 'react-dom';
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

const rootElement = document.getElementById('root');

if (!rootElement) {
    console.error('Root element not found! Rendering will fail.');
}

const render = (Component) => {
    try {
        ReactDOM.render(
            <JssProvider jss={jss} generateId={createGenerateId()}>
                <Provider store={store}>
                    <Component />
                </Provider>
            </JssProvider>,
            rootElement
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
