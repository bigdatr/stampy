// @flow
import React from 'react';
import type {Element} from 'react';
import {fromJS, List, Map} from 'immutable';
import SpruceClassName from '../util/SpruceClassName';

/**
 * @module Components
 */

//
// Th

type ThProps = {
    schemaItem: Map<any,any>
};

function Th(props: ThProps): Element<*> {
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
};

function Td(props: TdProps): Element<*> {
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

type Schema = List<SchemaItem> | Array<SchemaItem> | Function;

type SchemaItem = {
    value: string | (row: Map<any>) => Element<*>,
    heading: string | () => Element<*>,
    render: (row: Map<any>) => Element<*>,
    width: string
};

type TableProps = {
    className?: string, // {ClassName}
    data: List<Object|Map<string,*>>|Array<Object|Map<string,*>>, // Collection of data to display in the table.
    modifier?: SpruceModifier, // {SpruceModifier}
    peer?: string, // {SprucePeer}
    rowProps: (row: Object) => Object, // {TableRowProps}
    schema: Schema, /**
         * {Array<TableSchemaColumn>|List<TableSchemaColumn>|Function}
         * A collection that describes how to process and render each column,
         * or a function that receives the current data row and should return a schema.
         */
    spruceName: string, // {SpruceName}
    tableProps?: Object // Attributes applied to the component's <table> HTML element
};

export default class Table extends React.Component<TableProps> {
    static defaultProps = {
        className: '',
        data: List(),
        modifier: '',
        rowProps: () => ({}),
        schema: List(),
        spruceName: 'Table',
        tableProps: {}
    };

    formatSchema: Function = (row: ?any, schema: Schema): List<Map<string,any>> => {
        const appliedSchema = typeof schema === 'function' ? schema(row) : schema;
        return fromJS(appliedSchema);
    };

    render(): Element<*> {
        const {
            className,
            data,
            modifier,
            peer,
            rowProps,
            schema,
            spruceName,
            tableProps
        } = this.props;

        // Take the schema to create each heading
        const tableHead: Element<*>[] = this.formatSchema(null, schema)
            .map((column, key) => <Th key={key} schemaItem={column} />)
            .toJS();

        // use `data` then `schema` to make each `row` then `column`
        const tableBody: Element<*>[] = fromJS(data)
            .map((row: Map<string,*>): Element<*> => {
                return <tr key={row.hashCode()} {...rowProps(row)}>
                    {this.formatSchema(row, schema).map((column, key: number) => <Td key={key} row={row} schemaItem={column} />)}
                </tr>;
            })
            .toArray();

        return <table {...tableProps} className={SpruceClassName({name: spruceName, modifier, className, peer})}>
            <thead><tr>{tableHead}</tr></thead>
            <tbody>{tableBody}</tbody>
        </table>;
    }
}
