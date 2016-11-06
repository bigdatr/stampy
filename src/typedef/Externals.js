/* @flow */
/* eslint-disable no-unused-vars */
import {List} from 'immutable';
import React from 'react';


/**
 * Immutable.js Iterable
 * @typedef Iterable
 * @see https://facebook.github.io/immutable-js/docs/#/Iterable
 */

/**
 * Immutable.js List
 * @typedef List
 * @see https://facebook.github.io/immutable-js/docs/#/List
 */

/**
 * Immutable.js Map
 * @typedef Map
 * @see https://facebook.github.io/immutable-js/docs/#/Map
 */

/**
 * Immutable.js OrderedMap
 * @typedef OrderedMap
 * @see https://facebook.github.io/immutable-js/docs/#/OrderedMap
 */

/**
 * Immutable.js Record
 * @typedef Record
 * @see https://facebook.github.io/immutable-js/docs/#/Record
 */

/**
 * React Component
 * @typedef Component
 * @see https://facebook.github.io/react/docs/react-component.html
 */




/**
 * Either and Immutable List or a Javascript Array
 */
type ListOrArray = List<*> | Array<any>;


/**
 * Renderable Content
 */
type Renderable = React.Element<any> | string | number | boolean | null
