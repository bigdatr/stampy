import React from 'react';
import Button from 'stampy/lib/component/Button';

export default () => {
    return <div>
        <p>Normal button</p>
        <Button
            onClick={() => alert('click')}
        >
            Button
        </Button>

        <p>Disabled button</p>
        <Button
            onClick={() => alert('click')}
            disabled
        >
            Button
        </Button>

        <p>Classy button</p>
        <Button
            onClick={() => alert('click')}
            className="classy"
        >
            Button
        </Button>

        <p>Modifier button</p>
        <Button
            onClick={() => alert('click')}
            modifier="large"
        >
            Button
        </Button>
    </div>
}
