// @flow

import React, { Component, PropTypes } from 'react';
import {fromJS} from 'immutable';

/**
 * @module Hocks
 */

/**
 * `PropChangeHock` is designed to provide a way to call a function whenever a particular set of props change on a component.
 * Whenever the `componentWillMount()` and `componentWillReceiveProps()` lifecycle methods are called, `PropChangeHock` will check if any of the props in `propKeys` have changed, and call `onPropChangeFunction` if so.
 * It's often used to dispatch actions to request new data, when props affecting the query have changed.
 *
 *
 * @example
 * function MyComponent(props) {
 *   return <span>Extremely simple React component</span>;
 * }
 *
 * const withPropChange = PropChangeHock(['propA'], (props) => {
 *   console.log(`Prop A has changed to ${props.propA}`);
 * });
 *
 * export default withPropChange(MyComponent); // exports MyComponent with PropChangeHock as a higher order component
 *
 * @param {Array<string>} propKeys The props that you want to check for changes on. Nested objects or values can be passed in using dot notation inside strings e.g. `['page', query.name', 'query.age']`.
 * @param {PropChangeFunction} onPropChangeFunction The function to be called. It is passed a single argument, the updated props object.
 * @return {HockApplier}
 */

const PropChangeHock = (propKeys: Array<string>, onPropChangeFunction: Function): HockApplier => {
    return (ComposedComponent: ReactClass<any>): ReactClass<PropChangeHock> => {

        return class PropChangeHock extends Component {
            componentWillMount() {
                onPropChangeFunction(this.props);
            }
            componentWillReceiveProps(nextProps: Object) {
                const thisPropsImmutable = fromJS(this.props);
                const nextPropsImmutable = fromJS(nextProps);

                const propsHaveChanged = fromJS(propKeys)
                    .some(ii => {
                        const keyPath = ii.split('.');
                        return !thisPropsImmutable
                            .getIn(keyPath)
                            .equals(nextPropsImmutable.getIn(keyPath));
                    });

                if(propsHaveChanged) {
                    onPropChangeFunction(nextProps);
                }
            }
            render() {
                return <ComposedComponent {...this.props} />;
            }
        }
    }
}

export default PropChangeHock;


/**
 * A function to be called when props have changed.
 *
 * @callback PropChangeFunction
 * @param {Object} nextProps The updated props object.
 * @return {*} The returned value is not used.
 */
