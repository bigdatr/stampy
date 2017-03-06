// @flow
import React from 'react';
import ReactSelect from 'react-select';
import SpruceClassName from '../../util/SpruceClassName';
import StampyPropTypes from '../../decls/PropTypes';

type SelectProps = {
    className?: string,
    clearable: ?boolean,
    disabled: ?boolean,
    modifier?: SpruceModifier,
    multi: ?boolean,
    onChange: OnChangeMulti,
    options: Object[],
    placeholder: ?string,
    spruceName?: string,
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
 * @prop {boolean} [clearable]
 * @prop {boolean} [disabled]
 * @prop {boolean} [multi]
 * @prop {OnChange|OnChangeMulti} [onChange]
 * @prop {Object[]} [options]
 * @prop {string} [placeholder]
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
        onChange,
        className,
        modifier,
        spruceName: name
    } = props;

    const modifiedOnChange: Function = multi
        ? (options, meta) => onChange(options.map(ii => ii.value), meta)
        : (option, meta) => onChange(option && option.value, meta);

    return <ReactSelect
        {...props}
        className={SpruceClassName({name, modifier, className})}
        onChange={modifiedOnChange}
    />;
}

Select.propTypes = {
    /** {ClassName} */
    className: StampyPropTypes.className,
    clearable: React.PropTypes.bool,
    disabled: React.PropTypes.bool,
    /** {SpruceModifier} */
    modifier: StampyPropTypes.spruceModifier,
    multi: React.PropTypes.bool,
    onChange: React.PropTypes.func,
    options: React.PropTypes.arrayOf(
        React.PropTypes.shape({
            value: React.PropTypes.string,
            label: React.PropTypes.string
        })
    ),
    placeholder: React.PropTypes.string,
    /** {SpruceName} */
    spruceName: StampyPropTypes.spruceName,
    value: React.PropTypes.any
};

Select.defaultProps = {
    spruceName: 'Select'
};

export default Select;
