// @flow
import React from 'react';
import type {Element} from 'react';

/**
 * @module Element
 */

/**
 * Pointfree function that lets you apply props to an element
 *
 * @example
 * // Plain
 * PropsOf({className: 'Button'})(<button/>)
 * // <button className="Button" />
 *
 *
 * // Monads
 * Some({className: 'Button'})
 *     .map(PropsOf(<button/>))
 *
 * // <button className="Button" />
 *
 *
 * // Pipe
 * const wrap = pipe(PropsOf(<button/>));
 * wrap({className: 'Button'});
 *
 * // <button className="Button" />
 *
 * @name PropsOf
 * @kind function
 *
 * @param {ReactElement} element
 * An element to compose around future elements
 *
 * @return {Function} A partially applied function waiting to be called with a element.
 */


export default function PropsOf(element: Element<*>): Object => Element<*> {
    return (props) => React.cloneElement(element, props);
}

