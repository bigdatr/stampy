import test from 'ava';
import {shallow} from 'enzyme';
import React from 'react';
import DebouncePipe from './DebouncePipe';
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
    const myWrappedComponent = new WrappedComponent();
    myWrappedComponent.props = {};

    var render1: Object = Map(myWrappedComponent.render().props);
    var render2: Object = Map(myWrappedComponent.render().props);

    render1.forEach((prop, key) => {
        tt.is(prop, render2.get(key), `Prop "${key}" must be strictly equal on re-render`);
    });
});

//
// debounce pipe tests
//
