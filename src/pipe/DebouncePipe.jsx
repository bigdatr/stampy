// @flow

import React, {Component} from 'react';
import Debounce from 'debounce';
import UpPipe from './UpPipe';
import ConfigureHock from '../util/ConfigureHock';

/**
 * @module Pipes
 */

/**
 * @component
 *
 * The DebouncePipe is an up pipe that applies a debounce to
 * a selected onChange function.
 *
 * @decorator {DebouncePipe}
 * @decorator {HockApplier}
 *
 * @memberof module:Pipes
 */

export default ConfigureHock(
    (config: HockConfig, applierConfig: Object): HockApplier => {
        var debounce = Debounce((thunk) => thunk(), applierConfig.wait);

        return UpPipe((props) => ({
            payloadCallback: (payload, onChange) => {
                debounce(() => onChange(payload));
            },
            onChangeProp: config(props).onChangeProp
        }));
    },
    (props: Object): Object => ({
        onChangeProp: "onChange"
    },
    {
        wait: 100
    })
);

/**
 * @callback DebouncePipe
 * @param {DebouncePipeConfig} [config]
 */

/**
 * @callback DebouncePipeConfig
 * @param {Object} props
 * @return {DebouncePipeConfigResult}
 * A function that accepts props and returns configuration for DebouncePipe.
 */

/**
 * @typedef DebouncePipeConfigResult
 * @type {Object}
 * @property {number} wait
 * The amount of time in milliseconds to wait before calling the change function.
 */
