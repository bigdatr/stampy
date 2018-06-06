// @flow
import test from 'ava';
import React from 'react';
import {cloneElement} from 'react';
import {shallow} from 'enzyme';
import {spy} from 'sinon';
import CollectionSelect_optionList from '../CollectionSelect_optionList';

const option = (props) => ({
    value: 'foo',
    label: 'Foo',
    option: {id: 'foo', name: 'Foo'},
    focused: false,
    matched: true,
    onChange: spy(),
    onMouseOver: spy(),
    selected: false,
    ...props
});

const OptionList = <CollectionSelect_optionList
    dangerouslyInsideParentComponent={true}
    onChangeShow={spy()}
    options={[
        option(),
    ]}
    parent="Foo"
    renderEmpty={() => 'Empty'}
    renderOption={(option) => <span {...option}/>}
/>;

test('will add a _optionList className', (t: Object) => {
    t.is(
        shallow(OptionList).dive().prop('className'),
        "Foo_optionList"
    );
});

test('will set have the number of children as there are matched options', (t: Object) => {
    let options = [option(), option()];
    t.is(shallow(cloneElement(OptionList, {options})).children().length, 2);

    options = [option(), option({matched: false})];
    t.is(shallow(cloneElement(OptionList, {options})).children().length, 1);
});

test('will render empty item if there are no matches', (t: Object) => {
    let options = [option({matched: false}), option({matched: false})];
    const children = shallow(cloneElement(OptionList, {options})).children();
    t.is(children.length, 1);
    t.is(children.node, 'Empty');
});


test('each option will trigger its onChange when clicked ', (t: Object) => {
    const onChange = spy();
    const options = [option({onChange})];
    const list = shallow(cloneElement(OptionList, {options}));

    list.childAt(0).prop('onChange')();
    t.is(onChange.callCount, 1);
});

test('each option will call props.onChangeShow with false when clicked', (t: Object) => {
    const onChangeShow = spy();
    const list = shallow(cloneElement(OptionList, {onChangeShow}));

    list.childAt(0).prop('onChange')();
    t.is(onChangeShow.callCount, 1);
    t.is(onChangeShow.args[0][0], false);
});


