import React from 'react';
import {Route, IndexRoute} from 'react-router';

import AppHandler from 'component/AppHandler';
import ErrorHandler from 'component/ErrorHandler';
import ContentsPage from 'component/ContentsPage';
import Example from 'hock/Example';

import ButtonExampleComponent from 'example/component/button/ButtonExample';
import ButtonExampleSource from '!raw!example/component/button/ButtonExample';

import TableExampleComponent from 'example/component/table/TableExample';
import TableExampleSource from '!raw!example/component/table/TableExample';

import ToggleExampleComponent from 'example/input/toggle/ToggleExample';
import ToggleExampleSource from '!raw!example/input/toggle/ToggleExample';

import SpruceClassNameExampleComponent from 'example/util/SpruceClassNameExample';
import SpruceClassNameExampleSource from '!raw!example/util/SpruceClassNameExample';

import SpruceComponentExampleComponent from 'example/util/SpruceComponentExample';
import SpruceComponentExampleSource from '!raw!example/util/SpruceComponentExample';


const routes = <Route component={AppHandler} path="/">
    <IndexRoute component={ContentsPage} />
    <Route path="component">
        <Route path="table" component={Example({source: TableExampleSource})(TableExampleComponent)}/>
        <Route path="button" component={Example({source: ButtonExampleSource})(ButtonExampleComponent)}/>
    </Route>
    <Route path="input">
        <Route path="toggle" component={Example({source: ToggleExampleSource})(ToggleExampleComponent)}/>
    </Route>
    <Route path="util">
        <Route path="SpruceClassName" component={Example({source: SpruceClassNameExampleSource})(SpruceClassNameExampleComponent)}/>
        <Route path="SpruceComponent" component={Example({source: SpruceComponentExampleSource})(SpruceComponentExampleComponent)}/>
    </Route>

    <Route path="*" component={ErrorHandler}/>
</Route>;

export default routes;
