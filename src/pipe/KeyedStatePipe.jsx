// @flow

import React, {Component} from 'react';
import {get, set} from '../util/CollectionUtils';

/**
 * @module Pipes
 */

export default (config: Object = {}): HockApplier => {
    const {
        keys = ['data'],
        dataValueProp = 'dataValue',
        dataChangeProp = 'dataChange'
    } = config;

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
            dataChange: Function = (key: string): Function => (payload: Function) => {
                this.props[dataChangeProp](set(this.props[dataValueProp], key, payload));
            }
            render(): React.Element<any> {
                const hockProps: Object = keys
                    .reduce((props: Object, key: string) => {
                        props[`${key}Value`] = get(this.props[dataValueProp], key);
                        props[`${key}Change`] = this.dataChange(key)
                        return props;
                    }, {});

                const clonedProps = Object.assign({}, this.props);
                delete clonedProps[dataValueProp];
                delete clonedProps[dataChangeProp];
                const newProps = Object.assign({}, clonedProps, hockProps);

                return <ComponentToDecorate {...newProps} />;
            }
        }

        return KeyedStatePipe;
    }
}
