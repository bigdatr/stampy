import React from 'react';
import {StateHock, UpPipe} from 'stampy';

const Example = (props: Object) => {
    const {
        value,
        onChange
    } = props;

    return <div style={{fontFamily: 'monospace'}}>
        <div>Value: {value}</div>
        <button onClick={() => onChange(value)}>Append exclamation mark</button>
    </div>;
}

const withState = StateHock((props) => ({
    initialState: "some data"
}));

const payloadChange = (newValue) => `${newValue}!`;

const withUpPipe = UpPipe((props) => ({
    payloadChange
}));

export default withState(withUpPipe(Example));
