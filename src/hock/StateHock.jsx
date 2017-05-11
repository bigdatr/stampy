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
         * Value is the current state and dataChange is a callback whose return value will replace `value`.
         * Because the whole state is replaced each time, it works particuarlly well with immutable data.
         *
         * @example
         * // Counter
         * import {StateHock} from 'stampy';
         *
         * const example = (props) => {
         *     const {dataValue, dataChange} = props;
         *     return <div>
         *         <div>value: {dataValue}</div>
         *         <button onClick={() => dataChange(dataValue + 1)}>+</button>
         *         <button onClick={() => dataChange(dataValue - 1)}>-</button>
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
         *     const {dataValue, dataChange} = props;
         *     return <div>
         *         <div>Foo: {dataValue.get('foo')}</div>
         *         <button onClick={() => dataChange(dataValue.set('foo', 'bar'))}>Bar</button>
         *         <button onClick={() => dataChange(dataValue.set('foo', 'qux'))}>Qux</button>
         *     </div>
         * }
         *
         * const withState = StateHock({initialState: (props) => Map()});
         * export default withState(example);
         *
         * @childprop {any} dataValue - The current stored value
         * @childprop {function} dataChange - Callback whose return value will replace `props.dataValue`
         *
         * @decorator {StateHock}
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
 * Provides configuration for `StateHock`.
 *
 * @callback StateHock
 *
 * @param {QueryStringHockConfig} [config]
 *
 * @return {QueryStringWrapper}
 */
