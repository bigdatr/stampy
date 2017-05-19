import test from 'ava';
import {shallow} from 'enzyme';
import React from 'react';
import SpreadPipe from './SpreadPipe';
import {Map} from 'immutable';

//
// Hock Tests
//

test(`SpreadPipe matches (config) => (Component) => Hock`, tt => {
    var Child = () => <div/>;
    tt.is(typeof SpreadPipe, 'function');
    tt.is(typeof SpreadPipe(), 'function');
    tt.is(typeof SpreadPipe()(Child), 'function');
});

test(`SpreadPipe passes other props through`, tt => {
    var Child = () => <div/>;
    var Component = SpreadPipe()(Child);
    tt.is(shallow(<Component value={{}} foo="bar" />).props().foo, 'bar');
});


test(`SpreadPipe does not recreate props every render`, tt => {
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = SpreadPipe(() => ({
        valueChangePairs: [
            ['aValue', 'aChange'],
            ['bValue', 'bChange']
        ]
    }))(componentToWrap);

    const myWrappedComponent = new WrappedComponent({
        value: {
            aValue: '123',
            bValue: '456'
        }
    });

    var render1: Object = Map(myWrappedComponent.render().props);
    var render2: Object = Map(myWrappedComponent.render().props);

    render1.forEach((prop, key) => {
        tt.is(prop, render2.get(key), `Prop "${key}" must be strictly equal on re-render`);
    });
});


test(`SpreadPipe does not recreate props every render when using own config`, tt => {
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = SpreadPipe(() => ({
        valueChangePairs: [
            ['aValue', 'aChange'],
            ['bValue', 'bChange']
        ]
    }))(componentToWrap);

    const myWrappedComponent = new WrappedComponent({
        value: {
            aValue: '123',
            bValue: '456'
        }
    });

    var render1: Object = Map(myWrappedComponent.render().props);
    var render2: Object = Map(myWrappedComponent.render().props);

    render1.forEach((prop, key) => {
        tt.is(prop, render2.get(key), `Prop "${key}" must be strictly equal on re-render`);
    });
});

test(`SpreadPipe does not recreate props when changes happen to props to used in the updating of child props`, tt => {
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = SpreadPipe(() => ({
        valueChangePairs: [
            ['aValue', 'aChange'],
            ['bValue', 'bChange']
        ]
    }))(componentToWrap);

    const myWrappedComponent = new WrappedComponent({
        value: {
            aValue: '123',
            bValue: '456'
        },
        unrelatedProp: 123
    });

    myWrappedComponent.props = myWrappedComponent.render().props;
    myWrappedComponent.componentWillReceiveProps({unrelatedProp: 456});
    var render2: Object = Map(myWrappedComponent.render().props);

    Map(myWrappedComponent.props).forEach((prop, key) => {
        tt.is(prop, render2.get(key), `Prop "${key}" must be strictly equal after unrelated props change`);
    });
});

//
// spread pipe tests
//


test('SpreadPipe will allow you to change valueProp & onChangeProp', tt => {
    tt.plan(2);
    var Child = () => <div/>;
    var Component = SpreadPipe(() => ({
        valueChangePairs: [
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

test('SpreadPipe should silently fail if change function prop not provided', tt => {
    tt.plan(1);
    var Child = () => <div/>;
    var Component = SpreadPipe(() => ({
        valueChangePairs: [
            ['aValue', 'aChange']
        ]
    }))(Child);

    tt.notThrows(() => {
        shallow(<Component value={{}} />)
            .props()
            .aChange(1);
    });
});

test('SpreadPipe will create correct props off config.valueChangePairs', tt => {
    var Child = () => <div/>;
    var Component = SpreadPipe(() => ({
        valueChangePairs: [['fooValue', 'fooChange']]
    }))(Child);
    var instance = shallow(<Component value={{fooValue: 1}}/>);

    tt.is(instance.props().fooValue, 1);
    tt.is(typeof instance.props().fooChange, 'function');
});

test('SpreadPipe onChange function will change state.key based on name', tt => {
    var spy = (value) => tt.deepEqual(value, {fooValue: 2});
    var Child = () => <div/>;
    var Component = SpreadPipe(() => ({
        valueChangePairs: [['fooValue', 'fooChange']]
    }))(Child);
    var instance = shallow(<Component onChange={spy} value={{fooValue: 1}}/>);

    instance.props().fooChange(2);
});

test('SpreadPipe will not pass down original value and onChange props', tt => {
    var Child = () => <div/>;
    var Component = SpreadPipe(() => ({
        valueChangePairs: [['fooValue', 'fooChange']]
    }))(Child);
    var instance = shallow(<Component value={{fooValue: 1}}/>);

    tt.false(instance.props().hasOwnProperty('value'));
    tt.false(instance.props().hasOwnProperty('onChange'));
});

test('SpreadPipe will create value/onChange props off config.valueChangePairs', tt => {
    var Child = () => <div/>;
    var Component = SpreadPipe(() => ({
        valueChangePairs: [['value', 'onChange']]
    }))(Child);
    var instance = shallow(<Component value={{value: 1}}/>);

    tt.is(instance.props().value, 1);
    tt.is(typeof instance.props().onChange, 'function');
});
