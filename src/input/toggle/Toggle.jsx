// @flow
import React, {PropTypes} from 'react';
import SpruceClassName from '../../util/SpruceClassName';
import {StampyPropTypes} from '../../types/Types';

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
        htmlProps,
        modifier,
        onChange,
        spruceName,
        value
    } = props;

    return <button
        {...htmlProps}
        className={SpruceClassName({name: spruceName, modifier, className}, {[`${spruceName}-active`]: !!value})}
        disabled={disabled}
        onClick={ee => !disabled && onChange && onChange(!value, {event: ee, element: ee.target})}
        type="button"
        children={children}
    />;
}

Toggle.propTypes = {
    /** {ClassName} */
    className: StampyPropTypes.className,
    /** Set to true to disable the toggle. When disabled `onClick` will no longer be called when clicked */
    disabled: PropTypes.bool,
    /** {HtmlProps} */
    htmlProps: StampyPropTypes.htmlProps,
    /** {SpruceModifier} */
    modifier: StampyPropTypes.spruceModifier,
    /** {OnChangeMulti} */
    onChange: StampyPropTypes.onChangeMulti,
    /** {SpruceName} */
    spruceName: StampyPropTypes.spruceName,
    /** Boolean indicating if the toggle should be active or not */
    value: PropTypes.bool
};

type ToggleProps = {
    children: ?React.Element<*>,
    className: ?string,
    disabled: ?boolean,
    htmlProps: ?Object,
    modifier: SpruceModifier,
    onChange: OnChange,
    spruceName: string,
    value: ?boolean
};

Toggle.defaultProps = {
    className: '',
    disabled: false,
    modifier: '',
    spruceName: 'Toggle',
    value: false
};

export default Toggle;
