// @flow

import React, {Component} from 'react';
import {fromJS, List, Map} from 'immutable';
import ConfigureHock from '../util/ConfigureHock';
import {getIn, setIn} from '../util/CollectionUtils';

/**
 * @module Pipes
 */

export default ConfigureHock(
    (config: Function): HockApplier => {
        return (ComponentToDecorate: ReactClass<any>): ReactClass<any> => {

            /**
             * @component
             *
             * The KeyedSplitterPipe lets you split a pipe with Objects or Maps as a value
             * into a series of smaller pipes.
             * Partial values and partial change functions are given to each pipe
             * so they can continue to be composed.
             *
             * A common usage would be to split a pipe containing the values of a form
             * into a series of pipes, one for each field.
             *
             * @childprop {Object} split
             * The prop containing the new pipes that KeyedSplitterPipe created.
             * This prop's name can be changed in config.
             *
             * @decorator {KeyedSplitterPipe}
             * @decorator {HockApplier}
             *
             * @memberof module:Pipes
             */

            class KeyedSplitterPipe extends Component {

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
                    const paths = List(nextConfig.paths);

                    // get the props based on the values and change function in the value change pairs
                    const prevValueChangePairs: List<ValueChangePairList> = fromJS(prevConfig.valueChangePairs);
                    const nextValueChangePairs: List<ValueChangePairList> = fromJS(nextConfig.valueChangePairs);

                    const prevValueChangeProps: List<Map<string,*>> = KeyedSplitterPipe.getValueChangeProps(prevProps, prevValueChangePairs);
                    const nextValueChangeProps: List<Map<string,*>> = KeyedSplitterPipe.getValueChangeProps(nextProps, nextValueChangePairs);

                    // check each prop to see if any values aren't strictly equal
                    // P.S. we don't care if onChange functions aren't equal as these aren't used in the creation of child props
                    // (they are only used when onChange is actually called)
                    const valuesHaveChanged = prevValueChangeProps
                        .some((prev, key) => prev.get('value') !== nextValueChangeProps.getIn([key, 'value']));

                    // only update childProps when necessary
                    if(
                        !paths.equals(List(prevConfig.paths))
                        || prevConfig.splitProp !== splitProp
                        || valuesHaveChanged
                        || !this.childProps
                    ) {
                        this.childProps = {
                            [splitProp]: this.split(paths, nextValueChangeProps)
                        };
                    }
                };

                static getValueChangeProps(props: Object, valueChangePairs: List<ValueChangePairList>): List<Map<string,*>> {
                    return valueChangePairs
                        .map(ii => Map({
                            value: props[ii.get(0)],
                            valueName: ii.get(0),
                            onChangeName: ii.get(1)
                        }));
                }

                split(paths: List<string>, valueChangeProps: List<Map<string,*>>): Object {
                    return paths
                        // turn ['a','b'] into {a: null, b: null}
                        .reduce((flatPipes: Map<string,*>, path: string): Map<string,*> => {
                            return flatPipes.set(path, null);
                        }, Map())
                        // assign an object with value/change pairs to each
                        .map((pipe: *, path: string) => {
                            const pathArray: Array<string> = path.split(".");
                            return this.createPipe(pathArray, valueChangeProps);
                        })
                        .reduce((pipes: Object, pipe: Object, path: string) => {
                            return setIn(pipes, path.split("."), pipe);
                        }, {});
                }

                createPipe(pathArray: Array<string>, valueChangeProps: List<Map<string,*>>): Object {
                    return valueChangeProps
                        .reduce((obj: Object, valueChangeProp: Map<string,*>): Object => {
                            const valueProp: * = valueChangeProp.get('value');
                            const value: * = valueProp
                                ? getIn(valueProp, pathArray)
                                : undefined;

                            const onChange: Function = this.createPartialChange(pathArray, valueChangeProp);

                            return {
                                ...obj,
                                [valueChangeProp.get('valueName')]: value,
                                [valueChangeProp.get('onChangeName')]: onChange
                            };
                        }, {});
                }

                createPartialChange: Function = (pathArray: Array<string>, valueChangeProp: Map<string,*>) => (newPartialValue: *) => {
                    const valueName: string = valueChangeProp.get('valueName');
                    const onChangeName: string = valueChangeProp.get('onChangeName');

                    const existingValue: * = this.props[valueName];
                    const changeFunction: * = this.props[onChangeName];
                    const updatedValue: * = setIn(existingValue, pathArray, newPartialValue);

                    if(!changeFunction || typeof changeFunction !== "function") {
                        console.warn(`KeyedSplitterPipe cannot call change on "${onChangeName}" prop. Expected function, got ${changeFunction}`);
                        return;
                    }

                    changeFunction(updatedValue);
                };

                render(): React.Element<any> {
                    var newProps: Object = Object.assign({}, this.props, this.childProps);
                    return <ComponentToDecorate {...newProps} />;
                }
            }

            return KeyedSplitterPipe;
        }
    },
    (): Object => ({
        paths: [],
        valueChangePairs: [['value', 'onChange']],
        splitProp: 'split'
    })
);


/**
 * @callback KeyedSplitterPipe
 * @param {KeyedSplitterPipeConfig} [config]
 */

/**
 * @callback KeyedSplitterPipeConfig
 * @param {Object} props
 * @return {KeyedSplitterPipeConfigResult}
 * A function that accepts props and returns configuration for KeyedSplitterPipe.
 */

/**
 * @typedef KeyedSplitterPipeConfigResult
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
 * Sets the name of the prop containing the new pipes that KeyedSplitterPipe created.
 */

