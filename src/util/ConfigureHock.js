// @flow

/**
 * @module Utils
 */

/**
 * `ConfigureHock` assists in the creation of hocks by allowing default config values
 * to be easily set, validating config input.
 *
 * @example
 * export default ConfigureHock(
 *     (config) => {
 *         return (ComponentToDecorate) => {
 *             class CoolHock extends Component {
 *                 render() {
 *                      return <ComponentToDecorate
 *                         {...this.props}
 *                         name={config(this.props).name}
 *                     />;
 *                 }
 *             }
 *             return CoolHock;
 *         }
 *     },
 *     {
 *         name: "default name"
 *     }
 * );
 *
 * @name ConfigureHock
 * @kind function
 * @param {ConfiguredHockCreator} hockCreator
 * A function that must return a hock Component.
 *
 * @param {Function} [defaultConfig = () => {}]
 * The default config. Key / value pairs on the object returned from this function are used only when the key isn't returned from the hock config function.
 *
 * @param {Object} [defaultApplierConfig = {}]
 * The default applier config. Key / value pairs on this object are used only when the key isn't specified on the applierConfig object.
 *
 * @return {Function} The configured hock to export.
 */

export default function ConfigureHock(hockCreator: Function, defaultConfig: Function = () => ({}), defaultApplierConfig: Object = {}): Function {
    return (config: HockConfig = defaultConfig, applierConfig: Object = defaultApplierConfig): HockApplier => {
        if(typeof config !== "function") {
            throw new Error("config must be a function");
        }
        if(typeof applierConfig !== "object") {
            throw new Error("applierConfig must be an object");
        }
        const configWithDefaults: Function = (props: Object, ...otherArgs: *) => {
            const configObject = config(props, ...otherArgs);
            if(typeof configObject !== "object") {
                throw new Error("result of config function must be an object");
            }
            return Object.assign({}, defaultConfig(props, ...otherArgs), configObject);
        };
        const applierConfigWithDefaults = Object.assign({}, defaultApplierConfig, applierConfig);
        return hockCreator(configWithDefaults, applierConfigWithDefaults);
    };
}
