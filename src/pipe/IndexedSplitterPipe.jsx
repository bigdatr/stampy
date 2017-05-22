// @flow

import React, {Component} from 'react';
import {fromJS, List, Map, Range} from 'immutable';
import StateHock from '../hock/StateHock';
import ConfigureHock from '../util/ConfigureHock';
import {get, set} from '../util/CollectionUtils';
import Compose from '../util/Compose';

/**
 * @module Pipes
 */

const DEFAULT_PROPS: Function = (): Object => ({
    valueChangePairs: [['value', 'onChange']],
    splitProp: 'split',
    onPopProp: 'onPop',
    onPushProp: 'onPush',
    onSwapProp: 'onSwap',
    onSwapPrevProp: 'onSwapPrev',
    onSwapNextProp: 'onSwapNext'
});

const IndexedSplitterPipe: Function = ConfigureHock(
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

                    const {
                        splitProp,
                        onPushProp,
                        onPopProp,
                        onSwapProp,
                        onSwapPrevProp,
                        onSwapNextProp
                    } = nextConfig;

                    // get the props based on the values and change function in the value change pairs
                    const prevValueChangePairs: List<ValueChangePairList> = fromJS(prevConfig.valueChangePairs);
                    const nextValueChangePairs: List<ValueChangePairList> = fromJS(nextConfig.valueChangePairs);

                    const prevValueChangeProps: List<Map<string,*>> = IndexedSplitterPipe.getValueChangeProps(prevProps, prevValueChangePairs);
                    const nextValueChangeProps: List<Map<string,*>> = IndexedSplitterPipe.getValueChangeProps(nextProps, nextValueChangePairs);

                    // check each prop to see if any values aren't strictly equal
                    // P.S. we don't care if onChange functions aren't equal as these aren't used in the creation of child props
                    // (they are only used when onChange is actually called)
                    const valuesHaveChanged: boolean = prevValueChangeProps
                        .some((prev, key) => {
                            return prev.get('valueLength') !== nextValueChangeProps.getIn([key, 'valueLength'])
                                || prev.get('value') !== nextValueChangeProps.getIn([key, 'value']);
                        });

                    // only update childProps when necessary
                    if(
                        prevConfig.splitProp !== splitProp
                        || prevConfig.onPushProp !== onPushProp
                        || prevConfig.onPopProp !== onPopProp
                        || prevConfig.onSwapProp !== onSwapProp
                        || prevConfig.onSwapPrevProp !== onSwapPrevProp
                        || prevConfig.onSwapNextProp !== onSwapNextProp
                        || prevProps.listKeysValue !== nextProps.listKeysValue
                        || valuesHaveChanged
                        || !this.childProps
                    ) {
                        this.childProps = {
                            [splitProp]: this.split(nextValueChangeProps),
                            [onPopProp]: this.onModify(nextValueChangeProps, nextProps.listKeysValue, this.onPop),
                            [onPushProp]: this.onModify(nextValueChangeProps, nextProps.listKeysValue, this.onPush),
                            [onSwapProp]: this.onModify(nextValueChangeProps, nextProps.listKeysValue, this.onSwap),
                            [onSwapNextProp]: this.onModify(nextValueChangeProps, nextProps.listKeysValue, this.onSwapNext),
                            [onSwapPrevProp]: this.onModify(nextValueChangeProps, nextProps.listKeysValue, this.onSwapPrev)
                        };
                    }
                };

                static getValueChangeProps(props: Object, valueChangePairs: List<ValueChangePairList>): List<Map<string,*>> {
                    return valueChangePairs
                        .map((ii) => Map({
                            value: props[ii.get(0)],
                            valueLength: List(props[ii.get(0)]).size,
                            valueName: ii.get(0),
                            onChangeName: ii.get(1),
                            listKeys: props.listKeysValue
                        }));
                }

                static zipValues(valueChangeProps: List<Map<string,*>>): List<Map<string,*>> {
                    // find total length of output value i.e. the longest input value
                    const length: number = valueChangeProps
                        .map(ii => List(ii.get('value')).size)
                        .max();

                    // get value change props values keyed by valueName
                    const valueChangeMap: Map<Map<string,*>> = valueChangeProps
                        .reduce((map: List<Map<string,*>>, ii: Map<string,*>) => {
                            return map.set(ii.get('valueName'), ii.get('value'));
                        }, Map());

                    // zip the values together, fill with undefined where required
                    return Range(0, length)
                        .toList()
                        .map((index: number) => Map(
                            valueChangeMap.reduce((map: Map<string,*>, value: *, valueName: string) => {
                                map[valueName] = value ? get(value, index) : undefined;
                                return map;
                            }, {})
                        ));
                }

                static unzipValues(zipped: List<Map<string,*>>, valueNames: List<string>): Map<List<string,*>> {
                    return Map(
                        valueNames.reduce((obj: Object, valueName: string) => {
                            obj[valueName] = zipped.map(ii => ii.get(valueName));
                            return obj;
                        }, {})
                    );
                }

                split(valueChangeProps: List<Map<string,*>>): Array {
                    const length: number = valueChangeProps
                        .map(ii => ii.get('valueLength'))
                        .max();

                    return Range(0, length)
                        .toList()
                        .map(index => ({
                            ...this.createPipe(index, valueChangeProps)
                        }))
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
                            const listKeys: Object = valueChangeProp.get('listKeys');

                            return {
                                ...obj,
                                [valueChangeProp.get('valueName')]: value,
                                [valueChangeProp.get('onChangeName')]: onChange,
                                key: listKeys ? listKeys.get(index) : index // use keys from listKeys if provided
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

                onModify: Function = (valueChangeProps: List<Map<string,*>>, listKeys: List<number>, modifier: Function): Function => {
                    const modify: Function = (valueListUpdated: List<Map<string,*>>, updatedListKeys: List<Map<string,*>>) => {
                        // call onChange for the list keys
                        this.props.listKeysChange(updatedListKeys);

                        // call onChange for each changeFunction
                        const valueNames: List<string> = valueChangeProps.map(ii => ii.get('valueName'));
                        IndexedSplitterPipe
                            .unzipValues(valueListUpdated, valueNames)
                            .forEach((updatedValue: List<*>, valueName: string) => {
                                const onChangeName: string = valueChangeProps
                                    .find(ii => ii.get('valueName') == valueName)
                                    .get('onChangeName');

                                const changeFunction: * = this.props[onChangeName];

                                if(!changeFunction || typeof changeFunction !== "function") {
                                    console.warn(`IndexedSplitterPipe cannot call change on "${onChangeName}" prop. Expected function, got ${changeFunction}`);
                                    return;
                                }

                                changeFunction(updatedValue);
                            });
                    };

                    const value: List<Map<string,*>> = IndexedSplitterPipe.zipValues(valueChangeProps);

                    // call the modifying function, passing in a callback for the modifying function to provide is updated info
                    return modifier(value, listKeys, modify);
                };

                onPop: Function = (value: List<Map<string,*>>, listKeys: List<number>, modify: Function) => () => {
                    modify(
                        value.pop(),
                        listKeys.pop()
                    );
                };

                onPush: Function = (value: List<Map<string,*>>, listKeys: List<number>, modify: Function) => (payload: *) => {
                    modify(
                        value.push(
                            Map({
                                value: payload
                            })
                        ),
                        listKeys.push(listKeys.max() + 1)
                    );
                };

                onSwap: Function = (value: List<Map<string,*>>, listKeys: List<number>, modify: Function) => (indexA: number, indexB: number) => {
                    const valueListUpdated: List<Map<string,*>> = value
                        .set(indexA, value.get(indexB))
                        .set(indexB, value.get(indexA));

                    const listKeysUpdated: List<Map<string,*>> = listKeys
                        .set(indexA, listKeys.get(indexB))
                        .set(indexB, listKeys.get(indexA));

                    modify(valueListUpdated, listKeysUpdated);
                };

                onSwapNext: Function = (value: List<Map<string,*>>, listKeys: List<number>, modify: Function) => (index: number) => {
                    if(index >= value.size - 1) {
                        return;
                    }
                    return this.onSwap(value, listKeys, modify)(index, index + 1);
                };

                onSwapPrev: Function = (value: List<Map<string,*>>, listKeys: List<number>, modify: Function) => (index: number) => {
                    if(index < 1) {
                        return;
                    }
                    return this.onSwap(value, listKeys, modify)(index, index - 1);
                };

                render(): React.Element<any> {
                    var newProps: Object = Object.assign({}, this.props, this.childProps);
                    return <ComponentToDecorate {...newProps} />;
                }
            }

            return IndexedSplitterPipe;
        }
    },
    DEFAULT_PROPS
);

export const IndexedSplitterPipeStateful: Function = ConfigureHock(
    (config: Function) => {
        const withState: Function = StateHock({
            initialState: (props: Object) => {
                // autogenerate an id for each value
                const {valueChangePairs} = config(props);
                const length: number = List(valueChangePairs)
                    .map(pair => List(props[pair[0]]).size)
                    .max();

                return Range(0, length).toList();
            },
            valueProp: 'listKeysValue',
            onChangeProp:'listKeysChange'
        });
        const withSplitter: Function = IndexedSplitterPipe(config);
        return Compose(
            withState,
            withSplitter
        );
    },
    DEFAULT_PROPS
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
 *
 * @property {string} [onPushProp = "onPush"]
 *
 * @property {string} [onPopProp = "onPop"]
 *
 * @property {string} [onSwapProp = "onSwap"]
 *
 * @property {string} [onSwapPrevProp = "onSwapPrev"]
 *
 * @property {string} [onSwapNextProp = "onSwapNext"]
 */

