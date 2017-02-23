import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';
import sinon from 'sinon';
import ToggleSet from './ToggleSet';

const options = [
    {value: "1", label: "one"},
    {value: "2", label: "two"},
    {value: "3", label: "three"}
];

test('ToggleSet should have a class of ToggleSet', tt => {
    const toggleSet = shallow(<ToggleSet options={options} />);
    tt.true(toggleSet.render().children().first().hasClass('ToggleSet'));
});

test('ToggleSet should apply htmlProps to outer element', tt => {
    const toggleSet = shallow(<ToggleSet options={options} htmlProps={{'data-test': "test"}} />);
    tt.is(toggleSet.render().children().first().get(0).attribs['data-test'], "test");
});

test('ToggleSet should render toggle with labels according to options', tt => {
    const toggles = shallow(<ToggleSet options={options} />).children();
    tt.deepEqual(
        toggles.map(ii => ii.prop('children')),
        ["one", "two", "three"]
    );
});


test('ToggleSet should render active toggles according to value', tt => {
    const toggles = shallow(<ToggleSet options={options} />).children();
    tt.deepEqual(
        toggles.map(ii => ii.prop('value')),
        [false, false, false]
    );

    const togglesWithValue = shallow(<ToggleSet options={options} value="2" />).children();
    tt.deepEqual(
        togglesWithValue.map(ii => ii.prop('value')),
        [false, true, false]
    );

    const togglesWithWrongValue = shallow(<ToggleSet options={options} value="4" />).children();
    tt.deepEqual(
        togglesWithWrongValue.map(ii => ii.prop('value')),
        [false, false, false]
    );
});

test('ToggleSet should render active toggles according to value with multi=true', tt => {
    const toggles = shallow(<ToggleSet options={options} multi />).children();
    tt.deepEqual(
        toggles.map(ii => ii.prop('value')),
        [false, false, false]
    );

    const togglesWithOneValue = shallow(<ToggleSet options={options} multi value={["2"]} />).children();
    tt.deepEqual(
        togglesWithOneValue.map(ii => ii.prop('value')),
        [false, true, false]
    );

    const togglesWithManyValues = shallow(<ToggleSet options={options} multi value={["1", "2", "3"]} />).children();
    tt.deepEqual(
        togglesWithManyValues.map(ii => ii.prop('value')),
        [true, true, true]
    );

    const togglesWithOneWrongValue = shallow(<ToggleSet options={options} multi value={["1", "4"]} />).children();
    tt.deepEqual(
        togglesWithOneWrongValue.map(ii => ii.prop('value')),
        [true, false, false]
    );
});

test('ToggleSet should call onChange with appropriate values', tt => {

    const onChange = sinon.spy();
    const toggles = shallow(<ToggleSet options={options} onChange={onChange} />).children();
    toggles.first().prop('onChange')(true);

    tt.true(onChange.calledOnce, 'onChange should be called once');
    tt.is(onChange.firstCall.args[0], "1");

});

test('ToggleSet should cope with no onChange', tt => {

    const toggles = shallow(<ToggleSet options={options} />).children();
    toggles.first().prop('onChange')(true);

});

test('ToggleSet should call onChange with appropriate values, when it already has a value', tt => {

    const onChange = sinon.spy();
    const toggles = shallow(<ToggleSet options={options} onChange={onChange} value="2" />).children();
    toggles.first().prop('onChange')(true);

    tt.true(onChange.calledOnce, 'onChange should be called once');
    tt.is(onChange.firstCall.args[0], "1");

});

test('ToggleSet should not call onChange with current value when not clearable and user clicks active toggle', tt => {

    const onChange = sinon.spy();
    const toggles = shallow(<ToggleSet options={options} onChange={onChange} value="1" />).children();
    toggles.first().prop('onChange')(false);
    tt.false(onChange.called, 'onChange should not be called');

});

test('ToggleSet should call onChange with empty string when clearable and user clicks active toggle', tt => {

    const onChange = sinon.spy();
    const toggles = shallow(<ToggleSet options={options} onChange={onChange} value="1" clearable />).children();
    toggles.first().prop('onChange')(false);

    tt.true(onChange.calledOnce, 'onChange should be called once');
    tt.is(onChange.firstCall.args[0], "");
});

test('ToggleSet should call onChange with appropriate values when multi=true', tt => {

    const onChange = sinon.spy();
    const toggles = shallow(<ToggleSet options={options} onChange={onChange} multi />).children();
    toggles.first().prop('onChange')(true);
    tt.true(onChange.calledOnce, 'onChange should be called once');
    tt.deepEqual(onChange.firstCall.args[0], ["1"]);

    const onChange2 = sinon.spy();
    const toggles2 = shallow(<ToggleSet options={options} onChange={onChange2} multi value={["1"]} />).children();
    toggles2.last().prop('onChange')(true);
    tt.true(onChange2.calledOnce, 'onChange should be called once');
    tt.deepEqual(onChange2.firstCall.args[0], ["1", "3"]);

    const onChange3 = sinon.spy();
    const toggles3 = shallow(<ToggleSet options={options} onChange={onChange3} multi value={["3"]} />).children();
    toggles3.last().prop('onChange')(false);
    tt.true(onChange3.calledOnce, 'onChange should be called once');
    tt.deepEqual(onChange3.firstCall.args[0], []);
});