'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _immutable = require('immutable');

var _ComponentClassName = require('../../util/ComponentClassName');

var _ComponentClassName2 = _interopRequireDefault(_ComponentClassName);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @module Table
 */

//
// Th

function Th(props) {
    var _props$schemaItem$toO = props.schemaItem.toObject(),
        width = _props$schemaItem$toO.width,
        _props$schemaItem$toO2 = _props$schemaItem$toO.heading,
        heading = _props$schemaItem$toO2 === undefined ? '' : _props$schemaItem$toO2;

    var content = typeof heading === 'function' ? heading() : heading;

    return _react2.default.createElement('th', {
        style: { width: width },
        children: content
    });
}

//
// Td

function Td(props) {
    var row = props.row,
        schemaItem = props.schemaItem;

    var _schemaItem$toObject = schemaItem.toObject(),
        render = _schemaItem$toObject.render,
        value = _schemaItem$toObject.value;

    // Content rendering priority order
    // 1. render function
    // 2. value function
    // 3. value key accessor


    var content = render ? render(row) : typeof value === 'function' ? value(row) : row.get(value);

    // Only return a td if the schema hasn't
    // provided one
    return content && content.type === 'td' ? content : _react2.default.createElement(
        'td',
        null,
        content
    );
}

//
// Table

/**
 *
 * `Table` is a Controlled component that takes a collection of data and a schema. It iterates creating one row per item.
 *  The schema is used to determine how to render each column.
 *
 * ### Content rendering priority order
 * 1. render function
 * 2. value function
 * 3. value key accessor
 *
 * @param {Object}      props
 * @param {String}      props.className
 * @param {Array|List}  props.data             - Collection of data to iterate over
 * @param {String}      props.modifier         - Spruce modifiers
 * @param {Function}    props.rowProps         - Gets called for each item in data. The return object will be destructured onto the `tr`
 * @param {Array|List}  props.schema           - Collection describing how to render each column
 *
 * @example
 * const schema = [
 *      {
 *          heading: 'Name',
 *          value: 'name'
 *      },
 *      {
 *          heading: 'BMI',
 *          value: (row) => {
 *              const {height, mass} = row.toObject();
 *              return mass / height * height;
 *          }
 *      },
 *      {
 *          heading: 'Avatar',
 *          render: row => <img src={row.get('avatarUrl')} />
 *      }
 * ];
 *
 * return <Table data={props.data} schema={schema} />
 *
 * @category ControlledComponent
 */
function Table(props) {
    var modifier = props.modifier,
        className = props.className,
        rowProps = props.rowProps;

    var schema = (0, _immutable.fromJS)(props.schema);
    var data = (0, _immutable.fromJS)(props.data);

    // Take the schema to create each heading
    var tableHead = schema.map(function (column, key) {
        return _react2.default.createElement(Th, { key: key, schemaItem: column });
    }).toJS();

    // use `data` then `schema` to make each `row` then `column`
    var tableBody = data.map(function (row) {
        return _react2.default.createElement(
            'tr',
            _extends({ key: row.hashCode() }, rowProps(row)),
            schema.map(function (column, key) {
                return _react2.default.createElement(Td, { key: key, row: row, schemaItem: column });
            })
        );
    }).toJS();

    return _react2.default.createElement(
        'table',
        { className: (0, _ComponentClassName2.default)({ name: 'Table', modifier: modifier, className: className }) },
        _react2.default.createElement(
            'thead',
            null,
            _react2.default.createElement(
                'tr',
                null,
                tableHead
            )
        ),
        _react2.default.createElement(
            'tbody',
            null,
            tableBody
        )
    );
}

Table.defaultProps = {
    className: '',
    data: (0, _immutable.List)(),
    modifier: '',
    rowProps: function rowProps() {
        return {};
    },
    schema: (0, _immutable.List)()
};

exports.default = Table;