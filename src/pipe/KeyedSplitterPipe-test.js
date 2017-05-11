import test from 'ava';
import {shallow} from 'enzyme';
import sinon from 'sinon';
import React from 'react';
import KeyedSplitterPipe from './KeyedSplitterPipe';
import {Map} from 'immutable';

test(`KeyedSplitterPipe matches (config) => (Component) => Hock`, tt => {
    var Child = () => <div/>;
    tt.is(typeof KeyedSplitterPipe, 'function');
    tt.is(typeof KeyedSplitterPipe(), 'function');
    tt.is(typeof KeyedSplitterPipe()(Child), 'function');
});

test(`KeyedSplitterPipe passes other props through`, tt => {
    var Child = () => <div/>;
    var Component = KeyedSplitterPipe()(Child);
    tt.is(shallow(<Component dataValue={{}} foo="bar" />).props().foo, 'bar');
});

test(`KeyedSplitterPipe does not recreate props every render`, tt => {
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = KeyedSplitterPipe()(componentToWrap);
    const myWrappedComponent = new WrappedComponent();
    myWrappedComponent.props = {};

    var render1: Object = Map(myWrappedComponent.render().props);
    var render2: Object = Map(myWrappedComponent.render().props);

    render1.forEach((prop, key) => {
        tt.is(prop, render2.get(key), `Prop "${key}" must be strictly equal on re-render`);
    });
});

test('KeyedSplitterPipe provides correct values in split prop', tt => {
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = KeyedSplitterPipe(() => ({
        keys: [
            ['value', 'onChange'],
            ['errorValue', 'errorChange']
        ],
        paths: [
            'name.first',
            'name.last',
            'age'
        ]
    }))(componentToWrap);

    const myWrappedComponent = new WrappedComponent();
    myWrappedComponent.props = {
        value: {
            name: {
                first: "Bob",
                last: "Thunk"
            },
            age: 24
        },
        errorValue: {
            name: {
                first: "Name too short",
                last: null
            },
            age: null
        }
    };

    const {split} = myWrappedComponent.render().props;
    tt.is(split.name.first.value, "Bob");
    tt.is(split.name.last.value, "Thunk");
    tt.is(split.age.value, 24);
    tt.is(split.name.first.errorValue, "Name too short");
    tt.is(split.name.last.errorValue, null);
    tt.is(split.age.errorValue, null);
});


test('KeyedSplitterPipe should pass undefined values for paths that dont exist', tt => {
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = KeyedSplitterPipe(() => ({
        keys: [
            ['value', 'onChange']
        ],
        paths: [
            'dogs.name',
        ]
    }))(componentToWrap);

    const myWrappedComponent = new WrappedComponent();
    myWrappedComponent.props = {
        value: {
            name: {
                first: "Bob",
                last: "Thunk"
            }
        }
    };

    const {value} = myWrappedComponent.render().props.split.dogs.name;
    tt.is(typeof value, "undefined");
});

test('KeyedSplitterPipe should pass undefined values if valueProp doesnt exist', tt => {
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = KeyedSplitterPipe(() => ({
        keys: [
            ['value', 'onChange']
        ],
        paths: [
            'name',
        ]
    }))(componentToWrap);

    const myWrappedComponent = new WrappedComponent();
    myWrappedComponent.props = {};

    const {value} = myWrappedComponent.render().props.split.name;
    tt.is(typeof value, "undefined");
});

test('KeyedSplitterPipe provides correct change functions in split prop', tt => {
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = KeyedSplitterPipe(() => ({
        keys: [
            ['value', 'onChange'],
            ['errorValue', 'errorChange']
        ],
        paths: [
            'name.first',
            'name.last',
            'age'
        ]
    }))(componentToWrap);

    const onChange = sinon.spy();
    const errorChange = sinon.spy();

    const myWrappedComponent = new WrappedComponent();
    myWrappedComponent.props = {
        value: {
            name: {
                first: "Bob",
                last: "Thunk"
            },
            age: 24
        },
        errorValue: {
            name: {
                first: "Name too short",
                last: null
            },
            age: null
        },
        onChange,
        errorChange
    };

    const {split} = myWrappedComponent.render().props;
    tt.is(typeof split.name.first.onChange, "function");
    tt.is(typeof split.name.last.onChange, "function");
    tt.is(typeof split.age.onChange, "function");
    tt.is(typeof split.name.first.errorChange, "function");
    tt.is(typeof split.name.last.errorChange, "function");
    tt.is(typeof split.age.errorChange, "function");

    const expectedUpdatedValue = {
        name: {
            first: "Bob!",
            last: "Thunk"
        },
        age: 24
    };

    split.name.first.onChange("Bob!");
    tt.true(onChange.calledOnce, 'onChange is called once');
    tt.false(errorChange.called, 'other change functions are not called');
    tt.deepEqual(expectedUpdatedValue, onChange.firstCall.args[0], 'onChange is called with the correct arguments passed');

    const expectedUpdatedValue2 = {
        name: {
            first: "Name too short",
            last: null
        },
        age: "Error time"
    };

    split.age.errorChange("Error time");
    tt.true(errorChange.calledOnce, 'errorChange is called once');
    tt.deepEqual(expectedUpdatedValue2, errorChange.firstCall.args[0], 'errorChange is called with the correct arguments passed');
});

