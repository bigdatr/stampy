/* eslint-disable */

import {List, Map, Iterable} from 'immutable';

/**
 * @module Utils
 */

const clone: Function = (item: Object|Array<*>): Object|Array<*> => {
    return Array.isArray(item) ? item.slice() : Object.assign({}, item);
};

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

export function get(collection: List<*>|Map<*,*>|Object|Array<*>, key: string|number, notFoundValue: * = null): * {
    if(!has(collection, key)) {
        return notFoundValue;
    }
    if(Iterable.isIterable(collection)) {
        return collection.get(key, notFoundValue);
    }
    return collection[key];
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

export function getIn(collection: List<*>|Map<*,*>|Object|Array<*>, keyPath: Array<string>, notFoundValue: * = null): * {
    var item: * = collection;
    for(let key of keyPath) {
        if(!has(item, key)) {
            return notFoundValue;
        }
        item = get(item, key);
    }
    return item;
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
    if(Iterable.isIterable(collection)) {
        return collection.set(key, value);
    }

    var newCollection: Array<*>|Object = collection
        ? clone(collection)
        : {};

    newCollection[key] = value;
    return newCollection;
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
    if(Iterable.isIterable(collection)) {
        return collection.setIn(keyPath, value);
    }

    for(var i = keyPath.length - 1; i >= 0; i--) {
        value = set(
            getIn(collection, keyPath.slice(0, i)),
            keyPath[i],
            value
        );
    }

    return value;
}

/**
 * `CollectionUtils` is a set of utility functions that allow you to perform some of Immutable's functions on collections
 * that may or may not be immutable.
 */

const CollectionUtils = {
    has,
    get,
    getIn,
    set,
    setIn
};

export default CollectionUtils;
