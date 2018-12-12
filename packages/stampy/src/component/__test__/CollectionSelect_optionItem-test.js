// @flow
import test from 'ava';
import React from 'react';
import {cloneElement} from 'react';
import {shallow} from 'enzyme';
import {spy} from 'sinon';
import CollectionSelect_optionItem from '../CollectionSelect_optionItem';

const OptionItem = <CollectionSelect_optionItem
    dangerouslyInsideParentComponent={true}
    selected={false}
    focused={false}
    parent="Foo"
    label="foo"
    onMouseOver={() => {}}
    onChange={() => {}}
/>;

test('will add a _optionItem className', (t: Object) => {
    t.is(
        shallow(OptionItem).dive().prop('className'),
        "Foo_optionItem"
    );
});

test('will set props.label as the child', (t: Object) => {
    t.is(
        shallow(OptionItem).dive().prop('children'),
        "foo"
    );
});

test('will prevent mouseDowns from bubbling upwards', (t: Object) => {
    const preventDefault = spy();
    const onMouseDown = shallow(OptionItem)
        .dive()
        .prop('onMouseDown')

    onMouseDown({preventDefault});

    t.is(preventDefault.callCount, 1);
});

test('will add selected and focused modifiers', (t: Object) => {
    const option = (props) => shallow(cloneElement(OptionItem, props));
    t.is('', option({}).prop('modifier'));
    t.is('focused', option({focused: true}).prop('modifier'));
    t.is('selected ', option({selected: true}).prop('modifier'));
    t.is('selected focused', option({selected: true, focused: true}).prop('modifier'));
});

test('will call the values onDelete method when clicked', (t: Object) => {
    const onChange = spy();

    shallow(cloneElement(OptionItem, {onChange}))
        .simulate('click')

    t.is(onChange.callCount, 1);
});
