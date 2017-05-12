import React from 'react';
import {StateHock, SpreadPipe, Input} from 'stampy';
import {Map} from 'immutable';

const Example = (props: Object) => {
    const {
        value,
        sortValue,
        filterValue,
        onChange,
        sortChange,
        filterChange
    } = props;

    return <div style={{fontFamily: 'monospace'}}>
        <label style={{display: 'block'}}>data <Input value={value} onChange={onChange} /></label>
        <label style={{display: 'block'}}>sort <Input value={sortValue} onChange={sortChange} /></label>
        <label style={{display: 'block'}}>filter <Input value={filterValue} onChange={filterChange} /></label>
        <pre>{JSON.stringify({value, sortValue, filterValue}, null, 4)}</pre>
    </div>;
}

const withState = StateHock({initialState: () => Map()});

const withSpread = SpreadPipe(() => ({
    valueChangePairs: [
        ['value', 'onChange'],
        ['sortValue', 'sortChange'],
        ['filterValue', 'filterChange']
    ]
}));

export default withState(withSpread(Example));
