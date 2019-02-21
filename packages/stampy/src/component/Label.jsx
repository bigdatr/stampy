// @flow
import React from 'react';
import type {ChildrenArray, Element} from 'react';
import SpruceClassName from '../util/SpruceClassName';

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

type Props = {
    children?: ChildrenArray<*>,
    className: string, // {ClassName}
    htmlFor?: string, // The id of the input HTML element this label corresponds to
    labelProps?: Object, // Attributes applied to the component's <label> HTML element
    modifier: SpruceModifier, // {SpruceModifier}
    parent: string, // ${SpruceParent}
    peer: string, // {SprucePeer}
    spruceName: string, // {SpruceName}
    style: Object // React style object to apply to the rendered HTML element
};

export default class Label extends React.Component<Props> {
    static defaultProps = {
        className: '',
        labelProps: {},
        modifier: '',
        parent: '',
        peer: '',
        spruceName: 'Label',
        style: {}
    };

    render(): Element<*> {
        const {
            children,
            className,
            htmlFor,
            labelProps,
            modifier,
            parent,
            peer,
            spruceName,
            style
        } = this.props;

        return <label
            {...labelProps}
            htmlFor={htmlFor}
            className={SpruceClassName({name: spruceName, modifier, className, parent, peer})}
            children={children}
            style={style}
        />;
    }
}
