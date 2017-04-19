// @flow
import React, {PropTypes} from 'react';
import SpruceClassName from '../../util/SpruceClassName';
import StampyPropTypes from '../../decls/PropTypes';

/**
 * @module Inputs
 */

/**
 * @component
 *
 * `Textarea` is a simple component that displays a textarea.
 * It does not keep state.
 *
 * @example
 * return <Textarea type='text' onChange={(val) => doStuff(val)}/>
 */

function Textarea(props: TextareaProps): React.Element<any> {
    const {
        className,
        disabled,
        textareaProps,
        modifier,
        onChange,
        spruceName,
        type,
        value
    } = props;

    return <textarea
        {...textareaProps}
        className={SpruceClassName({name: spruceName, modifier, className})}
        disabled={disabled}
        onChange={(ee) => onChange && onChange(ee.target.value, {event: ee, element: ee.target})}
        type={type}
        value={value}
    />;
}

Textarea.propTypes = {
    /** {ClassName} */
    className: StampyPropTypes.className,
    /** Set to true to disable the textarea. When disabled `onChange` will no longer be called when the textarea changes */
    disabled: PropTypes.bool,
    /** {HtmlProps} */
    textareaProps: StampyPropTypes.htmlProps,
    /** {SpruceModifier} */
    modifier: StampyPropTypes.spruceModifier,
    /** {OnChange} */
    onChange: StampyPropTypes.onChange,
    /** {SpruceName} */
    spruceName: StampyPropTypes.spruceName,
    /** HTML type attribute for the textarea */
    type: PropTypes.string,
    /** The string to show in the textarea */
    value: PropTypes.string
};

Textarea.defaultProps = {
    className: '',
    disabled: false,
    textareaProps: {},
    modifier: '',
    spruceName: 'Textarea',
    type: 'text',
    value: ''
}

type TextareaProps = {
    className?: string,
    disabled?: boolean,
    textareaProps?: Object,
    modifier?: SpruceModifier,
    onChange?: OnChange,
    spruceName?: string,
    type?: string,
    value?: boolean
};

export default Textarea;
