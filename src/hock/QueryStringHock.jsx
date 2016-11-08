// @flow

import React, {Component, PropTypes} from 'react';
import {fromJS, List, Map} from 'immutable';
import PropChangeHock from './PropChangeHock';

/**
 * @module Hocks
 */

/**
 * `QueryStringHock` is a higher order component designed to greatly simplify getting and setting the query string, if your app is using any version of react-router (currently works with v1.x and v2.x).
 * When used on a component, your component will receive some extra props.
 *
 * - query - the object representing the query string. Change this props name using config.queryPropName.
 * - updateQuery - a function to updates only parts of the query at once. Good at not demolishing other query params not set by this component
 * - setQuery - a function to set the query
 *
 * It also allows for array parameters, push state vs replace state, and firing a function whenever the query string changes.
 *
 * This component requires a `location` prop, which should be the location prop that react-router provides its route components.
 * This prop will automatically be received if this HOC is used on any components that are passed straight to a <Route> object.
 * If you're using react-router v1 then you'll also need to pass it a history prop that react-router provides.
 * If using react-router v2 then QueryStringHock will automatically connect via context.
 *
 * @example
 * function MyComponent(props) {
 *   // the current query string will be printed to the console
 *   console.log(props.query);
 *
 *
 *   const onClick = () => {
 *     props.updateQuery({a: "A"});
 *   };
 *
 *   return <div>
 *     <p>Extremely simple React component</p>
 *     <p onClick={onClick}>Set a="A" in query string</p>
 *   </div>;
 * }
 *
 * const withQueryString = QueryStringHock();
 *
 * export default withQueryString(MyComponent); // exports MyComponent with QueryStringHock as a higher order component
 *
 * @param {Object} [config] Configuration object for the QueryStringHock
 * @param {Object} [config.defaultQuery] These defaults will be passed down in the query prop whenever they aren't present in the actual query string.
 * @param {string} [config.queryPropName = "query"] Sets the name of the query prop.
 * @param {boolean} [config.replaceState] - optional boolean, setting this to true will make query changes use replaceState instead of pushState
 * @param {Array<string>} [config.arrayParams] - If you have particular query parameters that you always want to return as arrays, name them in here. All arrayParams will also be an empty array if they are not present in the query string. By default react-router only passes an array of query param values back if there are more than one value in them.
 * @param {QueryChangeFunction} [onQueryChangeFunction] A function to be called when the query string changes. By default this function is called on initial `componentDidMount` and every time any query param changes after this - to limit this use the third argument `onChangeParams`
 * @params [Array<string>] [onChangeParams] An array of the query parameters that, once changed, will cause `onQueryChangeFunction` to be fired.
 * @return {HockApplier}
 */

const QueryStringHock = (config: ?Object = null, onQueryChangeFunction: ?Function = null, onChangeParams: ?Array<string> = null): HockApplier => {
    return (ComposedComponent: ReactClass<any>): ReactClass<any> => {

        const replaceState: boolean = !!(config && config.replaceState);
        const queryPropName: string = (config && config.queryPropName) || "query";
        const arrayParams: List<string> = (config && fromJS(config.arrayParams)) || List();
        const defaultQuery: Map<string,any> = (config && fromJS(config.defaultQuery)) || Map();

        const propsToListenTo: Array<string> = !onChangeParams
            ? [queryPropName]
            : fromJS(onChangeParams)
                .map(param => `${queryPropName}.${param}`)
                .toJS();

        const PreparedComposedComponent: ReactClass<any> = !onQueryChangeFunction
            ? ComposedComponent
            : PropChangeHock([queryPropName], (props) => {
                onQueryChangeFunction && onQueryChangeFunction(propsToListenTo, props);
            })(ComposedComponent);

        class QueryStringHock extends Component {

            updateQuery: Function;
            setQuery: Function;

            constructor(props: Object) {
                super(props);

                // explicit bind until es7
                this.updateQuery = this.updateQuery.bind(this);
                this.setQuery = this.setQuery.bind(this);
            }

            /**
             * Gets the query object
             * @param {Object} props Props to refer to.
             */

            getQuery(props: Object): Object {
                const query: Map<string,any> = defaultQuery.merge(fromJS(props.location.query));

                // ensures that all arrayParams are returned as arrays (not strings or blank)
                return arrayParams
                    .reduce((query, arrayParamKey) => {
                        const param = query.get(arrayParamKey, List());
                        const arrayParamValue = List.isList(param) ? param : List([param]);
                        return query.set(arrayParamKey, arrayParamValue);
                    }, query)
                    .toJS();
            }

            /**
             * Partially updates the query. Any keys on the objects passed in will be modified on the query object.
             * Keys set to empty strings or `null` will be removed from the query object.
             * @param {Object} queryParamsToUpdate An object containing query params to update.
             */

            updateQuery(queryParamsToUpdate: Object) {
                const query = fromJS(this.props.location.query)
                    .merge(fromJS(queryParamsToUpdate))
                    .toJS();
                this.setQuery(query);
            }

            /**
             * Replaces the current query string with the params defined in `query`.
             * Keys set to empty strings or `null` will be removed from the query object.
             * @param {Object} query An object containing query params.
             */

            setQuery(query: Object) {
                const routerMethod: string = replaceState ? "replace" : "push";
                const newQuery: Object = fromJS(query)
                    .filter(ii => ii !== "")
                    .toJS();

                if(this.context.router) {
                    // react router v2
                    this.context.router[routerMethod]({
                        pathname: this.props.location.pathname,
                        query: newQuery
                    });
                } else {
                    // react router v1
                    this.props.history[`${routerMethod}State`](null, this.props.location.pathname, newQuery);
                }
            }

            render(): React.Element<any> {
                const newProps: Object = {
                    [queryPropName]: this.getQuery(this.props),
                    setQuery: this.setQuery,
                    updateQuery: this.updateQuery
                };
                return <PreparedComposedComponent {...this.props} {...newProps} />;
            }
        }

        QueryStringHock.propTypes = {
            location: PropTypes.object.isRequired, // must be react router location object, required for react-router v1 and v2
            history: PropTypes.object // must be react router history object, required for react-router v1
        };

        QueryStringHock.contextTypes = {
            router: React.PropTypes.func // required for react-router v2
        };

        return QueryStringHock;
    }
};

export default QueryStringHock;

/**
 * A function to be called when the query string has changed.
 *
 * @callback QueryChangeFunction
 * @param {Object} query The updated query object.
 * @param {Object} nextProps The updated props object.
 * @return {*} The returned value is not used.
 */
