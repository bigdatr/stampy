// @flow

import React from 'react';
import type {ComponentType, Node} from 'react';

/**
 * @module Hocks
 */
type Props = {};
type ChildProps = {};

export default (key: string, value: Function|*): HockApplier => (ComponentToDecorate: ComponentType<Props>): ComponentType<ChildProps> => {

    /**
     * @component
     *
     * SetProp lets you change a single prop during a hock chain.
     * The value for SetProp can either be a plain value or a function that is given the whole props object.
     *
     * @example
     * import SetProp from 'stampy/lib/hock/SetProp';
     * import Compose from 'stampy/lib/util/Compose';
     *
     * const example = (props) => {
     *     const {foo} = props;
     *     const {bar} = props;
     *     return <div>
     *         <div>Foo: {foo}</div>
     *         <div>Bar: {bar}</div>
     *     </div>
     * }
     *
     * export default Compose(
     *      SetProp('foo', 'foobly'),
     *      SetProp('bar', props => `${props.foo}Bar`),
     * )(example)
     *
     * @decorator {HockApplier}
     * @memberof module:Hocks
     */

    return class SetProp extends React.PureComponent<Props> {
        render(): Node {
            const newProps = {
                ...this.props,
                [key]: (typeof value === 'function') ? value(this.props) : value
            };

            return <ComponentToDecorate {...newProps}  />;
        }
    };
};

