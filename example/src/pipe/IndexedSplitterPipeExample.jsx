import React from 'react';
import {fromJS} from 'immutable';
import {
    StateHock,
    SpreadPipe,
    IndexedSplitterPipeStateful,
    Input,
    Compose
} from 'stampy';

const Example = (props: Object) => {
    const {
        split,
        onPush,
        onPop,
        onSwap,
        onSwapPrev,
        onSwapNext,
        onChange,
        value
    } = props;

    return <div style={{fontFamily: 'monospace'}}>
        <div>
            <button onClick={() => onPush(`${Math.ceil(Math.random() * 100)}`)}>push random</button>
            <button onClick={() => onPop()}>pop</button>
            <button onClick={() => onSwap(0, split.length - 1)}>swap first and last</button>
            {/*<button onClick={() => {onChange(value.push("X").push("Y"))}}>add more options via props</button>*/}
        </div>
        {split.map((ii, index) => {
            const {
                value,
                onChange,
                errorValue,
                errorChange,
                isFirst,
                isLast,
                key
            } = ii;

            return <div key={key} style={{display: 'block'}}>
                Key: {key + " "}
                <label>value <Input value={value} onChange={onChange} /></label>
                <label>error <Input value={errorValue} onChange={errorChange} /></label>

                {!isFirst && <button onClick={() => onSwapPrev(index)}>↑</button>}
                {!isLast && <button onClick={() => onSwapNext(index)}>↓</button>}
            </div>;
        })}
    </div>;
}

const withState = StateHock({
    initialState: () => fromJS({
        value: [
            "A",
            "B",
            "C"
        ],
        errorValue: [
            "!"
        ]
    })
});

const withSpread = SpreadPipe(() => ({
    valueChangePairs: [
        ['value', 'onChange'],
        ['errorValue', 'errorChange']
    ]
}));

const withPipes = IndexedSplitterPipeStateful(() => ({
    valueChangePairs: [
        ['value', 'onChange'],
        ['errorValue', 'errorChange']
    ]
}));

const withHocks = Compose(
    withState,
    withSpread,
    withPipes
);

export default withHocks(Example);
