// @flow

import {List, Map} from 'immutable';

/**
 * @module Utils
 */

/**
 * `RemoveProps` is a utility function to remove certain props from a props object.
 * The original props object will not be mutated, and nested objects and arrays will be passed through without cloning.
 *
 * @example
 * // filtering using an array
 * const filteredProps = RemoveProps(['badProp'], props);
 *
 * // filtering using an object, only props with the names
 * // of object keys that evaluate to true will be removed
 * const propsToRemove = {
 *     removeMeAlways: true,
 *     removeMeSometimes: Math.random() > 0.5.
 *     removeMeNever: false
 * };
 * const filteredProps = RemoveProps(propsToRemove, props);
 *
 * @param {List<string>|Array<string>|Map<string,boolean>|Object} propNames The props to remove. Passing an array or List of strings will remove props by name
 *    If you pass a Map or object then only props with the names of object keys that evaluate to true will be removed.
 * @param {Object} onPropChangeFunction The function to be called. It is passed a single argument, the updated props object.
 * @return {Object} The filtered set of props
 */

export default function RemoveProps(propNames: List<string>|Array<string>|Map<string,boolean>|Object, props: Object): Object {

    const propList: List<any> = List.isList(propNames) || propNames instanceof Array
        ? List(propNames)
        : Map(propNames)
            .filter(ii => ii)
            .keySeq()
            .toList();

    return propList
        .reduce((filteredProps: Map<string,any>, propName: string): Map<string,any> => {
            return filteredProps.delete(propName);
        }, Map(props))
        .toObject();
}
