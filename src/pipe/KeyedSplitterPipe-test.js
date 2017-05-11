import test from 'ava';
import {shallow} from 'enzyme';
import React from 'react';
import KeyedSplitterPipe from './KeyedSplitterPipe';

test(`KeyedSplitterPipe matches (config) => (Component) => Hock`, tt => {
    var Child = () => <div/>;
    tt.is(typeof KeyedSplitterPipe, 'function');
    tt.is(typeof KeyedSplitterPipe(), 'function');
    tt.is(typeof KeyedSplitterPipe()(Child), 'function');
});

test(`KeyedSplitterPipe passes other props through`, tt => {
    var Child = () => <div/>;
    var Component = KeyedSplitterPipe()(Child);
    tt.is(shallow(<Component dataValue={{}} foo="bar" />).props().foo, 'bar');
});

test(`KeyedSplitterPipe does not recreate props every render`, tt => {
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = KeyedSplitterPipe()(componentToWrap);
    const myWrappedComponent = new WrappedComponent();
    myWrappedComponent.props = {};

    var render1: Object = Map(myWrappedComponent.render().props);
    var render2: Object = Map(myWrappedComponent.render().props);

    render1.forEach((prop, key) => {
        tt.is(prop, render2.get(key), `Prop "${key}" must be strictly equal on re-render`);
    });
});
