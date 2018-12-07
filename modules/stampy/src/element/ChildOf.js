// @flow
import React from 'react';
import type {ElementType} from 'react';
import type {Element} from 'react';


/**
 * @module Element
 */

/**
 * Pointfree function that lets you wrap a child with an element
 *
 * @example
 * // Plain
 * ChildOf('Text')(<button/>)
 * // <button>Text</button>
 *
 *
 * // Monads
 * Some('Text')
 *     .map(ChildOf(<button/>))
 *     .map(ChildOf(<section/>))
 *
 * // <section>
 * //     <button>Text</button>
 * // </section>
 *
 *
 * // Pipe
 * const wrap = pipe(ChildOf(<button/>), ChildOf(<section/>);
 * wrap('Text');
 *
 * // <section>
 * //     <button>Text</button>
 * // </section>
 *
 * @name ChildOf
 * @kind function
 *
 * @param {ReactElement} element
 * An element to compose around future elements
 *
 * @return {Function} A partially applied function waiting to be called with a element.
 */


export default function ChildOf(element: Element<*>): ElementType => Element<*> {
    return (child) => React.cloneElement(element, {}, child);
}

