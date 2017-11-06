/* eslint-disable flowtype/require-valid-file-annotation */

import Debounce from 'debounce';
import UpPipe from './UpPipe';
import ConfigureHock from '../../util/ConfigureHock';

/**
 * @module Pipes
 */

/**
 * @component
 *
 * The DebouncePipe is an up-pipe that applies a debounce to
 * a selected onChange function.
 *
 * @decorator {DebouncePipe}
 * @decorator {HockApplier}
 *
 * @example
 * const withDebouncePipe = DebouncePipe(props => ({
 *    onChangeProp: "onSubmit"
 * }), {wait: 500});
 *
 * @memberof module:Pipes
 */

const DebouncePipe = ConfigureHock(
    (config: HockConfig, applierConfig: Object): HockApplier => {
        var debounce = Debounce((thunk) => thunk(), applierConfig.wait);

        return UpPipe((props) => ({
            payloadCallback: (payload: *, onChange: Function) => {
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

export default DebouncePipe;

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
 * @typedef DebouncePipeApplierConfig
 * @type {Object}
 * @property {number} wait
 * The amount of time to debounce in milliseconds.
 */
