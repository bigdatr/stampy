// @flow
import type {Node} from 'react';
import React from 'react';
import SelectHock from '../SelectHock';
import UpdateProps from '../UpdateProps';
import test from 'ava';
import pipeWith from 'unmutable/lib/util/pipeWith';
import get from 'unmutable/lib/get';
import {shallow} from 'enzyme';
import {spy} from 'sinon';
import {CheckHockChildProps} from '../../util/TestHelpers';


const options = [
    {id: 'foo', name: 'Foo'},
    {id: 'bar', name: 'Bar'},
    {id: 'baz', name: 'Baz'}
];

const KEY_UP = {keyCode: 40};
const KEY_DOWN = {keyCode: 38};
const KEY_RETURN = {keyCode: 13};
const KEY_BACKSPACE = {keyCode: 8};

test('SelectHock will create new props', (t: *) => {
    CheckHockChildProps(
        SelectHock(),
        {options, value: options[0]},
        (props) => {
            t.is(props.focusIndex, 0);
            t.is(props.options.length, 3);
            t.is(props.value[0].value, 'foo');
            t.is(typeof props.onKeyDown, 'function');
            t.is(typeof props.onHover, 'function');
        }
    )
});

test('SelectHock will create an empty value array if no value is provided', (t: *) => {
    CheckHockChildProps(
        SelectHock(),
        {options},
        (props) => {
            t.deepEqual(props.value, []);
        }
    )
});

test('SelectHock will recalculate state on componentWillReceiveProps', (t: *) => {
    let wrapper = pipeWith(
        () => <div />,
        SelectHock(),
        Component => shallow(<Component options={options} value={[options[0]]} />)
    );

    wrapper.setProps({value: [options[1]]});
    t.deepEqual(wrapper.state('value'), ['bar']);
});


test('props.valueAsPrimitive lets you select an option by its id', (t: *) => {
    CheckHockChildProps(
        SelectHock(),
        {options, value: 'foo', valueAsPrimitive: true},
        (props) => t.is(props.value[0].value, 'foo')
    )
});

test('props.valueAsPrimitive=false lets you select an option by valueKey', (t: *) => {
    CheckHockChildProps(
        SelectHock(),
        {options, value: options[0], valueAsPrimitive: false},
        (props) => t.is(props.value[0].value, 'foo')
    )
});

test('you can change value and label keys to match your collection', (t: *) => {
    const options = [
        {value: 'foo', label: 'Foo'},
        {value: 'bar', label: 'Bar'}
    ];

    CheckHockChildProps(
        SelectHock(),
        {
            options,
            value: options[0],
            getLabel: get('label'),
            getValue: get('value')
        },
        (props) => {
            t.is(props.value[0].value, 'foo');
        }
    );
});

test('You can have multiple values', (t: *) => {
    CheckHockChildProps(
        SelectHock(),
        {
            options,
            value: options,
            multi: true,
        },
        (props) => {
            t.is(props.value[0].value, 'foo');
            t.is(props.value[1].value, 'bar');
        }
    )
});


test('Hock will fire onChange with chosen option', (t: *) => {
    CheckHockChildProps(
        SelectHock(),
        {
            options,
            value: options[0],
            onChange: (payload) => t.is(payload.name, 'Bar')
        },
        (props) => props.options[1].onChange()
    )
});

test('Hock will fire onChange with multiple options if in multi mode', (t: *) => {
    CheckHockChildProps(
        SelectHock(),
        {
            options,
            value: [options[0]],
            multi: true,
            onChange: (payload) => {
                t.is(payload[0].id, 'foo');
                t.is(payload[1].id, 'bar');
            }
        },
        (props) => props.options[1].onChange()
    )
});



//
// Selected and Focusable
//

test('Selected options will have a prop of selected', (t: *) => {
    CheckHockChildProps(
        SelectHock(),
        {
            options,
            value: [options[0]],
        },
        ({options}) => {
            t.is(options[0].selected, true);
            t.is(options[1].selected, false);
        }
    )
});

