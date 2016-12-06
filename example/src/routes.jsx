import React from 'react';
import {Route, IndexRoute} from 'react-router';

import AppHandler from 'components/AppHandler';
import ErrorHandler from 'components/ErrorHandler';
import ContentsPage from 'components/ContentsPage';

import ButtonExample from 'component/button/ButtonExample';
import TableExample from 'component/table/TableExample';
import ToggleExample from 'input/toggle/ToggleExample';
import InputExample from 'input/input/InputExample';

import ElementQueryHockExample from 'hock/ElementQueryHockExample';
import ElementQueryHockStressTest from 'hock/ElementQueryHockStressTest';

import SpruceClassNameExample from 'util/SpruceClassNameExample';
import SpruceComponentExample from 'util/SpruceComponentExample';

const routes = <Route component={AppHandler} path="/">
    <IndexRoute component={ContentsPage} />
    <Route path="component">
        <Route path="Table" component={TableExample}/>
        <Route path="Button" component={ButtonExample}/>
    </Route>
    <Route path="input">
        <Route path="Toggle" component={ToggleExample}/>
        <Route path="Input" component={InputExample}/>
    </Route>
    <Route path="util">
        <Route path="SpruceClassName" component={SpruceClassNameExample}/>
        <Route path="SpruceComponent" component={SpruceComponentExample}/>
    </Route>

    <Route path="hock">
        <Route path="ElementQueryHock" component={ElementQueryHockExample}/>
        <Route path="ElementQueryHockStressTest" component={ElementQueryHockStressTest}/>
    </Route>

    <Route path="*" component={ErrorHandler}/>
</Route>;

export default routes;
