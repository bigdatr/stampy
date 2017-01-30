import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';
import sinon from 'sinon';

const proxyquire = require('proxyquire').noCallThru();

function FakeSelect(props) {
    var {multi, options, onChange} = props;
    onChange(multi ? options : options[0]);
    return <div></div>;
}

const Select = proxyquire('./Select', {'react-select': FakeSelect}).default;

const options = [
    {
        value: 'foo'
    },
    {
        value: 'bar'
    }
]

test('Select returns value through onChange', tt => {
    const onChange = sinon.spy();
    shallow(Select({onChange, options}));
    tt.is(onChange.getCall(0).args[0], 'foo');
});

test('Select multi returns array of value through onChange', tt => {
    const onChange = sinon.spy();
    shallow(Select({onChange, options, multi: true}));
    tt.deepEqual(onChange.getCall(0).args[0], ['foo', 'bar']);
});
