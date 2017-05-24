import React from 'react';
import {StateHock, DownPipe, Input} from 'stampy';

const Example = (props: Object) => {
    const {
        value,
        onChange,
        renamedValue,
        renamedChange
    } = props;

    return <div style={{fontFamily: 'monospace'}}>
        <label style={{display: 'block'}}>value > renamedValue <Input value={renamedValue} onChange={renamedChange} /></label>
        <label style={{display: 'block'}}>"this value has been changed" > value <Input value={value} onChange={onChange} /></label>
    </div>;
}

const withState = StateHock((props) => ({
    initialState: "some data"
}));

const withDownPipe = DownPipe(props => ({
    childProps: {
        value: "this value has been changed",
        onChange: () => console.log("This onChange function has been replaced with a new one"),
        renamedValue: props.value,
        renamedChange: props.onChange
    }
}));

export default withState(withDownPipe(Example));
