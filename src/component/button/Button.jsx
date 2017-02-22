// @flow
import React, {PropTypes} from 'react';
import SpruceClassName from '../../util/SpruceClassName';
import StampyPropTypes from '../../types/PropTypes';

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
        children,
        className,
        disabled,
        htmlProps,
        modifier,
        onClick,
        spruceName,
        type
    } = props;

    return <button
        {...htmlProps}
        children={children}
        className={SpruceClassName({name: spruceName, modifier, className})}
        disabled={disabled}
        onClick={!disabled && onClick}
        type={type}
    />;
}

Button.propTypes = {
    /** {ClassName} */
    className: PropTypes.string,
    /** Set to true to disable the button, and `onClick` calls will no longer be called when clicked. */
    disabled: PropTypes.bool,
    /** {HtmlProps} */
    htmlProps: StampyPropTypes.htmlProps,
    /** {SpruceModifier} */
    modifier: StampyPropTypes.spruceModifier,
    /** OnClick */
    onClick: PropTypes.func,
    /** {SpruceName} */
    spruceName: PropTypes.string,
    /** HTML button type */
    type: PropTypes.string
};

Button.defaultProps = {
    className: '',
    disabled: false,
    htmlProps: {},
    modifier: '',
    spruceName: 'Button',
    type: 'button'
};

type ButtonProps = {
    children?: React.Element<*>,
    className?: string,
    disabled?: boolean,
    htmlProps?: Object,
    modifier?: SpruceModifier,
    onClick?: OnClick,
    spruceName?: string,
    type: ?string
};

export default Button;
