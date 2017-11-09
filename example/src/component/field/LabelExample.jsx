import React from 'react';
import Label from 'stampy/lib/component/Label';
import Input from 'stampy/lib/component/Input';

export default () => {
    return <div>
        <p>Normal label</p>
        <Label>
            Label
        </Label>

        <p>Label linked to input</p>
        <Label htmlFor='the-input'>Click me to focus input</Label>
        <Input id='the-input'/>
    </div>
}
