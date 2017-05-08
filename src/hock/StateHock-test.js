import test from 'ava';
import {shallow} from 'enzyme';
import React from 'react';
import StateHock from './StateHock';
import {spy} from 'sinon';


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
    tt.is(shallow(<Component value="bar" />).props().value, undefined);
});


//
// Functionality
//

test('StateHock will set a defualt value', tt => {
    const Child = (props) => {
        tt.is(props.value, 0);
        return <div/>;
    };

    var Component = StateHock(0)(Child);

    shallow(<Component />).dive();
});

test('StateHock props.onChange will replace value', tt => {
    var Child = (props) => <div/>;
    var Component = StateHock(0)(Child);
    var instance = shallow(<Component />);

    instance.props().onChange(1);
    tt.is(instance.props().value, 1);
});
