import test from 'ava';
import {shallow} from 'enzyme';
import sinon from 'sinon';
import React from 'react';
import SplitIndexPipe from './SplitIndexPipe';
import {Map, fromJS, is, List} from 'immutable';

//
// hock tests
//

test(`SplitIndexPipe matches (config) => (Component) => Hock`, tt => {
    var Child = () => <div/>;
    tt.is(typeof SplitIndexPipe, 'function');
    tt.is(typeof SplitIndexPipe(), 'function');
    tt.is(typeof SplitIndexPipe()(Child), 'function');
});

test(`SplitIndexPipe passes other props through`, tt => {
    var Child = () => <div/>;
    var Component = SplitIndexPipe()(Child);
    tt.is(shallow(<Component dataValue={{}} foo="bar" />).props().foo, 'bar');
});

test(`SplitIndexPipe does not recreate props every render`, tt => {
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = SplitIndexPipe()(componentToWrap);
    const myWrappedComponent = new WrappedComponent({});

    var render1: Object = Map(myWrappedComponent.render().props);
    var render2: Object = Map(myWrappedComponent.render().props);

    render1.forEach((prop, key) => {
        tt.is(prop, render2.get(key), `Prop "${key}" must be strictly equal on re-render`);
    });
});


test(`SplitIndexPipe does not recreate props every render when using own config`, tt => {
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = SplitIndexPipe(() => ({
        valueChangePairs: [
            ['value', 'onChange'],
            ['errorValue', 'errorChange']
        ]
    }))(componentToWrap);

    const myWrappedComponent = new WrappedComponent({});

    var render1: Object = Map(myWrappedComponent.render().props);
    var render2: Object = Map(myWrappedComponent.render().props);

    render1.forEach((prop, key) => {
        tt.is(prop, render2.get(key), `Prop "${key}" must be strictly equal on re-render`);
    });
});

