// @flow
import React from 'react';
import SpruceClassName from '../../util/SpruceClassName';
import RemoveProps from '../../util/RemoveProps';

type InputProps = {
    className: ?string,
    modifier: Modifier,
    onChange: Function,
    type: ?string
}

/**
 * @module Inputs
 */


/**
 * `Input` is a simple component that displays an input.
 * It does not keep state.
 *
 * @param {Object} props
 * @param {ClassName} [props.className]
 * @param {Modifier} [props.modifier]
 * @param {OnChange} [props.onChange]
 * @param {String} [props.type = button] Input type
 *
 * @example
 * return <Input type='text' onChange={(val)=>doStuff(val)}/>
 */

function Input(props: InputProps): React.Element<any> {
    const {
        modifier,
        className
    } = props;

    const propsToRemove = ['modifier'];

    const filteredProps: Object = RemoveProps(propsToRemove, props);

    return <input
        {...filteredProps}
        onChange={(ee) => props.onChange && props.onChange(ee.target.value, {event: ee, elem: ee.target})}
        className={SpruceClassName({name: 'Input', modifier, className})}
    />;
}

Input.defaultProps = {
    className: '',
    modifier: '',
    type: 'text'
}

export default Input;
