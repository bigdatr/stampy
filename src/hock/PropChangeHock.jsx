// @flow

import React from 'react';
import type {ComponentType, Element} from 'react';
import {is} from 'immutable';
import ConfigureHock from '../deprecated/util/ConfigureHock';
import getIn from 'unmutable/lib/getIn';

/**
 * @module Hocks
 */

export default ConfigureHock(
    (config: Function): HockApplier => {
        return (ComponentToDecorate: ComponentType<*>): ComponentType<*> => {

            /**
             * @component
             *
             * `PropChangeHock` is designed to provide a way to call a function
             * whenever a particular set of props change on a component.
             * Whenever the `componentDidMount()` and `componentWillReceiveProps()` lifecycle methods
             * are called, `PropChangeHock` will check if any of the props in `paths` have changed,
             * and call `onPropChange` if so.
             *
             * It's often used to dispatch actions to request new data
             * when props affecting the query have changed.
             *
             * @example
             * function MyComponent(props) {
             *   return <span>Extremely simple React component</span>;
             * }
             *
             * const withPropChange = PropChangeHock(props => {
             *     paths: ['propA'],
             *     onPropChange: (props) => console.log(`Prop A has changed to ${props.propA}`);
             * });
             *
             * export default withPropChange(MyComponent);
             *
             * @decorator {PropChangeHock}
             * @decorator {HockApplier}
             *
             * @memberof module:Hocks
             */

            class PropChangeHock extends React.Component<Object> {
                onPropChange: Function;
                constructor(props: Object) {
                    super(props);
                    this.onPropChange = config(this.props).onPropChange;
                }
                componentDidMount() {
                    this.onPropChange(this.props);
                }
                componentWillReceiveProps(nextProps: Object) {
                    const propsHaveChanged = config(nextProps)
                        .paths
                        .some((ii: string): boolean => {
                            const keyPath = ii.split('.');
                            const getKeyPath = getIn(keyPath);

                            return !is(
                                getKeyPath(this.props),
                                getKeyPath(nextProps)
                            );
                        });

                    if(propsHaveChanged) {
                        this.onPropChange = config(nextProps).onPropChange,
                        this.onPropChange(nextProps);
                    }
                }
                render(): Element<*> {
                    const props = {
                        ...this.props
                    };

                    if(config(this.props).passOnPropChange) {
                        props.onPropChange = this.onPropChange;
                    }

                    return <ComponentToDecorate {...props} />;
                }
            }

            return PropChangeHock;
        };
    },
    (): Object => ({
        paths: [],
        onPropChange: () => ({}),
        passOnPropChange: false
    })
);

/**
 * @callback PropChangeHock
 * @param {PropChangeHockConfig} [config]
 */

/**
 * @callback PropChangeHockConfig
 * @param {Object} props
 * @return {PropChangeHockConfigResult}
 * A function that accepts props and returns configuration for PropChangeHock.
 */

/**
 * @typedef PropChangeHockConfigResult
 * @type {Object}
 *
 * @property {Array<string>} paths
 *
 * The props that you want to check for changes on.
 * Nested objects or values can be passed in using dot notation inside strings
 * e.g. `['page', query.name', 'query.age']`.
 *
 * @property {PropChangeFunction} onPropChange
 */

/**
 * A function to be called when props have changed.
 *
 * @callback PropChangeFunction
 *
 * @param {Object} nextProps
 * The updated props object.
 *
 * @return {*}
 * The returned value is not used.
 */
