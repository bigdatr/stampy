// @flow
import React from 'react';
import type {ChildrenArray, Element} from 'react';
import SpruceClassName from '../util/SpruceClassName';

/**
 * @module Components
 */

/**
 * @component
 *
 * `Button` is a simple component that displays a button.
 * It does not keep state.
 *
 * @example
 * return <Button>Button text</Button>
 */

type Props = {
    buttonProps: Object, // {HtmlProps}
    children?: ChildrenArray<*>,
    className: string, // {ClassName}
    disabled: boolean, // Set to true to disable the button, and `onClick` calls will no longer be called when clicked.
    modifier: SpruceModifier, // {SpruceModifier}
    onClick?: OnClick, // {OnClick}
    parent: string, // ${SpruceParent}
    peer: string, // {SprucePeer}
    spruceName: string, // {SpruceName}
    style: Object, // React style object to apply to the rendered HTML element
    type: string // HTML button type
};

export default class Button extends React.Component<Props> {
    static defaultProps = {
        buttonProps: {},
        className: '',
        disabled: false,
        modifier: '',
        parent: '',
        peer: '',
        spruceName: 'Button',
        style: {},
        type: 'button'
    };

    render(): Element<any> {
        const {
            buttonProps,
            children,
            className,
            disabled,
            modifier,
            onClick,
            parent,
            peer,
            spruceName,
            style,
            type
        } = this.props;

        const additionalClassNames: Object = {
            // $FlowFixMe: flow doesnt seem to know that vars passed into template strings are implicitly cast to strings
            [`${spruceName}-disabled`]: disabled
        };

        return <button
            {...buttonProps}
            children={children}
            className={SpruceClassName({name: spruceName, modifier, className, parent, peer}, additionalClassNames)}
            disabled={disabled}
            onClick={!disabled && onClick}
            type={type}
            style={style}
        />;
    }
}