test('Matched options will have a prop of matched', (t: *) => {
    CheckHockChildProps(
        SelectHock(),
        {
            options,
            match: 'bar',
            value: [options[0]],
        },
        ({options}) => {
            t.is(options[0].matched, false);
            t.is(options[1].matched, true);
        }
    )
});

test('The focused option will have a prop of focused', (t: *) => {
    CheckHockChildProps(
        SelectHock(),
        {
            options,
            value: [options[0]],
        },
        ({options}) => {
            t.is(options[0].focused, true);
            t.is(options[1].focused, false);
        }
    )
});


//
// Events
//

test('When hocked with focusMatched and focusSelected keyDown events will select the next index', (t: *) => {
    let wrapper = pipeWith(
        () => <div/>,
        SelectHock({focusMatched: true, focusSelected:true}),
        Component => shallow(<Component options={options} value={[options[0]]} />)
    );

    wrapper.prop('onKeyDown')(KEY_UP);
    t.is(wrapper.state('focusIndex'), 1);

    wrapper.prop('onKeyDown')(KEY_DOWN);
    t.is(wrapper.state('focusIndex'), 0);

    wrapper.prop('onKeyDown')(KEY_DOWN);
    t.is(wrapper.state('focusIndex'), 2);
});

test('When hocked with focusUnmatched false keyDown events will skip unmatched', (t: *) => {
    let wrapper = pipeWith(
        () => <div/>,
        SelectHock({focusUnmatched: false, focusSelected: true}),
        Component => shallow(<Component match="foo" options={options} value={[options[0]]} />)
    );

    wrapper.prop('onKeyDown')(KEY_UP);
    t.is(wrapper.state('focusIndex'), 0);

    wrapper.prop('onKeyDown')(KEY_DOWN);
    t.is(wrapper.state('focusIndex'), 0);

    wrapper.prop('onKeyDown')(KEY_DOWN);
    t.is(wrapper.state('focusIndex'), 0);
});

test('When hocked with focusSelected false keyDown events will skip selected', (t: *) => {
    let wrapper = pipeWith(
        () => <div/>,
        SelectHock({focusMatched: true, focusSelected: false}),
        Component => shallow(<Component options={options} value={[options[1]]} />)
    );

    wrapper.prop('onKeyDown')(KEY_UP);
    t.is(wrapper.state('focusIndex'), 2);

    wrapper.prop('onKeyDown')(KEY_UP);
    t.is(wrapper.state('focusIndex'), 0);

    wrapper.prop('onKeyDown')(KEY_DOWN);
    t.is(wrapper.state('focusIndex'), 2);

    wrapper.prop('onKeyDown')(KEY_DOWN);
    t.is(wrapper.state('focusIndex'), 0);
});

test('enter keyDown events will trigger onChange with selected index', (t: *) => {
    let wrapper = pipeWith(
        () => <div />,
        SelectHock(),
        Component => shallow(<Component
            options={options}
            value={[options[1]]}
            onChange={(element) => t.is(element, options[0])}/>)
    );

    wrapper.prop('onKeyDown')(KEY_RETURN);
});

test('props.valueAsPrimitive=true will return id values from the onChange', (t: *) => {
    let wrapper = pipeWith(
        () => <div />,
        SelectHock(),
        Component => shallow(<Component
            options={options}
            valueAsPrimitive
            value={[options[1].id]}
            onChange={(id) => t.is(id, 'foo')} />)
    );

    wrapper.prop('onKeyDown')(KEY_RETURN);
});

test('backspace will remove items', (t: *) => {
    let wrapper = pipeWith(
        () => <div />,
        SelectHock(),
        Component => shallow(<Component
            options={options}
            multi
            value={[options[1], options[2]]}
            onChange={(change) => t.deepEqual(change, [options[1]])}
        />)
    );

    wrapper.prop('onKeyDown')(KEY_BACKSPACE);
});

test('backspace will not remove items if props.match is present', (t: *) => {
    const onChange = spy();
    let wrapper = pipeWith(
        () => <div />,
        SelectHock(),
        Component => shallow(<Component
            options={options}
            value={options}
            multi
            match="foo"
            onChange={onChange}
        />)
    );

    wrapper.prop('onKeyDown')(KEY_BACKSPACE);
    t.is(onChange.callCount, 0);
});


