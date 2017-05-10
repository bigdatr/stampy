import test from 'ava';
import {shallow} from 'enzyme';
import React from 'react';

function HockTests(Hock: *, name: string) {
    test(`${name} matches (config) => (Component) => Hock`, tt => {
        var Child = () => <div/>;
        tt.is(typeof Hock, 'function');
        tt.is(typeof Hock(), 'function');
        tt.is(typeof Hock()(Child), 'function');
    });

    // add test to ensure Hock accepts two possible arguments,
    // config and applierConfig, both functions
}

function TransparentHockTests(Hock: *, name: string) {
    test(`${name} passes other props through`, tt => {
        var Child = () => <div/>;
        var Component = Hock()(Child);
        tt.is(shallow(<Component dataValue={{}} foo="bar" />).props().foo, 'bar');
    });
}

export {
    HockTests,
    TransparentHockTests
}

