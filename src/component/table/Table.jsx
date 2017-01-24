// @flow
import React from 'react';
import {fromJS, List, Map} from 'immutable';
import SpruceClassName from '../../util/SpruceClassName';

/**
 * @module Components
 */

//
// Th

type ThProps = {
    schemaItem: Map<any,any>
}

function Th(props: ThProps): React.Element<any> {
    const {
        width,
        heading = '',
        className
    } = props.schemaItem.toObject();

    const content: any = (typeof heading === 'function')
        ? heading()
        : heading;

    // Only return a th if the schema hasn't
    // provided one
    return (content && content.type === 'th')
        ? content
        : <th className={className} style={{width}}>{content}</th>;
}


//
// Td

type TdProps = {
    row: Map<any,any>,
    schemaItem: Map<any,any>
}

function Td(props: TdProps): React.Element<any> {
    const {row, schemaItem} = props;
    const {
        width,
        render,
        value,
        className
    } = schemaItem.toObject();

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
        : <td className={className} style={{width}}>{content}</td>;
}



//
// Table

type Schema = List<any> | Array<any> | Function;

type SchemaItem = {
    value: string | (row: Map<any>) => React.Element<any>,
    heading: string | () => React.Element<any>,
    render: (row: Map<any>) => React.Element<any>,
    width: string
}

type TableProps = {
    className: ?string,
    data: ListOrArray,
    modifier: Modifier,
    rowProps: (row: Object) => Object,
    schema: Schema
}


/**
 *
 * `Table` is a Controlled component that takes a collection of data and a schema. It iterates creating one row per item.
 *  The schema is used to determine how to render each column.
 *
 * ##### Content rendering priority order
 * 1. render function
 * 2. value function
 * 3. value key accessor
 *
 * @param {Object} props
 * @param {ClassName} [props.className]
 * @param {Array|List} props.data
 *     Collection of data to iterate over
 * @param {Modifier} modifier
 * @param {Function} [props.rowProps]
 *     Gets called for each item in data.
 *     The return object will be destructured onto the `tr`
 * @param {Array|List|Function} props.schema
 *     Collection describing how to render each column. Can be passed a function which will be
 *     called for each row.
 * @return {ReactElement}
 *
 * @example
 * const schema = [
 *      {
 *          heading: 'Name',
 *          value: 'name',
 *          width: '100px',
 *          className: 'Name'
 *      },
 *      {
 *          heading: 'BMI',
 *          value: (row) => {
 *              const {height, mass} = row.toObject();
 *              return mass / height * height;
 *          }
 *      },
 *      {
 *          heading: () => <th>Avatar</th>,
 *          render: row => <img src={row.get('avatarUrl')} />
 *      }
 * ];
 *
 * return <Table data={props.data} schema={schema} />
 *
 * @category ControlledComponent
 */
function Table(props: TableProps): React.Element<any> {
    const {modifier, className, rowProps, schema} = props;
    const data: List<any> = fromJS(props.data);


    // Take the schema to create each heading
    const tableHead: React.Element<any>[] = formatSchema(null, schema)
        .map((column, key) => <Th key={key} schemaItem={column} />)
        .toJS();

    // use `data` then `schema` to make each `row` then `column`
    const tableBody: React.Element<any>[] = data
        .map(row => {
            return <tr key={row.hashCode()} {...rowProps(row)}>
                {formatSchema(row, schema).map((column, key: number) => <Td key={key} row={row} schemaItem={column} />)}
            </tr>;
        })
        .toJS();

    return <table className={SpruceClassName({name: 'Table', modifier, className})}>
        <thead><tr>{tableHead}</tr></thead>
        <tbody>{tableBody}</tbody>
    </table>
}

function formatSchema(row:?any, schema:Schema): List<Map<string,any>> {
    const appliedSchema = typeof schema === 'function' ? schema(row) : schema;
    return fromJS(appliedSchema);
}

Table.defaultProps = {
    className: '',
    data: List(),
    modifier: '',
    rowProps: () => ({}),
    schema: List()
}

export default Table;
