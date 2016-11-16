import React from 'react';
import {Route, IndexRoute} from 'react-router';

import AppHandler from 'components/AppHandler';
import ErrorHandler from 'components/ErrorHandler';
import IndexPage from 'components/IndexPage';
import TableExample from 'components/TableExample';

var routes = (
    <Route component={AppHandler} path="/">
        <IndexRoute component={IndexPage} />
        <Route path="/table" component={TableExample}/>
        <Route path="*" component={ErrorHandler}/>
    </Route>
);

module.exports = routes;
