// @flow
import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';
import sinon from 'sinon';
import Textarea from '../Textarea';

test('textarea', (tt: Object) => {

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
});

test('Textarea should apply textareaProps to outer element', (tt: Object) => {
    const textarea = shallow(<Textarea textareaProps={{'data-test': "test"}} />);
    tt.is(
        textarea
            .render()
            .children()
            .first()
            .get(0)
            .attribs['data-test'],
        "test"
    );
});

test('Textarea will cast a value of null and undefined to an empty string', (tt: Object) => {
    tt.is(shallow(<Textarea value={null} />).node.props.value, '');
    tt.is(shallow(<Textarea value={undefined} />).node.props.value, '');
});

test('textarea classes', (tt: Object) => {
    tt.truthy(
        shallow(<Textarea/>)
            .render()
            .children()
            .first()
            .hasClass('Textarea'),
        'textarea should have a class of Textarea'
    );

    tt.truthy(
        shallow(<Textarea spruceName="Thing"/>)
            .render().
            children()
            .first()
            .hasClass('Thing'),
        'textarea should change class if given a spruceName prop'
    );

    tt.truthy(
        shallow(<Textarea modifier="large"/>)
            .render()
            .children()
            .first()
            .hasClass('Textarea-large'),
        'textareas with modifiers should be rendered with that modifier class'
    );

    tt.truthy(
        shallow(<Textarea peer="Thing"/>)
            .render()
            .children()
            .first()
            .hasClass('Textarea--Thing'),
        'textareas with peers should be rendered with that peer class'
    );

    tt.truthy(
        shallow(<Textarea className="foo"/>)
            .render()
            .children()
            .first()
            .hasClass('foo'),
        'textareas with className should append className'
    );

    tt.truthy(
        shallow(<Textarea className="foo"/>)
            .render()
            .children()
            .first()
            .hasClass('Textarea'),
        'textareas with className should not replace other class names'
    );
});
