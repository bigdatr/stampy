// @flow

import React, {Component} from 'react';
import {fromJS, List, Map, is} from 'immutable';
import ConfigureHock from '../util/ConfigureHock';
import {getIn, setIn} from '../util/CollectionUtils';
import memoize from 'lru-memoize';

/**
 * @module Pipes
 */

export default ConfigureHock(
    (config: Function): HockApplier => {
        return (ComponentToDecorate: ReactClass<any>): ReactClass<any> => {

            /**
             * @component
             *
             * The SplitKeyPipe lets you split a pipe with Objects or Maps as a value
             * into a series of smaller pipes.
             * Partial values and partial change functions are given to each pipe
             * so they can continue to be composed.
             *
             * A common usage would be to split a pipe containing the values of a form
             * into a series of pipes, one for each field.
             *
             * @childprop {Object} split
             * The prop containing the new pipes that SplitKeyPipe created.
             * This prop's name can be changed in config.
             *
             * @decorator {SplitKeyPipe}
             * @decorator {HockApplier}
             *
             * @memberof module:Pipes
             */

            class SplitKeyPipe extends Component {

                childProps: Object;

                constructor(props: Object) {
                    super(props);
                    const {
                        paths,
                        splitProp,
                        valueChangePairs
                    } = config(props);

                    const valueChangeProps: List<Map<string,*>> = SplitKeyPipe.getValueChangeProps(
                        fromJS(valueChangePairs),
                        props
                    );

                    this.childProps = {
                        [splitProp]: this.split(paths, valueChangeProps)
                    };
                }

                componentWillReceiveProps(nextProps: Object) {
                    this.updateChildProps(this.props, nextProps);
                }

                updateChildProps: Function = (prevProps: Object, nextProps: Object) => {
                    const prevConfig: Object = config(prevProps);
                    const nextConfig: Object = config(nextProps);

                    const paths: List<string> = List(nextConfig.paths);
                    const pathsChanged: boolean = !is(paths, List(prevConfig.paths));

                    const {splitProp} = nextConfig;
                    const splitPropChanged: boolean = splitProp !== prevConfig.splitProp;

                    // get the props based on the values and change function in the value change pairs
                    const prevValueChangePairs: List<ValueChangePairList> = fromJS(prevConfig.valueChangePairs);
                    const nextValueChangePairs: List<ValueChangePairList> = fromJS(nextConfig.valueChangePairs);
                    const valueChangePairsChanged: boolean = !is(prevValueChangePairs, nextValueChangePairs);

                    const valueChangeProps: List<Map<string,*>> = SplitKeyPipe.getValueChangeProps(
                        nextValueChangePairs,
                        nextProps,
                        prevProps
                    );

                    // check to see if any values aren't strictly equal
                    // P.S. we don't care if onChange functions aren't equal as these aren't used in the creation of child props
                    // (they are only used when onChange is actually called)
                    const valuesChanged = valueChangeProps.some(ii => ii.get('value') !== ii.get('prevValue'));

                    // only update childProps when necessary
                    if(!this.childProps || splitPropChanged || pathsChanged || valueChangePairsChanged || valuesChanged) {
                        // if the config changes this will require a more expensive update, recreating all the onChange functions
                        this.childProps = {
                            [splitProp]: this.split(paths, valueChangeProps)
                        };
                    }
                };

                static getValueChangeProps(
                    valueChangePairs: List<ValueChangePairList>,
                    nextProps: Object,
                    prevProps: Object = {}
                ): List<ValueChangePairList> {

                    return valueChangePairs
                        .map(ii => Map({
                            value: nextProps[ii.get(0)],
                            prevValue: prevProps[ii.get(0)],
                            valueName: ii.get(0),
                            onChangeName: ii.get(1)
                        }));
                }

                split: Function = (paths: List<string>, valueChangeProps: List<Map<string,*>>): Object => {
                    return paths
                        // turn ['a','b'] into {a: null, b: null}
                        .reduce((flatPipes: Map<string,*>, path: string): Map<string,*> => {
                            return flatPipes.set(path, null);
                        }, Map())
                        // assign an object with value/change pairs to each
                        .map((pipe: *, path: string) => {
                            return this.createPipe(path, valueChangeProps);
                        })
                        .reduce((pipes: Object, pipe: Object, path: string) => {
                            return setIn(pipes, path.split("."), pipe);
                        }, {});
                };

                createPipe: Function = (path: string, valueChangeProps: List<Map<string,*>>): Object => {
                    return valueChangeProps
                        .reduce((obj: Object, valueChangeProp: Map<string,*>): Object => {
                            const valueProp: * = valueChangeProp.get('value');
                            const value: * = valueProp
                                ? getIn(valueProp, path.split("."))
                                : undefined;

                            const valueName: string = valueChangeProp.get('valueName');
                            const onChangeName: string = valueChangeProp.get('onChangeName');
                            const onChange: Function = this.createPartialChangeMemoized(path, valueName, onChangeName);

                            return {
                                ...obj,
                                [valueChangeProp.get('valueName')]: value,
                                [valueChangeProp.get('onChangeName')]: onChange
                            };
                        }, {});
                };

                createPartialChange: Function = (path: string, valueName: string, onChangeName: string) => (newPartialValue: *) => {
                    const existingValue: * = this.props[valueName];
                    const changeFunction: * = this.props[onChangeName];
                    const updatedValue: * = setIn(existingValue, path.split("."), newPartialValue);

                    if(!changeFunction || typeof changeFunction !== "function") {
                        console.warn(`SplitKeyPipe cannot call change on "${onChangeName}" prop. Expected function, got ${changeFunction}`);
                        return;
                    }

                    changeFunction(updatedValue);
                };

                createPartialChangeMemoized: Function = memoize()(this.createPartialChange);

                render(): React.Element<any> {
                    var newProps: Object = Object.assign({}, this.props, this.childProps);
                    return <ComponentToDecorate {...newProps} />;
                }
            }

            return SplitKeyPipe;
        }
    },
    (): Object => ({
        paths: [],
        valueChangePairs: [['value', 'onChange']],
        splitProp: 'split'
    })
);


/**
 * @callback SplitKeyPipe
 * @param {SplitKeyPipeConfig} [config]
 */

/**
 * @callback SplitKeyPipeConfig
 * @param {Object} props
 * @return {SplitKeyPipeConfigResult}
 * A function that accepts props and returns configuration for SplitKeyPipe.
 */

/**
 * @typedef SplitKeyPipeConfigResult
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
 * Sets the name of the prop containing the new pipes that SplitKeyPipe created.
 */

