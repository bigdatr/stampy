// @flow
import React, {PropTypes} from 'react';
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

    function spruceComponent(props: Object): React.Element<any> {
        const {
            children,
            className,
            modifier,
            spruceName,
            ...otherProps
        } = props;

        return <Element
            className={SpruceClassName({className, modifier, name: spruceName || name})}
            children={children}
            {...otherProps}
        />;
    }

    spruceComponent.propTypes = {
        className: PropTypes.string,
        modifier: PropTypes.string,
        spruceName: PropTypes.string
    }

    spruceComponent.displayName = name;

    return spruceComponent;
}
