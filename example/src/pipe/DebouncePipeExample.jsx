import React from 'react';
import {
    StateHock,
    SpreadPipe,
    DebouncePipe,
    UpPipe,
    Input,
    Compose
} from 'stampy';

const Example = (props: Object) => {
    const {
        value,
        onChange,
        debounceValue
    } = props;

    return <div style={{fontFamily: 'monospace'}}>
        <label style={{display: 'block'}}>Value: <Input value={value} onChange={onChange} /></label>
        <label style={{display: 'block'}}>Debounced value: {debounceValue}</label>
    </div>;
}

const withState = StateHock((props) => ({
    initialState: "some data"
}));

const withSpread = SpreadPipe(() => ({
    valueChangePairs: [
        ['value', 'onChange'],
        ['debounceValue', 'debounceChange']
    ]
}));

const withDebouncePipe = DebouncePipe(props => ({
    onChangeProp: "debounceChange"
}), {wait: 500});

const withAutoSubmit = UpPipe((props) => ({
    payloadCallback: (payload, onChange) => {
        onChange(payload);
        props.debounceChange(payload);
    },
    onChangeProp: "onChange"
}));

export default Compose(
    withState,
    withSpread,
    withDebouncePipe,
    withAutoSubmit
)(Example);
