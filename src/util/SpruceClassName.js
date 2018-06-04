// @flow
import classnames from 'classnames';

type ClassNameProps = {
    name?: string,
    modifier?: SpruceModifier,
    peer?: SprucePeer,
    className?: string,
    parent?: string
};

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
 * return <div className={SpruceClassName(props, "ExtraClassName")} />
 * ^ // class name is "Button Button-large Button-small AnotherClass ExtraClassName"
 *
 * const props = {
 *     name: "Button",
 *     modifier: {
 *        yes: true,
 *        no false
 *     }
 * };
 * return <div className={SpruceClassName(props)} />
 * ^ // class name is "Button Button-yes"
 *
 * @param {Object} props An component's props.
 * @param {string} [props.name] The name of the components, which will be turned into a class name.
 * @param {SpruceModifier} [props.modifier]
 * @param {SprucePeer} [props.peer]
 * @param {ClassName} [props.className] Class name strings passed to the component with React's prop convention.
 * @param {...any} args More arguments to pass into `classnames`.
 * @return {string} Complete class names string.
 */


export default function SpruceClassName(props: ClassNameProps, ...args: Array<any>): string {
    let {name = '', parent = ''} = props;

    if(name[0] === '_' && !parent) {
        throw new Error(`Invalid Spruce Component: ${parent}${name}. A child component must have a defined parent prop.`);
    }

    if(name[0] !== '_' && parent) {
        throw new Error(`Invalid Spruce Component: ${parent}${name}.: A non child component cannot a defined parent prop.`);
    }

    name = `${parent}${name}`;

    const modifiers: string = classnames(props.modifier)
        .split(' ')
        .filter(ii => ii != '')
        // $FlowFixMe: flow doesnt seem to know that vars passed into template strings are implicitly cast to strings
        .map(mm => `${name}-${mm}`);

    const peers: string = classnames(props.peer)
        .split(' ')
        .filter(ii => ii != '')
        // $FlowFixMe: flow doesnt seem to know that vars passed into template strings are implicitly cast to strings
        .map(pp => `${name}--${pp}`);


    return classnames(
        name,
        modifiers,
        peers,
        args,
        props.className
    ).replace(/\s+/g, ' ');
}
