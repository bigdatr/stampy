// @flow

import React, {Component} from 'react';
import {fromJS, List, Map, Range} from 'immutable';
import ConfigureHock from '../util/ConfigureHock';
import {get, set} from '../util/CollectionUtils';

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

                    const prevValueChangeProps: Map<string,Map<string,*>> = IndexedSplitterPipe.getValueChangeProps(prevProps, prevValueChangePairs);
                    const nextValueChangeProps: Map<string,Map<string,*>> = IndexedSplitterPipe.getValueChangeProps(nextProps, nextValueChangePairs);

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

                static getValueChangeProps(props: Object, valueChangePairs: List<ValueChangePairList>): Map<string,Map<string,*>> {
                    return valueChangePairs
                        .map((ii) => Map({
                            value: props[ii.get(0)],
                            valueLength: List(props[ii.get(0)]).size,
                            valueName: ii.get(0),
                            onChangeName: ii.get(1),
                            listKeys: props.listKeysValue
                        }))
                        .reduce((map: Map<string,Map<string,*>>, ii: Map<string,*>) => {
                            return map.set(ii.get('valueName'), ii);
                        }, Map());
                }

                static zipValues(unzipped: Map<string,List<*>|Array<*>>): List<Map<string,*>> {
                    // find total length of output value i.e. the longest input value
                    const length: number = unzipped
                        .map(ii => List(ii).size)
                        .max();

                    // zip the values together, fill with undefined where required
                    return Range(0, length)
                        .toList()
                        .map((index: number) => Map(
                            unzipped.reduce((obj: Object, value: List<*>|Array<*>, valueName: string): Object => {
                                obj[valueName] = get(value, index);
                                return obj;
                            }, {})
                        ));
                }

                static unzipValues(zipped: List<Map<string,*>>, valueNames: List<string>): Map<string,List<*>> {
                    return Map(
                        valueNames.reduce((obj: Object, valueName: string) => {
                            obj[valueName] = zipped.map(ii => ii.get(valueName));
                            return obj;
                        }, {})
                    );
                }

                split(valueChangeProps: List<Map<string,*>>): List<*>|Array<*> {
                    const length: number = valueChangeProps
                        .map(ii => ii.get('valueLength'))
                        .max();

                    const isValueList: boolean = List.isList(
                        valueChangeProps.getIn(['value', 'value'])
                    );

                    const pipes: List<*> = Range(0, length)
                        .toList()
                        .map(index => ({
                            ...this.createPipe(index, valueChangeProps)
                        }));

                    return isValueList
                        ? pipes
                        : pipes.toArray();
                }

                createPipe(index: number, valueChangeProps: List<Map<string,*>>): Object {
                    return valueChangeProps
                        .reduce((obj: Object, valueChangeProp: Map<string,*>): Object => {
                            const valueProp: * = valueChangeProp.get('value');
                            const value: * = get(valueProp, index);

                            const onChange: Function = this.createPartialChange(index, valueChangeProp);
                            const listKeys: Object = valueChangeProp.get('listKeys');

                            return {
                                ...obj,
                                [valueChangeProp.get('valueName')]: value,
                                [valueChangeProp.get('onChangeName')]: onChange,
                                key: listKeys ? List(listKeys).get(index) : index // use keys from listKeys if provided
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

                onModify: Function = (valueChangeProps: List<Map<string,*>>, listKeys: ?List<number>, modifier: Function): Function => {

                    const unzipped: Map<string, List<*>|Array<*>> = valueChangeProps.map(ii => ii.get('value'));

                    const modify: Function = (valueListUpdated: List<Map<string,*>>, updatedListKeys: List<Map<string,*>>) => {

                        // call onChange for each changeFunction
                        const valueNames: List<string> = valueChangeProps.map(ii => ii.get('valueName'));
                        IndexedSplitterPipe
                            .unzipValues(valueListUpdated, valueNames)
                            .forEach((updatedValue: List<*>, valueName: string) => {
                                // $FlowFixMe: flow's not clever enough to realize that item will always be found
                                const item: Map<string,*> = valueChangeProps.get(valueName);
                                const onChangeName: string = item.get('onChangeName');
                                const changeFunction: * = this.props[onChangeName];

                                if(!changeFunction || typeof changeFunction !== "function") {
                                    console.warn(`IndexedSplitterPipe cannot call change on "${onChangeName}" prop. Expected function, got ${changeFunction}`);
                                    return;
                                }

                                changeFunction(
                                    List.isList(unzipped.get(valueName))
                                        ? updatedValue
                                        : updatedValue.toArray()
                                );
                            });

                        // call onChange for the list keys
                        this.props.listKeysChange && this.props.listKeysChange(updatedListKeys);
                    };

                    const zipped: List<Map<string,*>> = IndexedSplitterPipe.zipValues(unzipped);
                    if(!listKeys) {
                        listKeys = List();
                    }

                    // call the modifying function, passing in a callback for the modifying function to provide is updated info
                    return modifier(zipped, listKeys, modify);
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

                    const listKeysUpdated: List<number> = listKeys
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

export default IndexedSplitterPipe;

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

