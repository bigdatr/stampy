// @flow
import React from 'react';
import ComponentClassName from '../../util/ComponentClassName';
import RemoveProps from '../../util/RemoveProps';
import Button from '../../component/button/Button';

type ToggleProps = {
    className: ?string,
    disabled: ?boolean,
    modifier: Modifier,
    onChange: OnChange,
    onClick: OnClick,
    type: ?string,
    value: ?boolean
}

/**
 * @module Input
 */

/**
 *
 * `Toggle` is a simple input component that works like a checkbox.
 * Its value is a boolean.
 *
 * @param {Object} props
 * @param {String} [props.className] Class names to be directly applied to the toggle
 * @param {boolean} [props.disabled] Set to true to disable the toggle, and onClick calls will no longer be called when clicked
 * @param {Modifier} [props.modifier]
 * @param {OnChange} [props.onChange]
 * @param {OnClick} [props.onClick]
 * @param {String} [props.type = toggle] HTML toggle type
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
        value,
        onChange
    } = props;

    return <Button
        {...RemoveProps(['value'], props)}
        type="button"
        onClick={ii => onChange && onChange(!value)}
        modifier={{active: !!value}}
    />;
}

Toggle.defaultProps = {
    className: '',
    modifier: '',
    value: false
}

export default Toggle;
