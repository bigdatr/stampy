'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = ComponentClassNames;

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ComponentClassNames(props) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
    }

    return (0, _classnames2.default)(props.name, props.modifier ? props.modifier.split(' ').map(function (mm) {
        return props.name + '-' + mm;
    }) : null, args, props.className);
}