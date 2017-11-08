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
 * `Textarea` is a simple component that displays a textarea.
 * It does not keep state.
 *
 * @example
 * return <Textarea onChange={(val) => doStuff(val)}/>
 */

type Props = {
    className: string, // {ClassName}
    disabled: boolean, // Set to true to disable the textarea. When disabled, `onChange` will no longer be called when the textarea changes
    modifier: SpruceModifier, // {SpruceModifier}
    name?: string, // HTML name attribute for the textarea
    onChange?: OnChange, // {OnChange}
    peer: string, // {SprucePeer}
    placeholder?: string, // The placeholder text to show in the textarea when there is no value
    spruceName: string, // {SpruceName}
    style: Object, // React style object to apply to the rendered HTML element
    textareaProps?: Object, // {Placeholder}
    value?: ?string // {Value}
};

export default class Textarea extends React.Component<Props> {
    static defaultProps = {
        className: '',
        disabled: false,
        textareaProps: {},
        modifier: '',
        peer: '',
        spruceName: 'Textarea',
        style: {},
        value: ''
    };

    render(): Element<*> {
        const {
            className,
            disabled,
            modifier,
            name,
            onChange,
            peer,
            placeholder,
            spruceName,
            style,
            textareaProps,
            value
        } = this.props;

        return <textarea
            disabled={disabled}
            name={name}
            placeholder={placeholder}
            {...textareaProps}
            className={SpruceClassName({name: spruceName, modifier, className, peer})}
            onChange={(ee) => onChange && onChange(ee.target.value, {event: ee, element: ee.target})}
            value={(value == null) ? '' : value}
            style={style}
        />;
    }
}
