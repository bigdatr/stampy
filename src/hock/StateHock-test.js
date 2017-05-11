import test from 'ava';
import {shallow} from 'enzyme';
import React from 'react';
import StateHock from './StateHock';


//
// Hock Tests
//

test('StateHock matches (config) => (Component) => Hock', tt => {
    var Child = () => <div/>;
    tt.is(typeof StateHock, 'function');
    tt.is(typeof StateHock(), 'function');
    tt.is(typeof StateHock()(Child), 'function');
});

test('StateHock passes other props through', tt => {
    var Child = () => <div/>;
    var Component = StateHock()(Child);
    tt.is(shallow(<Component foo="bar" />).props().foo, 'bar');
    tt.is(shallow(<Component value="bar" />).props().value, undefined);
});

test('StateHock will allow you to change valueProp & onChangeProp', tt => {
    var Child = () => <div/>;
    var Component = StateHock({
        initialState: () => 0,
        valueProp: 'foo',
        onChangeProp: 'changeFoo'
    })(Child);

    tt.is(shallow(<Component foo="bar" />).props().foo, 0);
    tt.is(typeof shallow(<Component value="bar" />).props().changeFoo, 'function');
});



//
// Functionality
//

test('StateHock will set a defualt value', tt => {
    const Child = (props) => {
        tt.is(props.value, 0);
        return <div/>;
    };

    var Component = StateHock({initialState: () => 0})(Child);

    shallow(<Component />).dive();
});

test('StateHock props.onChange will replace value', tt => {
    var Child = () => <div/>;
    var Component = StateHock({initialState: () => 0})(Child);
    var instance = shallow(<Component />);
    instance.props().onChange(1);
    tt.is(instance.props().value, 1);
});
