// @flow
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {fromJS, List, Map} from 'immutable';
import URLSearchParams from 'url-search-params';

/**
 * @module Hocks
 */

export default (config: ?Object = null): HockApplier => {
    return (ComposedComponent: ReactClass<any>): ReactClass<any> => {

        const replaceState: boolean = !!(config && config.replaceState);
        const queryPropName: string = (config && config.queryPropName) || "query";
        const arrayParams: List<string> = (config && fromJS(config.arrayParams)) || List();

        // default all array params to empty lists
        const defaultArrayParams: Map<string, List<string>> = arrayParams
            .reduce((defaultQuery: Map<string, List<string>>, arrayParam: string) => {
                return defaultQuery.set(arrayParam, List());
            }, Map())

        // default query is comprised of the default array param lists,
        // with config.defaultQuery merged on top of it
        const defaultQuery: Map<string,any> = defaultArrayParams
            .merge((config && fromJS(config.defaultQuery)) || Map());

        /**
         * @component
         *
         * `QueryStringHock` is a higher order component designed to greatly simplify getting
         * and setting the query string, if your app is using `react-router`
         * (currently works with v1, v2, v3 and v4).  When used on a component, your component will
         * receive some extra props.
         *
         * It also allows for array parameters, push state vs replace state,
         * and firing a function whenever the query string changes.
         *
         * This component requires a `location` prop, which should be the location prop that
         * `react-router` provides its route components.
         * This prop will automatically be received if this HOC is used on any components that
         * are passed straight to a <Route> object.
         * If you're using `react-router` v1 then you'll also need to pass it a history prop
         * that `react-router` provides.
         * If using `react-router` v2 or greater then QueryStringHock will automatically
         * receive this via context.
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
         * export default withQueryString(MyComponent);
         * // exports MyComponent with QueryStringHock as a higher order component
         *
         * @decorator {QueryStringHock}
         *
         * @prop {Object} location
         * Required for `react-router` v1, v2, v3 and v4. Must be react router location object.
         *
         * @prop {Object} history
         * Required only for `react-router` v1. Must be react router history object.
         *
         * @context {Object} router Required for `react-router` v2, v3 and v4
         * where it should be provided automatically.
         *
         * @childprop {Object} query The object representing the query string.
         * Change this prop's name using `config.queryPropName`.
         *
         * @childprop {QueryStringUpdateQuery} updateQuery
         *
         * @childprop {QueryStringSetQuery} setQuery
         *
         * @memberof module:Hocks
         */

        class QueryStringHock extends Component {

            updateQuery: Function;
            setQuery: Function;

            constructor(props: Object) {
                super(props);

                // explicit bind until es7
                this.updateQuery = this.updateQuery.bind(this);
                this.setQuery = this.setQuery.bind(this);
            }

            /*
             * Gets the query object
             * @param {Object} props Props to refer to.
             */

            getQuery(): Map<string, string|Array<string>> {
                if(!this.props.location || !this.props.location.search) {
                    return Map();
                }

                const searchParams: URLSearchParams = new URLSearchParams(this.props.location.search);

                var params: Array<Array<string>>= [];
                for(let param of searchParams) {
                    params.push(param);
                }
                const groupedParams: Map<string,any> = fromJS(params)
                    .filter(ii => ii.get(1) != "")
                    .groupBy(ii => ii.get(0))
                    .toMap()
                    .map(param => param.map(ii => ii.get(1)))
                    .map((value, key) => {
                        // if an array param, return list as is
                        if(arrayParams.contains(key)) {
                            return value;
                        }
                        // if not an array param, use the value of the first param with this key
                        return value.get(0);
                    });

                return defaultQuery
                    .merge(groupedParams);
            }

            /*
             * Partially updates the query.
             * Any keys on the objects passed in will be modified on the query object.
             * Keys set to empty strings or `null` will be removed from the query object.
             *
             * @typedef QueryStringUpdateQuery
             *
             * @param {Object} queryParamsToUpdate
             * An object containing query params to update.
             *
             * @param {string} [pathname]
             * An optional string that will replace the current pathname.
             */

            updateQuery(queryParamsToUpdate: Object, pathname?: string) {
                const query = this.getQuery()
                    .merge(fromJS(queryParamsToUpdate))
                    .toJS();
                this.setQuery(query, pathname);
            }

            /*
             * Replaces the current query string with the params defined in `query`.
             * Keys set to empty strings or `null` will be removed from the query object.
             *
             * @typedef QueryStringSetQuery
             *
             * @param {Object} query
             * An object containing query params.
             *
             * @param {string} [pathname]
             * An optional string that will replace the current pathname.
             */

            setQuery(query: Object, pathname?: string) {
                if(!this.props.location || !this.props.location.pathname) {
                    console.warn("Cannot call setQuery, QueryStringHock has not been given a react-router location.pathname prop");
                    return;
                }

                if(!pathname) {
                    pathname = this.props.location.pathname;
                }

                const routerMethod: string = replaceState ? "replace" : "push";
                const newQuery: Object = fromJS(query)
                    .filter(ii => ii !== "" && ii != null); // non strict null comparison to catch undefined & null

                if(!this.context.router) {
                    // react router v1
                    this.props.history[`${routerMethod}State`](
                        null,
                        pathname,
                        newQuery.toJS()
                    );
                    return;
                }

                if(!this.context.router.history) {
                    // react router v2 and v3
                    this.context.router[routerMethod]({
                        pathname,
                        query: newQuery.toJS()
                    });
                    return;
                }

                // react router v4
                var newPath = pathname;
                if(!newQuery.isEmpty()) {

                    // build query string
                    const newQueryString: string = newQuery
                        .reduce((list: List<string>, value: string|List<string>, key: string): List<string> => {
                            if(List.isList(value)) {
                                return list.concat(
                                    // $FlowFixMe: flow doesnt seem to know that List.isList() returns false for strings
                                    value.map(ii => `${key}=${ii}`)
                                );
                            }
                            // $FlowFixMe: flow doesnt seem to know that List.isList() returns false for strings
                            return list.push(`${key}=${value}`);
                        }, List())
                        .join("&")

                    newPath += `?${newQueryString}`;
                }

                // only set new pathname if it has changed
                if(newPath !== this.props.location.pathname + this.props.location.search) {
                    this.context.router.history[routerMethod](newPath);
                }
            }

            render(): React.Element<any> {
                const newProps: Object = {
                    [queryPropName]: this.getQuery().toJS(), // TODO memoize this!
                    setQuery: this.setQuery,
                    updateQuery: this.updateQuery
                };
                return <ComposedComponent {...this.props} {...newProps} />;
            }
        }

        QueryStringHock.propTypes = {
            location: PropTypes.object.isRequired,
            history: PropTypes.object
        };

        QueryStringHock.contextTypes = {
            router: PropTypes.object
        };

        return QueryStringHock;
    }
};

