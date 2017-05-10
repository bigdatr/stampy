// @flow
// Code from redux: https://github.com/reactjs/redux/blob/master/LICENSE.md

/**
 * @module Utils
 */

/**
 * `Compose` accepts a number of functions as arguments, and nests them inside each other.
 * From right to left, each function is passed into the next.
 *
 * @param {Object} props The set of props to filter.
 * @return {Object} The filtered set of props.
 */

export default function Compose(...funcs: Array<Function>): Function {
    if(funcs.length === 0) {
        return arg => arg;
    }
    if(funcs.length === 1) {
        return funcs[0];
    }
    return funcs.reduce((a, b) => (...args) => a(b(...args)));
}
