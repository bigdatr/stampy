import test from 'ava';
import {shallow} from 'enzyme';
import React from 'react';
import StateHock from './StateHock';
import {Map} from 'immutable';

//
// Hock Tests
//

test('StateHock matches (config) => (Component) => Hock', tt => {
    var Child = () => <div/>;
    tt.is(typeof StateHock, 'function');
    tt.is(typeof StateHock(), 'function');
    tt.is(typeof StateHock()(Child), 'function');
});

test('StateHock passes other props through', tt => {
    var Child = () => <div/>;
    var Component = StateHock()(Child);
    tt.is(shallow(<Component foo="bar" />).props().foo, 'bar');
    tt.is(shallow(<Component value="bar" />).props().value, undefined);
});

test('StateHock does not recreate props every render', tt => {
    const WrappedComponent = StateHock()(() => <div>Example Component</div>);
    const myWrappedComponent = new WrappedComponent({});

    var render1: Object = Map(myWrappedComponent.render().props);
    var render2: Object = Map(myWrappedComponent.render().props);

    render1.forEach((prop, key) => {
        tt.is(prop, render2.get(key), `Prop "${key}" must be strictly equal on re-render`);
    });
});

test('StateHock will allow you to change valueProp, onChangeProp & initialState', tt => {
    var Child = () => <div/>;
    var Component = StateHock((props) => ({
        initialState: 0,
        valueProp: 'foo',
        onChangeProp: 'changeFoo',
        initialValueProp: 'initialFoo'
    }))(Child);

    tt.is(shallow(<Component foo="bar" />).props().foo, 0);
    tt.is(typeof shallow(<Component value="bar" />).props().changeFoo, 'function');
    tt.is(shallow(<Component foo="bar" />).props().initialFoo, 0);
});

//
// Functionality
//

test('StateHock will set a default value', tt => {
    const Child = (props) => {
        tt.is(props.value, 0);
        return <div/>;
    };

    var Component = StateHock((props) => ({initialState: 0}))(Child);

    shallow(<Component />).dive();
});

test('StateHock props.onChange will replace value', tt => {
    var Child = () => <div/>;
    var Component = StateHock((props) => ({initialState: 0}))(Child);
    var instance = shallow(<Component />);
    instance.props().onChange(1);
    tt.is(instance.props().value, 1);
    tt.is(instance.props().initialValue, 0);
});

