// @flow

import React from 'react';
import type {ComponentType, Node} from 'react';
import Hock from '../util/Hock';

/**
 * @module Hocks
 */
type Props = {};
type ChildProps = {};

export default Hock({
    hock: (config: Object): HockApplier => (ComponentToDecorate: ComponentType<Props>): ComponentType<ChildProps> => {

        /**
         * @component
         *
         * UpdateProps lets you change all the props of a component during a hock chain.
         * this.props are passed through config.propUpdater. The resulting object is passed to the
         * child component as it's props.
         *
         * @example
         * import UpdateProps from 'stampy/lib/hock/UpdateProps';
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
         *      UpdateProps(props => ({foo: props.foo + 1, bar: 'baz'}))
         * )(example)
         *
         * @decorator {HockApplier}
         * @memberof module:Hocks
         */

        return class UpdateProps extends React.PureComponent<Props> {
            render(): Node {
                return <ComponentToDecorate {...config.updater(this.props)} />;
            }
        };
    },
    defaultConfig: {
        updater: (/* props: Props */) => ({})
    },
    shorthandKey: "updater"
});

