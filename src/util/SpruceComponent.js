// @flow
import React from 'react';
import type {ChildrenArray, ComponentType, Element} from 'react';
import SpruceClassName from './SpruceClassName';

/**
 * @module Utils
 */

/**
 * `SpruceComponent` returns a React Element with SpruceClassNames applied to it.
 * It is used as a time saver when applying Spruce class names to dumb components.
 *
 * @param {String} name
 * Class name given to the new component
 *
 * @param {ReactElement|String} Element
 * Element to be given spruce classnames
 *
 * @return {ReactElement} 'Spruced' React element
 *
 * @example
 * const Table = SpruceComponent('Table', 'table');
 * const Grid = SpruceComponent('Grid', 'div');
 * const SpecialButton = SpruceComponent('SpecialButton', Button);
 *
 * function Component(props) {
 *      return <Grid>
 *          <Table>
 *              <tbody>
 *                  <tr><td>rad</td></tr>
 *              </tbody>
 *          </Table>
 *          <SpecialButton />
 *      </Grid>
 * }
 */

type SpruceComponentProps = {
    children?: ChildrenArray<*>,
    className?: string, // {ClassName}
    element?: ComponentType<*>|string, // React component to render as, or name of the HTML element to render as
    modifier?: SpruceModifier, // {SpruceModifier}
    peer?: string, // {SprucePeer}
    spruceName: string // {SpruceName}
};

export default function SpruceComponent(name: string, defaultElement: ComponentType<*>|string): Function {

    function spruceComponent(props: SpruceComponentProps): Element<*> {
        const {
            children,
            className,
            modifier,
            peer,
            spruceName,
            element,
            ...otherProps
        } = props;

        const Component = element || defaultElement;

        return <Component
            className={SpruceClassName({className, modifier, peer, name: spruceName || name})}
            children={children}
            {...otherProps}
        />;
    }

    spruceComponent.displayName = name;

    return spruceComponent;
}
