/* @flow */
/* eslint-disable no-unused-vars */

import React, {PropTypes} from 'react';
import {List} from 'immutable';

export const StampyPropTypes = {

    className: PropTypes.string,

    htmlProps: PropTypes.object,

    onChange: PropTypes.func,

    onChangeMulti: PropTypes.func,

    onClick: PropTypes.func,

    spruceModifier: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object
    ]),

    spruceName: PropTypes.string
};

type ClassName = string;

type HockApplier = (ComposedComponent: ReactClass<any>) => ReactClass<any>;

type HtmlProps = Object;

type ListOrArray = List<*> | Array<any>;

type SpruceModifier = string | Object;

type OnChangeMeta = {
    event: Object,
    element: Object
}

type OnChange = (newValue: string|boolean, meta: OnChangeMeta) => void;

type OnChangeMulti = (newValue: Array<string|boolean>, meta: OnChangeMeta) => void;

type OnClick = (event: Object) => void;

/**
 * HTML class names to be added to the rendered component.
 *
 * @typedef {string} ClassName
 */

/**
 * An object of attributes to be applied to the HTML tag of the component.
 *
 * @typedef {Object} HtmlProps
 */

/**
 * Spruce modifiers. Pass a string to add modifiers (space-separated if multiple)
 * or if you provide an object then only the names of the object's keys that evaluate to true will be added as modifiers.
 *
 * @typedef {(string|Object<string,boolean>)} SpruceModifier
 */

/**
 * A callback that is called by input components to notify parents of changes in their values.
 *
 * @callback OnChange
 * @param {string|boolean} newValue The input's new value.
 * @param {OnChangeMeta} meta
 */

/**
 * Meta information about the change
 *
 * @typedef OnChangeMeta
 * @property {Object} event The event that triggered the change
 * @property {Object} element The HTML element that triggered the change
 */

/**
 * A callback that is called by input components to notify parents of changes in their values.
 *
 * @callback OnChangeMulti
 * @param {Array<string|boolean>} newValue The input's new value.
 * @param {OnChangeMeta} meta
 */

/**
 * A callback that is called by input component to notify parents of changes to their values.
 *
 * @callback OnClick
 * @param {Function} event The element's HTML click event.
 */

/**
 * The base class name to use with the Spuce naming convention for this component.
 *
 * @typedef {string} SpruceName
 */

// externals

/**
 * Immutable.js Iterable
 * @typedef Iterable
 * @noexpand
 * @see https://facebook.github.io/immutable-js/docs/#/Iterable
 */

/**
 * Immutable.js List
 * @typedef List
 * @noexpand
 * @see https://facebook.github.io/immutable-js/docs/#/List
 */

/**
 * Immutable.js Map
 * @typedef Map
 * @noexpand
 * @see https://facebook.github.io/immutable-js/docs/#/Map
 */

/**
 * Immutable.js OrderedMap
 * @typedef OrderedMap
 * @noexpand
 * @see https://facebook.github.io/immutable-js/docs/#/OrderedMap
 */

/**
 * Immutable.js Record
 * @typedef Record
 * @noexpand
 * @see https://facebook.github.io/immutable-js/docs/#/Record
 */

/**
 * React Component
 * @typedef ReactComponent
 * @noexpand
 * @see https://facebook.github.io/react/docs/react-component.html
 */

/**
 * React Element
 * @typedef ReactElement
 * @noexpand
 * @see https://facebook.github.io/react/docs/react-component.html
 */
