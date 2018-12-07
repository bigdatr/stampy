// @flow
import test from 'ava';
import {shallow} from 'enzyme';
import React from 'react';
import type {Node} from 'react';
import SetProp from '../SetProp';

test('SetProp can update a prop via a value', (t: Object) => {

    const Child = (props: Object): Node => {
        t.is(props.foo, 2);
        return <div/>;
    };

    var Component = SetProp("foo", 2)(Child);

    shallow(<Component foo={1} />).dive();
});

test('SetProp can set prop via an updater', (t: Object) => {

    const Child = (props: Object): Node => {
        t.is(props.foo, 2);
        return <div/>;
    };

    var Component = SetProp("foo", props => props.foo + 1)(Child);

    shallow(<Component foo={1} />).dive();
});

test('SetProp can set a new prop', (t: Object) => {

    const Child = (props: Object): Node => {
        t.is(props.baz, 2);
        return <div/>;
    };

    var Component = SetProp("baz", 2)(Child);

    shallow(<Component foo={1} />).dive();
});
