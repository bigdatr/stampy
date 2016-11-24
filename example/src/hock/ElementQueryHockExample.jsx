import React from 'react';
import {ElementQueryHock} from 'stampy';

const example = (props) => {
    if(!props.eq) return <div>No height yet</div>;
    return <div>
        <div>width: {props.eq.get('width')}</div>
        <div>height: {props.eq.get('height')}</div>
        <div>active queries: {props.eq.get('active').join(', ')}</div>
        <div>inactive queries: {props.eq.get('inactive').join(', ')}</div>
    </div>
}

const ElementQueryHockExample = ElementQueryHock({
    'medium': [[300, 400], [200,600]] 
})(example);

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