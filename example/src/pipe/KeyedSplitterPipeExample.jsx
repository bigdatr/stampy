import React from 'react';
import {Map} from 'immutable';
import {
    StateHock,
    SpreadPipe,
    KeyedSplitterPipe,
    Input,
    Compose
} from 'stampy';

const Example = (props: Object) => {
    const {
        name: {
            first,
            last
        },
        age
    } = props.split;

    return <div style={{fontFamily: 'monospace'}}>
        <label style={{display: 'block'}}>first name <Input {...first} /></label>
        <label style={{display: 'block'}}>last name <Input {...last} /></label>
        <label style={{display: 'block'}}>age <Input {...age} /></label>
        <label style={{display: 'block'}}>first name error <Input value={first.errorValue} onChange={first.errorChange} /></label>
    </div>;
}

const withState = StateHock((props) => ({
    initialState: Map({
        value: {
            name: {
                first: "Bob",
                last: "Thunk"
            },
            age: 24
        },
        errorValue: {
            name: {
                first: "Name too short",
                last: null
            },
            age: null
        }
    })
}));

const withSpread = SpreadPipe(() => ({
    valueChangePairs: [
        ['value', 'onChange'],
        ['errorValue', 'errorChange']
    ]
}));

const withPipes = KeyedSplitterPipe(() => ({
    valueChangePairs: [
        ['value', 'onChange'],
        ['errorValue', 'errorChange']
    ],
    paths: [
        'name.first',
        'name.last',
        'age'
    ]
}));

const withHocks = Compose(
    withState,
    withSpread,
    withPipes
);

export default withHocks(Example);
