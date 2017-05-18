// @flow

import React, {Component} from 'react';
import {fromJS, List, Map, Range} from 'immutable';
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
             * The IndexedSplitterPipe lets you split a pipe with Arrays or Lists as a value
             * into a series of smaller pipes.
             * Partial values and partial change functions are given to each pipe
             * so they can continue to be composed.
             *
             * @childprop {Object} split
             * The prop containing the new pipes that IndexedSplitterPipe created.
             * This prop's name can be changed in config.
             *
             * @decorator {IndexedSplitterPipe}
             * @decorator {HockApplier}
             *
             * @memberof module:Pipes
             */

            class IndexedSplitterPipe extends Component {

                childProps: Object;

                constructor(props: Object) {
                    super(props);
                    this.updateChildProps({}, props);
                }

                componentWillReceiveProps(nextProps: Object) {
                    this.updateChildProps(this.props, nextProps);
                }

                updateChildProps: Function = (prevProps: Object, nextProps: Object) => {
                    const prevConfig: Object = config(prevProps);
                    const nextConfig: Object = config(nextProps);

                    const {splitProp} = nextConfig;

                    // get the props based on the values and change function in the value change pairs
                    const prevValueChangePairs: List<ValueChangePairList> = fromJS(prevConfig.valueChangePairs);
                    const nextValueChangePairs: List<ValueChangePairList> = fromJS(nextConfig.valueChangePairs);

                    const prevValueChangeProps: List<Map<string,*>> = IndexedSplitterPipe.getValueChangeProps(prevProps, prevValueChangePairs);
                    const nextValueChangeProps: List<Map<string,*>> = IndexedSplitterPipe.getValueChangeProps(nextProps, nextValueChangePairs);

                    // check each prop to see if any values aren't strictly equal
                    // P.S. we don't care if onChange functions aren't equal as these aren't used in the creation of child props
                    // (they are only used when onChange is actually called)
                    const valuesHaveChanged = prevValueChangeProps
                        .some((prev, key) => {
                            return prev.get('valueLength') !== nextValueChangeProps.getIn([key, 'valueLength'])
                                || prev.get('value') !== nextValueChangeProps.getIn([key, 'value']);
                        });

                    // only update childProps when necessary
                    if(
                        prevConfig.splitProp !== splitProp
                        || valuesHaveChanged
                        || !this.childProps
                    ) {
                        this.childProps = {
                            [splitProp]: this.split(nextValueChangeProps)
                        };
                    }
                };

                static getValueChangeProps(props: Object, valueChangePairs: List<ValueChangePairList>): List<Map<string,*>> {
                    return valueChangePairs
                        .map(ii => Map({
                            value: props[ii.get(0)],
                            valueLength: List(props[ii.get(0)]).size,
                            valueName: ii.get(0),
                            onChangeName: ii.get(1)
                        }));
                }

                split(valueChangeProps: List<Map<string,*>>): Array {
                    const length: number = valueChangeProps
                        .map(ii => ii.get('valueLength'))
                        .max();

                    return Range(0, length)
                        .toList()
                        .map(index => this.createPipe(index, valueChangeProps))
                        .toArray();
                }

                createPipe(index: number, valueChangeProps: List<Map<string,*>>): Object {
                    return valueChangeProps
                        .reduce((obj: Object, valueChangeProp: Map<string,*>): Object => {
                            const valueProp: * = valueChangeProp.get('value');
                            const value: * = valueProp
                                ? get(valueProp, index)
                                : undefined;

                            const onChange: Function = this.createPartialChange(index, valueChangeProp);

                            return {
                                ...obj,
                                [valueChangeProp.get('valueName')]: value,
                                [valueChangeProp.get('onChangeName')]: onChange
                            };
                        }, {});
                }

                createPartialChange: Function = (index: number, valueChangeProp: Map<string,*>) => (newPartialValue: *) => {
                    const valueName: string = valueChangeProp.get('valueName');
                    const onChangeName: string = valueChangeProp.get('onChangeName');

                    const existingValue: * = this.props[valueName];
                    const changeFunction: * = this.props[onChangeName];
                    const updatedValue: * = set(existingValue, index, newPartialValue);

                    if(!changeFunction || typeof changeFunction !== "function") {
                        console.warn(`IndexedSplitterPipe cannot call change on "${onChangeName}" prop. Expected function, got ${changeFunction}`);
                        return;
                    }

                    changeFunction(updatedValue);
                };

                render(): React.Element<any> {
                    var newProps: Object = Object.assign({}, this.props, this.childProps);
                    return <ComponentToDecorate {...newProps} />;
                }
            }

            return IndexedSplitterPipe;
        }
    },
    (): Object => ({
        valueChangePairs: [['value', 'onChange']],
        splitProp: 'split'
    })
);


/**
 * @callback IndexedSplitterPipe
 * @param {IndexedSplitterPipeConfig} [config]
 */

/**
 * @callback IndexedSplitterPipeConfig
 * @param {Object} props
 * @return {IndexedSplitterPipeConfigResult}
 * A function that accepts props and returns configuration for IndexedSplitterPipe.
 */

/**
 * @typedef IndexedSplitterPipeConfigResult
 * @type {Object}
 * @property {Array<string>} paths
 * An array of strings indicating which nested properties should have pipes created for them.
 *
 * Use dots to specify nested props,
 * e.g. `"user.id"` refers to the `id` property on the `user`
 *
 * @property {Array<ValueChangePair>|List<ValueChangePair>} [valueChangePairs = [['value', 'onChange']]]
 * An array of value/onChange pairs to include in each pipe.
 *
 * @property {string} [splitProp = "split"]
 * Sets the name of the prop containing the new pipes that IndexedSplitterPipe created.
 */

