// @flow

import React, {Component} from 'react';
import {fromJS, Map, is} from 'immutable';
import ConfigureHock from '../util/ConfigureHock';
import {get, set} from '../util/CollectionUtils';

type PartialChangeMap = Map<string,Map<string,Function>>;

/**
 * @module Pipes
 */

export default ConfigureHock(
    (config: Function): HockApplier => {
        return (ComponentToDecorate: ReactClass<any>): ReactClass<any> => {

            /**
             * @component
             *
             * The SpreadPipe turns properties on a single value/Change pair
             * into a set of value/Change pairs.
             *
             * The `config.valueChangePairs` array is reduced into a series of Value/Change pairs
             * that update their respective key as they change.
             *
             * Commonly used to separate multiple pieces of data being stored
             * in a single state hock.
             *
             * @example
             * import {StateHock, SpreadPipe} from 'stampy';
             *
             * const withState = StateHock({initialState: () => Map()});
             * const withSpread = SpreadPipe({
             *     valueChangePairs: [
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
             * A pair of props for each value/Change pair specified in config.valueChangePairs.
             *
             * @decorator {SpreadPipe}
             * @memberof module:Pipes
             */

            class SpreadPipe extends Component {

                partialChangeFunctions: PartialChangeMap = Map();
                constructor(props: Object) {
                    super(props);
                    this.initialize(props);
                }

                // reinitialize if output of config function changes
                componentWillReceiveProps(nextProps: Object) {

                    const configChanged: boolean = !is(
                        fromJS(config(this.props)),
                        fromJS(config(nextProps))
                    );

                    if(configChanged) {
                        this.initialize(nextProps);
                    }
                }

                // sets up a map of change functions, so these dont have to be recreated each render
                initialize: Function = (props: Object) => {
                    const {valueChangePairs} = config(props);

                    this.partialChangeFunctions = fromJS(valueChangePairs)
                        .reduce((map: Map<string,*>, pair: ValueChangePairList): Map<string,*> => {
                            return map.set(pair.get(1), this.createPartialChange(pair));
                        }, Map());
                }

                createPartialChange: Function = (pair: ValueChangePairList) => (newPartialValue: *) => {
                    const [pairValue, pairChange] = pair.toArray();
                    const existingValue: * = this.props[pairValue];
                    const changeFunction: * = this.props[pairChange];
                    const updatedValue: * = set(existingValue, pairValue, newPartialValue);
                    if(!changeFunction || typeof changeFunction !== "function") {
                        console.warn(`SpreadPipe cannot call change on "${pairChange}" prop. Expected function, got ${changeFunction}`);
                        return;
                    }
                    changeFunction(updatedValue);
                };

                dataChange: Function = (pairValue: string): Function => (payload: Function) => {
                    const {onChangeProp, valueProp} = config(this.props);
                    this.props[onChangeProp](set(this.props[valueProp], pairValue, payload));
                }
                render(): React.Element<any> {
                    const {
                        valueChangePairs,
                        onChangeProp,
                        valueProp
                    } = config(this.props);

                    const value = this.props[valueProp];

                    const hockProps: Object = fromJS(valueChangePairs)
                        .reduce((props: Object, pair: ValueChangePairList) => {
                            const [pairValue, pairChange] = pair.toArray();

                            props[pairValue] = get(value, pairValue);
                            props[pairChange] = this.partialChangeFunctions.get(pairChange);
                            return props;
                        }, {});

                    const clonedProps = Object.assign({}, this.props);
                    delete clonedProps[valueProp];
                    delete clonedProps[onChangeProp];
                    const newProps = Object.assign({}, clonedProps, hockProps);

                    return <ComponentToDecorate {...newProps} />;
                }
            }

            return SpreadPipe;
        }
    },
    {
        valueChangePairs: [['value', 'onChange']],
        valueProp: 'value',
        onChangeProp: 'onChange'
    }
);

/**
 * @callback SpreadPipe
 * @param {SpreadPipeConfig} [config]
 */

/**
 * @callback SpreadPipeConfig
 * @param {Object} props
 * @return {SpreadPipeConfigResult}
 * A function that accepts props and returns configuration for SpreadPipe.
 */

/**
 * @typedef SpreadPipeConfigResult
 *
 * @property {Array<ValueChangePair>|List<ValueChangePair>} [valueChangePairs = [['value', 'onChange']]]
 * An array of value/Change pairs to spread.
 * These will all be made availabe as props.
 *
 * @property {string} valueProp
 * The name of the prop to receive the value from.
 *
 * @property {string} onChangeProp
 * The name of the prop to receive the onChange callback from.
 */
