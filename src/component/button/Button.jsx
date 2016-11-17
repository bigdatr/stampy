// @flow
import React from 'react';
import ComponentClassName from '../../util/ComponentClassName';
import RemoveProps from '../../util/RemoveProps';

/**
 * @module Component
 */

type ButtonProps = {
    onClick: Function,
    className: ?string,
    modifier: ?string,
    type: ?string,
    disabled: ?boolean
}

/**
 *
 * `Button` is a simple component that displays a button.
 * It does not keep state.
 *
 * @example
 * return <Button>Button text</Button>
 *
 */
function Button(props: ButtonProps): React.Element<any> {
    const {
        modifier,
        className,
        disabled
    } = props;

    const propsToRemove = {
        modifier: true,
        onClick: !!disabled
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
