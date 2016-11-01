'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _immutable = require('immutable');

var _PropChangeHock = require('./PropChangeHock');

var _PropChangeHock2 = _interopRequireDefault(_PropChangeHock);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

var QueryStringHock = function QueryStringHock() {
    var config = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
    var onQueryChangeFunction = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
    var onChangeParams = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

    return function (ComposedComponent) {

        var replaceState = !!(config && config.replaceState);
        var queryPropName = config && config.queryPropName || "query";
        var arrayParams = config && (0, _immutable.fromJS)(config.arrayParams) || (0, _immutable.List)();
        var defaultQuery = config && (0, _immutable.fromJS)(config.defaultQuery) || (0, _immutable.Map)();

        var propsToListenTo = !onChangeParams ? [queryPropName] : (0, _immutable.fromJS)(onChangeParams).map(function (param) {
            return queryPropName + '.' + param;
        }).toJS();

        var PreparedComposedComponent = !onQueryChangeFunction ? ComposedComponent : (0, _PropChangeHock2.default)([queryPropName], function (props) {
            onQueryChangeFunction && onQueryChangeFunction(propsToListenTo, props);
        })(ComposedComponent);

        var QueryStringHock = function (_Component) {
            _inherits(QueryStringHock, _Component);

            function QueryStringHock(props) {
                _classCallCheck(this, QueryStringHock);

                // explicit bind until es7
                var _this = _possibleConstructorReturn(this, (QueryStringHock.__proto__ || Object.getPrototypeOf(QueryStringHock)).call(this, props));

                _this.updateQuery = _this.updateQuery.bind(_this);
                _this.setQuery = _this.setQuery.bind(_this);
                return _this;
            }

            /**
             * Gets the query object
             * @param {Object} props Props to refer to.
             */

            _createClass(QueryStringHock, [{
                key: 'getQuery',
                value: function getQuery(props) {
                    var query = defaultQuery.merge((0, _immutable.fromJS)(props.location.query));

                    // ensures that all arrayParams are returned as arrays (not strings or blank)
                    return arrayParams.reduce(function (query, arrayParamKey) {
                        var param = query.get(arrayParamKey, (0, _immutable.List)());
                        var arrayParamValue = _immutable.List.isList(param) ? param : (0, _immutable.List)([param]);
                        return query.set(arrayParamKey, arrayParamValue);
                    }, query).toJS();
                }

                /**
                 * Partially updates the query. Any keys on the objects passed in will be modified on the query object.
                 * Keys set to empty strings or `null` will be removed from the query object.
                 * @param {Object} queryParamsToUpdate An object containing query params to update.
                 */

            }, {
                key: 'updateQuery',
                value: function updateQuery(queryParamsToUpdate) {
                    var query = (0, _immutable.fromJS)(this.props.location.query).merge((0, _immutable.fromJS)(queryParamsToUpdate)).toJS();
                    this.setQuery(query);
                }

                /**
                 * Replaces the current query string with the params defined in `query`.
                 * Keys set to empty strings or `null` will be removed from the query object.
                 * @param {Object} query An object containing query params.
                 */

            }, {
                key: 'setQuery',
                value: function setQuery(query) {
                    var routerMethod = replaceState ? "replace" : "push";
                    var newQuery = (0, _immutable.fromJS)(query).filter(function (ii) {
                        return ii !== "";
                    }).toJS();

                    if (this.context.router) {
                        // react router v2
                        this.context.router[routerMethod]({
                            pathname: this.props.location.pathname,
                            query: newQuery
                        });
                    } else {
                        // react router v1
                        this.props.history[routerMethod + 'State'](null, this.props.location.pathname, newQuery);
                    }
                }
            }, {
                key: 'render',
                value: function render() {
                    var _newProps;

                    var newProps = (_newProps = {}, _defineProperty(_newProps, queryPropName, this.getQuery(this.props)), _defineProperty(_newProps, 'setQuery', this.setQuery), _defineProperty(_newProps, 'updateQuery', this.updateQuery), _newProps);
                    return _react2.default.createElement(PreparedComposedComponent, _extends({}, this.props, newProps));
                }
            }]);

            return QueryStringHock;
        }(_react.Component);

        QueryStringHock.propTypes = {
            location: _react.PropTypes.object.isRequired, // must be react router location object, required for react-router v1 and v2
            history: _react.PropTypes.object // must be react router history object, required for react-router v1
        };

        QueryStringHock.contextTypes = {
            router: _react2.default.PropTypes.func // required for react-router v2
        };

        return QueryStringHock;
    };
};

exports.default = QueryStringHock;

/**
 * A function to be called when the query string has changed.
 *
 * @callback QueryChangeFunction
 * @param {Object} query The updated query object.
 * @param {Object} nextProps The updated props object.
 * @return {*} The returned value is not used.
 */