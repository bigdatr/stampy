// @flow
import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';
import sinon from 'sinon';

import ShowHide, {ShowHideStateful} from '../ShowHide';


const toggle = () => <div></div>;

test('ShowHide will toggle props.show onClick', (tt: Object) => {
    const onClick = sinon.spy();
    const showHide = shallow(<ShowHide show={false} onClick={onClick} toggle={toggle}/>);
    showHide.find('.ShowHide_toggle').simulate('click');
    tt.is(onClick.firstCall.args[0], true);
});

test('ShowHide will not break if onClick is not provided', (tt: Object) => {
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


test('ShowHideStateful default visibility off defaultShow', (tt: Object) => {
    const show = shallow(<ShowHideStateful toggle={toggle} defaultShow={true}/>);
    const hide = shallow(<ShowHideStateful toggle={toggle} />);
    tt.deepEqual(show.state('value'), {show: true});
    tt.deepEqual(hide.state('value'), {show: false});
});

test('ShowHideStateful will passthrough props.onClick', (tt: Object) => {
    const onClick = sinon.spy();
    const showHide = shallow(<ShowHideStateful toggle={toggle} onClick={onClick}/>);
    showHide
        .dive()
        .dive()
        .find('.ShowHide_toggle')
        .simulate('click');

    tt.is(onClick.firstCall.args[0], true);
});

test('showhide classes', (tt: Object) => {
    tt.truthy(
        shallow(<ShowHide toggle={toggle}/>)
            .render()
            .children()
            .first()
            .hasClass('ShowHide'),
        'showhide should have a class of ShowHide'
    );

    tt.truthy(
        shallow(<ShowHide toggle={toggle} spruceName="Thing"/>)
            .render().
            children()
            .first()
            .hasClass('Thing'),
        'showhide should change class if given a spruceName prop'
    );

    tt.truthy(
        shallow(<ShowHide toggle={toggle} modifier="large"/>)
            .render()
            .children()
            .first()
            .hasClass('ShowHide-large'),
        'showhides with modifiers should be rendered with that modifier class'
    );

    tt.truthy(
        shallow(<ShowHide toggle={toggle} peer="Thing"/>)
            .render()
            .children()
            .first()
            .hasClass('ShowHide--Thing'),
        'showhides with peers should be rendered with that peer class'
    );

    tt.truthy(
        shallow(<ShowHide toggle={toggle} className="foo"/>)
            .render()
            .children()
            .first()
            .hasClass('foo'),
        'showhides with className should append className'
    );

    tt.truthy(
        shallow(<ShowHide toggle={toggle} className="foo"/>)
            .render()
            .children()
            .first()
            .hasClass('ShowHide'),
        'showhides with className should not replace other class names'
    );
});
