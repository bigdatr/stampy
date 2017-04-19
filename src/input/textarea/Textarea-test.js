import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';
import sinon from 'sinon';
import Textarea from './Textarea';

test('textarea', tt => {

    const textareaOnChange = sinon.spy();
    const textareaComponent = shallow(<Textarea onChange={textareaOnChange} className='OtherToggle' modifier='large' value={'foo'}/>);
    const textareaElem = textareaComponent.find('textarea');

    tt.is(
        textareaElem.props().value,
        'foo',
        'textarea has correct value'
    );

    textareaElem.simulate('change', {target: {value: 'bar'}});

    tt.true(
        textareaOnChange.calledOnce,
        'textarea on change called once'
    );

    tt.true(
        textareaOnChange.calledWith('bar', {event: {target: {value: 'bar'}}, element: {value: 'bar'}}),
        'textarea on change called with correct params'
    );

    tt.true(
        !textareaElem.props().modifier,
        'modifier prop is not passed to textarea element'
    );

    tt.true(
        textareaComponent.render().children().first().hasClass('OtherToggle'),
        'textarea applies passed classname'
    );
});

test('Textarea should apply textareaProps to outer element', tt => {
    const textarea = shallow(<Textarea textareaProps={{'data-test': "test"}} />);
    tt.is(textarea.render().children().first().get(0).attribs['data-test'], "test");
});
