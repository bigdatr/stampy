import React from 'react';
import {Label, Input} from 'stampy';

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
