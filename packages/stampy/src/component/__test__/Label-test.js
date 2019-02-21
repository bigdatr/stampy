// @flow
import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';
import Label from '../Label';

test('basic label', (tt: Object) => {

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


test('Label applies htmlFor as "for" attribute on <label>', (tt: Object) => {
    const label = shallow(<Label htmlFor="abc" />);
    tt.is(
        label
            .render()
            .children()
            .first()
            .get(0)
            .attribs
            .for,
        "abc"
    );
});

test('Label should apply labelProps to outer element', (tt: Object) => {
    const label = shallow(<Label labelProps={{'data-test': "test"}} />);
    tt.is(
        label
            .render()
            .children()
            .first()
            .get(0)
            .attribs['data-test'],
        "test"
    );
});

test('label classes', (tt: Object) => {
    tt.truthy(
        shallow(<Label/>)
            .render()
            .children()
            .first()
            .hasClass('Label'),
        'label should have a class of Label'
    );

    tt.truthy(
        shallow(<Label spruceName="Thing"/>)
            .render().
            children()
            .first()
            .hasClass('Thing'),
        'label should change class if given a spruceName prop'
    );

    tt.truthy(
        shallow(<Label modifier="large"/>)
            .render()
            .children()
            .first()
            .hasClass('Label-large'),
        'labels with modifiers should be rendered with that modifier class'
    );

    tt.truthy(
        shallow(<Label peer="Thing"/>)
            .render()
            .children()
            .first()
            .hasClass('Label--Thing'),
        'labels with peers should be rendered with that peer class'
    );

    tt.truthy(
        shallow(<Label className="foo"/>)
            .render()
            .children()
            .first()
            .hasClass('foo'),
        'labels with className should append className'
    );

    tt.truthy(
        shallow(<Label className="foo"/>)
            .render()
            .children()
            .first()
            .hasClass('Label'),
        'labels with className should not replace other class names'
    );
});
