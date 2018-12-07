// @flow
import React from 'react';
import type {Element} from 'react';
import SpruceClassName from '../util/SpruceClassName';
import ReactSelect from 'react-select';

type SelectOption = {
    disabled?: boolean,
    label: string,
    value: string
};

type Props = {
    className: string, // {ClassName}
    clearable?: boolean, // Boolean indicating if the selection can be cleared
    disabled?: boolean, // Set to true to disable the select. When disabled, `onChange` will no longer be called when the value changes
    modifier: SpruceModifier, // ${SpruceModifier}
    multi?: boolean, // Boolean indicating if more than one selected item at once
    onChange?: OnChangeMulti, // ${OnChange}
    options: SelectOption[], // Array of options that the user can select from
    parent: string, // ${SpruceParent}
    peer: string, // ${SprucePeer}
    placeholder?: string, // {Placeholder}
    spruceName: string, // {SpruceName}
    style: Object, // React style object to apply to the rendered HTML element
    value?: string|Array<string>, // {Value}
    valueKey?: string // key that locates the collections primary value
};

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
 * @prop {string} [valueKey]
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

export default class Select extends React.Component<Props> {
    static defaultProps = {
        className: '',
        modifier: '',
        peer: '',
        spruceName: 'Select',
        valueKey: 'value',
        style: {}
    };

    render(): Element<*> {
        const {
            multi,
            onChange,
            className,
            modifier,
            parent,
            peer,
            spruceName: name,
            style,
            valueKey
        } = this.props;

        const modifiedOnChange: Function = multi
            ? (options, meta) => onChange && onChange(options.map(ii => ii[valueKey]), meta)
            : (option, meta) => onChange && onChange(option && option[valueKey], meta);

        return <ReactSelect
            {...this.props}
            className={SpruceClassName({name, modifier, className, parent, peer})}
            onChange={modifiedOnChange}
            style={style}
        />;
    }
}
