/**
 * A function that builds a higher order React component around another component.
 * These often have some amount of configuration already set by partial function application.
 *
 * @callback HockApplier
 * @param {Component} ComposedComponent The component you wish to wrap in a hock.
 * @return {Component} The higher order component.
 */

type HockApplier = (ComposedComponent: ReactClass<any>) => ReactClass<any>;
