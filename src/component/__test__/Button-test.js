// @flow
import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';
import sinon from 'sinon';
import Button from '../Button';

test('basic button', (tt: Object) => {
    const onButtonClick = sinon.spy();
    const wrapper = shallow(<Button onClick={onButtonClick}>Button</Button>);

    tt.is(
        wrapper.text(),
        'Button',
        'component text is rendered'
    );

    tt.true(
        typeof wrapper.prop('modifier') == 'undefined',
        'modifier prop is not passed to HTML element'
    );

    wrapper.find('button').simulate('click');
    tt.true(
        onButtonClick.calledOnce,
        'buttons call their onClick events when onClick is called'
    );
});

test('button classes', (tt: Object) => {
    tt.truthy(
        shallow(<Button>Button</Button>)
            .render()
            .children()
            .first()
            .hasClass('Button'),
        'button should have a class of Button'
    );

    tt.truthy(
        shallow(<Button spruceName="Thing">Button</Button>)
            .render().
            children()
            .first()
            .hasClass('Thing'),
        'button should change class if given a spruceName prop'
    );

    tt.truthy(
        shallow(<Button modifier="large">Button</Button>)
            .render()
            .children()
            .first()
            .hasClass('Button-large'),
        'buttons with modifiers should be rendered with that modifier class'
    );

    tt.truthy(
        shallow(<Button peer="Thing">Button</Button>)
            .render()
            .children()
            .first()
            .hasClass('Button--Thing'),
        'buttons with peers should be rendered with that peer class'
    );

    tt.truthy(
        shallow(<Button className="foo">Button</Button>)
            .render()
            .children()
            .first()
            .hasClass('foo'),
        'buttons with className should append className'
    );

    tt.truthy(
        shallow(<Button className="foo">Button</Button>)
            .render()
            .children()
            .first()
            .hasClass('Button'),
        'buttons with className should not replace other class names'
    );
});

test('disabled button', (tt: Object) => {
    const onButtonClick = sinon.spy();
    const wrapper = shallow(<Button disabled onClick={onButtonClick}>Button</Button>);

    tt.true(
        wrapper.prop('disabled'),
        'disabled buttons have a disabled attribute'
    );

    tt.true(
        wrapper.render().children().first().hasClass('Button-disabled'),
        'disabled buttons have a Button-disabled className'
    )

    wrapper.find('button').simulate('click');
    tt.false(
        onButtonClick.calledOnce,
        'disabled buttons do not call their onClick events when onClick is called'
    );
});

test('Button should apply buttonProps to outer element', (tt: Object) => {
    const button = shallow(<Button buttonProps={{'data-test': "test"}} />);
    tt.is(button.render().children().first().get(0).attribs['data-test'], "test");
});
