// @flow
import React, {PropTypes} from 'react';
import SpruceClassName from '../../util/SpruceClassName';
import StampyPropTypes from '../../decls/PropTypes';

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

function Toggle(props: ToggleProps): React.Element<any> {
    const {
        children,
        className,
        disabled,
        modifier,
        onChange,
        spruceName,
        toggleProps,
        value
    } = props;

    const additionalClassNames: Object = {
        // $FlowFixMe: flow doesnt seem to know that vars passed into template strings are implicitly cast to strings
        [`${spruceName}-active`]: !!value
    };

    return <button
        {...toggleProps}
        className={SpruceClassName({name: spruceName, modifier, className}, additionalClassNames)}
        disabled={disabled}
        onClick={ee => !disabled && onChange && onChange(!value, {event: ee, element: ee.target})}
        type="button"
        children={children}
    />;
}

Toggle.propTypes = {
    /** {ClassName} */
    className: StampyPropTypes.className,
    /** Set to true to disable the toggle. When disabled `onChange` will no longer be called when clicked */
    disabled: PropTypes.bool,
    /** {SpruceModifier} */
    modifier: StampyPropTypes.spruceModifier,
    /** {OnChangeBoolean} */
    onChange: StampyPropTypes.onChangeBoolean,
    /** {SpruceName} */
    spruceName: StampyPropTypes.spruceName,
    /** {HtmlProps} */
    toggleProps: StampyPropTypes.htmlProps,
    /** Boolean indicating if the toggle should be active or not */
    value: PropTypes.bool
};

Toggle.defaultProps = {
    className: '',
    disabled: false,
    toggleProps: {},
    modifier: '',
    spruceName: 'Toggle',
    value: false
};

type ToggleProps = {
    children?: React.Element<*>,
    className?: string,
    disabled?: boolean,
    modifier?: SpruceModifier,
    onChange?: OnChangeBoolean,
    spruceName?: string,
    toggleProps?: Object,
    value?: boolean
};

export default Toggle;
