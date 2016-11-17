// @flow
import React from 'react';
import ComponentClassName from '../../util/ComponentClassName';
import RemoveProps from '../../util/RemoveProps';

/**
 * @module Component
 */

type ButtonProps = {
    className: ?string,
    disabled: ?boolean,
    modifier: ?string,
    onClick: Function,
    type: ?string,
}

/**
 * `Button` is a simple component that displays a button.
 * It does not keep state.
 *
 * @param {Object} props
 * @param {String} [props.className] Class names to be directly applied to the button
 * @param {boolean} [props.disabled] Set to true to disable the button, and onClick calls will no longer be called when clicked
 * @param {String} [props.modifier] Spruce modifers
 * @param {Function} [props.onClick] Function to be called when clicked
 * @param {String} [props.type = button] HTML button type
 *
 * @example
 * return <Button>Button text</Button>
 */

function Button(props: ButtonProps): React.Element<any> {
    const {
        modifier,
        className,
        disabled
    } = props;

    const propsToRemove = {
        modifier: true,
        onClick: !!disabled // explicity removs onClick when disabled in case underlying elements change from using a <button>
    };
    const filteredProps: Object = RemoveProps(propsToRemove, props);

    return <button
        {...filteredProps}
        className={ComponentClassName({name: 'Button', modifier, className})}
    />;
}

Button.defaultProps = {
    className: '',
    modifier: '',
    type: 'button'
}

export default Button;
