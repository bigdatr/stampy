// @flow
import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';
import sinon from 'sinon';
import Checkbox from '../Checkbox';

test('checkbox can be true', (tt: Object) => {

    const inputOnChange = sinon.spy();
    const wrapper = shallow(<Checkbox onChange={inputOnChange} className='OtherToggle' modifier='large' value={true} />);
    const inputElem = wrapper.find('input');

    tt.is(
        inputElem.props().checked,
        true,
        'checkbox is checked'
    );

    tt.true(
        wrapper
            .render()
            .children()
            .first()
            .hasClass('Checkbox-active'),
        'checkbox has a class of Checkbox-active when value is true'
    );
});

test('checkbox can be false', (tt: Object) => {

    const inputOnChange = sinon.spy();
    const wrapper = shallow(<Checkbox onChange={inputOnChange} className='OtherToggle' modifier='large' value={false} />);
    const inputElem = wrapper.find('input');

    tt.is(
        inputElem.props().checked,
        false,
        'checkbox is not checked'
    );

    tt.false(
        wrapper
            .render()
            .children()
            .first()
            .hasClass('Checkbox-active'),
        'checkbox doesnt has a class of Checkbox-active when value is false'
    );
});

test('checkbox', (tt: Object) => {

    const inputOnChange = sinon.spy();
    const wrapper = shallow(<Checkbox onChange={inputOnChange} className='OtherToggle' modifier='large' value={true} />);
    const inputElem = wrapper.find('input');

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

test('disabled checkbox', (tt: Object) => {
    const toggleOnChange = sinon.spy();
    const wrapper = shallow(<Checkbox disabled onChange={toggleOnChange} />);

    tt.true(
        wrapper.prop('disabled'),
        'disabled checkboxes have a disabled attribute'
    );

    wrapper.find('input').simulate('change', {target: {}});
    tt.false(
        toggleOnChange.calledOnce,
        'disabled checkboxes do not call their onChange events when clicked'
    );

    tt.true(
        wrapper
            .render()
            .children()
            .first()
            .hasClass('Checkbox-disabled'),
        'checkbox has a class of Checkbox-disabled when disabled'
    );
});
