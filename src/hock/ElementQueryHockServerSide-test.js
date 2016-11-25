import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';
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
    const eqHock = shallow(<ElementQueryHockExample/>);

    tt.is(
        eqHock.html(),
        '<div>Hello World</div>',
        'component can still be rendered without browser'
    );

});