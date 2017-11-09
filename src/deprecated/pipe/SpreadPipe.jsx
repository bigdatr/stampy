/* eslint-disable flowtype/require-valid-file-annotation */

import React, {Component} from 'react';
import {fromJS} from 'immutable';
import ConfigureHock from '../util/ConfigureHock';
import {isKeyed, get, set} from '../util/CollectionUtils';

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

                childProps: Object;
                upToDateValue: Object;

                constructor(props: Object) {
                    super(props);

                    const nextConfig: Object = config(props);
                    const nextValue: * = props[nextConfig.valueProp];
                    if(!isKeyed(nextValue)) {
                        throw new Error(`Expected prop "${nextConfig.valueProp}" to be keyed, got ${nextValue}`);
                    }
                    const nextValueChangePairs: List<string> = fromJS(nextConfig.valueChangePairs);

                    this.childProps = this.generateChildProps(nextValue, nextValueChangePairs);
                    this.upToDateValue = nextValue;
                }

                componentWillReceiveProps(nextProps: Object) {
                    this.updateChildProps(this.props, nextProps);
                }

                updateChildProps: Function = (prevProps: Object, nextProps: Object) => {
                    const prevConfig: Object = config(prevProps);
                    const nextConfig: Object = config(nextProps);

                    const prevValue: * = prevProps[prevConfig.valueProp];
                    const nextValue: * = nextProps[nextConfig.valueProp];
                    if(!isKeyed(nextValue)) {
                        throw new Error(`Expected prop "${nextConfig.valueProp}" to be keyed, got ${nextValue}`);
                    }

                    const prevValueChangePairs: List<string> = fromJS(prevConfig.valueChangePairs);
                    const nextValueChangePairs: List<string> = fromJS(nextConfig.valueChangePairs);

                    // check each prop to see if any values aren't strictly equal
                    // P.S. we don't care if onChange functions aren't equal as these aren't used in the creation of child props
                    // (they are only used when onChange is actually called)
                    const valuesHaveChanged = prevValueChangePairs
                        .some((prev, key) => prev.get(0) !== nextValueChangePairs.getIn([key, 0]));

                    // only update childProps when necessary
                    if(
                        prevValue !== nextValue
                        || valuesHaveChanged
                    ) {
                        this.childProps = this.generateChildProps(nextValue, nextValueChangePairs);
                    }

                    // cache the new value prop so we can cope with multiple onChange calls in a row
                    this.upToDateValue = nextValue;
                };

                generateChildProps(nextValue: *, valueChangePairs: List<string>): Object {
                    return valueChangePairs
                        .reduce((props: Object, pair: ValueChangePairList): Object => {
                            const [pairValue, pairChange] = pair.toArray();
                            props[pairValue] = get(nextValue, pairValue);
                            props[pairChange] = this.createPartialChange(pair);
                            return props;
                        }, {});
                }

                createPartialChange: Function = (pair: ValueChangePairList) => (newPartialValue: *) => {
                    const {onChangeProp} = config(this.props);
                    const [pairValue] = pair.toArray();

                    const changeFunction: * = this.props[onChangeProp];
                    this.upToDateValue = set(this.upToDateValue, pairValue, newPartialValue);
                    if(!changeFunction || typeof changeFunction !== "function") {
                        console.warn(`SpreadPipe cannot call change on "${onChangeProp}" prop. Expected function, got ${changeFunction}`);
                        return;
                    }
                    changeFunction(this.upToDateValue);
                };

                render(): React.Element<any> {
                    const {
                        onChangeProp,
                        valueProp
                    } = config(this.props);

                    const clonedProps = Object.assign({}, this.props);
                    delete clonedProps[valueProp];
                    delete clonedProps[onChangeProp];
                    const newProps = Object.assign({}, clonedProps, this.childProps);
                    return <ComponentToDecorate {...newProps} />;
                }
            }

            return SpreadPipe;
        };
    },
    (): Object => ({
        valueChangePairs: [['value', 'onChange']],
        valueProp: 'value',
        onChangeProp: 'onChange'
    })
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
 * @type {Object}
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
