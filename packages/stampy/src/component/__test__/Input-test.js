// @flow
import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';
import sinon from 'sinon';
import Input from '../Input';

test('input', (tt: Object) => {

    const inputOnChange = sinon.spy();
    const inputComponent = shallow(<Input onChange={inputOnChange} className='OtherToggle' modifier='large' value={'foo'}/>);
    const inputElem = inputComponent.find('input');

    tt.is(
        inputElem.props().value,
        'foo',
        'input has correct value'
    );

    inputElem.simulate('change', {target: {value: 'bar'}});

    tt.true(
        inputOnChange.calledOnce,
        'input on change called once'
    );

    tt.true(
        inputOnChange.calledWith('bar', {event: {target: {value: 'bar'}}, element: {value: 'bar'}}),
        'input on change called with correct params'
    );

    tt.true(
        !inputElem.props().modifier,
        'modifier prop is not passed to input element'
    );

    tt.is(
        inputElem
            .render()
            .children()
            .first()
            .get(0)
            .attribs
            .type,
        "text",
        'Input defaults to type="text"'
    );
});

test('Input applies type attribute to HTML element', (tt: Object) => {
    const input = shallow(<Input type="tel" />);
    tt.is(
        input
            .render()
            .children()
            .first()
            .get(0)
            .attribs
            .type,
        "tel"
    );
});


test('Input should apply inputProps to outer element', (tt: Object) => {
    const input = shallow(<Input inputProps={{'data-test': "test"}} />);
    tt.is(
        input
            .render()
            .children()
            .first()
            .get(0)
            .attribs['data-test'],
        "test"
    );
});


test('Input will cast a value of null and undefined to an empty string', (tt: Object) => {
    tt.is(shallow(<Input value={null} />).node.props.value, '');
    tt.is(shallow(<Input value={undefined} />).node.props.value, '');
});

test('Input will correctly apply placeholder attribute', (tt: Object) => {
    tt.is(shallow(<Input placeholder="place" />).node.props.placeholder, 'place');
    tt.is(shallow(<Input />).node.props.placeholder, undefined);
});

test('input classes', (tt: Object) => {
    tt.truthy(
        shallow(<Input/>)
            .render()
            .children()
            .first()
            .hasClass('Input'),
        'input should have a class of Input'
    );

    tt.truthy(
        shallow(<Input spruceName="Thing"/>)
            .render().
            children()
            .first()
            .hasClass('Thing'),
        'input should change class if given a spruceName prop'
    );

    tt.truthy(
        shallow(<Input modifier="large"/>)
            .render()
            .children()
            .first()
            .hasClass('Input-large'),
        'inputs with modifiers should be rendered with that modifier class'
    );

    tt.truthy(
        shallow(<Input peer="Thing"/>)
            .render()
            .children()
            .first()
            .hasClass('Input--Thing'),
        'inputs with peers should be rendered with that peer class'
    );

    tt.truthy(
        shallow(<Input className="foo"/>)
            .render()
            .children()
            .first()
            .hasClass('foo'),
        'inputs with className should append className'
    );

    tt.truthy(
        shallow(<Input className="foo"/>)
            .render()
            .children()
            .first()
            .hasClass('Input'),
        'inputs with className should not replace other class names'
    );
});
