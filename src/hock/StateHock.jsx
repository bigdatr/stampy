// @flow

import React, {Component} from 'react';
import ConfigureHock from '../util/ConfigureHock';

/**
 * @module Hocks
 */

export default ConfigureHock(
    (config: Function): HockApplier => {
        return (ComponentToDecorate: ReactClass<any>): ReactClass<any> => {

            /**
             * @component
             *
             * State hock allows you to control state changes through the prop cycle. It provides a prop of `value` and `onChange`.
             * Value is the current state and onChange is a callback whose return value will replace `value`.
             * Because the whole state is replaced each time, it works particularly well with immutable data.
             *
             * @example
             * // Counter
             * import {StateHock} from 'stampy';
             *
             * const example = (props) => {
             *     const {value, onChange} = props;
             *     return <div>
             *         <div>value: {value}</div>
             *         <button onClick={() => onChange(value + 1)}>+</button>
             *         <button onClick={() => onChange(value - 1)}>-</button>
             *     </div>
             * }
             *
             * const withState = StateHock((props) => ({initialState: 0}));
             * export default withState(example);
             *
             * // Immutable Data
             * import {StateHock} from 'stampy';
             * import {Map} from 'immutable';
             *
             * const example = (props) => {
             *     const {value, onChange} = props;
             *     return <div>
             *         <div>Foo: {value.get('foo')}</div>
             *         <button onClick={() => onChange(value.set('foo', 'bar'))}>Bar</button>
             *         <button onClick={() => onChange(value.set('foo', 'qux'))}>Qux</button>
             *     </div>
             * }
             *
             * const withState = StateHock((props) => {initialState: Map()});
             * export default withState(example);
             *
             * @childprop {any} value
             * The current stored value.
             * This prop's name can be changed in config.
             *
             * @childprop {function} onChange
             * Callback whose return value will replace `props.value`.
             * This prop's name can be changed in config.
             *
             * @decorator {StateHock}
             * @decorator {HockApplier}
             *
             * @memberof module:Hocks
             */

            class StateHock extends Component {
                state: Object;
                initialState: *;
                constructor(props: Object) {
                    super(props);
                    const {initialState} = config(props);
                    this.state = {
                        value: initialState,
                        previousValue: initialState
                    }
                }
                componentWillReceiveProps(nextProps: Object) {
                    const onPropChange = config(nextProps).onPropChange;
                    if(onPropChange) {
                        // Call on prop change to check if the value should be updated.
                        // Storing the value on previousValue allows for checking against
                        // changes in props not state.
                        onPropChange(
                            (value) => this.setState({value, previousValue: value}),
                            nextProps,
                            this.state.previousValue,
                            this.state.value
                        );
                    }
                }
                onChange: Function = (payload: Function) => {
                    this.setState({
                        value: payload
                    });
                }
                render(): React.Element<any> {
                    const {
                        valueProp,
                        onChangeProp
                    } = config(this.props);

                    const hockProps: Object = {
                        [valueProp]: this.state.value,
                        [onChangeProp]: this.onChange
                    };

                    return <ComponentToDecorate
                        {...this.props}
                        {...hockProps}
                    />;
                }
            }

            return StateHock;
        }
    },
    (): Object => ({
        initialState: undefined,
        valueProp: 'value',
        onChangeProp: 'onChange'
    })
);

/**
 * @callback StateHock
 * @param {StateHockConfig} [config]
 */

/**
 * @callback onPropChange
 * @param {function} onChange - Callback to update state with
 * @param {object} nextProps - The new set of props
 * @param {*} previousState - The previous version of state (Either InitialState or the last onPropChange)
 * @param {*} state - The current version of state
 */

/**
 * @callback StateHockConfig
 * @param {Object} props
 * @return {StateHockConfigResult}
 * A function that accepts props and returns configuration for StateHock.
 */

/**
 * @typedef StateHockConfigResult
 * @type {Object}
 *
 * @property {*} [initialState]
 * The initial state for the hock.
 *
 * @property {onPropChange} [onPropChange]
 * Allows you to update the current value when props change.
 *
 * @property {string} [valueProp = "value"]
 * The name of the prop to pass the value down as.
 *
 * @property {string} [onChangeProp = "onChange"]
 * The name of the prop to pass the onChange down as.
 */

