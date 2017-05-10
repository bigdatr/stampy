// @flow

import React, {Component} from 'react';
import memoize from 'lru-memoize';
import {List, Map, is} from 'immutable';
import {getIn, setIn} from '../util/CollectionUtils';

type PartialChangeMap = Map<string,Map<string,Function>>;

/**
 * @module Pipes
 */

export default (config: Function = () => ({})): HockApplier => {
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

            initialize: Function = (props: Object) => {
                this.partialChangeFunctions = List(config(props).paths)
                    .reduce((funcs: PartialChangeMap, path: string): PartialChangeMap => {
                        const map: Map<string,*> = List(config(props).keys)
                            .reduce((map: Map<string,*>, key: string): Map<string,*> => {
                                return map.set(key, this.createPartialChange(path, key));
                            }, Map());

                        return funcs.set(path, map);
                    }, Map());
            }

            componentWillReceiveProps(nextProps: Object) {
                const keysChanged: boolean = is(
                    List(config(this.props).paths),
                    List(config(nextProps).paths)
                );

                const pathsChanged: boolean = is(
                    List(config(this.props).keys),
                    List(config(nextProps).keys)
                );

                if(keysChanged || pathsChanged) {
                    this.initialize(nextProps);
                }
            }

            createPipe: Function = (props: Object, path: string): Object => {
                const {
                    keys,
                    splitPropModifier = ii => ii
                } = config(props);

                const pathArray: Array<string> = path.split(".");
                const pipeProps: Object = List(keys)
                    .reduce((obj: Object, key: string): Object => ({
                        ...obj,
                        [`${key}Value`]: getIn(props[`${key}Value`] || {}, pathArray),
                        [`${key}Change`]: this.partialChangeFunctions.getIn([path, key])
                    }), {});

                return splitPropModifier(pipeProps);
            };

            createPartialChange: Function = (path: string, key: string) => (newPartialValue: *) => {
                const existingValue: * = this.props[`${key}Value`];
                const updatedValue: * = setIn(existingValue, path.split("."), newPartialValue);
                this.props[`${key}Change`](updatedValue);
            };

            nestPipes: Function = (flatPipes: Object): Object => {
                return Object.keys(flatPipes)
                    .reduce((fields: Object, key: string) => {
                        return setIn(fields, key.split("."), flatPipes[key]);
                    }, {});
            };

            // memoize only the most recently generated split
            split: Function = memoize()(
                (props: Object): Object => {

                    const flatPipes: Object = List(config(props).paths)
                        // turn ['a','b'] into {a: null, b: null}
                        .reduce((flatPipes: Map<string,*>, path: string): Map<string,*> => {
                            return flatPipes.set(path, null);
                        }, Map())
                        // assign an object with value/change pairs to each
                        .map((pipe: *, path: string) => this.createPipe(props, path))
                        .toObject();

                    return this.nestPipes(flatPipes);
                }
            );

            render(): React.Element<any> {
                const {splitProp} = config(this.props)
                const hockProps: Object = {
                    [splitProp]: this.split(this.props)
                };
                const newProps = Object.assign({}, this.props, hockProps);
                return <ComponentToDecorate {...newProps} />;
            }
        }

        return KeyedSplitterPipe;
    }
}
