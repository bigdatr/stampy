// @flow
import classnames from 'classnames';

type ClassNameProps = {
    name: string,
    modifier: ?Modifier,
    className: ?string
}

/**
 * @module Utils
 */

/**
 * `SpruceClassName` is a utility function to apply construct class names easily.
 * It uses the `classnames` package.
 * It accepts a components props and adheres to a standard usage of `modifier` and `className` props.
 *
 * @example
 * const props = {
 *     name: "Button",
 *     modifier: "large small",
 *     className: "AnotherClass"
 * };
 * reutrn <div className={SpruceClassName(props, "ExtraClassName")} />
 * ^ // class name is "Button Button-large Button-small AnotherClass ExtraClassName"
 *
 * const props = {
 *     name: "Button",
 *     modifier: {
 *        yes: true,
 *        no false
 *     }
 * };
 * reutrn <div className={SpruceClassName(props)} />
 * ^ // class name is "Button Button-yes"
 *
 * @param {Object} props An component's props.
 * @param {string} [props.name] The name of the components, which will be turned into a class name.
 * @param {Modifier} [props.modifier]
 * @param {ClassName} [props.className] Class name strings passed to the component with React's prop convention.
 * @param {...any} args More arguments to pass into `classnames`.
 * @return {string} Complete class names string.
 */


export default function SpruceClassName(props: ClassNameProps, ...args: Array<any>): string {
    const modifiers: string = classnames(props.modifier)
        .split(' ')
        .filter(ii => ii != '')
        .map(mm => `${props.name}-${mm}`)

    return classnames(
        props.name,
        modifiers,
        args,
        props.className
    );
}
