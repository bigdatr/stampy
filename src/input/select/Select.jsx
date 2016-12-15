// @flow
import React from 'react';
import ReactSelect from 'react-select';
import SpruceClassName from '../../util/SpruceClassName';
import RemoveProps from '../../util/RemoveProps';

type SelectProps = {
}

/**
 * @module Inputs
 */

/**
 * `Select` is a select.
 *
 * @category ControlledComponent
 */

function Select(props: SelectProps): React.Element<any> {
    const {
        multi,
        onChange
    } = props;

    const modifiedOnChange: Function = multi
        ? (options) => props.onChange(options.map(ii => ii.value))
        : (option) => props.onChange(option.value);

    return <ReactSelect
        {...props}
        onChange={modifiedOnChange}
    />;
}

export default Select;
