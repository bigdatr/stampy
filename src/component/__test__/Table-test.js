// @flow
import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';
import Table from '../Table';

const schema = [
    {
        heading: 'foo',
        value: 'foo',
        width: 200,
        render: row => <td className="test"><strong>{row.get('foo')}</strong></td>
    },
    {
        heading: () => 'bar',
        value: row => row.get('bar') + '|' + row.get('foo')
    },
    {
        value: 'baz'
    },
    {
        heading: () => <th>Heading</th>,
        value: 'wop'
    },
    {
        heading: 'nok',
        value: 'tol',
        className: 'azt'
    }
];

const data = [
    {
        foo: 1,
        bar: 2,
        baz: 3,
        wop: 7,
        tol: 9
    },
    {
        foo: 4,
        bar: 5,
        baz: 6,
        wop: 8,
        tol: 10
    }
];

const renderAt = (wrapper: *, find: *, index: number): * => {
    return wrapper
        .find(find)
        .at(index)
        .render();
};

test('th content rendering', (tt: Object) => {
    const wrapper = shallow(<Table data={data} schema={schema} />);
    const ThList = (num: number): * => {
        return wrapper
            .find('Th')
            .at(num)
            .render();
    };

    tt.is(wrapper.find('Th').length, 5);
    tt.is(ThList(4).html(), '<th class="azt">nok</th>');
    tt.is(ThList(3).text(), 'Heading');
    tt.is(ThList(2).text(), '');
    tt.is(ThList(1).text(), 'bar');
    tt.is(ThList(0).html(), '<th style="width:200px;">foo</th>');
});


test('td content rendering', (tt: Object) => {
    const wrapper = shallow(<Table data={data} schema={schema} />);

    const firstRow = wrapper
        .find('tbody tr')
        .at(0);

    const firstTd = renderAt(firstRow, 'Td', 0)
        .children()
        .first();

    tt.is(wrapper.find('tbody tr').length, 2);
    tt.is(firstTd.html(), '<strong>1</strong>');
    tt.is(firstTd.attr('class'), 'test');
    tt.is(renderAt(firstRow, 'Td', 1).text(), '2|1');
    tt.is(renderAt(firstRow, 'Td', 2).text(), '3');
    tt.is(renderAt(firstRow, 'Td', 4).html(), '<td class="azt">9</td>');
});

const functionSchema = (): Array<Object> => {
    return [
        {
            heading: 'Col 1',
            value: 'foo'
        },
        {
            heading: 'Col 2',
            value: 'bar'
        }
    ];
};

test('rendering with schema as a function', (tt: Object) => {
    const wrapper = shallow(<Table data={data} schema={functionSchema} />);

    const firstRow = wrapper
        .find('tbody tr')
        .at(0);

    tt.is(renderAt(firstRow, 'Td', 0).text(), '1');
    tt.is(renderAt(firstRow, 'Td', 1).text(), '2');
});

test('Table should apply tableProps to outer element', (tt: Object) => {
    const table = shallow(<Table tableProps={{'data-test': "test"}} />);
    tt.is(
        table
            .render()
            .children()
            .first()
            .get(0)
            .attribs['data-test'],
        "test"
    );
});

test('table classes', (tt: Object) => {
    tt.truthy(
        shallow(<Table data={data} schema={schema}/>)
            .render()
            .children()
            .first()
            .hasClass('Table'),
        'table should have a class of Table'
    );

    tt.truthy(
        shallow(<Table data={data} schema={schema} spruceName="Thing"/>)
            .render().
            children()
            .first()
            .hasClass('Thing'),
        'table should change class if given a spruceName prop'
    );

    tt.truthy(
        shallow(<Table data={data} schema={schema} modifier="large"/>)
            .render()
            .children()
            .first()
            .hasClass('Table-large'),
        'tables with modifiers should be rendered with that modifier class'
    );

    tt.truthy(
        shallow(<Table data={data} schema={schema} peer="Thing"/>)
            .render()
            .children()
            .first()
            .hasClass('Table--Thing'),
        'tables with peers should be rendered with that peer class'
    );

    tt.truthy(
        shallow(<Table data={data} schema={schema} className="foo"/>)
            .render()
            .children()
            .first()
            .hasClass('foo'),
        'tables with className should append className'
    );

    tt.truthy(
        shallow(<Table data={data} schema={schema} className="foo"/>)
            .render()
            .children()
            .first()
            .hasClass('Table'),
        'tables with className should not replace other class names'
    );
});
