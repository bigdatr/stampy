import test from 'ava';
import {shallow} from 'enzyme';
import React from 'react';
import KeyedStatePipe from './KeyedStatePipe';
import {Map} from 'immutable';

//
// Hock Tests
//

test(`KeyedStatePipe matches (config) => (Component) => Hock`, tt => {
    var Child = () => <div/>;
    tt.is(typeof KeyedStatePipe, 'function');
    tt.is(typeof KeyedStatePipe(), 'function');
    tt.is(typeof KeyedStatePipe()(Child), 'function');
});

test(`KeyedStatePipe passes other props through`, tt => {
    var Child = () => <div/>;
    var Component = KeyedStatePipe()(Child);
    tt.is(shallow(<Component value={{}} foo="bar" />).props().foo, 'bar');
});

test(`KeyedStatePipe does not recreate props every render`, tt => {
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = KeyedStatePipe()(componentToWrap);
    const myWrappedComponent = new WrappedComponent();
    myWrappedComponent.props = {
        value: "anything"
    };

    var render1: Object = Map(myWrappedComponent.render().props);
    var render2: Object = Map(myWrappedComponent.render().props);

    render1.forEach((prop, key) => {
        tt.is(prop, render2.get(key), `Prop "${key}" is not equal on re-render`);
    });
});

test('KeyedStatePipe will allow you to change valueProp & onChangeProp', tt => {
    var Child = () => <div/>;
    var Component = KeyedStatePipe(() => ({
        keys: [
            ['aValue', 'aChange'],
            ['bValue', 'bChange']
        ],
        valueProp: 'foo',
        onChangeProp: 'changeFoo'
    }))(Child);

    tt.is(shallow(<Component foo={{aValue: 1}} />).props().aValue, 1);

    shallow(<Component foo={{}} changeFoo={pp => tt.deepEqual(pp, {aValue: 1})} />)
        .props()
        .aChange(1);

});



//
// Functionality
//

test('KeyedStatePipe will create correct props off config.keys', tt => {
    var Child = () => <div/>;
    var Component = KeyedStatePipe(() => ({
        keys: [['fooValue', 'fooChange']]
    }))(Child);
    var instance = shallow(<Component value={{fooValue: 1}}/>);

    tt.is(instance.props().fooValue, 1);
    tt.is(typeof instance.props().fooChange, 'function');
});

test('KeyedStatePipe onChange function will change state.key based on name', tt => {
    var spy = (value) => tt.deepEqual(value, {fooValue: 2});
    var Child = () => <div/>;
    var Component = KeyedStatePipe(() => ({
        keys: [['fooValue', 'fooChange']]
    }))(Child);
    var instance = shallow(<Component onChange={spy} value={{fooValue: 1}}/>);

    instance.props().fooChange(2);
});

test('KeyedStatePipe will not pass down original value and onChange props', tt => {
    var Child = () => <div/>;
    var Component = KeyedStatePipe(() => ({
        keys: [['fooValue', 'fooChange']]
    }))(Child);
    var instance = shallow(<Component value={{fooValue: 1}}/>);

    tt.false(instance.props().hasOwnProperty('value'));
    tt.false(instance.props().hasOwnProperty('onChange'));
});

test('KeyedStatePipe will create value/onChange props off config.keys', tt => {
    var Child = () => <div/>;
    var Component = KeyedStatePipe(() => ({
        keys: [['value', 'onChange']]
    }))(Child);
    var instance = shallow(<Component value={{value: 1}}/>);

    tt.is(instance.props().value, 1);
    tt.is(typeof instance.props().onChange, 'function');
});
