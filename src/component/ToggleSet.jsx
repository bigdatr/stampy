// @flow
import React from 'react';
import type {Element} from 'react';
import {List, OrderedSet} from 'immutable';
import {Set} from 'immutable';
import SpruceClassName from '../util/SpruceClassName';
import Toggle from './Toggle';

/**
 * @module Inputs
 */

/**
 * @component
 *
 * `ToggleSet` is a set of `Toggle`s that allow selections from a set,
 * and optionally mutiple selections.
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
 *     },
 *     {
 *         value: 'baz',
 *         label: 'Baz'
 *     }
 * ]
 *
 * // allows the user to make a single selection of
 * // foo, bar or baz
 * <ToggleSet
 *   onChange={(value) => doStuff(value)}
 *   options={options}
 * />
 *
 * // allows the user to make a single selection of
 * // foo, bar, baz, or none
 * <ToggleSet
 *   onChange={(value) => doStuff(value)}
 *   options={options}
 *   clearable
 * />
 *
 * // allows the user to make any number of selections of
 * // foo, bar or baz, or none (clearable is not required for multiple)
 * <ToggleSet
 *   onChange={(valueArray) => doStuff(valueArray)}
 *   options={options}
 *   multi
 * />
 */

type ToggleOption = {
    disabled?: boolean,
    label: string,
    value: string
};

type Props = {
    className: string, // {ClassName}
    clearable: boolean, // Boolean indicating if the selection can be cleared
    disabled: boolean, // Set to true to disable the toggle set. When disabled, `onChange` will no longer be called when the value changes
    modifier: SpruceModifier, // ${SpruceModifier}
    multi: boolean, // Boolean indicating if more than one selected item at once
    onChange?: (newValues: Array<string>|string, meta: OnChangeMeta) => void, // ${OnChange}
    options: ToggleOption[], // The options that the user can select. Each will appear as a toggle
    peer: string, // ${SprucePeer}
    parent: string, // ${SpruceParent}
    spruceName: string, // {SpruceName}
    style: Object, // React style object to apply to the rendered HTML element
    toggleProps: Object, // Attributes applied to the component's <div> HTML element
    toggleSetProps?: Object, // Attributes applied each toggle component's <button> HTML element
    toggleSpruceName: string, // The spruce name used by each toggle in the toggle set
    toggleModifier: SpruceModifier, // The spruce modifiers applied to each toggle in the toggle set
    value?: string|Array<string> /**
     * The values that have been selected. Under normal usage these should correspond to values in the `options` array.
     * When `multi=false` this expects a string or boolean, or when `multi=true` this expects an array of strings or booleans.
     */
};


export default class ToggleSet extends React.Component<Props> {
    static defaultProps = {
        className: '',
        clearable: false,
        disabled: false,
        modifier: '',
        multi: false,
        parent: '',
        peer: '',
        spruceName: 'ToggleSet',
        style: {},
        toggleProps: {},
        toggleSetProps: {},
        toggleSpruceName: 'ToggleSet_toggle',
        toggleModifier: ''
    };

    render(): Element<*> {
        const {
            className,
            clearable,
            disabled: componentDisabled,
            toggleProps,
            toggleSetProps,
            modifier,
            multi,
            onChange,
            options,
            parent,
            peer,
            spruceName,
            style,
            toggleSpruceName,
            toggleModifier,
            value
        } = this.props;

        const selection: Set<*> = multi
            ? OrderedSet(value)
            : typeof value == "string" || typeof value == "boolean"
                ? OrderedSet([value])
                : OrderedSet();

        const toggles: Array<Element<*>> = List(options)
            .map((option: ToggleOption, index: number): Element<*> => {
                const {
                    label,
                    value,
                    disabled
                } = option;

                const toggleOnChange = (added: boolean, meta: OnChangeMeta) => {
                    if(!onChange) {
                        return;
                    }
                    if(multi) {
                        const newSelection: Set<*> = added
                            ? selection.add(value)
                            : selection.delete(value);

                        onChange(newSelection.toArray(), meta);
                        return;
                    }
                    if(clearable && !added) {
                        onChange("", meta);
                        return;
                    }
                    if(added) {
                        onChange(value, meta);
                    }
                };

                return <Toggle
                    children={label}
                    disabled={disabled || componentDisabled}
                    onChange={toggleOnChange}
                    toggleProps={toggleProps}
                    spruceName={toggleSpruceName}
                    modifier={typeof toggleModifier == "function" ? toggleModifier(option, index) : toggleModifier}
                    value={selection.has(value)}
                    key={index}
                />;
            })
            .toArray();

        return <div
            {...toggleSetProps}
            className={SpruceClassName({name: spruceName, modifier, className, parent, peer})}
            children={toggles}
            style={style}
        />;
    }
}
