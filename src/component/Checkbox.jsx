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
 * `Checkbox` is a simple component that displays an checkbox.
 * It does not keep state. Its value is a boolean.
 *
 * @example
 * return <Checkbox type='text' onChange={(val) => doStuff(val)}/>
 */

type Props = {
    className: string, // {ClassName}
    disabled: boolean, // Set to true to disable the checkbox. When disabled, `onChange` will no longer be called when the checkbox is toggled
    inputProps: Object, // Attributes applied to the component's <input> HTML element
    modifier: SpruceModifier, // {SpruceModifier}
    name?: string, // HTML name attribute for the checkbox
    onChange?: OnChange, // {OnChange}
    parent: string, // ${SpruceParent}
    peer: string, // {SprucePeer}
    spruceName: string, // {SpruceName}
    style: Object, // React style object to apply to the rendered HTML element
    value?: boolean // Boolean value
};

export default class Checkbox extends React.Component<Props> {
    static defaultProps = {
        className: '',
        disabled: false,
        inputProps: {},
        modifier: '',
        parent: '',
        peer: '',
        spruceName: 'Checkbox',
        style: {},
        value: false
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
            value
        } = this.props;

        const additionalClassNames: Object = {
            // $FlowFixMe: flow doesnt seem to know that vars passed into template strings are implicitly cast to strings
            [`${spruceName}-active`]: !!value,
            // $FlowFixMe: flow doesnt seem to know that vars passed into template strings are implicitly cast to strings
            [`${spruceName}-disabled`]: disabled
        };

        return <input
            disabled={disabled}
            name={name}
            type="checkbox"
            {...inputProps}
            className={SpruceClassName({name: spruceName, modifier, className, parent, peer}, additionalClassNames)}
            onChange={(ee) => onChange && !disabled && onChange(!!(ee.target.checked), {event: ee, element: ee.target})}
            checked={!!value}
            style={style}
        />;
    }
}
