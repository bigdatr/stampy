// @flow
import React from 'react';
import type {ChildrenArray, Element} from 'react';
import SpruceClassName from '../util/SpruceClassName';

/**
 * @module Inputs
 */

/**
 * @component
 *
 * `Toggle` is a simple input component that works like a checkbox.
 * Its value is a boolean. It defaults to `false`.
 *
 * @example
 * return <Toggle
 *    value={yourBoolean}
 *    onChange={(value) => doSomething(value)}
 * >Toggle text</Toggle>
 *
 * @category ControlledComponent
 */

type Props = {
    children?: ChildrenArray<*>,
    className: string, // {ClassName}
    disabled: boolean, // Set to true to disable the input. When disabled, `onChange` will no longer be called when the input changes
    modifier: SpruceModifier, // {SpruceModifier}
    onChange?: (newValue: boolean, meta: OnChangeMeta) => void, // {OnChange}
    peer: string, // {SprucePeer}
    parent: string, // ${SpruceParent}
    placeholder?: string, // {Placeholder}
    spruceName: string, // {SpruceName}
    style: Object, // React style object to apply to the rendered HTML element
    toggleProps: Object, // Attributes applied to the component's <button> HTML element
    value?: boolean // Boolean indicating if the toggle should be active or not
};

export default class Toggle extends React.Component<Props> {
    static defaultProps = {
        className: '',
        disabled: false,
        modifier: '',
        peer: '',
        parent: '',
        spruceName: 'Toggle',
        style: {},
        toggleProps: {},
        value: false
    };

    render(): Element<*> {
        const {
            children,
            className,
            disabled,
            modifier,
            onChange,
            parent,
            peer,
            spruceName,
            style,
            toggleProps,
            value
        } = this.props;

        const additionalClassNames: Object = {
            // $FlowFixMe: flow doesnt seem to know that vars passed into template strings are implicitly cast to strings
            [`${spruceName}-active`]: !!value,
            // $FlowFixMe: flow doesnt seem to know that vars passed into template strings are implicitly cast to strings
            [`${spruceName}-disabled`]: disabled
        };

        return <button
            {...toggleProps}
            className={SpruceClassName({name: spruceName, modifier, className, parent, peer}, additionalClassNames)}
            disabled={disabled}
            onClick={ee => !disabled && onChange && onChange(!value, {event: ee, element: ee.target})}
            type="button"
            children={children}
            style={style}
        />;
    }
}
