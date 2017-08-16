import test from 'ava';
import React from 'react';
import {renderToString} from 'react-dom/server'
import cheerio from 'cheerio';
import ElementQueryHock from './ElementQueryHock';

const example = () => {
    return <div>Hello World</div>;
};

const ElementQueryHockExample = ElementQueryHock([
    {
        name: 'medium',
        widthBounds: [1000, 1600],
        heightBounds: [500, 1000]
    },
    {
        name: 'large',
        widthBounds: [1600]
    }
])(example);



test('ElementQueryHockServerSide', tt => {
    const str = renderToString(<ElementQueryHockExample/>);
    const html = cheerio.load(str);

    tt.is(
        html.text(),
        'Hello World',
        'component can still be rendered without browser'
    );

    const HockInstance = new ElementQueryHockExample();

    tt.notThrows(() => HockInstance.componentDidMount(), 'Doesn\'t throw errors when mounting without window global');
    tt.notThrows(() => HockInstance.componentWillUnmount(), 'Doesn\'t throw errors when unmounting without window global');
});
