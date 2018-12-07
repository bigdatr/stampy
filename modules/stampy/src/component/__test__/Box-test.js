// @flow
import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';
import Box from '../Box';

test('basic box', (tt: Object) => {

    tt.is(
        shallow(<Box>Test Box</Box>).text(),
        'Test Box',
        'component text is rendered'
    );

    tt.true(
        typeof shallow(<Box>Test Box</Box>).prop('modifier') == 'undefined',
        'modifier prop is not passed to HTML element'
    );
});

test('Box should apply boxProps to outer element', (tt: Object) => {
    const box = shallow(<Box boxProps={{'data-test': "test"}} />);
    tt.is(
        box
            .render()
            .children()
            .first()
            .get(0)
            .attribs['data-test'],
        "test"
    );
});

test('box classes', (tt: Object) => {
    tt.truthy(
        shallow(<Box/>)
            .render()
            .children()
            .first()
            .hasClass('Box'),
        'box should have a class of Box'
    );

    tt.truthy(
        shallow(<Box spruceName="Thing"/>)
            .render().
            children()
            .first()
            .hasClass('Thing'),
        'box should change class if given a spruceName prop'
    );

    tt.truthy(
        shallow(<Box modifier="large"/>)
            .render()
            .children()
            .first()
            .hasClass('Box-large'),
        'boxs with modifiers should be rendered with that modifier class'
    );

    tt.truthy(
        shallow(<Box peer="Thing"/>)
            .render()
            .children()
            .first()
            .hasClass('Box--Thing'),
        'boxs with peers should be rendered with that peer class'
    );

    tt.truthy(
        shallow(<Box className="foo"/>)
            .render()
            .children()
            .first()
            .hasClass('foo'),
        'boxs with className should append className'
    );

    tt.truthy(
        shallow(<Box className="foo"/>)
            .render()
            .children()
            .first()
            .hasClass('Box'),
        'boxs with className should not replace other class names'
    );
});


test('box styles', (tt: Object) => {
    tt.is(shallow(<Box margin="1 2 3 4" />).prop('style').margin, '1rem 2rem 3rem 4rem');
    tt.is(shallow(<Box margin=" 1 2 " />).prop('style').margin, '1rem 2rem');

    tt.is(shallow(<Box margin="1" />).prop('style').margin, '1rem');
    tt.is(shallow(<Box marginBottom="1" />).prop('style').marginBottom, '1rem');
    tt.is(shallow(<Box marginLeft="1" />).prop('style').marginLeft, '1rem');
    tt.is(shallow(<Box marginRight="1" />).prop('style').marginRight, '1rem');
    tt.is(shallow(<Box marginTop="1" />).prop('style').marginTop, '1rem');
    tt.is(shallow(<Box padding="1" />).prop('style').padding, '1rem');
    tt.is(shallow(<Box paddingBottom="1" />).prop('style').paddingBottom, '1rem');
    tt.is(shallow(<Box paddingLeft="1" />).prop('style').paddingLeft, '1rem');
    tt.is(shallow(<Box paddingRight="1" />).prop('style').paddingRight, '1rem');
    tt.is(shallow(<Box paddingTop="1" />).prop('style').paddingTop, '1rem');
});
