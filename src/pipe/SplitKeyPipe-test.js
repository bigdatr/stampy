import test from 'ava';
import {shallow} from 'enzyme';
import sinon from 'sinon';
import React from 'react';
import SplitKeyPipe from './SplitKeyPipe';
import {Map} from 'immutable';

//
// hock tests
//

test(`SplitKeyPipe matches (config) => (Component) => Hock`, tt => {
    var Child = () => <div/>;
    tt.is(typeof SplitKeyPipe, 'function');
    tt.is(typeof SplitKeyPipe(), 'function');
    tt.is(typeof SplitKeyPipe()(Child), 'function');
});

test(`SplitKeyPipe passes other props through`, tt => {
    var Child = () => <div/>;
    var Component = SplitKeyPipe()(Child);
    tt.is(shallow(<Component dataValue={{}} foo="bar" />).props().foo, 'bar');
});

test(`SplitKeyPipe does not recreate props every render`, tt => {
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = SplitKeyPipe()(componentToWrap);
    const myWrappedComponent = new WrappedComponent({});

    var render1: Object = Map(myWrappedComponent.render().props);
    var render2: Object = Map(myWrappedComponent.render().props);

    render1.forEach((prop, key) => {
        tt.is(prop, render2.get(key), `Prop "${key}" must be strictly equal on re-render`);
    });
});


test(`SplitKeyPipe does not recreate props every render when using own config`, tt => {
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = SplitKeyPipe(() => ({
        valueChangePairs: [
            ['value', 'onChange'],
            ['errorValue', 'errorChange']
        ],
        paths: [
            'name.first',
            'name.last',
            'age'
        ]
    }))(componentToWrap);

    const myWrappedComponent = new WrappedComponent({});

    var render1: Object = Map(myWrappedComponent.render().props);
    var render2: Object = Map(myWrappedComponent.render().props);

    render1.forEach((prop, key) => {
        tt.is(prop, render2.get(key), `Prop "${key}" must be strictly equal on re-render`);
    });
});

test(`SplitKeyPipe does not recreate props when changes happen to props to used in the updating of child props`, tt => {
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = SplitKeyPipe(() => ({
        valueChangePairs: [
            ['value', 'onChange'],
            ['errorValue', 'errorChange']
        ],
        paths: [
            'name.first',
            'name.last',
            'age'
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
// SplitKeyPipe tests
//

test('SplitKeyPipe provides correct values in split prop', tt => {
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = SplitKeyPipe(() => ({
        valueChangePairs: [
            ['value', 'onChange'],
            ['errorValue', 'errorChange']
        ],
        paths: [
            'name.first',
            'name.last',
            'age'
        ]
    }))(componentToWrap);

    const myWrappedComponent = new WrappedComponent({
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
    });

    const {split} = myWrappedComponent.render().props;
    tt.is(split.name.first.value, "Bob");
    tt.is(split.name.last.value, "Thunk");
    tt.is(split.age.value, 24);
    tt.is(split.name.first.errorValue, "Name too short");
    tt.is(split.name.last.errorValue, null);
    tt.is(split.age.errorValue, null);
});


test('SplitKeyPipe should pass undefined values for paths that dont exist', tt => {
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = SplitKeyPipe(() => ({
        valueChangePairs: [
            ['value', 'onChange']
        ],
        paths: [
            'dogs.name'
        ]
    }))(componentToWrap);

    const myWrappedComponent = new WrappedComponent({
        value: {
            name: {
                first: "Bob",
                last: "Thunk"
            }
        }
    });

    const {value} = myWrappedComponent.render().props.split.dogs.name;
    tt.is(typeof value, "undefined");
});

test('SplitKeyPipe should pass undefined values if valueProp doesnt exist', tt => {
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = SplitKeyPipe(() => ({
        valueChangePairs: [
            ['value', 'onChange']
        ],
        paths: [
            'name'
        ]
    }))(componentToWrap);

    const myWrappedComponent = new WrappedComponent({});

    const {value} = myWrappedComponent.render().props.split.name;
    tt.is(typeof value, "undefined");
});

test('SplitKeyPipe provides correct change functions in split prop', tt => {
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = SplitKeyPipe(() => ({
        valueChangePairs: [
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

    const myWrappedComponent = new WrappedComponent({
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
    });

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

test('SplitKeyPipe should silently fail if change function prop not provided', tt => {
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = SplitKeyPipe(() => ({
        valueChangePairs: [
            ['value', 'onChange']
        ],
        paths: [
            'name'
        ]
    }))(componentToWrap);

    const myWrappedComponent = new WrappedComponent({
        value: {
            name: "Tom"
        }
    });

    tt.notThrows(() => {
        myWrappedComponent.render().props.split.name.onChange("New value");
    });
});

test('SplitKeyPipe should update childProps on componentWillReceiveProps if config changes', tt => {
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = SplitKeyPipe((props) => ({
        valueChangePairs: [[props.valueField, 'onChange']],
        paths: [props.nameField]
    }))(componentToWrap);

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
        'split() uses correct arguments, and config props affect split correctly'
    );
});

test('SplitKeyPipe can set config.splitProp', tt => {
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = SplitKeyPipe(() => ({
        paths: ['name'],
        splitProp: "splitt"
    }))(componentToWrap);

    const myWrappedComponent = new WrappedComponent({
        value: {
            name: "Tom"
        }
    });

    const {splitt} = myWrappedComponent.render().props;
    tt.is(splitt.name.value, 'Tom', 'split prop can be changed');
});


test('SplitKeyPipe has a default config for valueChangePairs', tt => {
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = SplitKeyPipe(() => ({
        paths: ['name']
    }))(componentToWrap);

    const myWrappedComponent = new WrappedComponent({
        value: {
            name: "Tom"
        }
    });

    const {split} = myWrappedComponent.render().props;
    tt.is(split.name.value, "Tom", 'value is included in default valueChangePairs');
    tt.is(typeof split.name.onChange, "function", 'onChange is included in default valueChangePairs');
    tt.is(Object.keys(split.name).length, 2, 'no other valueChangePairs are default');
});
