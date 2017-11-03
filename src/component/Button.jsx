// @flow
import PropTypes from 'prop-types';
import React from 'react';
import SpruceClassName from '../util/SpruceClassName';
import StampyPropTypes from '../decls/PropTypes';

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

function Button(props: ButtonProps): React.Element<any> {
    const {
        buttonProps,
        children,
        className,
        disabled,
        modifier,
        onClick,
        spruceName,
        type
    } = props;

    const additionalClassNames: Object = {
        // $FlowFixMe: flow doesnt seem to know that vars passed into template strings are implicitly cast to strings
        [`${spruceName}-disabled`]: disabled
    };

    return <button
        {...buttonProps}
        children={children}
        className={SpruceClassName({name: spruceName, modifier, className}, additionalClassNames)}
        disabled={disabled}
        onClick={!disabled && onClick}
        type={type}
    />;
}

Button.propTypes = {
    /** {HtmlProps} */
    buttonProps: StampyPropTypes.htmlProps,
    /** {ClassName} */
    className: PropTypes.string,
    /** Set to true to disable the button, and `onClick` calls will no longer be called when clicked. */
    disabled: PropTypes.bool,
    /** {SpruceModifier} */
    modifier: StampyPropTypes.spruceModifier,
    /** {OnClick} */
    onClick: PropTypes.func,
    /** {SpruceName} */
    spruceName: PropTypes.string,
    /** HTML button type */
    type: PropTypes.string
};

Button.defaultProps = {
    className: '',
    disabled: false,
    buttonProps: {},
    modifier: '',
    spruceName: 'Button',
    type: 'button'
};

type ButtonProps = {
    buttonProps?: Object,
    children?: React.Element<*>,
    className?: string,
    disabled?: boolean,
    modifier?: SpruceModifier,
    onClick?: OnClick,
    spruceName?: string,
    type: ?string
};

export default Button;