/**
 * Provides configuration for `QueryStringHock`.
 *
 * @callback QueryStringHock
 *
 * @param {QueryStringHockConfig} [config]
 *
 * @return {QueryStringWrapper}
 */

/**
 * A function that accepts the component you want to wrap in a `QueryStringHock`.
 *
 * @callback QueryStringWrapper
 *
 * @param {ReactComponent} ComponentToDecorate
 * The component you wish to wrap in an `QueryStringHock`.
 *
 * @return {ReactComponent}
 * The decorated component.
 */

/**
 * Configuration object for the QueryStringHock.
 *
 * @typedef QueryStringHockConfig
 *
 * @property {Object} [defaultQuery]
 * These defaults will be passed down in the query prop
 * whenever they aren't present in the actual query string.
 *
 * @property {string} [queryPropName = "query"]
 * Sets the name of the query prop.
 *
 * @property {boolean} [replaceState = false]
 * Optional boolean, setting this to true will make query changes use replaceState
 * instead of pushState.
 *
 * @property {Array<string>} [arrayParams]
 * If you have particular query parameters that you always want to return as arrays,
 * name them in here. All arrayParams will also be an empty array
 * if they are not present in the query string.
 * By default `react-router` only passes an array of query param values back
 * if there are more than one value in them.
 */

/**
 * A function to be called when the query string changes.
 * By default this function is called on initial `componentDidMount`
 * and every time any query param changes after this
 * - to limit this use the third argument `onChangeParams`
 *
 * @callback QueryChangeFunction
 *
 * @param {Object} query
 * The updated query object.
 *
 * @param {Object} nextProps
 * The updated props object.
 *
 * @return The returned value is not used.
 */
