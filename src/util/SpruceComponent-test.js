import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';
import SpruceComponent from './SpruceComponent';




const Foo = SpruceComponent('Foo', 'li');
const fooWrapper = shallow(<Foo modifier="red">Rad</Foo>);

test('the component renders the given type', tt => {
    tt.is(fooWrapper.type(), 'li');
});

test('the component renders SpruceClassNames', tt => {
    tt.is(fooWrapper.hasClass('Foo'), true);
    tt.is(fooWrapper.hasClass('Foo-red'), true);
});


const Bar = ({className, children}: {className: String, children: React.Element<any>}) => <div className={className} children={children} />;
const Baz = SpruceComponent('Baz', Bar);
const bazWrapper = shallow(<Baz modifier="green">Rad</Baz>);


test('It renders custom components', tt => {
    tt.is(bazWrapper.hasClass('Baz'), true);
});
