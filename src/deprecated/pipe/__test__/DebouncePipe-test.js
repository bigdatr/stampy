import test from 'ava';
import {shallow} from 'enzyme';
import React from 'react';
import DebouncePipe from '../DebouncePipe';
import {Map} from 'immutable';

//
// hock tests
//

test(`DebouncePipe matches (config) => (Component) => Hock`, tt => {
    var Child = () => <div/>;
    tt.is(typeof DebouncePipe, 'function');
    tt.is(typeof DebouncePipe(), 'function');
    tt.is(typeof DebouncePipe()(Child), 'function');
});

test(`DebouncePipe does not recreate props every render`, tt => {
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = DebouncePipe()(componentToWrap);
    const myWrappedComponent = new WrappedComponent({});

    var render1: Object = Map(myWrappedComponent.render().props);
    var render2: Object = Map(myWrappedComponent.render().props);

    render1.forEach((prop, key) => {
        tt.is(prop, render2.get(key), `Prop "${key}" must be strictly equal on re-render`);
    });
});

//
// debounce pipe tests
//

test('DebouncePipe will call onChange', async tt => {
    tt.plan(1);

    var Child = () => <div/>;
    var Component = DebouncePipe(null, {wait: 10})(Child);
    var payload = {anything: true};
    var asyncTest = new Promise(resolve => {
        shallow(<Component onChange={resolve} />)
            .props()
            .onChange(payload);
    });

    tt.is(await asyncTest, payload, 'onChange is called with correct payload');
});

test('DebouncePipe will debounce onChange', async tt => {
    tt.plan(1);

    var Child = () => <div/>;
    var Component = DebouncePipe(null, {wait: 100})(Child);
    var payload1 = {anything: true};
    var payload2 = {anything: false};
    var asyncTest = new Promise(resolve => {
        const {onChange} = shallow(<Component onChange={resolve} />).props();
        onChange(payload1);
        onChange(payload2);
    });

    tt.is(await asyncTest, payload2, 'onChange is called with correct payload');
});

test('DebouncePipe can change onChangeProp', async tt => {
    tt.plan(1);

    var Child = () => <div/>;
    var Component = DebouncePipe(() => ({
        onChangeProp: "onSubmit"
    }), {wait: 10})(Child);

    var payload = {anything: true};
    var asyncTest = new Promise(resolve => {
        shallow(<Component onSubmit={resolve} />)
            .props()
            .onSubmit(payload);
    });

    tt.is(await asyncTest, payload, 'onSubmit is called with correct payload');
});
