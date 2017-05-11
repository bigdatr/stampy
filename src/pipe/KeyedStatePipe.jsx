// @flow

import React, {Component} from 'react';
import {fromJS} from 'immutable';
import ConfigureHock from '../util/ConfigureHock';
import {get, set} from '../util/CollectionUtils';

/**
 * @module Pipes
 */

export default ConfigureHock(
    (config: Function): HockApplier => {
        return (ComponentToDecorate: ReactClass<any>): ReactClass<any> => {

            /**
             * @component
             *
             * The KeyedStatePipe turns properties on a single value/Change pair
             * into a set of value/Change pairs.
             *
             * The `config.keys` array is reduced into a series of Value/Change pairs
             * that update their respective key as they change.
             *
             * Commonly used to separate multiple pieces of data being stored
             * in a single state hock.
             *
             * @example
             * import {StateHock, KeyedStatePipe} from 'stampy';
             *
             * const withState = StateHock({initialState: () => Map()});
             * const withSpread = KeyedStatePipe({
             *     keys: [
             *         ['value', 'onChange'],
             *         ['sortValue', 'sortChange']
             *     ]
             * });
             *
             * // will pass down the above four props
             * // the values will be pulled from
             * // props.value.value and props.value.sortValue
             *
             * export default withState(withSpread(Example));
             *
             * @prop {string} value
             * The prop to receive the value from.
             * This prop's name can be changed in config.
             *
             * @prop {string} onChange
             * The prop to receive the onChange callback from.
             * This prop's name can be changed in config.
             *
             * @childprop {*} ...
             * A pair of props for each value/Change pair specified in config.keys.
             *
             * @decorator {KeyedStatePipe}
             * @memberof module:Pipes
             */

            class KeyedStatePipe extends Component {
                dataChange: Function = (keyValue: string): Function => (payload: Function) => {
                    const {onChangeProp, valueProp} = config(this.props);
                    this.props[onChangeProp](set(this.props[valueProp], keyValue, payload));
                }
                render(): React.Element<any> {
                    const {
                        keys,
                        onChangeProp,
                        valueProp
                    } = config(this.props);

                    const value = this.props[valueProp];

                    const hockProps: Object = fromJS(keys)
                        .reduce((props: Object, key: List<string>) => {
                            const [keyValue, keyChange] = key.toArray();

                            props[keyValue] = get(value, keyValue);
                            props[keyChange] = this.dataChange(keyValue)
                            return props;
                        }, {});

                    const clonedProps = Object.assign({}, this.props);
                    delete clonedProps[valueProp];
                    delete clonedProps[onChangeProp];
                    const newProps = Object.assign({}, clonedProps, hockProps);

                    return <ComponentToDecorate {...newProps} />;
                }
            }

            return KeyedStatePipe;
        }
    },
    {
        keys: [['value', 'onChange']],
        valueProp: 'value',
        onChangeProp: 'onChange'
    }
);

/**
 * @callback KeyedStatePipe
 * @param {KeyedStatePipeConfig} [config]
 */

/**
 * @callback KeyedStatePipeConfig
 * @param {Object} props
 * @return {KeyedStatePipeConfigResult}
 * A function that accepts props and returns configuration for KeyedStatePipe.
 */

/**
 * @typedef KeyedStatePipeConfigResult
 *
 * @property {Array<Array<string>>} [keys = [['value', 'onChange']]]
 * An array of value/Change pairs to include in each pipe.
 *
 * @property {string} valueProp
 * The name of the prop to receive the value from.
 *
 * @property {string} onChangeProp
 * The name of the prop to receive the onChange callback from.
 */
