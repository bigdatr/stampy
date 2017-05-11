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
             * The KeyedStatePipe lets you store state changes seperate to each other.
             * The `config.keys` array is reduced into a series of Value/Change pairs
             * that update their respective key as they change.
             *
             * @example
             * import {StateHock, KeyedStatePipe} from 'stampy';
             *
             * const withState = StateHock({initialState: () => Map()});
             * const splitToKeys = KeyedStatePipe({
             *     keys: ['data', 'sort', 'filter']
             * });
             * export default withState(splitToKeys(Example));
             *
             *
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
