'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
// example
//

var buttonStyles = {
  border: '1px solid #eee',
  borderRadius: 3,
  backgroundColor: '#FFFFFF',
  cursor: 'pointer',
  fontSize: 15,
  padding: '3px 10px'
};

var Button = function Button(_ref) {
  var children = _ref.children;
  var onClick = _ref.onClick;
  var _ref$style = _ref.style;
  var style = _ref$style === undefined ? {} : _ref$style;
  return _react2.default.createElement(
    'button',
    {
      style: _extends({}, buttonStyles, style),
      onClick: onClick
    },
    children
  );
};

Button.propTypes = {
  children: _react2.default.PropTypes.string.isRequired,
  onClick: _react2.default.PropTypes.func,
  style: _react2.default.PropTypes.object
};

exports.default = Button;