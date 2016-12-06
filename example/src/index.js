import React from 'react';
import ReactDOM from 'react-dom';
import {Router, hashHistory} from 'react-router';
import routes from 'routes';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import reducers from 'reducers';
import 'sass/style.scss';

const appElement = document.getElementById('app');

const store = createStore(reducers);

ReactDOM.render((
     <Provider store={store}>
        <Router history={hashHistory} routes={routes}/>
    </Provider>
), appElement);
