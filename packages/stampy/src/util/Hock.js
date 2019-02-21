// @flow

/**
 * @module Utils
 */

/**
 * `Hock` creates hocks for you.
 *
 * @example
 * export default Hock({
 *     hock: (config) => {
 *         return (ComponentToDecorate) => {
 *             class CoolHock extends Component {
 *                 render() {
 *                      return <ComponentToDecorate
 *                         {...this.props}
 *                         name={config.name}
 *                     />;
 *                 }
 *             }
 *             return CoolHock;
 *         }
 *     },
 *     defaultConfig: {
 *         name: () => "default name"
 *     }
 *     shorthandKey: 'name'
 * });
 *
 * @name Hock
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

type HockParams = {
    hock: (config: Object) => HockApplier,
    defaultConfig: Object,
    shorthandKey?: string
};

export default function Hock({hock, defaultConfig = {}, shorthandKey}: HockParams): Function {
    if(!hock) {
        throw new Error(`Hock must be passed an object with a key of "hock", containing a function that returns a hock applier`);
    }

    return (config: ?Object|Function): HockApplier => {

        if(!config) {
            config = {};
        }

        if(shorthandKey && typeof config === "function") {
            config = {
                [shorthandKey]: config
            };
        }

        if(typeof config !== "object") {
            let or = shorthandKey ? `, or a "${shorthandKey}" function` : ``;
            throw new Error(`config must be an object${or}`);
        }

        return hock({...defaultConfig, ...config});
    };
}
