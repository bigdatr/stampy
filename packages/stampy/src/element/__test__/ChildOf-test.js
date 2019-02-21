// @flow
import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';
import PropsOf from '../PropsOf';

test('PropsOf returns a function', (t: Object) => {
    t.is(typeof PropsOf(<div/>), 'function');
});

test('PropsOf returned function will clone the element the given value props', (t: Object) => {
    t.is(PropsOf(<div/>)({foo: true}).props.foo, true);
});

test('PropsOf will preserve original props', (t: Object) => {
    t.is(PropsOf(<div bar={true} />)({foo: false}).props.bar, true);
});

test('PropsOf will replace props', (t: Object) => {
    t.is(PropsOf(<div bar={true} />)({bar: false}).props.bar, false);
});

