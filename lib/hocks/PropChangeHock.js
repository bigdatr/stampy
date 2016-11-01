'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _immutable = require('immutable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @module Hocks
 */

/**
 * `PropChangeHock` is designed to provide a way to call a function whenever a particular set of props change on a component.
 * Whenever the `componentWillMount()` and `componentWillReceiveProps()` lifecycle methods are called, `PropChangeHock` will check if any of the props in `propKeys` have changed, and call `onPropChangeFunction` if so.
 * It's often used to dispatch actions to request new data, when props affecting the query have changed.
 *
 *
 * @example
 * function MyComponent(props) {
 *   return <span>Extremely simple React component</span>;
 * }
 *
 * const withPropChange = PropChangeHock(['propA'], (props) => {
 *   console.log(`Prop A has changed to ${props.propA}`);
 * });
 *
 * export default withPropChange(MyComponent); // exports MyComponent with PropChangeHock as a higher order component
 *
 * @param {Array<string>} propKeys The props that you want to check for changes on. Nested objects or values can be passed in using dot notation inside strings e.g. `['page', query.name', 'query.age']`.
 * @param {PropChangeFunction} onPropChangeFunction The function to be called. It is passed a single argument, the updated props object.
 * @return {HockApplier}
 */

var PropChangeHock = function PropChangeHock(propKeys, onPropChangeFunction) {
    return function (ComposedComponent) {

        return function (_Component) {
            _inherits(PropChangeHock, _Component);

            function PropChangeHock() {
                _classCallCheck(this, PropChangeHock);

                return _possibleConstructorReturn(this, (PropChangeHock.__proto__ || Object.getPrototypeOf(PropChangeHock)).apply(this, arguments));
            }

            _createClass(PropChangeHock, [{
                key: 'componentWillMount',
                value: function componentWillMount() {
                    onPropChangeFunction(this.props);
                }
            }, {
                key: 'componentWillReceiveProps',
                value: function componentWillReceiveProps(nextProps) {
                    var thisPropsImmutable = (0, _immutable.fromJS)(this.props);
                    var nextPropsImmutable = (0, _immutable.fromJS)(nextProps);

                    var propsHaveChanged = (0, _immutable.fromJS)(propKeys).some(function (ii) {
                        var keyPath = ii.split('.');
                        return !thisPropsImmutable.getIn(keyPath).equals(nextPropsImmutable.getIn(keyPath));
                    });

                    if (propsHaveChanged) {
                        onPropChangeFunction(nextProps);
                    }
                }
            }, {
                key: 'render',
                value: function render() {
                    return _react2.default.createElement(ComposedComponent, this.props);
                }
            }]);

            return PropChangeHock;
        }(_react.Component);
    };
};

exports.default = PropChangeHock;

/**
 * A function to be called when props have changed.
 *
 * @callback PropChangeFunction
 * @param {Object} nextProps The updated props object.
 * @return {*} The returned value is not used.
 */