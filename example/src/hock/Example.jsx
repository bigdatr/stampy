import React from 'react';

import Highlight from 'react-highlight';

export default (config) => {
    return (ComposedComponent) => {
        return (props) => {
            return <div className='Example'>
                <div className='Example_component'>
                    <ComposedComponent {...props}/>
                </div>
                <div className='Example_source'>
                    <Highlight>{config.source}</Highlight>
                </div>
            </div>;
        }
    }
}
