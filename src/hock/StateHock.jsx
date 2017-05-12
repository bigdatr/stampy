// @flow

import React, {Component} from 'react';

type StateHockConfig = {
    initialState?: Function,
    valueProp?: string,
    onChangeProp?: string
};

/**
 * @module Hocks
 */

export default (config: StateHockConfig = {}): HockApplier => {
    const {
        initialState = () => undefined,
        valueProp = 'value',
        onChangeProp = 'onChange'
    } = config;

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
         * const withState = StateHock({initialState: (props) => 0});
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
         * const withState = StateHock({initialState: (props) => Map()});
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
            constructor(props: Object) {
                super(props);
                this.state = {
                    value: initialState(props)
                }
            }
            onChange: Function = (payload: Function) => {
                this.setState({
                    value: payload
                });
            }
            render(): React.Element<any> {
                const hockProps = {
                    [valueProp]: this.state.value,
                    [onChangeProp]: this.onChange
                }
                return <ComponentToDecorate
                    {...this.props}
                    {...hockProps}
                />;
            }
        }

        return StateHock;
    }
}


/**
 * @callback StateHock
 * @param {StateHockConfig} [config]
 */

/**
 * @typedef StateHockConfig
 * @property {function} [initialState]
 * A function that is passed props and should return the initial state for the hock.
 *
 * @property {string} [valueProp = "value"]
 * The name of the prop to pass the value down as.
 *
 * @property {string} [onChangeProp = "onChange"]
 * The name of the prop to pass the onChange prop as.
 */

