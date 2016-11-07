/* @flow */
/* eslint-disable no-unused-vars */

/**
 * A function that builds a higher order React component around another component.
 * These often have some amount of configuration already set by partial function application.
 *
 * @typedef HockApplier
 * @param {ReactComponent} ComposedComponent The component you wish to wrap in a hock.
 * @return {ReactComponent} The higher order component.
 */

type HockApplier = (ComposedComponent: ReactClass<any>) => ReactClass<any>;
