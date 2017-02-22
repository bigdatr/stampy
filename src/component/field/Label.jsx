// @flow
import React, {PropTypes} from 'react';
import SpruceClassName from '../../util/SpruceClassName';
import StampyPropTypes from '../../types/PropTypes';

/**
 * @module Components
 */

/**
 * @component
 *
 * `Label` is a simple component that displays a label.
 *
 * @prop {ClassName} [className]
 * @prop {SpruceModifier} [modifier]
 * @prop {string} [spruceName = "Label"]
 *
 * @example
 * return <Label for='something'>Label for thing</Label>
 */

function Label(props: LabelProps): React.Element<any> {
    const {
        children,
        className,
        htmlFor,
        htmlProps,
        modifier,
        spruceName
    } = props;

    return <label
        {...htmlProps}
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
    htmlProps: StampyPropTypes.htmlProps,
    /** {SpruceModifier} */
    modifier: StampyPropTypes.spruceModifier,
    /** {SpruceName} */
    spruceName: StampyPropTypes.spruceName
};

Label.defaultProps = {
    className: '',
    htmlProps: {},
    modifier: '',
    spruceName: 'Label'
};

type LabelProps = {
    children?: React.Element<*>,
    className?: string,
    htmlFor?: string,
    htmlProps?: Object,
    modifier?: SpruceModifier,
    spruceName?: string
};

export default Label;
