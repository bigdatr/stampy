import test from 'ava';
import {shallow} from 'enzyme';
import React from 'react';
import KeyedStatePipe from './KeyedStatePipe';


//
// Hock Tests
//

test('KeyedStatePipe matches (config) => (Component) => Hock', tt => {
    var Child = () => <div/>;
    tt.is(typeof KeyedStatePipe, 'function');
    tt.is(typeof KeyedStatePipe(), 'function');
    tt.is(typeof KeyedStatePipe()(Child), 'function');
});

test('KeyedStatePipe passes other props through', tt => {
    var Child = () => <div/>;
    var Component = KeyedStatePipe()(Child);
    tt.is(shallow(<Component dataValue={{}} foo="bar" />).props().foo, 'bar');
    tt.is(shallow(<Component dataValue={{}} />).props().dataValue, undefined);
});

test('KeyedStatePipe will allow you to change dataValueProp & dataChangeProp', tt => {
    var Child = () => <div/>;
    var Component = KeyedStatePipe({
        keys: ['a', 'b'],
        dataValueProp: 'foo',
        dataChangeProp: 'changeFoo'
    })(Child);

    tt.is(shallow(<Component foo={{a: 1}} />).props().aValue, 1);

    shallow(<Component foo={{}} changeFoo={pp => tt.deepEqual(pp, {a: 1})} />).props().aChange(1)

});



//
// Functionality
//

test('KeyedStatePipe will create correct props off config.keys', tt => {
    var Child = () => <div/>;
    var Component = KeyedStatePipe({keys: ['foo']})(Child);
    var instance = shallow(<Component dataValue={{foo: 1}}/>);

    tt.is(instance.props().fooValue, 1);
    tt.is(typeof instance.props().fooChange, 'function');
});

test('KeyedStatePipe onChange function will change state.key based on name', tt => {
    var spy = (value) => tt.deepEqual(value, {foo: 2});
    var Child = () => <div/>;
    var Component = KeyedStatePipe({keys: ['foo']})(Child);
    var instance = shallow(<Component dataChange={spy} dataValue={{foo: 1}}/>);

    instance.props().fooChange(2);
});

test('KeyedStatePipe will not pass down original dataValue and dataChange props', tt => {
    var Child = () => <div/>;
    var Component = KeyedStatePipe({keys: ['foo']})(Child);
    var instance = shallow(<Component dataValue={{foo: 1}}/>);

    tt.false(instance.props().hasOwnProperty('dataValue'));
    tt.false(instance.props().hasOwnProperty('dataChange'));
});

test('KeyedStatePipe will create data props off config.keys', tt => {
    var Child = () => <div/>;
    var Component = KeyedStatePipe({keys: ['data']})(Child);
    var instance = shallow(<Component dataValue={{data: 1}}/>);

    tt.is(instance.props().dataValue, 1);
    tt.is(typeof instance.props().dataChange, 'function');
});
