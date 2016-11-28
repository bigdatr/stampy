// @flow
import React from 'react';
import SpruceClassName from '../../util/SpruceClassName';
import RemoveProps from '../../util/RemoveProps';

type ToggleProps = {
    className: ?string,
    disabled: ?boolean,
    modifier: Modifier,
    onChange: OnChange,
    value: ?boolean
}

/**
 * @module Inputs
 */

/**
 *
 * `Toggle` is a simple input component that works like a checkbox.
 * Its value is a boolean. It defaults to false.
 *
 * @param {Object} props
 * @param {ClassName} [props.className]
 * @param {boolean} [props.disabled] Set to true to disable the toggle, and onClick calls will no longer be called when clicked
 * @param {Modifier} [props.modifier]
 * @param {OnChange} [props.onChange]
 * @param {boolean} [props.value = false] Boolean indicating if the toggle should be active or not
 *
 * @example
 * return <Toggle
 *    value={yourBoolean}
 *    onChange={onChangeFunction}
 * >Toggle text</Toggle>
 *
 * @category ControlledComponent
 */

function Toggle(props: ToggleProps): React.Element<any> {
    const {
        className,
        disabled,
        modifier,
        onChange,
        value
    } = props;

    const propsToRemove = [
        'value',
        'modifier',
        'onClick'
    ];

    const filteredProps: Object = RemoveProps(propsToRemove, props);

    return <button
        {...filteredProps}
        className={SpruceClassName({name: 'Toggle', modifier, className}, {'Toggle-active': !!value})}
        onClick={ee => !disabled && onChange && onChange(!value, {event: ee, element: ee.target})}
        type="button"
    />;
}

Toggle.defaultProps = {
    className: '',
    modifier: '',
    value: false
}

export default Toggle;
