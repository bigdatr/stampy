// @flow
import React from 'react';
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
export default function SpruceComponent(name: string, Element: ReactClass<any>|string): Function {
    function spruceComonent(props: Object): React.Element<any> {
        var {className, modifier, children, ...otherProps} = props;
        return <Element
            className={SpruceClassName({className, modifier, name})}
            children={children}
            {...otherProps}
        />;
    }
    spruceComonent.proptypes = {
        className: React.PropTypes.string,
        modifier: React.PropTypes.string
    }
    spruceComonent.displayName = name;

    return spruceComonent;
}
