import React from 'react';
import test from 'ava';
import sinon from 'sinon';
import {shallow} from 'enzyme';
import PropChangeHock from './PropChangeHock';

test('PropChangeHock passes props straight through to children', tt => {
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = PropChangeHock(() => ({paths: ['aa'], onPropChange: () => {}}))(componentToWrap);
    const myWrappedComponent = new WrappedComponent();

    myWrappedComponent.props = {
        myProp: 'propettyProp',
        onPropChange: () => {}
    };

    tt.is(myWrappedComponent.render().props.myProp, myWrappedComponent.props.myProp);
});

test('PropChangeHock calls onPropChange function on componentDidMount', tt => {
    const onPropChange = sinon.spy();
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = PropChangeHock(() => ({paths: ['aa'], onPropChange}))(componentToWrap);

    shallow(<WrappedComponent foo="bar" />)
        .instance()
        .componentDidMount();

    tt.true(onPropChange.calledOnce, 'propChange is called');
    tt.deepEqual(onPropChange.firstCall.args[0].foo, 'bar', 'propChange is passed props from PropChangeHock component');
});

test('PropChangeHock doesnt call onPropChange function on componentWillReceiveProps when no propKey props have changed', tt => {
    const onPropChange = sinon.spy();
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = PropChangeHock(() => ({paths: ['bats'], onPropChange}))(componentToWrap);
    const wrapper = shallow(<WrappedComponent foo="bar" />);
    wrapper.instance().componentDidMount();
    wrapper.setProps({foo: 'baz'});
    tt.true(onPropChange.calledOnce);
});

test('PropChangeHock calls onPropChange function on componentWillReceiveProps when a propKey prop has changed', tt => {
    const onPropChange = sinon.spy();
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = PropChangeHock(() => ({paths: ['foo'], onPropChange}))(componentToWrap);
    const wrapper = shallow(<WrappedComponent foo="bar" />);
    wrapper.instance().componentDidMount();
    wrapper.setProps({foo: 'baz'});
    tt.true(onPropChange.calledTwice);
});

test('PropChangeHock doesnt call onPropChange function on componentWillReceiveProps when no propKey with dots props have changed', tt => {
    const onPropChange = sinon.spy();
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = PropChangeHock(() => ({paths: ['bats.wings'], onPropChange}))(componentToWrap);

    const wrapper = shallow(<WrappedComponent bats={{wings: null}} />);
    wrapper.instance().componentDidMount();
    wrapper.setProps({
        bats: {
            wings: null,
            other: 'foo'
        }
    });

    tt.false(onPropChange.calledTwice);
});

test('PropChangeHock calls onPropChange function on componentWillReceiveProps when a propKey with dots prop has changed', tt => {
    const onPropChange = sinon.spy();
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = PropChangeHock(() => ({paths: ['bats.wings'], onPropChange}))(componentToWrap);

    const wrapper = shallow(<WrappedComponent bats={{wings: null}} />);
    wrapper.instance().componentDidMount();
    wrapper.setProps({
        bats: {
            wings: 'foo'
        }
    });

    tt.true(onPropChange.calledTwice);
});

test('PropChangeHock: onPropChange will noop when not provided.', tt => {
    const WrappedComponent = PropChangeHock(() => ({paths: []}))(() => <div/>);
    tt.notThrows(() => shallow(<WrappedComponent bats={{wings: null}} />).instance().componentDidMount());
});

test('PropChangeHock: will pass onPropChange to child if config.passOnPropChange is true', tt => {
    const onPropChange = () => {};
    const WrappedComponent = PropChangeHock(() => ({onPropChange, passOnPropChange: true}))(() => <div/>);
    tt.is(shallow(<WrappedComponent />).prop('onPropChange'), onPropChange);
});

