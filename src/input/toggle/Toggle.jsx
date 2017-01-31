// @flow
import React from 'react';
import SpruceClassName from '../../util/SpruceClassName';
import RemoveProps from '../../util/RemoveProps';

type ToggleProps = {
    className: ?string,
    disabled: ?boolean,
    modifier: Modifier,
    onChange: OnChange,
    spruceName: string,
    value: ?boolean
}

/**
 * @module Inputs
 */

/**
 * @component
 *
 * `Toggle` is a simple input component that works like a checkbox.
 * Its value is a boolean. It defaults to false.
 *
 * @prop {boolean} [value = false] Boolean indicating if the toggle should be active or not
 * @prop {OnChange} [onChange]
 * @prop {boolean} [disabled] Set to true to disable the toggle, and onClick calls will no longer be called when clicked
 * @prop {ClassName} [className]
 * @prop {Modifier} [modifier]
 * @prop {string} [spruceName = "Toggle"]
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
        spruceName,
        value
    } = props;

    const propsToRemove = [
        'modifier',
        'onClick',
        'spruceName',
        'value'
    ];

    const filteredProps: Object = RemoveProps(propsToRemove, props);

    return <button
        {...filteredProps}
        className={SpruceClassName({name: spruceName, modifier, className}, {'Toggle-active': !!value})}
        onClick={ee => !disabled && onChange && onChange(!value, {event: ee, element: ee.target})}
        type="button"
    />;
}

Toggle.defaultProps = {
    className: '',
    modifier: '',
    spruceName: 'Toggle',
    value: false
}

export default Toggle;
