// @flow
import PropTypes from 'prop-types';
import React from 'react';
import {fromJS, List, Map} from 'immutable';
import SpruceClassName from '../../util/SpruceClassName';
import StampyPropTypes from '../../decls/PropTypes';
import ImmutablePropTypes from 'react-immutable-proptypes';

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

/**
 * An `Object` or `Map` that defines a column.
 *
 * @typedef {Object|Map} TableSchemaColumn
 * @property {string} heading The heading rendered at the top of the column
 * @property {string|Function} [value] A string indicating which data object key to fetch from each row, or a function that receives the current data row and should return the value.
 * @property {string} [className] Class names to apply to each cell in this column.
 * @property {TableSchemaRenderFunction} [render] A function that receives the current data row and should return a `ReactElement` to render.
 */

/**
 * Props to add to the `<tr>` element on each row.
 *
 * @callback TableRowProps
 * @param {Map} row The current data row.
 * @return {Object<string, string>} An object with string values, which will be destructured onto the `<tr>` element of each row.
 */

/**
 *
 * @component
 *
 * `Table` is a Controlled component that takes a collection of data and a schema. It iterates creating one row per item.
 *  The schema is used to determine how to render each column.
 *
 * ##### Content rendering priority order
 * 1. render function
 * 2. value function
 * 3. value key accessor
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
    const {
        className,
        modifier,
        rowProps = () => ({}),
        schema,
        spruceName,
        tableProps
    } = props;

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
        .toArray();

    return <table {...tableProps} className={SpruceClassName({name: spruceName, modifier, className})}>
        <thead><tr>{tableHead}</tr></thead>
        <tbody>{tableBody}</tbody>
    </table>
}

function formatSchema(row: ?any, schema: Schema): List<Map<string,any>> {
    const appliedSchema = typeof schema === 'function' ? schema(row) : schema;
    return fromJS(appliedSchema);
}

Table.propTypes = {
    /** {ClassName} */
    className: PropTypes.string,
    /** {Array|List} Collection of data to display in the table. */
    data: PropTypes.oneOfType([
        PropTypes.array,
        ImmutablePropTypes.list
    ]),
    /** {SpruceModifier} */
    modifier: StampyPropTypes.spruceModifier,
    /** {TableRowProps} */
    rowProps: PropTypes.func,
    /**
     * {Array<TableSchemaColumn>|List<TableSchemaColumn>|Function}
     * A collection that describes how to process and render each column,
     * or a function that receives the current data row and should return a schema.
     */
    schema: PropTypes.oneOfType([
        PropTypes.array,
        ImmutablePropTypes.list,
        PropTypes.func
    ]),
    /** {SpruceName} */
    spruceName: PropTypes.string,
    /** {HtmlProps} */
    tableProps: StampyPropTypes.htmlProps
};

Table.defaultProps = {
    className: '',
    data: List(),
    modifier: '',
    schema: List(),
    spruceName: 'Table',
    tableProps: {}
};

type Schema = List<SchemaItem> | Array<SchemaItem> | Function;

type SchemaItem = {
    value: string | (row: Map<any>) => React.Element<any>,
    heading: string | () => React.Element<any>,
    render: (row: Map<any>) => React.Element<any>,
    width: string
}

type TableProps = {
    className?: string,
    data: ListOrArray,
    modifier?: SpruceModifier,
    rowProps?: (row: Object) => Object,
    schema: Schema,
    spruceName?: string,
    tableProps?: Object
}

export default Table;
