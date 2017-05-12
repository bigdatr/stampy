import test from 'ava';
import {shallow} from 'enzyme';
import React from 'react';
import DownPipe from './DownPipe';

test(`DownPipe matches (config) => (Component) => Hock`, tt => {
    var Child = () => <div/>;
    tt.is(typeof DownPipe, 'function');
    tt.is(typeof DownPipe(), 'function');
    tt.is(typeof DownPipe()(Child), 'function');
});

test('DownPipe will allow you to change props', tt => {
    var Child = () => <div/>;
    var Component = DownPipe(() => ({
        childProps: {
            abc: 123
        }
    }))(Child);

    tt.is(shallow(<Component />).props().abc, 123);
});

