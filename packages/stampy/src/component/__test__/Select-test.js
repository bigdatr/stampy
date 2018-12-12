// @flow
import test from 'ava';
import React from 'react';
import type {Element} from 'react';
import {shallow} from 'enzyme';
import sinon from 'sinon';

const proxyquire = require('proxyquire').noCallThru();

function FakeSelect(props: Object): Element<*> {
    var {multi, options, onChange} = props;
    onChange(multi ? options : options[0]);
    return <div></div>;
}

const Select = proxyquire('../Select', {'react-select': FakeSelect}).default;

const options = [
    {
        value: 'foo',
        uppercase: 'FOO'
    },
    {
        value: 'bar',
        uppercase: 'BAR'
    }
];

test('Select returns value through onChange', (tt: Object) => {
    const onChange = sinon.spy();
    const wrapper = shallow(<Select onChange={onChange} options={options} />);
    wrapper.render();
    tt.is(onChange.getCall(0).args[0], 'foo');
});

test('Select multi returns array of value through onChange', (tt: Object) => {
    const onChange = sinon.spy();
    const wrapper = shallow(<Select onChange={onChange} options={options} multi />);
    wrapper.render();
    tt.deepEqual(onChange.getCall(0).args[0], ['foo', 'bar']);
});

test('Select can choose any value', (tt: Object) => {
    const onChange = sinon.spy();
    const wrapper = shallow(<Select onChange={onChange} options={options} valueKey="uppercase" multi />);
    wrapper.render();
    tt.deepEqual(onChange.getCall(0).args[0], ['FOO', 'BAR']);
});
