// @flow

import React, {Component} from 'react';
import ConfigureHock from '../util/ConfigureHock';

/**
 * @module Pipes
 */

const DEFAULT_CHANGE_PAYLOAD: Function = ii => ii;

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
             * const changePayload = (newValue) => `${newValue}!`;
             *
             * const withUpPipe = UpPipe(props => ({
             *     changePayload
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

                    const {onChangeProp, changePayload} = nextConfig;
                    const nextChangeFunction: Function = nextProps[onChangeProp];
                    const prevChangeFunction: Function = prevProps[onChangeProp];

                    // only update childProps when necessary
                    if(
                        prevConfig.onChangeProp !== onChangeProp
                        || prevConfig.changePayload !== changePayload
                        || prevChangeFunction !== nextChangeFunction
                    ) {
                        this.childProps = {
                            [onChangeProp]: (payload: *) => nextChangeFunction(changePayload(payload))
                        };
                    }
                };

                render(): React.Element<any> {
                    var newProps: Object = Object.assign({}, this.props, this.childProps);
                    return <ComponentToDecorate {...newProps} />;
                }
            }

            return UpPipe;
        }
    },
    (): Object => ({
        changePayload: DEFAULT_CHANGE_PAYLOAD,
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
 * @type Object
 * @property {Object} childProps
 * The new set of props to pass down.
 */
