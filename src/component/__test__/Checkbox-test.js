// @flow
import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';
import sinon from 'sinon';
import Checkbox from '../Checkbox';

test('checkbox can be true', (tt: Object) => {

    const inputOnChange = sinon.spy();
    const inputComponent = shallow(<Checkbox onChange={inputOnChange} className='OtherToggle' modifier='large' value={true} />);
    const inputElem = inputComponent.find('input');

    tt.is(
        inputElem.props().checked,
        true,
        'checkbox is checked'
    );
});

test('checkbox can be false', (tt: Object) => {

    const inputOnChange = sinon.spy();
    const inputComponent = shallow(<Checkbox onChange={inputOnChange} className='OtherToggle' modifier='large' value={false} />);
    const inputElem = inputComponent.find('input');

    tt.is(
        inputElem.props().checked,
        false,
        'checkbox is not checked'
    );
});

test('checkbox', (tt: Object) => {

    const inputOnChange = sinon.spy();
    const inputComponent = shallow(<Checkbox onChange={inputOnChange} className='OtherToggle' modifier='large' value={true} />);
    const inputElem = inputComponent.find('input');

    inputElem.simulate('change', {target: {}});

    tt.true(
        inputOnChange.calledOnce,
        'checkbox on change called once'
    );

    tt.false(
        inputOnChange.getCall(0).args[0],
        'checkbox on change called with correct params'
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
        "checkbox",
        'Checkbox defaults to type="checkbox"'
    );
});

test('Checkbox should apply inputProps to outer element', (tt: Object) => {
    const input = shallow(<Checkbox inputProps={{'data-test': "test"}} />);
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

test('checkbox classes', (tt: Object) => {
    tt.truthy(
        shallow(<Checkbox/>)
            .render()
            .children()
            .first()
            .hasClass('Checkbox'),
        'checkbox should have a class of Checkbox'
    );

    tt.truthy(
        shallow(<Checkbox spruceName="Thing"/>)
            .render().
            children()
            .first()
            .hasClass('Thing'),
        'checkbox should change class if given a spruceName prop'
    );

    tt.truthy(
        shallow(<Checkbox modifier="large"/>)
            .render()
            .children()
            .first()
            .hasClass('Checkbox-large'),
        'checkboxes with modifiers should be rendered with that modifier class'
    );

    tt.truthy(
        shallow(<Checkbox peer="Thing"/>)
            .render()
            .children()
            .first()
            .hasClass('Checkbox--Thing'),
        'checkboxes with peers should be rendered with that peer class'
    );

    tt.truthy(
        shallow(<Checkbox className="foo"/>)
            .render()
            .children()
            .first()
            .hasClass('foo'),
        'checkboxes with className should append className'
    );

    tt.truthy(
        shallow(<Checkbox className="foo"/>)
            .render()
            .children()
            .first()
            .hasClass('Checkbox'),
        'checkboxes with className should not replace other class names'
    );
});
