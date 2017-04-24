// @flow

import {List, Map, Iterable, fromJS} from 'immutable';

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
        // $FlowFixMe: Immutable's flow type checking on has() appears to be broken
        return collection.has(key);
    }
    if(Array.isArray(collection)) {
        // $FlowFixMe: flow doesnt seem to know that we've already confirmed that key is a number
        return typeof key == "number" && key >= 0 && key < collection.length;
    }
    // $FlowFixMe: flow doesnt seem to know that Lists will not reach this line because they return true for isIterable
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

export function get(collection: List<*>|Map<*,*>|Object|Array<*>, key: string|number, notFoundValue: ?*): * {
    if(!has(collection, key)) {
        return notFoundValue;
    }
    if(Iterable.isIterable(collection)) {
        // $FlowFixMe: flow doesnt seem to know that collections of type array wont make it to this part
        return collection.get(key, notFoundValue);
    }
    // $FlowFixMe: flow doesnt seem to know that Lists and Maps wont make it to this part
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

export function getIn(collection: List<*>|Map<*,*>|Object|Array<*>, keyPath: Array<string>, notFoundValue: *): * {
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
        // $FlowFixMe: flow doesnt seem to know that collections of type array wont make it to this part
        return collection.set(key, value);
    }
    var newCollection: Array<*>|Object = clone(collection);
    newCollection[key] = value;
    return newCollection;
}

/**
 * A function that works like Immutable's `setIn`, but can also work on Objects and Arrays.
 * Operations are done immutably even on non immutable.js collections
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
        // $FlowFixMe: flow doesnt seem to know that collections of type array wont make it to this part
        return collection.setIn(keyPath, value);
    }
    return fromJS(collection).setIn(keyPath, value).toJS();
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
