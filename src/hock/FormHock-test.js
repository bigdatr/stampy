import React from 'react';
import test from 'ava';
import sinon from 'sinon';
import FormHock from './FormHock';

test('FormHock passes props straight through to children', tt => {

    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = FormHock()(componentToWrap);
    const myWrappedComponent = new WrappedComponent();

    myWrappedComponent.props = {
        myProp: 'propettyProp'
    };

    var expectedProps = Object.assign({}, myWrappedComponent.render().props);
    // remove props provided by FormHock
    delete expectedProps.fields;

    tt.deepEqual(expectedProps, myWrappedComponent.props);
});

test('FormHock defaults its fields prop to an empty obejct if no fields provided in config', tt => {

    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = FormHock()(componentToWrap);
    const myWrappedComponent = new WrappedComponent();

    myWrappedComponent.props = {
        myProp: 'propettyProp'
    };

    tt.deepEqual(myWrappedComponent.render().props.fields, {});
});

test('FormHock provides correct values in fields prop', tt => {

    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = FormHock({
        fields: ['name']
    })(componentToWrap);
    const myWrappedComponent = new WrappedComponent();

    myWrappedComponent.props = {
        value: {
            name: 'Bob'
        }
    };

    const {props} = myWrappedComponent.render();

    tt.is(
        props.fields.name.value,
        'Bob'
    );
});

test('FormHock provides correct values in nested fields prop', tt => {

    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = FormHock({
        fields: ['name.last']
    })(componentToWrap);
    const myWrappedComponent = new WrappedComponent();

    myWrappedComponent.props = {
        value: {
            name: {
                last: 'Bob'
            }
        }
    };

    const {props} = myWrappedComponent.render();

    tt.is(
        props.fields.name.last.value,
        'Bob'
    );
});

test('FormHock provides empty string as value in fields prop when keypath not found in values prop', tt => {

    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = FormHock({
        fields: ['name']
    })(componentToWrap);
    const myWrappedComponent = new WrappedComponent();
    myWrappedComponent.props = {};

    const {props} = myWrappedComponent.render();

    tt.is(
        props.fields.name.value,
        ''
    );
});

test('FormHock calls onChange with updated value when onChange prop is fired', tt => {

    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = FormHock({
        fields: ['name', 'food']
    })(componentToWrap);
    const myWrappedComponent = new WrappedComponent();
    const onFormChange = sinon.spy();
    myWrappedComponent.props = {
        value: {
            name: 'Bob',
            food: 'bats'
        },
        onChange: onFormChange
    };

    const {props} = myWrappedComponent.render();
    props.fields.name.onChange("???");

    const expectedObj = {
        name: '???',
        food: 'bats'
    };

    tt.true(onFormChange.calledOnce, 'onChange prop should be called');
    tt.deepEqual(onFormChange.firstCall.args[0], expectedObj, 'onChange prop should be passed the updated value');
});


test('FormHock calls onChange with updated nested value when onChange prop is fired', tt => {

    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = FormHock({
        fields: ['name.last', 'food']
    })(componentToWrap);
    const myWrappedComponent = new WrappedComponent();
    const onFormChange = sinon.spy();
    myWrappedComponent.props = {
        value: {
            name: {
                last: 'Bob'
            },
            food: 'bats'
        },
        onChange: onFormChange
    };

    const {props} = myWrappedComponent.render();
    props.fields.name.last.onChange("???");

    const expectedObj = {
        name: {
            last: '???'
        },
        food: 'bats'
    };

    tt.true(onFormChange.calledOnce, 'onChange prop should be called');
    tt.deepEqual(onFormChange.firstCall.args[0], expectedObj, 'onChange prop should be passed the updated value');
});

test('FormHock memoizes its fields prop', tt => {

    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = FormHock({
        fields: ['name']
    })(componentToWrap);
    const myWrappedComponent = new WrappedComponent();

    myWrappedComponent.props = {
        value: {
            name: 'Bob'
        }
    };

    var firstFieldsProp = myWrappedComponent.render().props.fields;
    var secondFieldsProp = myWrappedComponent.render().props.fields;

    myWrappedComponent.props = {
        value: {
            name: 'Jim'
        }
    };

    var thirdFieldsProp = myWrappedComponent.render().props.fields;

    tt.is(firstFieldsProp, secondFieldsProp, 'subsequent renders should not cause new objects to be made');
    tt.not(secondFieldsProp, thirdFieldsProp, 'changes in props should cause new objects to be made');
    tt.is(thirdFieldsProp.name.value, 'Jim', 'changes in props should update value');
});

test('FormHock memoizes the onChange props it passes down', tt => {

    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = FormHock({
        fields: ['name']
    })(componentToWrap);
    const myWrappedComponent = new WrappedComponent();

    myWrappedComponent.props = {
        value: {
            name: 'Bob'
        }
    };

    var firstFieldsProp = myWrappedComponent.render().props.fields.name.onChange;

    myWrappedComponent.props = {
        value: {
            name: 'Jim'
        }
    };

    var secondFieldsProp = myWrappedComponent.render().props.fields.name.onChange;

    tt.is(firstFieldsProp.name.onChange, secondFieldsProp.name.onChange, 'subsequent renders should not cause new onChange functions to be made');
});
