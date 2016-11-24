import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';
import sinon from 'sinon';
import Input from './Input';

test('input', tt => {

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
        inputOnChange.calledWith('bar', {event: {target: {value: 'bar'}}, elem: {value: 'bar'}}),
        'input on change called with correct params'
    );

    tt.true(
        !inputElem.props().modifier,
        'modifier prop is not passed to input element'
    );

    tt.true(
        inputComponent.render().children().first().hasClass('OtherToggle'),
        'input applies passed classname'
    );
});



