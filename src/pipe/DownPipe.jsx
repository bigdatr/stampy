// @flow

import React, {Component} from 'react';
import ConfigureHock from '../util/ConfigureHock';

/**
 * @module Pipes
 */

export default ConfigureHock(
    (config: HockConfig): HockApplier => {
        return (ComponentToDecorate: ReactClass<any>): ReactClass<any> => {

            /**
             * @component
             *
             * The DownPipe simply allows you to rename props on their way down a hock pipe.
             *
             * @example
             *
             * import React from 'react';
             * import {StateHock, DownPipe, Input} from 'stampy';
             *
             * const Example = ({value, renamedValue}) => {
             *     // if Example normally receives value = "abc",
             *     // then the DownPipe here causes Example to receive
             *     // renamedValue = "abc"
             *     // value = undefined
             *     return null;
             * }
             *
             * const withDownPipe = DownPipe(props => ({
             *     childProps: {
             *         renamedValue: props.value
             *     }
             * }));
             *
             * export default withDownPipe(Example);
             *
             * @decorator {DownPipe}
             * @decorator {HockApplier}
             *
             * @memberof module:Pipes
             */

            class DownPipe extends Component {
                render(): React.Element<any> {
                    const newProps: Object = config(this.props).childProps;
                    return <ComponentToDecorate {...newProps} />;
                }
            }

            return DownPipe;
        }
    },
    (props: Object): Object => ({
        childProps: props
    })
);

/**
 * @callback DownPipe
 * @param {DownPipeConfig} [config]
 */

/**
 * @callback DownPipeConfig
 * @param {Object} props
 * @return {DownPipeConfigResult}
 * A function that accepts props and returns configuration for DownPipe.
 */

/**
 * @typedef DownPipeConfigResult
 * @property {Object} childProps
 * The new set of props to pass down.
 */
