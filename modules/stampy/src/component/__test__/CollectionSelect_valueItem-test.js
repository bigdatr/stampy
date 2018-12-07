// @flow
import test from 'ava';
import React from 'react';
import {cloneElement} from 'react';
import {shallow} from 'enzyme';
import {spy} from 'sinon';
import CollectionSelect_valueItem from '../CollectionSelect_valueItem';

const value = {
    onDelete: spy(),
    option: {},
    value: 'foo',
    label: 'Foo'
};

const ValueItem = <CollectionSelect_valueItem
    dangerouslyInsideParentComponent={true}
    parent="Foo"
    value={value}
/>;

test('will add a _valueItem className', (t: Object) => {
    t.is(
        shallow(ValueItem).dive().prop('className'),
        "Foo_valueItem"
    )
});

test('will add a cross to the label', (t: Object) => {
    t.is(
        shallow(ValueItem).dive().prop('children'),
        "Foo ×"
    )
});

test('will prevent mouseDowns from bubbling upwards', (t: Object) => {
    const preventDefault = spy();
    const onMouseDown = shallow(ValueItem)
        .dive()
        .prop('onMouseDown')

    onMouseDown({preventDefault});

    t.is(preventDefault.callCount, 1);
});


test('will call the values onDelete method when clicked', (t: Object) => {
    const onDelete = spy();

    shallow(cloneElement(ValueItem, {value: {...value, onDelete}}))
        .simulate('click');

    t.is(onDelete.callCount, 1);
});
