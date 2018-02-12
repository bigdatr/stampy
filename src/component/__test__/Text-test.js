// @flow
import test from 'ava';
import React from 'react';
import type {Element} from 'react';
import {shallow} from 'enzyme';
import Text from '../Text';

test('Text will render a custom Element', (tt: Object) => {
    function TestElement(): Element<*> {
        return <div></div>;
    }
    tt.is(shallow(<Text />).node.type, 'span');
    tt.is(shallow(<Text element="div"/>).node.type, 'div');
    tt.is(shallow(<Text element={TestElement}/>).node.type, TestElement);
});

test('Text will format numbers', (tt: Object) => {
    tt.is(shallow(<Text numberFormat="0,0" children={1234}/>).node.props.children, '1,234');
});

test('Text will format dates', (tt: Object) => {
    tt.is(shallow(<Text dateFormat="YYYY-MM-DD" children={0}/>).node.props.children, '1970-01-01');
    tt.is(shallow(<Text dateFormat="DD-MM-YYYY" children={'1970-01-01'}/>).node.props.children, '01-01-1970');
});

test('Text will format dates for title attribute', (tt: Object) => {
    tt.is(shallow(<Text titleDateFormat="YYYY-MM-DD" children={0}/>).node.props.title, '1970-01-01');
    tt.is(shallow(<Text titleDateFormat="DD-MM-YYYY" children={'1970-01-01'}/>).node.props.title, '01-01-1970');
});

test('text classes', (tt: Object) => {
    tt.truthy(
        shallow(<Text/>)
            .render()
            .children()
            .first()
            .hasClass('Text'),
        'text should have a class of Text'
    );

    tt.truthy(
        shallow(<Text spruceName="Thing"/>)
            .render()
            .children()
            .first()
            .hasClass('Thing'),
        'text should change class if given a spruceName prop'
    );

    tt.truthy(
        shallow(<Text modifier="large"/>)
            .render()
            .children()
            .first()
            .hasClass('Text-large'),
        'texts with modifiers should be rendered with that modifier class'
    );

    tt.truthy(
        shallow(<Text peer="Thing"/>)
            .render()
            .children()
            .first()
            .hasClass('Text--Thing'),
        'texts with peers should be rendered with that peer class'
    );

    tt.truthy(
        shallow(<Text className="foo"/>)
            .render()
            .children()
            .first()
            .hasClass('foo'),
        'texts with className should append className'
    );

    tt.truthy(
        shallow(<Text className="foo"/>)
            .render()
            .children()
            .first()
            .hasClass('Text'),
        'texts with className should not replace other class names'
    );
});
