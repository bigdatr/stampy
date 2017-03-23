import React from 'react';
import {HashRouter, Route} from 'react-router-dom';

import AppHandler from 'components/AppHandler';
import ErrorHandler from 'components/ErrorHandler';
import ContentsPage from 'components/ContentsPage';

import ButtonExample from 'component/button/ButtonExample';
import LabelExample from 'component/field/LabelExample';
import ShowHideExample from 'component/ShowHide/ShowHideExample';
import TableExample from 'component/table/TableExample';

import InputExample from 'input/input/InputExample';
import SelectExample from 'input/select/SelectExample';
import ToggleExample from 'input/toggle/ToggleExample';
import ToggleSetExample from 'input/toggleSet/ToggleSetExample';

import ElementQueryHockExample from 'hock/ElementQueryHockExample';
import ElementQueryHockStressTest from 'hock/ElementQueryHockStressTest';
import QueryStringHockExample from 'hock/QueryStringHockExample';

import SpruceClassNameExample from 'util/SpruceClassNameExample';
import SpruceComponentExample from 'util/SpruceComponentExample';

const Routes = <HashRouter>
    <AppHandler>
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
        {/*<Route component={ErrorHandler} />*/}
    </AppHandler>
</HashRouter>;

export default Routes;
