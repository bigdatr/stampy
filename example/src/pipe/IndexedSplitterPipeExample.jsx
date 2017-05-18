import React from 'react';
import {fromJS} from 'immutable';
import {
    StateHock,
    SpreadPipe,
    IndexedSplitterPipe,
    Input,
    Compose
} from 'stampy';

const Example = (props: Object) => {
    return <div style={{fontFamily: 'monospace'}}>
        {props.split.map((ii, key) => {
            const {
                value,
                onChange,
                errorValue,
                errorChange
            } = ii;

            return <div key={key} style={{display: 'block'}}>
                Index: {key} -
                <label>value <Input value={value} onChange={onChange} /></label>
                <label>error <Input value={errorValue} onChange={errorChange} /></label>
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

const withPipes = IndexedSplitterPipe(() => ({
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
