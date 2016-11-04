// @flow
import React from 'react';
import {fromJS, List, Map} from 'immutable';
import {deepReduceOutwards} from 'immutable-recursive';
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
    return <th
        style={{width}}
        children={heading}
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
    const {render, filter} = schemaItem.toObject();

    // Content rendering priority order
    // 1. render function
    // 2. filter function
    // 3. filter key accessor
    const content: any = (render)
        ? render(row)
        : (typeof filter === 'function')
            ? filter(row)
            : row.get(filter)
    ;

    // Only return a td if the schema hasn't
    // provided one
    return (content && content.type === 'td')
        ? content
        : <td>{content}</td>;
}





type Schema = ListOrArray<SchemaItem>;

type SchemaItem = {
    filter: string | (row: Map<any>) => React.Element<any>,
    heading: string,
    render: (row: Map<any>) => React.Element<any>,
    width: string | number
}


type TableProps = {
    childNodeName: ?string,
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
 * 2. filter function
 * 3. filter key accessor
 *
 * @param {Object}      [props]
 * @param {String}      [props.childNodeName]    - name of the key that holds any children nodes to flatten
 * @param {String}      [props.className]
 * @param {Array|List}  [props.data]             - Collection of data to iterate over
 * @param {String}      [props.modifier]         - Spruce modifiers
 * @param {Function}    [props.rowProps]         - Gets called for each item in data. The return object will be destructured onto the `tr`
 * @param {Array|List}  [props.schema]           - Collection describing how to render each column
 *
 * @example
 * const schema = [
 *      {
 *          heading: 'Name',
 *          filter: 'name'
 *      },
 *      {
 *          heading: 'BMI',
 *          filter: (row) => {
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
    const {modifier, className, rowProps, childNodeName} = props;
    const schema = fromJS(props.schema);

    // deepRecurse through the childNodes, pushing each leaf
    // to the reduction. This will flatten the any deep children
    // but retain their ordering
    const data: List<any> = fromJS(props.data)
        // A fake parent node has to be created so that
        // the deepReduce can start with a child
        .update(ii => Map().set(childNodeName, ii))
        .update(deepReduceOutwards((reduction, item) => {
            return reduction.push(item);
        }, List(), [childNodeName]))
        .skip(1); // The first node is our fake root node.


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
    childNodeName: 'children',
    data: List(),
    modifier: '',
    schema: List(),
    rowProps: () => ({}),
    sortAscending: false,
    sortBy: null
}

export default Table;

