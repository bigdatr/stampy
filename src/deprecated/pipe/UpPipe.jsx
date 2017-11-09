/* eslint-disable flowtype/require-valid-file-annotation */

import React, {Component} from 'react';
import ConfigureHock from '../util/ConfigureHock';

/**
 * @module Pipes
 */

const DEFAULT_PAYLOAD: Function = ii => ii;

export default ConfigureHock(
    (config: HockConfig): HockApplier => {
        return (ComponentToDecorate: ReactClass<any>): ReactClass<any> => {

            /**
             * @component
             *
             * The UpPipe lets you modify the payload of a change function
             * on its way up a chain of pipes.
             *
             * @example
             * import React from 'react';
             * import {StateHock, UpPipe, Input} from 'stampy';
             *
             * const Example = (props: Object) => {
             *     const {value, onChange} = props;
             *     return <div style={{fontFamily: 'monospace'}}>
             *         <div>Value: {value}</div>
             *         <button onClick={() => onChange(value)}>Append exclamation mark</button>
             *     </div>;
             * }
             *
             * const withState = StateHock({
             *     initialState: () => "some data"
             * });
             *
             * const payloadChange = (newValue) => `${newValue}!`;
             *
             * const withUpPipe = UpPipe(props => ({
             *     payloadChange
             * }));
             *
             * export default withState(withUpPipe(Example));
             *
             * @decorator {UpPipe}
             * @decorator {HockApplier}
             *
             * @memberof module:Pipes
             */

            class UpPipe extends Component {

                childProps: Object;

                constructor(props: Object) {
                    super(props);
                    this.updateChildProps({}, props);
                }

                componentWillReceiveProps(nextProps: Object) {
                    this.updateChildProps(this.props, nextProps);
                }

                updateChildProps: Function = (prevProps: Object, nextProps: Object) => {
                    const prevConfig: Object = config(prevProps);
                    const nextConfig: Object = config(nextProps);

                    const {
                        onChangeProp,
                        payloadChange,
                        payloadCallback
                    } = nextConfig;

                    const nextChangeFunction: Function = nextProps[onChangeProp];
                    const prevChangeFunction: Function = prevProps[onChangeProp];

                    // only update childProps when necessary
                    if(
                        prevConfig.onChangeProp !== onChangeProp
                        || prevConfig.payloadChange !== payloadChange
                        || prevConfig.payloadCallback !== payloadCallback
                        || prevChangeFunction !== nextChangeFunction
                    ) {
                        this.childProps = {
                            [onChangeProp]: payloadCallback
                                ? (pp: *) => payloadCallback(pp, nextChangeFunction)
                                : (pp: *) => nextChangeFunction(payloadChange(pp))
                        };
                    }
                };

                render(): React.Element<any> {
                    var newProps: Object = Object.assign({}, this.props, this.childProps);
                    return <ComponentToDecorate {...newProps} />;
                }
            }

            return UpPipe;
        };
    },
    (): Object => ({
        payloadChange: DEFAULT_PAYLOAD,
        payloadCallback: null,
        onChangeProp: "onChange"
    })
);

/**
 * @callback UpPipe
 * @param {UpPipeConfig} [config]
 */

/**
 * @callback UpPipeConfig
 * @param {Object} props
 * @return {UpPipeConfigResult}
 * A function that accepts props and returns configuration for UpPipe.
 */

/**
 * @typedef UpPipeConfigResult
 * @type {Object}
 *
 * If both payloadChange and payloadCallback are defined,
 * payloadCallback will be used.
 *
 * @property {Object} childProps
 * The new set of props to pass down.
 *
 * @property {UpPipePayloadChange} [payloadChange]
 *
 * @property {UpPipePayloadCallback} [payloadCallback]
 */

/**
 * @callback UpPipePayloadChange
 * @param {*} payload
 * The payload of the change function that was called on this pipe.
 *
 * @return {*}
 * The replacement payload of the change function, which will
 * be called on the next pipe up.
 */

/**
 * @callback UpPipePayloadCallback
 * @param {*} payload
 * The payload of the change function that was called on this pipe.
 *
 * @param {Function} nextOnChange
 * The change function of the next pipe up. Pass your new payload into this.
 * You can also choose to not call this function and end the chain of change functions.
 */
