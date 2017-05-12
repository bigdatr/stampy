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
        inputOnChange.calledWith('bar', {event: {target: {value: 'bar'}}, element: {value: 'bar'}}),
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

    tt.is(
        inputElem.render().children().first().get(0).attribs.type,
        "text",
        'Input defaults to type="text"'
    );
});

test('Input applies type attribute to HTML element', tt => {
    const input = shallow(<Input type="tel" />);
    tt.is(input.render().children().first().get(0).attribs.type, "tel");
});


test('Input should apply inputProps to outer element', tt => {
    const input = shallow(<Input inputProps={{'data-test': "test"}} />);
    tt.is(input.render().children().first().get(0).attribs['data-test'], "test");
});


test('Input will cast a value of null and undefined to an empty string', tt => {
    tt.is(shallow(<Input value={null} />).node.props.value, '');
    tt.is(shallow(<Input value={undefined} />).node.props.value, '');
});
