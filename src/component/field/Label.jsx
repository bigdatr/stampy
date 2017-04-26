// @flow
import PropTypes from 'prop-types';
import React from 'react';
import SpruceClassName from '../../util/SpruceClassName';
import StampyPropTypes from '../../decls/PropTypes';

/**
 * @module Components
 */

/**
 * @component
 *
 * `Label` is a simple component that displays a label.
 *
 * @example
 * return <Label htmlFor='something'>Label for thing</Label>
 */

function Label(props: LabelProps): React.Element<any> {
    const {
        children,
        className,
        htmlFor,
        labelProps,
        modifier,
        spruceName
    } = props;

    return <label
        {...labelProps}
        htmlFor={htmlFor}
        className={SpruceClassName({name: spruceName, modifier, className})}
        children={children}
    />;
}

Label.propTypes = {
    /** {ClassName} */
    className: StampyPropTypes.className,
    /** The id of the input HTML element this label corresponds to. */
    htmlFor: PropTypes.string,
    /** {HtmlProps} */
    labelProps: StampyPropTypes.htmlProps,
    /** {SpruceModifier} */
    modifier: StampyPropTypes.spruceModifier,
    /** {SpruceName} */
    spruceName: StampyPropTypes.spruceName
};

Label.defaultProps = {
    className: '',
    labelProps: {},
    modifier: '',
    spruceName: 'Label'
};

type LabelProps = {
    children?: React.Element<*>,
    className?: string,
    htmlFor?: string,
    labelProps?: Object,
    modifier?: SpruceModifier,
    spruceName?: string
};

export default Label;
