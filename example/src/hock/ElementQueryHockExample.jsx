import React from 'react';
import ElementQueryHock from 'stampy/lib/hock/ElementQueryHock';

const example = (props) => {
    if(!props.eqReady) return <div>No data yet</div>;
    return <div>
        <div>width: {props.eqWidth}</div>
        <div>height: {props.eqHeight}</div>
        <div>active queries: {props.eqActive.join(', ')}</div>
        <div>inactive queries: {props.eqInactive.join(', ')}</div>
    </div>
}

const ElementQueryHockExample = ElementQueryHock([
    {
        name: 'medium',
        widthBounds: [300, 600],
        heightBounds: [200, 400]
    },
    {
        name: 'large',
        widthBounds: [600, 1200],
        heightBounds: [400, 1800]
    }
])(example);

export default () => {
    return <div style={{
        position: 'absolute',
        top: '25%',
        left: '25%',
        right: '25%',
        bottom: '25%',
        border: '1px solid #ccc'
    }}>
        <ElementQueryHockExample/>
    </div>
};
