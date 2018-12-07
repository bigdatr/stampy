/* eslint-disable */

import {
    List,
    Map,
    Iterable
} from 'immutable';
import isPlainObject from 'is-plain-object';

import unmutableGet from 'unmutable/lib/get';
import unmutableSet from 'unmutable/lib/set';
import unmutableGetIn from 'unmutable/lib/getIn';
import unmutableSetIn from 'unmutable/lib/setIn';
import unmutableHas from 'unmutable/lib/has';
import unmutableIsKeyed from 'unmutable/lib/util/isKeyed';
import unmutableIsIndexed from 'unmutable/lib/util/isIndexed';

/**
 * @module Utils
 */

const clone: Function = (item: Object|Array<*>): Object|Array<*> => {
    return Array.isArray(item) ? item.slice() : Object.assign({}, item);
};

/**
 * A function that returns true if the argument is keyed.
 * @example
 * console.log(isKeyed({})); // returns true
 * console.log(isKeyed([])); // returns false
 * console.log(isKeyed(Map())); // returns true
 * console.log(isKeyed(List())); // returns false
 *
 * @param {*} collection The item to check
 * @memberof module:Utils~CollectionUtils
 */

export function isKeyed(item: *): boolean {
    return unmutableIsKeyed(item);
}

/**
 * A function that returns true if the argument is indexed.
 * @example
 * console.log(isKeyed({})); // returns true
 * console.log(isKeyed([])); // returns false
 * console.log(isKeyed(Map())); // returns true
 * console.log(isKeyed(List())); // returns false
 *
 * @param {*} collection The item to check
 * @memberof module:Utils~CollectionUtils
 */

export function isIndexed(item: *): boolean {
    return unmutableIsIndexed(item);
}

/**
 * A function that works like Immutable's `has`, but can also accept Objects and Arrays
 * @example
 * const obj = {
 *   a: "ABC"
 * };
 * console.log(has(obj, 'a')); // returns true
 * console.log(has(obj, 'b')); // returns false
 * console.log(has(fromJS(obj), 'a')); // returns true
 * console.log(has(fromJS(obj), 'b')); // returns false
 *
 * @param {List<*>|Map<*,*>|Object|Array<*>} collection The collection to process
 * @param {string|number} key The key or index to access
 * @memberof module:Utils~CollectionUtils
 */

export function has(collection: List<*>|Map<*,*>|Object|Array<*>, key: string|number): * {
    if(Iterable.isIterable(collection)) {
        return collection.has(key);
    }
    if(Array.isArray(collection)) {
        return typeof key == "number" && key >= 0 && key < collection.length;
    }
    return collection.hasOwnProperty(key);
}


/**
 * A function that works like Immutable's `get`, but can also accept Objects and Arrays
 * @example
 * const obj = {
 *   a: "ABC"
 * };
 * console.log(get(obj, 'a')); // outputs "ABC"
 * console.log(get(fromJS(obj), 'a')); // also outputs "ABC"
 *
 * @param {List<*>|Map<*,*>|Object|Array<*>} collection The collection to process
 * @param {string|number} key The key or index to access
 * @param {*} notFoundValue The value to be returned when the key is not found
 * @memberof module:Utils~CollectionUtils
 */

export function get(collection: List<*>|Map<*,*>|Object|Array<*>, key: string|number, notFoundValue: * = undefined): * {
    return unmutableGet(key, notFoundValue)(collection);
}

/**
 * A function that works like Immutable's `getIn`, but can also accept Objects and Arrays
 * @example
 * const obj = {
 *   a: {
 *     b: "ABC"
 *   }
 * };
 * console.log(get(obj, ['a', 'b'])); // outputs "ABC"
 * console.log(get(fromJS(obj), ['a', 'b'])); // also outputs "ABC"
 *
 * @param {List<*>|Map<*,*>|Object|Array<*>} collection The collection to process
 * @param {Array<string|number>} keyPath The keyPath to access
 * @param {*} notFoundValue The value to be returned when the key is not found
 * @memberof module:Utils~CollectionUtils
 */

export function getIn(collection: List<*>|Map<*,*>|Object|Array<*>, keyPath: Array<string>, notFoundValue: * = undefined): * {
    return unmutableGetIn(keyPath, notFoundValue)(collection);
}

/**
 * A function that works like Immutable's `set`, but can also work on Objects and Arrays.
 * Operations are done immutably even on non immutable.js collections
 * @example
 * const obj = {};
 * console.log(set(obj, 'a', '!!!')); // outputs {a: "!!!"}
 *
 * @param {List<*>|Map<*,*>|Object|Array<*>} collection The collection to process
 * @param {string|number} key The key or index to set
 * @param {*} value The value to set
 * @memberof module:Utils~CollectionUtils
 */

export function set(collection: List<*>|Map<*,*>|Object|Array<*>, key: string|number, value: *): List<*>|Map<*,*>|Object|Array<*> {
    return unmutableSet(key, value)(collection);
}

/**
 * A function that works like Immutable's `setIn`, but can also work on Objects and Arrays.
 * Operations are done immutably even on non immutable.js collections.
 *
 * Please note that if you set deep properties on objects or arrays with circular references
 * this may result in parts of the collection being cloned.
 *
 * @example
 * const obj = {
 *   a: {}
 * };
 * console.log(setIn(obj, ['a', 'b'], '!!!')); // outputs {a: {b: "!!!"}}
 *
 * @param {List<*>|Map<*,*>|Object|Array<*>} collection The collection to process
 * @param {Array<string|number>} keyPath The key or index to set
 * @param {*} value The value to set
 * @memberof module:Utils~CollectionUtils
 */

export function setIn(collection: List<*>|Map<*,*>|Object|Array<*>, keyPath: Array<string|number>, value: *): List<*>|Map<*,*>|Object|Array<*> {
    return unmutableSetIn(keyPath, value)(collection);
}

/**
 * `CollectionUtils` is a set of utility functions that allow you to perform some of Immutable's functions on collections
 * that may or may not be immutable.
 */

const CollectionUtils = {
    isKeyed,
    has,
    get,
    getIn,
    set,
    setIn
};

export default CollectionUtils;
