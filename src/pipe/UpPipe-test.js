import test from 'ava';
import {shallow} from 'enzyme';
import React from 'react';
import UpPipe from './UpPipe';
import {Map} from 'immutable';

//
// hock tests
//

test(`UpPipe matches (config) => (Component) => Hock`, tt => {
    var Child = () => <div/>;
    tt.is(typeof UpPipe, 'function');
    tt.is(typeof UpPipe(), 'function');
    tt.is(typeof UpPipe()(Child), 'function');
});

test(`UpPipe does not recreate props every render`, tt => {
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = UpPipe()(componentToWrap);
    const myWrappedComponent = new WrappedComponent({});

    var render1: Object = Map(myWrappedComponent.render().props);
    var render2: Object = Map(myWrappedComponent.render().props);

    render1.forEach((prop, key) => {
        tt.is(prop, render2.get(key), `Prop "${key}" must be strictly equal on re-render`);
    });
});

test(`UpPipe does not recreate props when changes happen to props to used in the updating of child props`, tt => {
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = UpPipe()(componentToWrap);
    const myWrappedComponent = new WrappedComponent({unrelated: 123});

    myWrappedComponent.props = myWrappedComponent.render().props;
    myWrappedComponent.componentWillReceiveProps({unrelatedProp: 456});
    var render2: Object = Map(myWrappedComponent.render().props);

    Map(myWrappedComponent.props).forEach((prop, key) => {
        tt.is(prop, render2.get(key), `Prop "${key}" must be strictly equal after unrelated props change`);
    });
});

test(`UpPipe does not recreate props when changes happen to props to used in the updating of child props, when using user-defined config`, tt => {
    const componentToWrap = () => <div>Example Component</div>;
    const changePayload = ii => `${ii}!`;
    const WrappedComponent = UpPipe(() => ({
        changePayload
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
// uppipe tests
//

test('UpPipe will allow you to change onChange payload', tt => {
    tt.plan(1);

    var Child = () => <div/>;
    var Component = UpPipe(() => ({
        changePayload: ii => `${ii}!`
    }))(Child);

    shallow(<Component onChange={(payload) => tt.is(payload, "123!")} />)
        .props()
        .onChange("123");
});

test('UpPipe defaults to just passing through payload', tt => {
    tt.plan(1);

    var Child = () => <div/>;
    var Component = UpPipe()(Child);

    shallow(<Component onChange={(payload) => tt.is(payload, "123")} />)
        .props()
        .onChange("123");
});


test('UpPipe will allow you to change onChange payload of other props', tt => {
    tt.plan(1);

    var Child = () => <div/>;
    var Component = UpPipe(() => ({
        changePayload: ii => `${ii}!`,
        onChangeProp: "onSubmit"
    }))(Child);

    shallow(<Component onSubmit={(payload) => tt.is(payload, "123!")} />)
        .props()
        .onSubmit("123");
});
