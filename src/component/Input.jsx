// @flow
import PropTypes from 'prop-types';
import React from 'react';
import SpruceClassName from '../util/SpruceClassName';
import StampyPropTypes from '../decls/PropTypes';

/**
 * @module Inputs
 */

/**
 * @component
 *
 * `Input` is a simple component that displays an input.
 * It does not keep state.
 *
 * @example
 * return <Input type='text' onChange={(val) => doStuff(val)}/>
 */

function Input(props: InputProps): React.Element<any> {
    const {
        className,
        disabled,
        inputProps,
        modifier,
        name,
        onChange,
        spruceName,
        type,
        value,
        placeholder
    } = props;

    return <input
        disabled={disabled}
        name={name}
        placeholder={placeholder}
        type={type}
        {...inputProps}
        className={SpruceClassName({name: spruceName, modifier, className})}
        onChange={(ee) => onChange && onChange(ee.target.value, {event: ee, element: ee.target})}
        value={(value == null) ? '' : value}
    />;
}

Input.propTypes = {
    /** {ClassName} */
    className: StampyPropTypes.className,
    /** Set to true to disable the input. When disabled `onChange` will no longer be called when the input changes */
    disabled: PropTypes.bool,
    /** {HtmlProps} */
    inputProps: StampyPropTypes.htmlProps,
    /** {SpruceModifier} */
    modifier: StampyPropTypes.spruceModifier,
    /** HTML name attribute for the input */
    name: PropTypes.string,
    /** {OnChange} */
    onChange: StampyPropTypes.onChange,
    /** {SpruceName} */
    spruceName: StampyPropTypes.spruceName,
    /** HTML type attribute for the input */
    type: PropTypes.string,
    /** The string to show in the input */
    value: PropTypes.string,
    /** The placeholder text to show in the input when there is no value */
    placeholder: PropTypes.string
};

Input.defaultProps = {
    className: '',
    disabled: false,
    inputProps: {},
    modifier: '',
    name: '',
    spruceName: 'Input',
    type: 'text',
    value: ''
}

type InputProps = {
    className?: string,
    disabled?: boolean,
    inputProps?: Object,
    modifier?: SpruceModifier,
    name?: string,
    onChange?: OnChange,
    spruceName?: string,
    type?: string,
    value?: string,
    placeholder?: string
};

export default Input;
