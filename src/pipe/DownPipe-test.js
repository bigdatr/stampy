import test from 'ava';
import {shallow} from 'enzyme';
import React from 'react';
import DownPipe from './DownPipe';
import {HockTests} from '../hock/HockTests-testutil';

HockTests(DownPipe, 'DownPipe');

test('DownPipe will allow you to change props', tt => {
    var Child = () => <div/>;
    var Component = DownPipe(() => ({
        childProps: {
            abc: 123
        }
    }))(Child);

    tt.is(shallow(<Component />).props().abc, 123);
});

