import React from 'react';
import {StateHock, DownPipe, Input} from 'stampy';

const Example = (props: Object) => {
    const {
        dataValue,
        dataChange,
        renamedValue,
        renamedChange
    } = props;

    return <div style={{fontFamily: 'monospace'}}>
        <label style={{display: 'block'}}>dataValue <Input value={dataValue} onChange={dataChange} /></label>
        <label style={{display: 'block'}}>renamedValue <Input value={renamedValue} onChange={renamedChange} /></label>
    </div>;
}

const withState = StateHock({
    initialState: () => "some data"
});

const withDownPipe = DownPipe(props => ({
    childProps: {
        dataValue: "this value has been changed",
        dataChange: () => console.log("This dataChange function has been replaced with a new one"),
        renamedValue: props.dataValue,
        renamedChange: props.dataChange
    }
}));

export default withState(withDownPipe(Example));
