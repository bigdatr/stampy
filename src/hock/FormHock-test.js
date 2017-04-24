import React from 'react';
import test from 'ava';
import sinon from 'sinon';
import FormHock from './FormHock';
import {fromJS} from 'immutable';

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

