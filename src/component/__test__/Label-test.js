import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';
import sinon from 'sinon';
import Label from '../Label';

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


test('Label applies htmlFor as "for" attribute on <label>', tt => {
    const label = shallow(<Label htmlFor="abc" />);
    tt.is(label.render().children().first().get(0).attribs.for, "abc");
});



test('Label should apply labelProps to outer element', tt => {
    const label = shallow(<Label labelProps={{'data-test': "test"}} />);
    tt.is(label.render().children().first().get(0).attribs['data-test'], "test");
});

