// @flow
import React, {PropTypes} from 'react';
import {List, Set} from 'immutable';
import SpruceClassName from '../../util/SpruceClassName';
import StampyPropTypes from '../../decls/PropTypes';
import Toggle from '../toggle/Toggle';

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

function ToggleSet(props: ToggleSetProps): React.Element<any> {
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
        spruceName,
        toggleSpruceName,
        toggleModifier,
        value
    } = props;

    const selection: Set<string> = multi
        ? Set(value)
        : typeof value == "string" || typeof value == "boolean"
            ? Set([value])
            : Set();

    const toggles: Array<React.Element<any>> = List(options)
        .map(({label, value, disabled}) => {

            const toggleOnChange = (added: boolean, meta: OnChangeMeta) => {
                if(!onChange) {
                    return;
                }
                if(multi) {
                    const newSelection: Set<string> = added
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
                modifier={toggleModifier}
                value={selection.has(value)}
            />;
        })
        .toArray();

    return <div
        {...toggleSetProps}
        className={SpruceClassName({name: spruceName, modifier, className})}
        children={toggles}
    />;
}

ToggleSet.propTypes = {
    /** {ClassName} */
    className: StampyPropTypes.className,
    /** Controls if the selection is clearable i.e. the user can choose to select no items. */
    clearable: PropTypes.bool,
    /** Set to true to disable the toggle set. When disabled the user cannot change the state of the `ToggleSet` */
    disabled: PropTypes.bool,
    /** {Object} An object of attributes to be applied to the HTML tags of each of the toggles created by this component. */
    toggleProps: StampyPropTypes.htmlProps,
    /** {HtmlProps} */
    toggleSetProps: StampyPropTypes.htmlProps,
    /** {SpruceModifier} */
    modifier: StampyPropTypes.spruceModifier,
    /** Set to true to allow the user to select more than one option at once. When `multi=true` the first argument of `onChange` will be an array of selected options. */
    multi: PropTypes.bool,
    /** {OnChangeMulti} */
    onChange: StampyPropTypes.onChangeMulti,
    /** The options that the user can select. Each will appear as a toggle. */
    options: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.string,
            label: PropTypes.string
        })
    ).isRequired,
    /** {SpruceName} */
    spruceName: StampyPropTypes.spruceName,
    /** {string} The spruce name used by each toggle in the toggle set */
    toggleSpruceName: StampyPropTypes.spruceName,
    /** {SpruceModifier} The spruce modifier used by each toggle in the toggle set */
    toggleModifier: StampyPropTypes.spruceModifier,
    /**
     * The values that have been selected. Under normal usage these should correspond to values in the `options` array.
     * When `multi=false` this expects a string or boolean, or when `multi=true` this expects an array of strings or booleans.
     */
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
        PropTypes.arrayOf(
            PropTypes.string,
            PropTypes.bool,
        )
    ])
}

ToggleSet.defaultProps = {
    className: '',
    toggleSetProps: {},
    modifier: '',
    spruceName: 'ToggleSet',
    toggleSpruceName: 'ToggleSet_toggle'
}

type ToggleSetProps = {
    className?: string,
    clearable?: boolean,
    disabled?: boolean,
    toggleProps?: Object,
    toggleSetProps?: Object,
    modifier?: SpruceModifier,
    multi?: boolean,
    onChange?: OnChangeMulti,
    options: Object[],
    spruceName?: string,
    toggleSpruceName?: string,
    toggleModifier?: SpruceModifier,
    value?: string|Array<string>
}

export default ToggleSet;
