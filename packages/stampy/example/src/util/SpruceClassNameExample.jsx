import React from 'react';
import SpruceClassName from 'stampy/lib/util/SpruceClassName';

export default () => {
    return <div>
        <pre>
            <span>Code: {`SpruceClassName({name: 'Button', modifier:'red large', className: 'otherStuff'})`}</span>
            <div>Result: {SpruceClassName({name: 'Button', modifier:'red large', className: 'otherStuff'})}</div>
        </pre>
    </div>
}
