// @flow
import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';
import ChildOf from '../ChildOf';

test('ChildOf returns a function', (t: Object) => {
    t.is(typeof ChildOf(<div/>), 'function');
});

test('ChildOf returned function will clone the element the given value as a child', (t: Object) => {
    t.is(ChildOf(<div/>)('foo').props.children, 'foo');
    t.is((<div/>).props.children, undefined);
});

