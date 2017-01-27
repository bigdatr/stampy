// @flow
import React from 'react';
import ReactSelect from 'react-select';
import SpruceClassName from '../../util/SpruceClassName';

type SelectProps = {
    multi: ?boolean,
    onChange: OnChange|OnChangeMulti,
    options: Object[],
    value: any
}

/**
 * @module Inputs
 */


/**
 * @component
 *
 * `Select` is a small wrapper around [react-select](https://github.com/JedWatson/react-select).
 *
 * @prop {Boolean} [multi]
 * Toggles the between single and multi select mode.
 * Multiselect onChange will return an array to `newValue`
 *
 * @prop {OnChange|OnChangeMulti} [onChange]
 * @prop {Object[]} [options]
 * @prop {any} [value]
 *
 * @example
 * const options = [
 *     {
 *         value: 'foo',
 *         label: 'Foo'
 *     },
 *     {
 *         value: 'bar',
 *         label: 'Bar'
 *     }
 * ]
 * return <Select onChange={(val) => doStuff(val)} options={options}/>
 */

function Select(props: SelectProps): React.Element<any> {
    const {
        multi,
        onChange
    } = props;

    const modifiedOnChange: Function = multi
        ? (options, meta) => onChange(options.map(ii => ii.value), meta)
        : (option, meta) => onChange(option && option.value, meta);

    return <ReactSelect
        {...props}
        onChange={modifiedOnChange}
    />;
}

Select.propTypes = {
    multi: React.PropTypes.bool,
    onChange: React.PropTypes.func,
    options: React.PropTypes.array.isRequired,
    value: React.PropTypes.any
}

export default Select;
