import React from 'react';
import {StateHock, KeyedStatePipe, Input} from 'stampy';
import {Map} from 'immutable';

const Example = (props: Object) => {
    const {
        dataValue,
        sortValue,
        filterValue,
        dataChange,
        sortChange,
        filterChange
    } = props;

    return <div style={{fontFamily: 'monospace'}}>
        <label style={{display: 'block'}}>data <Input value={dataValue} onChange={dataChange} /></label>
        <label style={{display: 'block'}}>sort <Input value={sortValue} onChange={sortChange} /></label>
        <label style={{display: 'block'}}>filter <Input value={filterValue} onChange={filterChange} /></label>
        <pre>{JSON.stringify({dataValue, sortValue, filterValue}, null, 4)}</pre>
    </div>;
}

const withState = StateHock({initialState: () => Map()});

const splitToKeys = KeyedStatePipe({
    keys: ['data', 'sort', 'filter']
});

export default withState(splitToKeys(Example));
