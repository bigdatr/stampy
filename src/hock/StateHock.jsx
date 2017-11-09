// @flow

import React from 'react';
import type {ComponentType, Element} from 'react';
import Hock from '../util/Hock';

/**
 * @module Hocks
 */

type Props = {};
type State = {
    value: *
};
type ChildProps = {};

export default Hock({
    hock: (config: Object): HockApplier => (ComponentToDecorate: ComponentType<Props>): ComponentType<ChildProps> => {

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
         * const withState = StateHock((props) => Map());
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

        return class StateHock extends React.Component<Props, State> {
            constructor(props: Object) {
                super(props);
                this.state = {
                    value: config.initialState(props)
                };
            }
            componentWillReceiveProps(nextProps: Object) {
                config.onPropChange(this.onChange, nextProps, this.state.value);
            }
            onChange: Function = (payload: Function) => {
                this.setState({
                    value: payload
                });
            }
            render(): Element<*> {
                const {
                    valueProp,
                    onChangeProp
                } = config;

                const hockProps: Object = {
                    [valueProp(this.props)]: this.state.value,
                    [onChangeProp(this.props)]: this.onChange
                };

                return <ComponentToDecorate
                    {...this.props}
                    {...hockProps}
                />;
            }
        };
    },
    defaultConfig: {
        initialState: (/* props: Object */) => undefined,
        valueProp: (/* props: Object */) => 'value',
        onChangeProp: (/* props: Object */) => 'onChange',
        onPropChange: (/* onChange: Function, nextProps: Object, value: Object */) => {}
    },
    shorthandKey: "initialState"
});

/**
 * @callback StateHock
 * @param {StateHockConfig} [config]
 */

/**
 * @callback onPropChange
 * @param {function} onChange - Callback to update state with
 * @param {object} nextProps - The new set of props
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

