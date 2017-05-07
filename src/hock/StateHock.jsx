// @flow

import React, {Component} from 'react';
import {Map} from 'immutable';

/**
 * @module Hocks
 */

export default (initialState: any = Map()): HockApplier => {
    return (ComponentToDecorate: ReactClass<any>): ReactClass<any> => {

        /**
         * @component
         *
         * `StateHock`
         *
         * @decorator {StateHock}
         * @memberof module:Hocks
         */

        class StateHock extends Component {
            state: Object = {
                value: initialState
            };
            onChange: Function = (payload: Function) => {
                this.setState({
                    value: payload
                });
            }
            render(): React.Element<any> {
                return <ComponentToDecorate
                    {...this.props}
                    value={this.state.value}
                    onChange={this.onChange}
                />;
            }
        }

        return StateHock;
    }
}

