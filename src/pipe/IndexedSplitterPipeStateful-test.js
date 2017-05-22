import test from 'ava';
import {shallow} from 'enzyme';
import React from 'react';
import {IndexedSplitterPipeStateful} from './IndexedSplitterPipe';

//
// hock tests
//

test(`IndexedSplitterPipeStateful matches (config) => (Component) => Hock`, tt => {
    var Child = () => <div/>;
    tt.is(typeof IndexedSplitterPipeStateful, 'function');
    tt.is(typeof IndexedSplitterPipeStateful(), 'function');
    tt.is(typeof IndexedSplitterPipeStateful()(Child), 'function');
});

//
// IndexedSplitterPipeStateful
//

test('IndexedSplitterPipeStateful will set initialValue from props', tt => {
    const Child = (props) => {
        tt.deepEqual(props.listKeysValue, [0,1,2]);
        return <div/>;
    };

    var Component = IndexedSplitterPipeStateful()(Child);
    var value = ["A","B","C"];

    shallow(<Component value={value} />).dive();
});

test('IndexedSplitterPipeStateful props.listKeysChange will replace value', tt => {
    var Child = () => <div/>;
    var Component = IndexedSplitterPipeStateful()(Child);
    var instance = shallow(<Component />);
    instance.props().listKeysChange([0,1,2]);
    tt.deepEqual(instance.props().listKeysValue, [0,1,2]);
});
