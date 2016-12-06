import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';
import sinon from 'sinon';
import Label from './Label';

test('basic label', tt => {

    tt.is(
        shallow(<Label>Test Label</Label>).text(),
        'Test Label',
        'component text is rendered'
    );

    tt.true(
        typeof shallow(<Label>Test Label</Label>).prop('modifier') == 'undefined',
        'modifier prop is not passed to HTML element'
    );

});

