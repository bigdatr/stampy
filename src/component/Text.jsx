// @flow
import React from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';
import moment from 'moment';
import SpruceClassName from '../util/SpruceClassName';
import StampyPropTypes from '../decls/PropTypes';

/**
 * @module Components
 */

/**
 * @component
 *
 * `Text` is a Goose compliant component for general purpose text rendering.
 *
 * _**Note:** `numberFormat` & `dateFormat` will only work if the children are either strings, numbers or dates._
 *
 * @example
 * <Text>Plain Text</Text>
 * <Text modifier="hero" element="a">Hero Link</Text>
 * <Text numberFormat="0,0">{props.number}</Text>
 * <Text numberFormat="YYYY-MM-DD">{props.date}</Text>
 *
 * <Text modifier="alpha">
 *     <Text element="strong">Date: </Text>
 *     <Text dateFormat="YYYY-MM-DD">{props.date}</Text>
 * </Text>
 */

export default function Text(props: Object): React.Element<any> {
    const {
        spruceName = 'Text',
        modifier,
        numberFormat,
        dateFormat,
        className,
        onClick,
        style,
        element: Element = 'span'
    } = props;

    var children = props.children;

    if(numberFormat) {
        children = numeral(children).format(numberFormat);
    }

    if(dateFormat) {
        children = moment(new Date(children)).format(dateFormat);
    }

    return <Element
        className={SpruceClassName({name: spruceName, modifier, className})}
        style={style}
        onClick={onClick}
        children={children}
    />;
}

Text.propTypes = {
    /** {ClassName} */
    className: StampyPropTypes.className,

    /** {ReactElement} */
    element: StampyPropTypes.element,

    /** {SpruceModifier} */
    modifier: StampyPropTypes.spruceModifier,

    /** Numeral format string. Will cause children to be passed through [numeral.format](https://momentjs.com/docs/#/displaying/) */
    numberFormat: PropTypes.string,

    /** Moment format string. Will cause children to be cast to a Date and passed through [moment.format](https://momentjs.com/docs/#/displaying/) */
    dateFormat: PropTypes.string,

    /** {OnClick} */
    onClick: StampyPropTypes.onClick,

    /** {SpruceName} */
    spruceName: StampyPropTypes.spruceName,

    /** {Style} */
    style: StampyPropTypes.style
};
