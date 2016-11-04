import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';
import ComponentClassName from './ComponentClassName';

test('modifier splitting', tt => {
    tt.is(ComponentClassName({name: 'Test', modifier:'rad cool'}), 'Test Test-rad Test-cool ');
});

test('modifier splitting', tt => {
    tt.is(ComponentClassName({name: 'Test'}, 'extra'), 'Test extra');
});
