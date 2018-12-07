// @flow
import test from 'ava';
import React from 'react';
import {cloneElement} from 'react';
import {shallow} from 'enzyme';
import {fake} from 'sinon';
import CollectionSelect from '../CollectionSelect';


//
// Setup
//

const option = (props) => ({
    value: 'foo',
    label: 'Foo',
    option: {id: 'foo', name: 'Foo'},
    focused: false,
    matched: true,
    onChange: fake(),
    onMouseOver: fake(),
    selected: false,
    ...props
});

const value = (props) => ({
    value: 'foo',
    label: 'Foo',
    onDelete: fake(),
    option: {id: 'foo', name: 'Foo'},
    ...props
})

const defaultProps = {
    defaultShow: true,
    className: '',
    modifier: '',
    options: [
        option({label: 'Foo', value: 'foo'}),
        option({label: 'Bar', value: 'bar'})
    ],
    spruceName: 'CollectionSelect',
    match: '',
    onChangeMatch: fake(),
    onKeyDown: fake(),
    openIcon: fake(),
    value: [value()]
};


test.beforeEach(t => {
    global.document = {};
    global.document.addEventListener = fake();
    global.document.removeEventListener = fake();
});

test.afterEach(t => {
    delete global.document;
});

const shallowPastHocks = (element) => shallow(element).dive().dive().dive();



//
// Tests
//

test('will render a showHide with the applied spruceName', (t: *) => {
    const showHide = shallowPastHocks(<CollectionSelect {...defaultProps}/>);

    t.is(1, showHide.find('.CollectionSelect_toggle').length);
    t.is(1, showHide.find('.CollectionSelect_children').length);
});


test('will contain an optionItem for each option', (t: *) => {
    const options = shallowPastHocks(<CollectionSelect {...defaultProps}/>)
        .find('CollectionSelect_optionList')
        .shallow()
        .find('CollectionSelect_optionItem');

    t.is(options.length, 2);
});


test('will render a default empty message if there are no options', (t: *) => {
    const select = <CollectionSelect
        {...defaultProps}
        options={[option({matched: false})]}
    />;

    const emptyMessage = shallowPastHocks(select)
        .find('CollectionSelect_optionList')
        .shallow()
        .find('_optionItem');

    t.is(emptyMessage.prop('children'), 'No items found');
});


test('can render a custom empty message if there are no options', (t: *) => {
    const select = <CollectionSelect
        {...defaultProps}
        emptyMessage={() => 'foo'}
        options={[option({matched: false})]}
    />;

    const emptyMessage = shallowPastHocks(select)
        .find('CollectionSelect_optionList')
        .shallow()
        .find('_optionItem');

    t.is(emptyMessage.prop('children'), 'foo');
});

test('can apply a custom renderOption into the _optionList', (t: *) => {
    const select = <CollectionSelect
        {...defaultProps}
        renderOption={() => 'fooOption'}
        options={[option(), option()]}
    />;

    const options = shallowPastHocks(select)
        .find('CollectionSelect_optionList')
        .shallow()
        .prop('children');

    t.deepEqual(options, ['fooOption', 'fooOption']);
});



test('will render values into the control', (t: *) => {
    const select = <CollectionSelect
        {...defaultProps}
        value={[value(), value(), value()]}
    />;

    const values = shallowPastHocks(select)
        .find('CollectionSelect_control')
        .shallow()
        .find('CollectionSelect_valueItem');

    t.is(values.length, 3);
});

test('can apply a custom placeholder into the control', (t: *) => {
    const select = <CollectionSelect
        {...defaultProps}
        placeholder="foo"
        value={[value(), value(), value()]}
    />;

    const placeholder = shallowPastHocks(select)
        .find('CollectionSelect_control')
        .prop('placeholder');

    t.is('foo', placeholder);
});

test('can apply a custom renderValue into the control', (t: *) => {
    const select = <CollectionSelect
        {...defaultProps}
        renderValue={() => 'fooValue'}
        value={[value(), value(), value()]}
    />;

    const valueItems = shallowPastHocks(select)
        .find('CollectionSelect_control')
        .shallow()
        .find('_valueList')
        .prop('children');

    t.deepEqual(valueItems, ['fooValue', 'fooValue', 'fooValue']);
});
