import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';
import Table from './Table';

const schema = [
    {
        heading: 'foo',
        filter: 'foo',
        width: 200,
        render: row => <td className="test"><strong>{row.get('foo')}</strong></td>
    },
    {
        heading: 'bar',
        filter: row => row.get('bar') + '|' + row.get('foo')
    },
    {
        filter: 'baz'
    }
];

const data = [
    {
        foo: 1,
        bar: 2,
        baz: 3
    },
    {
        foo: 4,
        bar: 5,
        baz: 6
    }
];

function renderAt(wrapper, find, index) {
    return wrapper
        .find(find)
        .at(index)
        .render();
}

test('th content rendering', tt => {
    const wrapper = shallow(<Table data={data} schema={schema} />);
    const ThList = wrapper.find('Th');
    tt.is(ThList.length, 3);
    tt.is(
        ThList
            .at(2)
            .render()
            .text()
        ,
        ''
    );
    tt.is(
        ThList
            .at(0)
            .render()
            .html(),
        '<th style="width:200px;">foo</th>'
    );
});


test('td content rendering', tt => {
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
});

test('child flattening', tt => {
    const nestedData = [
        {
            foo: 'bar',
            children: [
                {
                    foo: 'bar'
                }
            ]
        }
    ];
    const wrapper = shallow(<Table data={nestedData} schema={schema} />);
    tt.is(wrapper.find('tbody tr').length, 2);
    tt.is(shallow(<Table data={nestedData} schema={schema} childNodeName="other"/>).find('tbody tr').length, 1);
})
