// @flow

import React, {Component} from 'react';

type StateHockConfig = {
    initialState?: Function,
    dataValueProp?: string,
    dataChangeProp?: string
};

/**
 * @module Hocks
 */

export default (config: StateHockConfig = {}): HockApplier => {
    const {
        initialState = () => undefined,
        dataValueProp = 'dataValue',
        dataChangeProp = 'dataChange'
    } = config;

    return (ComponentToDecorate: ReactClass<any>): ReactClass<any> => {

        /**
         * @component
         *
         * State hock allows you to control state changes through the prop cycle. It provides a prop of `value` and `onChange`.
         * Value is the current state and onChange is a callback whose return value will replace `value`.
         * Because the whole state is replaced each time, it works particuarlly well with immutable data.
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
         * const withState = StateHock(0);
         * export default withState(example);
         *
         * // Immutable Data
         * import {StateHock} from 'stampy';
         * import {Map} from 'immutable';
         *¡
         * const example = (props) => {
         *     const {value, onChange} = props;
         *     return <div>
         *         <div>Foo: {value.get('foo')}</div>
         *         <button onClick={() => onChange(value.set('foo', 'bar'))}>Bar</button>
         *         <button onClick={() => onChange(value.set('foo', 'qux'))}>Qux</button>
         *     </div>
         * }
         *
         * const withState = StateHock(Map());
         * export default withState(example);
         *
         * @childprop {any} value - The current stored value
         * @childprop {function} onChange - Callback whose return value will replace `props.value`
         *
         * @decorator {StateHock}
         * @memberof module:Hocks
         */

        class StateHock extends Component {
            state: Object;
            constructor(props: Object) {
                super(props);
                this.state = {
                    dataValue: initialState(props)
                }
            }
            onChange: Function = (payload: Function) => {
                this.setState({
                    dataValue: payload
                });
            }
            render(): React.Element<any> {
                const hockProps = {
                    [dataValueProp]: this.state.dataValue,
                    [dataChangeProp]: this.onChange
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
