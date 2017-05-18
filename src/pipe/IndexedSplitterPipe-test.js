import test from 'ava';
import {shallow} from 'enzyme';
import sinon from 'sinon';
import React from 'react';
import IndexedSplitterPipe from './IndexedSplitterPipe';
import {Map} from 'immutable';

//
// hock tests
//

test(`IndexedSplitterPipe matches (config) => (Component) => Hock`, tt => {
    var Child = () => <div/>;
    tt.is(typeof IndexedSplitterPipe, 'function');
    tt.is(typeof IndexedSplitterPipe(), 'function');
    tt.is(typeof IndexedSplitterPipe()(Child), 'function');
});

test(`IndexedSplitterPipe passes other props through`, tt => {
    var Child = () => <div/>;
    var Component = IndexedSplitterPipe()(Child);
    tt.is(shallow(<Component dataValue={{}} foo="bar" />).props().foo, 'bar');
});

test(`IndexedSplitterPipe does not recreate props every render`, tt => {
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = IndexedSplitterPipe()(componentToWrap);
    const myWrappedComponent = new WrappedComponent({});

    var render1: Object = Map(myWrappedComponent.render().props);
    var render2: Object = Map(myWrappedComponent.render().props);

    render1.forEach((prop, key) => {
        tt.is(prop, render2.get(key), `Prop "${key}" must be strictly equal on re-render`);
    });
});


test(`IndexedSplitterPipe does not recreate props every render when using own config`, tt => {
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = IndexedSplitterPipe(() => ({
        valueChangePairs: [
            ['value', 'onChange'],
            ['errorValue', 'errorChange']
        ]
    }))(componentToWrap);

    const myWrappedComponent = new WrappedComponent({});

    var render1: Object = Map(myWrappedComponent.render().props);
    var render2: Object = Map(myWrappedComponent.render().props);

    render1.forEach((prop, key) => {
        tt.is(prop, render2.get(key), `Prop "${key}" must be strictly equal on re-render`);
    });
});

test(`IndexedSplitterPipe does not recreate props when changes happen to props to used in the updating of child props`, tt => {
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = IndexedSplitterPipe(() => ({
        valueChangePairs: [
            ['value', 'onChange'],
            ['errorValue', 'errorChange']
        ]
    }))(componentToWrap);

    const myWrappedComponent = new WrappedComponent({unrelated: 123});

    myWrappedComponent.props = myWrappedComponent.render().props;
    myWrappedComponent.componentWillReceiveProps({unrelatedProp: 456});
    var render2: Object = Map(myWrappedComponent.render().props);

    Map(myWrappedComponent.props).forEach((prop, key) => {
        tt.is(prop, render2.get(key), `Prop "${key}" must be strictly equal after unrelated props change`);
    });
});

//
// keyedsplitterpipe tests
//

test('IndexedSplitterPipe provides correct values in split prop', tt => {
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = IndexedSplitterPipe(() => ({
        valueChangePairs: [
            ['value', 'onChange'],
            ['errorValue', 'errorChange']
        ]
    }))(componentToWrap);

    const myWrappedComponent = new WrappedComponent({
        value: [
            1,
            {hi: "hello"}
        ],
        errorValue: [
            "!",
            "?"
        ]
    });

    const {split} = myWrappedComponent.render().props;
    tt.is(split[0].value, 1);
    tt.is(split[1].value.hi, "hello");
    tt.is(split[0].errorValue, "!");
    tt.is(split[1].errorValue, "?");
});

test('IndexedSplitterPipe should pass undefined values when passed values of unequal length', tt => {
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = IndexedSplitterPipe(() => ({
        valueChangePairs: [
            ['value', 'onChange'],
            ['errorValue', 'errorChange']
        ]
    }))(componentToWrap);

    const myWrappedComponent = new WrappedComponent({
        value: [
            1,
            {hi: "hello"}
        ],
        errorValue: [
            "!"
            // no second element!
        ]
    });

    const {errorValue} = myWrappedComponent.render().props.split[1];
    tt.is(typeof errorValue, "undefined");
});

test('IndexedSplitterPipe provides correct change functions in split prop', tt => {
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = IndexedSplitterPipe(() => ({
        valueChangePairs: [
            ['value', 'onChange'],
            ['errorValue', 'errorChange']
        ]
    }))(componentToWrap);

    const onChange = sinon.spy();
    const errorChange = sinon.spy();

    const myWrappedComponent = new WrappedComponent({
        value: [1,2,3],
        errorValue: [4,5,6],
        onChange,
        errorChange
    });

    const {split} = myWrappedComponent.render().props;
    tt.is(typeof split[0].onChange, "function");
    tt.is(typeof split[1].onChange, "function");
    tt.is(typeof split[0].errorChange, "function");
    tt.is(typeof split[1].errorChange, "function");

    const expectedUpdatedValue = [1,7,3];

    split[1].onChange(7);
    tt.true(onChange.calledOnce, 'onChange is called once');
    tt.false(errorChange.called, 'other change functions are not called');
    tt.deepEqual(expectedUpdatedValue, onChange.firstCall.args[0], 'onChange is called with the correct arguments passed');
});

test('IndexedSplitterPipe should silently fail if change function prop not provided', tt => {
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = IndexedSplitterPipe(() => ({
        valueChangePairs: [
            ['value', 'onChange']
        ]
    }))(componentToWrap);

    const myWrappedComponent = new WrappedComponent({
        value: [1,2,3]
    });

    tt.notThrows(() => {
        myWrappedComponent.render().props.split[0].onChange("New value");
    });
});

test('IndexedSplitterPipe should update childProps on componentWillReceiveProps if config changes', tt => {
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = IndexedSplitterPipe((props) => ({
        valueChangePairs: [[props.valueField, 'onChange']]
    }))(componentToWrap);

    const anotherWrappedComponent = new WrappedComponent({
        valueField: "value",
        nameField: "name"
    });

    const nextProps = {
        valueField: "val",
        nameField: "name",
        val: [1,2,3]
    };
    anotherWrappedComponent.componentWillReceiveProps(nextProps);
    anotherWrappedComponent.props = nextProps;

    tt.is(
        anotherWrappedComponent.render().props.split[0].val,
        1,
        'split() memoization uses correct arguments, and config props affect split correctly'
    );
});

test('IndexedSplitterPipe can set config.splitProp', tt => {
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = IndexedSplitterPipe(() => ({
        splitProp: "splitt"
    }))(componentToWrap);

    const myWrappedComponent = new WrappedComponent({
        value: ["Tom"]
    });

    const {splitt} = myWrappedComponent.render().props;
    tt.is(splitt[0].value, 'Tom', 'split prop can be changed');
});


test('IndexedSplitterPipe has a default config for valueChangePairs', tt => {
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = IndexedSplitterPipe()(componentToWrap);

    const myWrappedComponent = new WrappedComponent({
        value: ["Tom"]
    });

    const {split} = myWrappedComponent.render().props;
    tt.is(split[0].value, "Tom", 'value is included in default valueChangePairs');
    tt.is(typeof split[0].onChange, "function", 'onChange is included in default valueChangePairs');
    tt.is(Object.keys(split[0]).length, 2, 'no other valueChangePairs are default');
});