test('KeyedSplitterPipe should silently fail if change function prop not provided', tt => {
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = KeyedSplitterPipe(() => ({
        keys: [
            ['value', 'onChange']
        ],
        paths: [
            'name'
        ]
    }))(componentToWrap);

    const myWrappedComponent = new WrappedComponent();
    myWrappedComponent.props = {
        value: {
            name: "Tom"
        }
    };

    tt.notThrows(() => {
        myWrappedComponent.render().props.split.name.onChange("New value");
    });
});

test('KeyedSplitterPipe should call initialize on componentWillReceiveProps if config.paths or config.keys changes', tt => {
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = KeyedSplitterPipe((props) => ({
        keys: [[props.valueField, 'onChange']],
        paths: [props.nameField]
    }))(componentToWrap);

    const myWrappedComponent = new WrappedComponent({
        valueField: "value",
        nameField: "name"
    });
    //myWrappedComponent.props = {
    //    valueField: "value",
    //    nameField: "name"
    //};

    myWrappedComponent.initialize = sinon.spy();
    myWrappedComponent.componentWillReceiveProps({
        valueField: "value",
        nameField: "name",
        something: "unrelated"
    });
    tt.false(myWrappedComponent.initialize.called, 'initialize is not called if an unrelated prop changes');

    myWrappedComponent.initialize = sinon.spy();
    myWrappedComponent.componentWillReceiveProps({
        valueField: "val",
        nameField: "name"
    });
    tt.true(myWrappedComponent.initialize.calledOnce, 'initialize is called if keys changes');

    myWrappedComponent.initialize = sinon.spy();
    myWrappedComponent.componentWillReceiveProps({
        valueField: "value",
        nameField: "namey"
    });
    tt.true(myWrappedComponent.initialize.calledOnce, 'initialize is called if paths changes');

    const anotherWrappedComponent = new WrappedComponent({
        valueField: "value",
        nameField: "name"
    });

    const nextProps = {
        valueField: "val",
        nameField: "name",
        val: {
            name: "VALNAME!"
        }
    };
    anotherWrappedComponent.componentWillReceiveProps(nextProps);
    anotherWrappedComponent.props = nextProps;

    tt.is(
        anotherWrappedComponent.render().props.split.name.val,
        "VALNAME!",
        'split() memoization uses correct arguments, and config props affect split correctly'
    );
});

test('KeyedSplitterPipe can set config.splitProp', tt => {
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = KeyedSplitterPipe(() => ({
        paths: ['name'],
        splitProp: "splitt"
    }))(componentToWrap);

    const myWrappedComponent = new WrappedComponent();
    myWrappedComponent.props = {
        value: {
            name: "Tom"
        }
    };
    const {splitt} = myWrappedComponent.render().props;
    tt.is(splitt.name.value, 'Tom', 'split prop can be changed');
});


test('KeyedSplitterPipe has a default config for keys', tt => {
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = KeyedSplitterPipe(() => ({
        paths: ['name']
    }))(componentToWrap);

    const myWrappedComponent = new WrappedComponent();
    myWrappedComponent.props = {
        value: {
            name: "Tom"
        }
    };
    const {split} = myWrappedComponent.render().props;
    tt.is(split.name.value, "Tom", 'value is included in default keys');
    tt.is(typeof split.name.onChange, "function", 'onChange is included in default keys');
    tt.is(Object.keys(split.name).length, 2, 'no other keys are default');
});
