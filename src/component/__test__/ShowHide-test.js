// @flow
import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';
import sinon from 'sinon';

import ShowHide, {ShowHideStateful} from '../ShowHide';

import {CheckClassName} from '../../util/TestHelpers';


const toggle = () => <div></div>;


test.beforeEach(t => {
    global.document = {};
    global.document.addEventListener = sinon.spy();
    global.document.removeEventListener = sinon.spy();
});

test.afterEach(t => {
    delete global.document;
});

test('ShowHide will toggle props.show onChange', (tt: Object) => {
    const onChange = sinon.spy();
    const showHide = shallow(<ShowHide show={false} onChange={onChange} toggle={toggle}/>);
    showHide.find('.ShowHide_toggle').simulate('click');
    tt.is(onChange.firstCall.args[0], true);
});

test('ShowHide will not break if onChange is not provided', (tt: Object) => {
    const showHide = shallow(<ShowHide show={false} toggle={toggle}/>);
    showHide.find('.ShowHide_toggle').simulate('click');
    tt.is(showHide.find('.ShowHide_children').length, 0);
});

test('ShowHide will show children based on props.show', (tt: Object) => {
    const show = shallow(<ShowHide show={true} toggle={toggle}/>);
    const hide = shallow(<ShowHide show={false} toggle={toggle}/>);
    tt.is(show.find('.ShowHide_children').length, 1);
    tt.is(hide.find('.ShowHide_children').length, 0);
});

test('ShowHide will create and destroy event listeners if closeOnBlur is true', (tt: Object) => {
    global.document.addEventListener = sinon.spy();
    global.document.removeEventListener = sinon.spy();

    // event listeners will not be added without the closeOnBlur prop
    shallow(<ShowHide toggle={toggle} />).unmount();
    tt.is(global.document.addEventListener.callCount, 0);
    tt.is(global.document.removeEventListener.callCount, 0);

    // event listeners are added when the prop is true
    shallow(<ShowHide closeOnBlur toggle={toggle} />).unmount();
    tt.is(global.document.addEventListener.firstCall.args[0], 'mousedown');
    tt.is(global.document.removeEventListener.firstCall.args[0], 'mousedown');
    tt.is(typeof global.document.addEventListener.firstCall.args[1], 'function');
    tt.is(typeof global.document.removeEventListener.firstCall.args[1], 'function');
});

test.todo('ShowHide will fire onChange with false on an ouside click');


test('ShowHideStateful default visibility off defaultShow', (tt: Object) => {
    const show = shallow(<ShowHideStateful toggle={toggle} defaultShow={true}/>);
    const hide = shallow(<ShowHideStateful toggle={toggle} />);
    tt.deepEqual(show.state('value'), {show: true});
    tt.deepEqual(hide.state('value'), {show: false});
});

test('ShowHideStateful will passthrough props.onChange', (tt: Object) => {
    const onChange = sinon.spy();
    const showHide = shallow(<ShowHideStateful toggle={toggle} onChange={onChange}/>);
    showHide
        .dive()
        .dive()
        .find('.ShowHide_toggle')
        .simulate('click');

    tt.is(onChange.firstCall.args[0], true);
});




test('showhide classes', (tt: Object) => {
    tt.true(
        CheckClassName(<ShowHide toggle={toggle}/>, 'ShowHide'),
        'showhide should have a class of ShowHide'
    );

    tt.true(
        CheckClassName(<ShowHide toggle={toggle} spruceName="Thing"/>, 'Thing'),
        'showhide should change class if given a spruceName prop'
    );

    tt.true(
        CheckClassName(<ShowHide toggle={toggle} modifier="large"/>, 'ShowHide-large'),
        'showhides with modifiers should be rendered with that modifier class'
    );

    tt.true(
        CheckClassName(<ShowHide toggle={toggle} peer="Thing"/>, 'ShowHide--Thing'),
        'showhides with peers should be rendered with that peer class'
    );

    tt.true(
        CheckClassName(<ShowHide toggle={toggle} className="foo"/>, 'foo'),
        'showhides with className should append className'
    );

    tt.true(
        CheckClassName(<ShowHide toggle={toggle} className="foo"/>, 'ShowHide'),
        'showhides with className should not replace other class names'
    );
});
