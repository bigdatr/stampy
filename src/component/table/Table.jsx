// @flow

import React, {Component, PropTypes} from 'react';
import {fromJS, List, Map} from 'immutable';
import {deepReduceOutwards} from 'immutable-recursive';
import ComponentClassName from '../../util/ComponentClassName';

type Schema = ListOrArray<SchemaItem>;

type SchemaItem = {
    filter: string | (row: Map<any>) => React.Element<any>,
    heading: string,
    render: (row: Map<any>) => React.Element<any>,
    width: string | number
}

type Props = {
    className: ?string,
    data: ListOrArray<any>,
    modifier: ?string,
    rowProps: (row: Object) => Object,
    schema: Schema
}



function Th(props: Object): React.Element<any> {
    var {width, heading = ''} = props.schemaItem.toObject();
    return <th
        style={{width}}
        children={heading}
    />;
}

function Td(props: Object): React.Element<any> {
    const {row, schemaItem} = props;
    const {render, filter} = schemaItem.toObject();

    // Content rendering priority order
    // 1. render function
    // 2. filter function
    // 3. filter key accessor
    const content = (render)
        ? render(row)
        : (typeof filter === 'function')
            ? filter(row)
            : props.row.get(filter)
    ;

    return <td>{content}</td>;
}


function Table(props: Props): React.Element<any> {
    const {modifier, className, rowProps} = props;
    const schema = fromJS(props.schema);
    const data = fromJS(props.data)
        .update(ii => Map().set('children', ii))
        .update(deepReduceOutwards((reduction, item) => {
            return reduction.push(item);
        }, List(), ['children']))
        .skip(1); // The first node is the root node


    // Take the schema to create each heading
    const tableHead: React.Element<any> = schema
        .map((column, key: number) => <Th key={key} schemaItem={column} />)
        .toJS();

    // use `data` then `schema` to make each `row` then `column`
    const tableBody = data
        .map((row, rowKey: number) => {
            return <tr key={row.hashCode()} {...rowProps(row)}>
                {schema.map((column, key: number) => <Td key={key} row={row} schemaItem={column} />)}
            </tr>;
        });

    return <table className={ComponentClassName({name: 'Table', modifier, className})}>
        <thead><tr>{tableHead}</tr></thead>
        <tbody>{tableBody}</tbody>
    </table>
}

Table.defaultProps = {
    className: '',
    data: List(),
    modifier: '',
    schema: List(),
    rowProps: () => ({}),
    sortAscending: false,
    sortBy: null
}

export default Table;

