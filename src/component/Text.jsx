// @flow
import React from 'react';
import type {ChildrenArray, ComponentType, Element} from 'react';
import SpruceClassName from '../util/SpruceClassName';

// peer dependencies
let numeral = require('numeral');
let moment = require('moment');

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

type Props = {
    children?: ChildrenArray<*>,
    className: string, // {ClassName}
    dateFormat?: string, // Moment format string. Will cause children to be cast to a Date and passed through [moment.format](https://momentjs.com/docs/#/displaying/)
    element: ComponentType<*>, // Name of the HTML element to render as
    htmlProps: Object, // Object of HTML attributes to apply to the rendered element
    modifier: SpruceModifier, // {SpruceModifier}
    numberFormat?: string, // Numeral format string. Will cause children to be passed through [numeral.format](https://momentjs.com/docs/#/displaying/)
    onClick?: OnClick, // {OnClick}
    peer: string, // {SprucePeer}
    spruceName: string, // {SpruceName}
    style: Object // React style object to apply to the rendered HTML element
};

export default class Text extends React.Component<Props> {
    static defaultProps = {
        className: '',
        element: 'span',
        htmlProps: {},
        modifier: '',
        peer: '',
        spruceName: 'Text',
        style: {}
    };

    render(): Element<*> {
        let {
            children,
            className,
            dateFormat,
            element: TextElement,
            htmlProps,
            modifier,
            numberFormat,
            onClick,
            peer,
            spruceName,
            style
        } = this.props;

        if((typeof children === "string" || typeof children === "number") && numberFormat) {
            children = numeral(children).format(numberFormat);
        }

        // this typeof check must happen in this if, statement
        // because otherwise flow 0.54.1 cant work out that children would only be a number or a string
        if((typeof children === "string" || typeof children === "number") && dateFormat) {
            children = moment(new Date(children)).format(dateFormat);
        }

        return <TextElement
            className={SpruceClassName({name: spruceName, modifier, className, peer})}
            style={style}
            onClick={onClick}
            children={children}
            {...htmlProps}
        />;
    }
}
