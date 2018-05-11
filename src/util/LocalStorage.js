// @flow

/**
 * @module Utils
 */

/**
 * An asyncronous wrapper around localStorage.getItem
 *
 * @example
 * LocalStorageLoad('foo').then(foo => console.log(foo))
 *
 * @param {string} key - The set of functions to compose.
 * @return {Promise} a promise containing the contents of key
 */
export async function LocalStorageLoad(key: string): Promise<*> {
    const state = localStorage.getItem(key);
    if(state == null) {
        return undefined;
    }
    return JSON.parse(state);
}

/**
 * An asyncronous wrapper around localStorage.setItem
 *
 * @example
 * LocalStorageLoad('foo').then(foo => console.log(foo))
 *
 * @param {string} key - The key to store the data.
 * @param {string} value - The data to store.
 * @return {Promise} a promise containing the value stored
 */
export async function LocalStorageSave(key: string, value: *): Promise<*> {
    if(value == null) {
        return value;
    }
    const state = JSON.stringify(value);
    localStorage.setItem(key, state);
    return state;
}
