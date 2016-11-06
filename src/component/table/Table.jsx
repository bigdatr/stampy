// @flow
import React from 'react';
import {fromJS, List, Map} from 'immutable';
import ComponentClassName from '../../util/ComponentClassName';

/**
 * @module Table
 */

//
// Th

type ThProps = {
    schemaItem: Map<any,any>
}

function Th(props: ThProps): React.Element<any> {
    var {width, heading = ''} = props.schemaItem.toObject();

    const content: any = (typeof heading === 'function')
        ? heading()
        : heading;

    return <th
        style={{width}}
        children={content}
    />;
}


//
// Td

type TdProps = {
    row: Map<any,any>,
    schemaItem: Map<any,any>
}

function Td(props: TdProps): React.Element<any> {
    const {row, schemaItem} = props;
    const {render, value} = schemaItem.toObject();

    // Content rendering priority order
    // 1. render function
    // 2. value function
    // 3. value key accessor
    const content: any = (render)
        ? render(row)
        : (typeof value === 'function')
            ? value(row)
            : row.get(value)
    ;

    // Only return a td if the schema hasn't
    // provided one
    return (content && content.type === 'td')
        ? content
        : <td>{content}</td>;
}



//
// Table

type Schema = ListOrArray<SchemaItem>;

type SchemaItem = {
    value: string | (row: Map<any>) => React.Element<any>,
    heading: string | () => React.Element<any>,
    render: (row: Map<any>) => React.Element<any>,
    width: string | number
}

type TableProps = {
    className: ?string,
    data: ListOrArray,
    modifier: ?string,
    rowProps: (row: Object) => Object,
    schema: Schema
}


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
 * @param {Object}          props
 * @param {String}          props.className
 * @param {Array|List}      props.data             - Collection of data to iterate over
 * @param {String|Function} props.modifier         - Spruce modifiers
 * @param {Function}        props.rowProps         - Gets called for each item in data. The return object will be destructured onto the `tr`
 * @param {Array|List}      props.schema           - Collection describing how to render each column
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
function Table(props: TableProps): React.Element<any> {
    const {modifier, className, rowProps} = props;
    const schema: List<any> = fromJS(props.schema);
    const data: List<any> = fromJS(props.data);

    // Take the schema to create each heading
    const tableHead: React.Element<any>[] = schema
        .map((column, key) => <Th key={key} schemaItem={column} />)
        .toJS();

    // use `data` then `schema` to make each `row` then `column`
    const tableBody: React.Element<any>[] = data
        .map(row => {
            return <tr key={row.hashCode()} {...rowProps(row)}>
                {schema.map((column, key: number) => <Td key={key} row={row} schemaItem={column} />)}
            </tr>;
        })
        .toJS();

    return <table className={ComponentClassName({name: 'Table', modifier, className})}>
        <thead><tr>{tableHead}</tr></thead>
        <tbody>{tableBody}</tbody>
    </table>
}

Table.defaultProps = {
    className: '',
    data: List(),
    modifier: '',
    rowProps: () => ({}),
    schema: List()
}

export default Table;
