// @flow
import React from 'react';
import SpruceClassName from '../../util/SpruceClassName';
import RemoveProps from '../../util/RemoveProps';

type InputProps = {
    className: ?string,
    modifier: SpruceModifier,
    onChange: OnChange,
    spruceName: string,
    type: ?string
}

/**
 * @module Inputs
 */


/**
 * @component
 *
 * `Input` is a simple component that displays an input.
 * It does not keep state.
 *
 * @prop {OnChange} [onChange]
 * @prop {ClassName} [className]
 * @prop {SpruceModifier} [modifier]
 * @prop {string} [spruceName = "Input"]
 * @prop {String} [type = "button"] Input type
 *
 * @example
 * return <Input type='text' onChange={(val) => doStuff(val)}/>
 */

function Input(props: InputProps): React.Element<any> {
    const {
        modifier,
        className,
        spruceName
    } = props;

    const propsToRemove = ['modifier', 'spruceName'];

    const filteredProps: Object = RemoveProps(propsToRemove, props);

    return <input
        {...filteredProps}
        onChange={(ee) => props.onChange && props.onChange(ee.target.value, {event: ee, element: ee.target})}
        className={SpruceClassName({name: spruceName, modifier, className})}
    />;
}

Input.defaultProps = {
    className: '',
    modifier: '',
    spruceName: 'Input',
    type: 'text'
}

export default Input;
