import test from 'ava';
import {shallow} from 'enzyme';
import React from 'react';
import StateHock from './StateHock';


//
// Hock Tests
//

test('StateHock matches (config) => (Component) => Hock', tt => {
    var Child = (props) => <div/>;
    tt.is(typeof StateHock, 'function');
    tt.is(typeof StateHock(), 'function');
    tt.is(typeof StateHock()(Child), 'function');
});

test('StateHock passes other props through', tt => {
    var Child = (props) => <div/>;
    var Component = StateHock()(Child);
    tt.is(shallow(<Component foo="bar" />).props().foo, 'bar');
    tt.is(shallow(<Component dataValue="bar" />).props().dataValue, undefined);
});

test('StateHock will allow you to change dataValueProp & dataChangeProp', tt => {
    var Child = (props) => <div/>;
    var Component = StateHock({
        initialState: () => 0,
        dataValueProp: 'foo',
        dataChangeProp: 'changeFoo'
    })(Child);

    tt.is(shallow(<Component foo="bar" />).props().foo, 0);
    tt.is(typeof shallow(<Component dataValue="bar" />).props().changeFoo, 'function');
});



//
// Functionality
//

test('StateHock will set a defualt dataValue', tt => {
    const Child = (props) => {
        tt.is(props.dataValue, 0);
        return <div/>;
    };

    var Component = StateHock({initialState: () => 0})(Child);

    shallow(<Component />).dive();
});

test('StateHock props.dataChange will replace dataValue', tt => {
    var Child = (props) => <div/>;
    var Component = StateHock({initialState: () => 0})(Child);
    var instance = shallow(<Component />);
    instance.props().dataChange(1);
    tt.is(instance.props().dataValue, 1);
});
