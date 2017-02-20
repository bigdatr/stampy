import React from 'react';
import test from 'ava';
import sinon from 'sinon';
import PropChangeHock from './PropChangeHock';

test('PropChangeHock passes props straight through to children', tt => {
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = PropChangeHock(['aa'], () => {})(componentToWrap);
    const myWrappedComponent = new WrappedComponent();

    myWrappedComponent.props = {
        myProp: 'propettyProp'
    };

    tt.deepEqual(myWrappedComponent.render().props, myWrappedComponent.props);
});

test('PropChangeHock calls onPropChange function on componentWillMount', tt => {
    const onPropChange = sinon.spy();
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = PropChangeHock(['aa'], onPropChange)(componentToWrap);
    const myWrappedComponent = new WrappedComponent();

    myWrappedComponent.props = {
        myProp: 'propettyProp'
    };

    myWrappedComponent.componentWillMount();

    tt.true(onPropChange.calledOnce, 'propChange is called');
    tt.deepEqual(onPropChange.firstCall.args[0], myWrappedComponent.props, 'propChange is passed props from PropChangeHock component');
});

test('PropChangeHock doesnt call onPropChange function on componentWillReceiveProps when no propKey props have changed', tt => {
    const onPropChange = sinon.spy();
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = PropChangeHock(['bats'], onPropChange)(componentToWrap);
    const myWrappedComponent = new WrappedComponent();

    myWrappedComponent.props = {
        fish: "quiet"
    };

    const nextProps = {
        fish: "LOUD"
    };

    myWrappedComponent.componentWillReceiveProps(nextProps);

    tt.false(onPropChange.called, 'propChange is not called');
});

test('PropChangeHock calls onPropChange function on componentWillReceiveProps when a propKey prop has changed', tt => {
    const onPropChange = sinon.spy();
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = PropChangeHock(['bats', 'fish'], onPropChange)(componentToWrap);
    const myWrappedComponent = new WrappedComponent();

    myWrappedComponent.props = {
        fish: "quiet"
    };

    const nextProps = {
        fish: "LOUD"
    };

    myWrappedComponent.componentWillReceiveProps(nextProps);

    tt.true(onPropChange.calledOnce, 'propChange is called');
    tt.deepEqual(onPropChange.firstCall.args[0], nextProps, 'propChange is passed nextProps from PropChangeHock component');
});

test('PropChangeHock doesnt call onPropChange function on componentWillReceiveProps when no propKey with dots props have changed', tt => {
    const onPropChange = sinon.spy();
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = PropChangeHock(['bats.wings'], onPropChange)(componentToWrap);
    const myWrappedComponent = new WrappedComponent();

    myWrappedComponent.props = {
        bats: {
            wings: true,
            thumbs: true,
            fingers: "ambiguous"
        }
    };

    const nextProps = {
        bats: {
            wings: true,
            thumbs: false,
            fingers: null
        }
    };

    myWrappedComponent.componentWillReceiveProps(nextProps);

    tt.false(onPropChange.called, 'propChange is not called');
});

test('PropChangeHock calls onPropChange function on componentWillReceiveProps when a propKey with dots prop has changed', tt => {
    const onPropChange = sinon.spy();
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = PropChangeHock(['bats.wings'], onPropChange)(componentToWrap);
    const myWrappedComponent = new WrappedComponent();

    myWrappedComponent.props = {
        bats: {
            wings: true,
            thumbs: true,
            fingers: "ambiguous"
        }
    };

    const nextProps = {
        bats: {
            wings: false,
            thumbs: true,
            fingers: "ambiguous"
        }
    };

    myWrappedComponent.componentWillReceiveProps(nextProps);

    tt.true(onPropChange.calledOnce, 'propChange is called');
    tt.deepEqual(onPropChange.firstCall.args[0], nextProps, 'propChange is passed nextProps from PropChangeHock component');
});
