import test from 'ava';
import {shallow} from 'enzyme';
import React from 'react';
import DownPipe from '../DownPipe';
import {Map} from 'immutable';

//
// hock tests
//

test(`DownPipe matches (config) => (Component) => Hock`, tt => {
    var Child = () => <div/>;
    tt.is(typeof DownPipe, 'function');
    tt.is(typeof DownPipe(), 'function');
    tt.is(typeof DownPipe()(Child), 'function');
});

test(`DownPipe does not recreate props every render`, tt => {
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = DownPipe()(componentToWrap);
    const myWrappedComponent = new WrappedComponent();
    myWrappedComponent.props = {};

    var render1: Object = Map(myWrappedComponent.render().props);
    var render2: Object = Map(myWrappedComponent.render().props);

    render1.forEach((prop, key) => {
        tt.is(prop, render2.get(key), `Prop "${key}" must be strictly equal on re-render`);
    });
});

//
// downpipe tests
//

test('DownPipe will allow you to change props', tt => {
    var Child = () => <div/>;
    var Component = DownPipe(() => ({
        childProps: {
            abc: 123
        }
    }))(Child);

    tt.is(shallow(<Component />).props().abc, 123);
});

test('DownPipe has a default childProps config that just passes props through', tt => {
    var Child = () => <div/>;
    var Component = DownPipe()(Child);
    tt.is(shallow(<Component abc={123} />).props().abc, 123);
});

