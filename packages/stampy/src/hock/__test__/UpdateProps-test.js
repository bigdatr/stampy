// @flow
import test from 'ava';
import {shallow} from 'enzyme';
import React from 'react';
import type {Element} from 'react';
import UpdateProps from '../UpdateProps';

test('UpdateProps can update props', (t: Object) => {

    const Child = (props: Object): Element<*> => {
        t.is(props.foo, 2);
        t.is(props.bar, 'rad');
        return <div/>;
    };

    var Component = UpdateProps((props) => ({
        foo: props.foo + 1,
        bar: 'rad'
    }))(Child);

    shallow(<Component foo={1} />).dive();
});


test('UpdateProps can remove props', (t: Object) => {

    const Child = (props: Object): Element<*> => {
        t.is(props.foo, undefined);
        return <div/>;
    };

    var Component = UpdateProps(() => ({}))(Child);

    shallow(<Component foo={1} />).dive();
});
