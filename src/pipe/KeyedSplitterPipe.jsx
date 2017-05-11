// @flow

import React, {Component} from 'react';
import memoize from 'lru-memoize';
import {fromJS, List, Map, is} from 'immutable';
import ConfigureHock from '../util/ConfigureHock';
import {getIn, setIn} from '../util/CollectionUtils';

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
             * The KeyedSplitterPipe lets you split a pipe into a series of smaller pipes.
             * Partial values and partial change functions are given to each pipe.
             *
             * A common usage would be to split a pipe containing the values of a form
             * into a series of pipes, one for each field.
             *
             * @decorator {KeyedSplitterPipe}
             * @memberof module:Pipes
             */

            class KeyedSplitterPipe extends Component {

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
                    const {paths, keys} = config(props);

                    this.partialChangeFunctions = List(paths)
                        .reduce((funcs: PartialChangeMap, path: string): PartialChangeMap => {
                            const map: Map<string,*> = fromJS(keys)
                                .reduce((map: Map<string,*>, key: List<string>): Map<string,*> => {
                                    return map.set(key.get(1), this.createPartialChange(path, key));
                                }, Map());

                            return funcs.set(path, map);
                        }, Map());
                }

                createPartialChange: Function = (path: string, key: List<string>) => (newPartialValue: *) => {
                    const [keyValue, keyChange] = key.toArray();
                    const existingValue: * = this.props[keyValue];
                    const updatedValue: * = setIn(existingValue, path.split("."), newPartialValue);
                    const changeFunction: * = this.props[keyChange];
                    if(!changeFunction || typeof changeFunction !== "function") {
                        console.warn(`KeyedSplitterPipe cannot call change on "${keyChange}" prop. Expected function, got ${changeFunction}`);
                        return;
                    }
                    this.props[keyChange](updatedValue);
                };

                // creates an output pipe
                // declared static (contains no reference to "this")
                // so it can be called from memoized methods
                static createPipe(
                    props: Object,
                    path: string,
                    keys: Array<Array<string>>,
                    partialChangeFunctions: PartialChangeMap
                ): Object {

                    const pathArray: Array<string> = path.split(".");
                    return fromJS(keys)
                        .reduce((obj: Object, key: List<string>): Object => {
                            const [keyValue, keyChange] = key.toArray();
                            const value: * = props[keyValue]
                                ? getIn(props[keyValue], pathArray)
                                : undefined;

                            return {
                                ...obj,
                                [keyValue]: value,
                                [keyChange]: partialChangeFunctions.getIn([path, keyChange])
                            };
                        }, {});
                }

                // creates an output pipe
                // declared static (contains no reference to "this")
                // so it can be called from memoized methods
                static split(
                    props: Object,
                    paths: Array<string>,
                    keys: Array<Array<string>>,
                    partialChangeFunctions: PartialChangeMap
                ): Object {

                    return List(paths)
                        // turn ['a','b'] into {a: null, b: null}
                        .reduce((flatPipes: Map<string,*>, path: string): Map<string,*> => {
                            return flatPipes.set(path, null);
                        }, Map())
                        // assign an object with value/change pairs to each
                        .map((pipe: *, path: string) => KeyedSplitterPipe.createPipe(props, path, keys, partialChangeFunctions))
                        .reduce((pipes: Object, pipe: Object, path: string) => {
                            return setIn(pipes, path.split("."), pipe);
                        }, {});
                }

                // memoize only the most recently generated split
                // also make sure all variables that can affect the output of this.split()
                // are passed in as arguments, so memoization can work correctly
                splitMemoized: Function = memoize()(KeyedSplitterPipe.split);

                render(): React.Element<any> {
                    const {splitProp, paths, keys} = config(this.props);
                    const hockProps: Object = {
                        [splitProp]: this.splitMemoized(this.props, paths, keys, this.partialChangeFunctions)
                    };
                    const newProps = Object.assign({}, this.props, hockProps);
                    return <ComponentToDecorate {...newProps} />;
                }
            }

            return KeyedSplitterPipe;
        }
    },
    {
        keys: [['value', 'onChange']],
        paths: [],
        splitProp: 'split'
    }
);
