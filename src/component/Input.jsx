// @flow
import React from 'react';
import type {Element} from 'react';
import SpruceClassName from '../util/SpruceClassName';

/**
 * @module Inputs
 */

/**
 * @component
 *
 * `Input` is a simple component that displays an input.
 * It does not keep state.
 *
 * @example
 * return <Input type='text' onChange={(val) => doStuff(val)}/>
 */

type Props = {
    className?: string, // {ClassName}
    disabled?: boolean, // Set to true to disable the input. When disabled, `onChange` will no longer be called when the input changes
    inputProps?: Object, // Attributes applied to the component's <input> HTML element
    modifier?: SpruceModifier, // {SpruceModifier}
    name?: string, // HTML name attribute for the input
    onChange?: OnChange, // {OnChange}
    peer: string, // {SprucePeer}
    placeholder?: string, // {Placeholder}
    spruceName: string, // {SpruceName}
    type?: string, // HTML type attribute for the input
    value?: string // {Value}
};

export default class Input extends React.Component<Props> {
    static defaultProps = {
        className: '',
        disabled: false,
        inputProps: {},
        modifier: '',
        name: '',
        spruceName: 'Input',
        type: 'text',
        value: ''
    };

    render(): Element<*> {
        const {
            className,
            disabled,
            inputProps,
            modifier,
            name,
            onChange,
            peer,
            spruceName,
            type,
            value,
            placeholder
        } = this.props;

        return <input
            disabled={disabled}
            name={name}
            placeholder={placeholder}
            type={type}
            {...inputProps}
            className={SpruceClassName({name: spruceName, modifier, className, peer})}
            onChange={(ee) => onChange && onChange(ee.target.value, {event: ee, element: ee.target})}
            value={(value == null) ? '' : value}
        />;
    }
}
