import React from 'react';
import {HashRouter, Switch, Route} from 'react-router-dom';

import AppHandler from 'components/AppHandler';
import ErrorHandler from 'components/ErrorHandler';
import ContentsPage from 'components/ContentsPage';

import ButtonExample from 'component/button/ButtonExample';
import LabelExample from 'component/field/LabelExample';
import ShowHideExample from 'component/showHide/ShowHideExample';
import TableExample from 'component/table/TableExample';

import InputExample from 'input/input/InputExample';
import SelectExample from 'input/select/SelectExample';
import ToggleExample from 'input/toggle/ToggleExample';
import ToggleSetExample from 'input/toggleSet/ToggleSetExample';

import ElementQueryHockExample from 'hock/ElementQueryHockExample';
import ElementQueryHockStressTest from 'hock/ElementQueryHockStressTest';
import QueryStringHockExample from 'hock/QueryStringHockExample';
import StateHockExample from 'hock/StateHockExample';

import SpreadPipeExample from 'pipe/SpreadPipeExample';
import KeyedSplitterPipeExample from 'pipe/KeyedSplitterPipeExample';
import DownPipeExample from 'pipe/DownPipeExample';
import UpPipeExample from 'pipe/UpPipeExample';

import SpruceClassNameExample from 'util/SpruceClassNameExample';
import SpruceComponentExample from 'util/SpruceComponentExample';

export const routesList = <Switch>
    <Route exact path="/" component={ContentsPage} />
    <Route path="/component/Button" component={ButtonExample}/>
    <Route path="/component/Label" component={LabelExample}/>
    <Route path="/component/ShowHide" component={ShowHideExample}/>
    <Route path="/component/Table" component={TableExample}/>
    <Route path="/input/Input" component={InputExample}/>
    <Route path="/input/Select" component={SelectExample}/>
    <Route path="/input/Toggle" component={ToggleExample}/>
    <Route path="/input/ToggleSet" component={ToggleSetExample}/>
    <Route path="/util/SpruceClassName" component={SpruceClassNameExample}/>
    <Route path="/util/SpruceComponent" component={SpruceComponentExample}/>
    <Route path="/hock/ElementQueryHock" component={ElementQueryHockExample}/>
    <Route path="/hock/ElementQueryHockStressTest" component={ElementQueryHockStressTest}/>
    <Route path="/hock/QueryStringHock" component={QueryStringHockExample}/>
    <Route path="/hock/StateHock" component={StateHockExample}/>
    <Route path="/pipe/SpreadPipe" component={SpreadPipeExample}/>
    <Route path="/pipe/KeyedSplitterPipe" component={KeyedSplitterPipeExample}/>
    <Route path="/pipe/DownPipe" component={DownPipeExample}/>
    <Route path="/pipe/UpPipe" component={UpPipeExample}/>
    <Route component={ErrorHandler} />
</Switch>;

const Routes = <HashRouter>
    <AppHandler>
        {routesList}
    </AppHandler>
</HashRouter>;

export default Routes;
