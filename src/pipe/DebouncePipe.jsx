// @flow

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
    (): Object => ({
        onChangeProp: "onChange"
    }),
    {
        wait: 100
    }
);

/**
 * @callback DebouncePipe
 * @param {DebouncePipeConfig} [config]
 * @param {DebouncePipeApplierConfig} [applierConfig]
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
 * @property {string} onChangeProp
 * The name of the prop to receive the onChange callback from.
 */

/**
 * @callback DebouncePipeApplierConfig
 * @param {Object} props
 * @return {DebouncePipeConfigResult}
 * A function that accepts props and returns configuration for DebouncePipe.
 */
