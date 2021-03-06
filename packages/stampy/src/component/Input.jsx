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
    className: string, // {ClassName}
    disabled: boolean, // Set to true to disable the input. When disabled, `onChange` will no longer be called when the input changes
    inputProps: Object, // Attributes applied to the component's <input> HTML element
    modifier: SpruceModifier, // {SpruceModifier}
    name?: string, // HTML name attribute for the input
    onChange?: OnChange, // {OnChange}
    parent: string, // ${SpruceParent}
    peer: string, // {SprucePeer}
    placeholder?: string, // {Placeholder}
    spruceName: string, // {SpruceName}
    style: Object, // React style object to apply to the rendered HTML element
    type?: string, // HTML type attribute for the input
    value?: ?string // {Value}
};

export default class Input extends React.Component<Props> {
    static defaultProps = {
        className: '',
        disabled: false,
        inputProps: {},
        modifier: '',
        parent: '',
        peer: '',
        spruceName: 'Input',
        style: {},
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
            parent,
            spruceName,
            style,
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
            className={SpruceClassName({name: spruceName, modifier, className, parent, peer})}
            onChange={(ee) => onChange && onChange(ee.target.value, {event: ee, element: ee.target})}
            value={(value == null) ? '' : value}
            style={style}
        />;
    }
}