test(`SplitIndexPipe does not recreate props when changes happen to props to used in the updating of child props`, tt => {
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = SplitIndexPipe(() => ({
        valueChangePairs: [
            ['value', 'onChange'],
            ['errorValue', 'errorChange']
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

test('SplitIndexPipe provides correct values in split prop', tt => {
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = SplitIndexPipe(() => ({
        valueChangePairs: [
            ['value', 'onChange'],
            ['errorValue', 'errorChange']
        ]
    }))(componentToWrap);

    const myWrappedComponent = new WrappedComponent({
        value: [
            1,
            {hi: "hello"}
        ],
        errorValue: [
            "!",
            "?"
        ]
    });

    const {split} = myWrappedComponent.render().props;
    tt.is(split[0].value, 1);
    tt.is(split[1].value.hi, "hello");
    tt.is(split[0].errorValue, "!");
    tt.is(split[1].errorValue, "?");
    tt.is(split[0].key, 0, 'default keys should be provided based off index');
    tt.is(split[1].key, 1, 'default keys should be provided based off index');
    tt.true(split[0].isFirst, 'the first item should have isFirst = true');
    tt.false(split[1].isFirst, 'the non-first items should have isFirst = false');
    tt.false(split[0].isLast, 'the non-last items should have isLast = true');
    tt.true(split[1].isLast, 'the last item should have isLast = false');
});

test('SplitIndexPipe provides key in split prop if listKeysValue prop is provided', tt => {
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = SplitIndexPipe(() => ({
        valueChangePairs: [
            ['value', 'onChange'],
            ['errorValue', 'errorChange']
        ]
    }))(componentToWrap);

    const myWrappedComponent = new WrappedComponent({
        value: [
            "A",
            "B"
        ],
        errorValue: [
            "!",
            "?"
        ],
        listKeysValue: [10,11]
    });

    const {split} = myWrappedComponent.render().props;
    tt.is(split[0].key, 10, 'keys should be provided based off contents of listKeysProp');
    tt.is(split[1].key, 11, 'keys should be provided based off contents of listKeysProp');
});

test('SplitIndexPipe should pass undefined values when passed values of unequal length', tt => {
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = SplitIndexPipe(() => ({
        valueChangePairs: [
            ['value', 'onChange'],
            ['errorValue', 'errorChange']
        ]
    }))(componentToWrap);

    const myWrappedComponent = new WrappedComponent({
        value: [
            1,
            {hi: "hello"}
        ],
        errorValue: [
            "!"
            // no second element!
        ]
    });

    const {errorValue} = myWrappedComponent.render().props.split[1];
    tt.is(typeof errorValue, "undefined");
});

test('SplitIndexPipe provides correct change functions in split prop', tt => {
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = SplitIndexPipe(() => ({
        valueChangePairs: [
            ['value', 'onChange'],
            ['errorValue', 'errorChange']
        ]
    }))(componentToWrap);

    const onChange = sinon.spy();
    const errorChange = sinon.spy();

    const myWrappedComponent = new WrappedComponent({
        value: [1,2,3],
        errorValue: [4,5,6],
        onChange,
        errorChange
    });

    const {split} = myWrappedComponent.render().props;
    tt.is(typeof split[0].onChange, "function");
    tt.is(typeof split[1].onChange, "function");
    tt.is(typeof split[0].errorChange, "function");
    tt.is(typeof split[1].errorChange, "function");

    const expectedUpdatedValue = [1,7,3];

    split[1].onChange(7);
    tt.true(onChange.calledOnce, 'onChange is called once');
    tt.false(errorChange.called, 'other change functions are not called');
    tt.deepEqual(expectedUpdatedValue, onChange.firstCall.args[0], 'onChange is called with the correct arguments passed');
});

test('SplitIndexPipe should silently fail if change function prop not provided', tt => {
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = SplitIndexPipe(() => ({
        valueChangePairs: [
            ['value', 'onChange']
        ]
    }))(componentToWrap);

    const myWrappedComponent = new WrappedComponent({
        value: [1,2,3]
    });

    tt.notThrows(() => {
        myWrappedComponent.render().props.split[0].onChange("New value");
    });
});

test('SplitIndexPipe should update childProps on componentWillReceiveProps if config changes', tt => {
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = SplitIndexPipe((props) => ({
        valueChangePairs: [[props.valueField, 'onChange']]
    }))(componentToWrap);

    const anotherWrappedComponent = new WrappedComponent({
        valueField: "value",
        nameField: "name"
    });

    const nextProps = {
        valueField: "val",
        nameField: "name",
        val: [1,2,3]
    };
    anotherWrappedComponent.componentWillReceiveProps(nextProps);
    anotherWrappedComponent.props = nextProps;

    tt.is(
        anotherWrappedComponent.render().props.split[0].val,
        1,
        'split() memoization uses correct arguments, and config props affect split correctly'
    );
});

test('SplitIndexPipe can set config.splitProp', tt => {
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = SplitIndexPipe(() => ({
        splitProp: "splitt"
    }))(componentToWrap);

    const myWrappedComponent = new WrappedComponent({
        value: ["Tom"]
    });

    const {splitt} = myWrappedComponent.render().props;
    tt.is(splitt[0].value, 'Tom', 'split prop can be changed');
});


test('SplitIndexPipe has a default config for valueChangePairs', tt => {
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = SplitIndexPipe()(componentToWrap);

    const myWrappedComponent = new WrappedComponent({
        value: ["Tom"]
    });

    const {split} = myWrappedComponent.render().props;
    tt.is(split[0].value, "Tom", 'value is included in default valueChangePairs');
    tt.is(typeof split[0].onChange, "function", 'onChange is included in default valueChangePairs');
});

//
// static methods
//

test('SplitIndexPipe.zipValues works correctly', tt => {
    const componentToWrap = () => <div>Example Component</div>;
    const {zipValues} = SplitIndexPipe()(componentToWrap);

    const unzipped = fromJS({
        value: [1,2,3],
        errorValue: ["invalid name"]
    });

    const zipped = zipValues(unzipped);
    const expectedOutput = fromJS([
        {
            value: 1,
            errorValue: "invalid name"
        },
        {
            value: 2,
            errorValue: undefined
        },
        {
            value: 3,
            errorValue: undefined
        }
    ]);

    tt.true(
        is(
            zipped,
            expectedOutput
        )
    );
});

test('SplitIndexPipe.unzipValues works correctly', tt => {
    const componentToWrap = () => <div>Example Component</div>;
    const {unzipValues} = SplitIndexPipe()(componentToWrap);

    const zipped = fromJS([
        {
            value: 1,
            errorValue: "invalid name"
        },
        {
            value: 2,
            errorValue: undefined
        },
        {
            value: 3,
            errorValue: undefined
        }
    ]);

    const upzipped = unzipValues(zipped, fromJS(['value', 'errorValue']));

    const expectedOutput = fromJS({
        value: [1,2,3],
        errorValue: ["invalid name", undefined, undefined]
    });

    tt.true(
        is(
            upzipped,
            expectedOutput
        )
    );
});

//
// modify methods
//

test('SplitIndexPipes modifier functions work correctly with value arrays (using onPop as example)', tt => {
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = SplitIndexPipe()(componentToWrap);

    const onChange = sinon.spy();

    const myWrappedComponent = new WrappedComponent({
        value: ["A","B","C"],
        onChange
    });

    myWrappedComponent.render().props.onPop();

    tt.true(onChange.calledOnce, 'onChange should be called once');
    tt.deepEqual(
        onChange.firstCall.args[0],
        ["A","B"],
        'onChange should passed correct update value'
    );
});

test('SplitIndexPipes modifier functions work correctly with value arrays (using onPop as example)', tt => {
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = SplitIndexPipe()(componentToWrap);

    const onChange = sinon.spy();

    const myWrappedComponent = new WrappedComponent({
        value: ["A","B","C"],
        onChange
    });

    myWrappedComponent.render().props.onPop();

    tt.true(onChange.calledOnce, 'onChange should be called once');
    tt.deepEqual(
        onChange.firstCall.args[0],
        ["A","B"],
        'onChange should passed correct update value'
    );
});

test('SplitIndexPipes modifier functions should fail silently if no onChange is given (using onPop as example)', tt => {
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = SplitIndexPipe()(componentToWrap);


    const myWrappedComponent = new WrappedComponent({
        value: ["A","B","C"]
    });

    tt.notThrows(() => {
        myWrappedComponent.render().props.onPop();
    });
});


test('SplitIndexPipes onPop works correctly', tt => {
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = SplitIndexPipe()(componentToWrap);

    const onChange = sinon.spy();
    const listKeysChange = sinon.spy();

    const myWrappedComponent = new WrappedComponent({
        value: List(["A","B","C"]),
        listKeysValue: List([10,11,12]),
        onChange,
        listKeysChange
    });

    myWrappedComponent.render().props.onPop();

    tt.true(onChange.calledOnce, 'onChange should be called once');
    tt.true(
        is(
            onChange.firstCall.args[0],
            List(["A","B"])
        ),
        'onChange should passed correct update value'
    );
    tt.true(listKeysChange.calledOnce, 'listKeysChange should be called once');
    tt.true(
        is(
            listKeysChange.firstCall.args[0],
            List([10,11])
        ),
        'listKeysChange should passed correct update value'
    );
});

test('SplitIndexPipes onPush works correctly', tt => {
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = SplitIndexPipe()(componentToWrap);

    const onChange = sinon.spy();
    const listKeysChange = sinon.spy();

    const myWrappedComponent = new WrappedComponent({
        value: List(["A","B","C"]),
        listKeysValue: List([10,11,12]),
        onChange,
        listKeysChange
    });

    myWrappedComponent.render().props.onPush("D");

    tt.true(onChange.calledOnce, 'onChange should be called once');
    tt.true(
        is(
            onChange.firstCall.args[0],
            List(["A","B","C","D"])
        ),
        'onChange should passed correct update value'
    );
    tt.true(listKeysChange.calledOnce, 'listKeysChange should be called once');
    tt.true(
        is(
            listKeysChange.firstCall.args[0],
            List([10,11,12,13])
        ),
        'listKeysChange should passed correct update value'
    );
});

test('SplitIndexPipes onPush gives an id when there are no items in value', tt => {
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = SplitIndexPipe()(componentToWrap);

    const onChange = sinon.spy();
    const listKeysChange = sinon.spy();

    const myWrappedComponent = new WrappedComponent({
        value: List(),
        listKeysValue: List(),
        onChange,
        listKeysChange
    });

    myWrappedComponent.render().props.onPush("A");

    tt.true(onChange.calledOnce, 'onChange should be called once');
    tt.true(
        is(
            onChange.firstCall.args[0],
            List(["A"])
        ),
        'onChange should passed correct update value'
    );
    tt.true(listKeysChange.calledOnce, 'listKeysChange should be called once');
    tt.true(
        is(
            listKeysChange.firstCall.args[0],
            List([0])
        ),
        'listKeysChange should passed correct update value'
    );
});

test('SplitIndexPipes onSwap works correctly', tt => {
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = SplitIndexPipe()(componentToWrap);

    const onChange = sinon.spy();
    const listKeysChange = sinon.spy();

    const myWrappedComponent = new WrappedComponent({
        value: List(["A","B","C"]),
        listKeysValue: List([10,11,12]),
        onChange,
        listKeysChange
    });

    myWrappedComponent.render().props.onSwap(0,2);

    tt.true(onChange.calledOnce, 'onChange should be called once');
    tt.true(
        is(
            onChange.firstCall.args[0],
            List(["C","B","A"])
        ),
        'onChange should passed correct update value'
    );
    tt.true(listKeysChange.calledOnce, 'listKeysChange should be called once');
    tt.true(
        is(
            listKeysChange.firstCall.args[0],
            List([12,11,10])
        ),
        'listKeysChange should passed correct update value'
    );
});

test('SplitIndexPipes onSwapNext works correctly', tt => {
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = SplitIndexPipe()(componentToWrap);

    const onChange = sinon.spy();
    const listKeysChange = sinon.spy();

    const myWrappedComponent = new WrappedComponent({
        value: List(["A","B","C"]),
        listKeysValue: List([10,11,12]),
        onChange,
        listKeysChange
    });

    myWrappedComponent.render().props.onSwapNext(0);

    tt.true(onChange.calledOnce, 'onChange should be called once');
    tt.true(
        is(
            onChange.firstCall.args[0],
            List(["B","A","C"])
        ),
        'onChange should passed correct update value'
    );
    tt.true(listKeysChange.calledOnce, 'listKeysChange should be called once');
    tt.true(
        is(
            listKeysChange.firstCall.args[0],
            List([11,10,12])
        ),
        'listKeysChange should passed correct update value'
    );
});

test('SplitIndexPipes onSwapNext does nothing if used on last item in array', tt => {
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = SplitIndexPipe()(componentToWrap);

    const onChange = sinon.spy();
    const listKeysChange = sinon.spy();

    const myWrappedComponent = new WrappedComponent({
        value: List(["A","B","C"]),
        listKeysValue: List([10,11,12]),
        onChange,
        listKeysChange
    });

    myWrappedComponent.render().props.onSwapNext(2);

    tt.false(onChange.called, 'onChange should not be called');
    tt.false(listKeysChange.called, 'listKeysChange should not be called');
});

test('SplitIndexPipes onSwapPrev works correctly', tt => {
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = SplitIndexPipe()(componentToWrap);

    const onChange = sinon.spy();
    const listKeysChange = sinon.spy();

    const myWrappedComponent = new WrappedComponent({
        value: List(["A","B","C"]),
        listKeysValue: List([10,11,12]),
        onChange,
        listKeysChange
    });

    myWrappedComponent.render().props.onSwapPrev(2);

    tt.true(onChange.calledOnce, 'onChange should be called once');
    tt.true(
        is(
            onChange.firstCall.args[0],
            List(["A","C","B"])
        ),
        'onChange should passed correct update value'
    );
    tt.true(listKeysChange.calledOnce, 'listKeysChange should be called once');
    tt.true(
        is(
            listKeysChange.firstCall.args[0],
            List([10,12,11])
        ),
        'listKeysChange should passed correct update value'
    );
});


test('SplitIndexPipes onSwapNext does nothing if used on last item in array', tt => {
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = SplitIndexPipe()(componentToWrap);

    const onChange = sinon.spy();
    const listKeysChange = sinon.spy();

    const myWrappedComponent = new WrappedComponent({
        value: List(["A","B","C"]),
        listKeysValue: List([10,11,12]),
        onChange,
        listKeysChange
    });

    myWrappedComponent.render().props.onSwapPrev(0);

    tt.false(onChange.called, 'onChange should not be called');
    tt.false(listKeysChange.called, 'listKeysChange should not be called');
});
