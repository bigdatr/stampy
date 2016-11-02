// @flow

import React, {Component, PropTypes} from 'react';
import {fromJS, List, Map} from 'immutable';
import ComponentClassName from 'stampy/util/ComponentClassName';

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
    schema: Schema
}

const defaultProps = {
    className: '',
    data: List(),
    modifier: '',
    schema: List(),
    sortAscending: false,
    sortBy: null
}

function Th(props: Object): React.Element<any> {
    var {width, heading = ''} = props.schemaItem;

    return <th
        style={{width}}
        children={heading}
    />;
}

function Td(props: Object): React.Element<any> {
    const {row, schemaItem: {render, filter}} = props;

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


function Table(props: Props = defaultProps): React.Element<any> {
    const {modifier, className} = props;
    const schema = fromJS(props.schema);
    const data = fromJS(props.data);

    // Take the schema to create each heading
    const tableHead: React.Element<any> = schema
        .map((column, key: number) => <Th key={key} schemaItem={column} />)
        .toJS();

    // use `data` then `schema` to make each `row` then `column`
    const tableBody = data
        .map((row, rowKey: number) => {
            return <tr key={rowKey}>
                {schema.map((column, key: number) => <Td key={key} row={row} schemaItem={column} />)}
            </tr>;
        });

    return <table className={ComponentClassName({name: 'Table', modifier, className})}>
        <thead><tr>{tableHead}</tr></thead>
        <tbody>{tableBody}</tbody>
    </table>
}

export default Table;

