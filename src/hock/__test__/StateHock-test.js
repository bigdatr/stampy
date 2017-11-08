// @flow
import test from 'ava';
import {shallow} from 'enzyme';
import React from 'react';
import type {Element} from 'react';
import StateHock from '../StateHock';

test('StateHock should use initialState', (tt: Object) => {
    tt.plan(2);

    const Child = (props: Object): Element<*> => {
        tt.is(props.value, 0, "StateHock should pass down state as value prop");
        return <div/>;
    };

    var Component = StateHock({
        initialState: (props: Object): * => {
            tt.is(props.aProp, "yes", `StateHock.initialState should receive props`);
            return 0;
        }
    })(Child);

    shallow(<Component aProp={"yes"} />).dive();
});


test('StateHock should allow shorthand initialState', (tt: Object) => {
    const Child = (props: Object): Element<*> => {
        tt.is(props.value, 0, "StateHock should pass down state as value prop");
        return <div/>;
    };

    var Component = StateHock(() => 0)(Child);

    shallow(<Component />).dive();
});

test('StateHock props.onChange should replace value', (tt: Object) => {
    var Child = () => <div/>;
    var Component = StateHock(() => 0)(Child);
    var instance = shallow(<Component />);
    instance.props().onChange(1);
    tt.is(instance.props().value, 1);
});

// onPropChange ???

test('StateHock should call config.onPropChange if provided', (tt: Object) => {
    var Child = () => <div/>;
    var Component = StateHock({
        initialState: () => 0,
        onPropChange: (onChange: Function, nextProps: Object) => {
            tt.is(nextProps, 'foo');
            onChange(nextProps);
        }
    })(Child);
    var wrapper = shallow(<Component />);
    wrapper.instance().componentWillReceiveProps('foo');
    tt.is(wrapper.instance().state.value, 'foo');
});

test('StateHock config.onPropChange should not be called if not provided', (tt: Object) => {
    var Child = () => <div/>;
    var Component = StateHock(() => 0)(Child);
    var wrapper = shallow(<Component />);
    wrapper.instance().componentWillReceiveProps('foo');
    tt.is(wrapper.instance().state.value, 0);
});




//
// Hock Tests
//

// test('StateHock matches (config) => (Component) => Hock', (tt: Object) => {
//     var Child = () => <div/>;
//     tt.is(typeof StateHock, 'function');
//     tt.is(typeof StateHock(), 'function');
//     tt.is(typeof StateHock()(Child), 'function');
// });

// test('StateHock passes other props through', (tt: Object) => {
//     var Child = () => <div/>;
//     var Component = StateHock()(Child);
//     tt.is(shallow(<Component foo="bar" />).props().foo, 'bar');
//     tt.is(shallow(<Component value="bar" />).props().value, undefined);
// });

// test('StateHock does not recreate props every render', (tt: Object) => {
//     const WrappedComponent = StateHock()(() => <div>Example Component</div>);
//     const myWrappedComponent = new WrappedComponent({
//         a: 1,
//         b: 2
//     });

//     var render1: Object = Map(myWrappedComponent.render().props);
//     var render2: Object = Map(myWrappedComponent.render().props);

//     render1.forEach((prop, key) => {
//         tt.is(prop, render2.get(key), `Prop "${key}" must be strictly equal on re-render`);
//     });
// });

// test('StateHock will allow you to change valueProp, onChangeProp & initialState', (tt: Object) => {
//     var Child = () => <div/>;
//     var Component = StateHock((props) => ({
//         initialState: 0,
//         valueProp: 'foo',
//         onChangeProp: 'changeFoo'
//     }))(Child);

//     tt.is(shallow(<Component foo="bar" />).props().foo, 0);
//     tt.is(typeof shallow(<Component value="bar" />).props().changeFoo, 'function');
// });

//
// Functionality
//
