// @flow
import test from 'ava';
import React from 'react';
import {cloneElement} from 'react';
import {shallow} from 'enzyme';
import {fake} from 'sinon';
import {spy} from 'sinon';
import CollectionSelect_control from '../CollectionSelect_control';



const Control = <CollectionSelect_control
    dangerouslyInsideParentComponent={true}
    match=""
    onChangeMatch={fake()}
    onChangeShow={fake()}
    onKeyDownInput={fake()}
    parent="Foo"
    placeholder=""
    show={false}
    valueList={fake()}
/>;

test('will add a _control className', (t: Object) => {
    t.is(
        shallow(Control).dive().prop('className'),
        "Foo_control"
    );
});


test('_input will only show the current match string if the optionList is open', (t: Object) => {
    const input = (props) => shallow(cloneElement(Control, props)).find('Input');
    t.is(input({match: 'foo', show: true}).prop('value'), 'foo');
    t.is(input({match: 'foo', show: false}).prop('value'), '');
});

test('_input will close the options on return and escape, but will open on any other keyPress', (t: Object) => {
    const onChangeShow = spy();
    const input = shallow(cloneElement(Control, {onChangeShow})).find('Input').dive();


    input.simulate('keyDown', {keyCode: 13});
    t.true(
        onChangeShow.firstCall.calledWith(false),
        'return will close'
    );


    input.simulate('keyDown', {keyCode: 27});
    t.true(
        onChangeShow.secondCall.calledWith(false),
        'escape will close'
    );


    input.simulate('keyDown', {keyCode: 1231});
    t.true(
        onChangeShow.thirdCall.calledWith(true),
        'anything else will open'
    );

});


test('_input pass the onKeyDown event along to onKeyDownInput', (t: Object) => {
    const onKeyDownInput = spy();
    const input = shallow(cloneElement(Control, {onKeyDownInput})).find('Input').dive();

    input.simulate('keyDown', {keyCode: 1});
    input.simulate('keyDown', {keyCode: 2});
    input.simulate('keyDown', {keyCode: 3});
    t.true(onKeyDownInput.firstCall.calledWith({keyCode: 1}));
    t.true(onKeyDownInput.secondCall.calledWith({keyCode: 2}));
    t.true(onKeyDownInput.thirdCall.calledWith({keyCode: 3}));
});


test('_input will open/close the options list on click, focus and blur', (t: Object) => {
    const onChangeShow = spy();
    const input = shallow(cloneElement(Control, {onChangeShow})).find('Input').dive();


    input.simulate('click');
    t.true(
        onChangeShow.firstCall.calledWith(true),
        'onClick will open the list'
    );


    input.simulate('focus');
    t.true(
        onChangeShow.secondCall.calledWith(true),
        'onFocus will open the list'
    );


    input.simulate('blur');
    t.true(
        onChangeShow.thirdCall.calledWith(false),
        'onBlur will close the list'
    );

});



test('will render the default open/close icons based on props.show', (t: Object) => {
    const openClose = (props) => shallow(cloneElement(Control, props))
        .find('_openClose')
        .childAt(0)
    ;

    t.is(
        '▾',
        openClose({show: false}).prop('children'),
        'closed: will render the default down arrow'
    );

    t.is(
        '▾',
        openClose({show: true}).prop('children'),
        'open: will render the default down arrow'
    );

    t.is(
        'rotate(180deg)',
        openClose({show: true}).prop('style').transform,
        'open: will be rotated'
    );
});

test('will render the custon open/close icons', (t: Object) => {
    const openClose = (props) => shallow(cloneElement(Control, props))
        .find('_openClose')
        .prop('children');

    t.is('open', openClose({show: false, openIcon: () => 'open'}));
    t.is('close', openClose({show: true, closeIcon: () => 'close'}));

});

