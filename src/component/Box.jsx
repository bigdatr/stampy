// @flow
import React from 'react';
import type {ChildrenArray, Node, ComponentType} from 'react';
import SpruceClassName from '../util/SpruceClassName';

/**
 * @module Components
 */

/**
 * @component
 *
 * Box is an empty component that has shortcuts to style margin and padding
 *
 * @example
 * return <Box marginBottom="1rem" padding="1rem"><Input/></Box>
 */

type Props = {
    boxProps?: *,
    children?: ChildrenArray<*>,
    className?: string, // {ClassName}
    element?: ComponentType<*>|string, // The id of the input HTML element this label corresponds to
    margin?: string,
    marginBottom?: string,
    marginLeft?: string,
    marginRight?: string,
    marginTop?: string,
    modifier?: SpruceModifier, // {SpruceModifier}
    padding?: string,
    paddingBottom?: string,
    paddingLeft?: string,
    paddingRight?: string,
    paddingTop?: string,
    parent?: string, // ${SpruceParent}
    peer?: string, // {SprucePeer}
    spruceName?: string, // {SpruceName}
    style?: *
};

export default function Box(props: Props): Node {
    const {children} = props;
    const {className} = props;
    const {element: Element = 'div'} = props;
    const {marginBottom} = props;
    const {marginLeft} = props;
    const {marginRight} = props;
    const {marginTop} = props;
    const {margin} = props;
    const {modifier} = props;
    const {paddingBottom} = props;
    const {paddingLeft} = props;
    const {paddingRight} = props;
    const {paddingTop} = props;
    const {padding} = props;
    const {parent} = props;
    const {peer} = props;
    const {spruceName = 'Box'} = props;
    const {style} = props;
    const {boxProps = {}} = props;

    return <Element
        className={SpruceClassName({name: spruceName, modifier, className, parent, peer})}
        children={children}
        {...boxProps}
        style={{
            ...style,
            margin,
            marginBottom,
            marginLeft,
            marginRight,
            marginTop,
            padding,
            paddingBottom,
            paddingLeft,
            paddingRight,
            paddingTop
        }}
    />;
}
