import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';
import sinon from 'sinon';
import Button from '../Button';

test('basic button', tt => {
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

    tt.truthy(
        wrapper.render().children().first().hasClass('Button'),
        'button has a class of button'
    );

    tt.truthy(
        shallow(<Button modifier="large">Button</Button>).render().children().first().hasClass('Button-large'),
        'buttons with modifiers are rendered with that modifier class'
    );

    wrapper.find('button').simulate('click');
    tt.true(
        onButtonClick.calledOnce,
        'buttons call their onClick events when onClick is called'
    );
});


test('disabled button', tt => {
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

test('Button should apply buttonProps to outer element', tt => {
    const button = shallow(<Button buttonProps={{'data-test': "test"}} />);
    tt.is(button.render().children().first().get(0).attribs['data-test'], "test");
});