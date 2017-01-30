import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';
import sinon from 'sinon';

import ShowHide, {ShowHideStateful} from './ShowHide';


const toggle = () => <div></div>;

test('ShowHide will toggle props.show onClick', tt => {
    const onClick = sinon.spy();
    const showHide = shallow(<ShowHide show={false} onClick={onClick} toggle={toggle}/>);
    showHide.find('.ShowHide_toggle').simulate('click');
    tt.is(onClick.firstCall.args[0], true);
});

test('ShowHide will not break if onClick is not provided', tt => {
    const showHide = shallow(<ShowHide show={false} toggle={toggle}/>);
    showHide.find('.ShowHide_toggle').simulate('click');
    tt.is(showHide.find('.ShowHide_children').length, 0);
});

test('ShowHide will show children based on props.show', tt => {
    const show = shallow(<ShowHide show={true} toggle={toggle}/>);
    const hide = shallow(<ShowHide show={false} toggle={toggle}/>);
    tt.is(show.find('.ShowHide_children').length, 1);
    tt.is(hide.find('.ShowHide_children').length, 0);
});


test('ShowHideStateful default visibility off defaultShow', tt => {
    const show = shallow(<ShowHideStateful toggle={toggle} defaultShow={true}/>);
    const hide = shallow(<ShowHideStateful toggle={toggle} />);
    tt.is(show.state('show'), true);
    tt.is(hide.state('show'), false);
});


test('ShowHideStateful will toggle visibility on toggle', tt => {
    const showHide = shallow(<ShowHideStateful toggle={toggle} defaultShow={true}/>);
    showHide.instance().toggle(false);
    tt.is(showHide.state('show'), false);
});


test('ShowHideStateful will passthrough props.onClick', tt => {
    const onClick = sinon.spy();
    const showHide = shallow(<ShowHideStateful toggle={toggle} onClick={onClick}/>);
    showHide.instance().toggle(false);
    tt.is(onClick.firstCall.args[0], false);
});

