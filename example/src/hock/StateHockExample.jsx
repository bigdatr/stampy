import React from 'react';
import {StateHock} from 'stampy';
import {Map} from 'immutable';

const Example = (props) => {
    const {
        value,
        onChange
    } = props;

    const increment = (path) => value.updateIn(path, 0, ii => ii + 1);
    const decrement = (path) => value.updateIn(path, 0, ii => ii - 1);

    return <div>
        <button onClick={() => onChange(value.set('rad', value.get('cool', '-')))}>Set rad to cool</button>
        <button onClick={() => onChange(increment(['bar']))}>increment bar</button>
        <button onClick={() => onChange(decrement(['bar']))}>decrement bar</button>
        <button onClick={() => onChange(increment(['foo']))}>increment foo</button>
        <button onClick={() => onChange(decrement(['foo']))}>decrement foo</button>
        <input type="text" onChange={(ee) => onChange(value.set('cool', ee.target.value))}/>
        <pre>{JSON.stringify(value.toJS(), null, 4)}</pre>
    </div>;
}

const withState = StateHock((props) => ({
    initialState: Map()
}));

export default withState(Example);
