import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';
import Text from '../Text';

test('Text will render a custom Element', tt => {
    function TestElement() {
        return <div></div>;
    }
    tt.is(shallow(<Text />).node.type, 'span');
    tt.is(shallow(<Text element="div"/>).node.type, 'div');
    tt.is(shallow(<Text element={TestElement}/>).node.type, TestElement);
});

test('Text will format numbers', tt => {
    tt.is(shallow(<Text numberFormat="0,0" children={1234}/>).node.props.children, '1,234');
});

test('Text will format dates', tt => {
    tt.is(shallow(<Text dateFormat="YYYY-MM-DD" children={0}/>).node.props.children, '1970-01-01');
    tt.is(shallow(<Text dateFormat="DD-MM-YYYY" children={'1970-01-01'}/>).node.props.children, '01-01-1970');
});
