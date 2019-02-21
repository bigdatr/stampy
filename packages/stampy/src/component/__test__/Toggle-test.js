// @flow
import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';
import sinon from 'sinon';
import Toggle from '../Toggle';

test('toggle', (tt: Object) => {

    const trueToggleOnChange = sinon.spy();
    const falseToggleOnChange = sinon.spy();
    const trueToggle = shallow(<Toggle onChange={trueToggleOnChange} value={true}>Toggle</Toggle>);
    const falseToggle = shallow(<Toggle onChange={falseToggleOnChange} value={false}>Toggle</Toggle>);

    tt.is(
        trueToggle.text(),
        'Toggle',
        'component text is rendered'
    );

    tt.true(
        typeof trueToggle.prop('modifier') == 'undefined',
        'modifier prop is not passed to HTML element'
    );

    tt.true(
        typeof trueToggle.prop('value') == 'undefined',
        'value prop is not passed to HTML element'
    );

    tt.true(
        trueToggle
            .render()
            .children()
            .first()
            .hasClass('Toggle-active'),
        'toggle has a class of Toggle-active when value is true'
    );

    tt.false(
        falseToggle
            .render()
            .children()
            .first()
            .hasClass('Toggle-active'),
        'toggle has not a class of Toggle-active when value is false'
    );

    trueToggle.find('button').simulate('click', {target: {}});
    tt.true(
        trueToggleOnChange.calledOnce,
        'toggles call their onClick events when onClick is called'
    );

    tt.false(
        trueToggleOnChange.getCall(0).args[0],
        'toggles with a value of true will call onChange with a value of false'
    );

    falseToggle.find('button').simulate('click', {target: {}});
    tt.true(
        falseToggleOnChange.getCall(0).args[0],
        'toggles with a value of false will call onChange with a value of true'
    );
});


test('disabled toggle', (tt: Object) => {
    const toggleOnChange = sinon.spy();
    const wrapper = shallow(<Toggle disabled onChange={toggleOnChange}>Toggle</Toggle>);

    tt.true(
        wrapper.prop('disabled'),
        'disabled toggles have a disabled attribute'
    );

    wrapper.find('button').simulate('click');
    tt.false(
        toggleOnChange.calledOnce,
        'disabled toggles do not call their onChange events when clicked'
    );
});


test('Toggle should apply toggleProps to outer element', (tt: Object) => {
    const toggle = shallow(<Toggle toggleProps={{'data-test': "test"}} />);
    tt.is(
        toggle
            .render()
            .children()
            .first()
            .get(0)
            .attribs['data-test'],
        "test"
    );
});

test('toggle classes', (tt: Object) => {
    tt.truthy(
        shallow(<Toggle/>)
            .render()
            .children()
            .first()
            .hasClass('Toggle'),
        'toggle should have a class of Toggle'
    );

    tt.truthy(
        shallow(<Toggle spruceName="Thing"/>)
            .render().
            children()
            .first()
            .hasClass('Thing'),
        'toggle should change class if given a spruceName prop'
    );

    tt.truthy(
        shallow(<Toggle modifier="large"/>)
            .render()
            .children()
            .first()
            .hasClass('Toggle-large'),
        'toggles with modifiers should be rendered with that modifier class'
    );

    tt.truthy(
        shallow(<Toggle peer="Thing"/>)
            .render()
            .children()
            .first()
            .hasClass('Toggle--Thing'),
        'toggles with peers should be rendered with that peer class'
    );

    tt.truthy(
        shallow(<Toggle className="foo"/>)
            .render()
            .children()
            .first()
            .hasClass('foo'),
        'toggles with className should append className'
    );

    tt.truthy(
        shallow(<Toggle className="foo"/>)
            .render()
            .children()
            .first()
            .hasClass('Toggle'),
        'toggles with className should not replace other class names'
    );
});

