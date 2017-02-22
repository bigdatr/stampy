// @flow
import React, {PropTypes} from 'react';
import SpruceClassName from '../../util/SpruceClassName';
import StampyPropTypes from '../../types/PropTypes';

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
        htmlProps,
        modifier,
        onChange,
        spruceName,
        type,
        value
    } = props;

    return <input
        {...htmlProps}
        className={SpruceClassName({name: spruceName, modifier, className})}
        disabled={disabled}
        onChange={(ee) => onChange && onChange(ee.target.value, {event: ee, element: ee.target})}
        type={type}
        value={value}
    />;
}

Input.propTypes = {
    /** {ClassName} */
    className: StampyPropTypes.className,
    /** Set to true to disable the toggle. When disabled `onChange` will no longer be called when the input changes */
    disabled: PropTypes.bool,
    /** {HtmlProps} */
    htmlProps: StampyPropTypes.htmlProps,
    /** {SpruceModifier} */
    modifier: StampyPropTypes.spruceModifier,
    /** {OnChange} */
    onChange: StampyPropTypes.onChange,
    /** {SpruceName} */
    spruceName: StampyPropTypes.spruceName,
    /** HTML type attribute for the input */
    type: PropTypes.string,
    /** The string to show in the input */
    value: PropTypes.string
};

Input.defaultProps = {
    className: '',
    disabled: false,
    htmlProps: {},
    modifier: '',
    spruceName: 'Input',
    type: 'text',
    value: ''
}

type InputProps = {
    className?: string,
    disabled?: boolean,
    htmlProps?: Object,
    modifier?: SpruceModifier,
    onChange?: OnChange,
    spruceName?: string,
    type?: string,
    value?: boolean
};

export default Input;
