import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import './index.css';
import AppWrapper from './containers/App';
import registerServiceWorker from './registerServiceWorker';

import configureStore from './store';
const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <AppWrapper />
  </Provider>
  , document.getElementById('root'));
registerServiceWorker();
