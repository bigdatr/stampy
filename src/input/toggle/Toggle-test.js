import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';
import sinon from 'sinon';
import Toggle from './Toggle';

test('toggle', tt => {

    const onChange = sinon.spy();
    const trueToggle = shallow(<Toggle value={true}>Toggle</Toggle>);
    const falseToggle = shallow(<Toggle onChange={onChange} value={false}>Toggle</Toggle>);

    tt.truthy(
        trueToggle.render().children().first().hasClass('Button-active'),
        'toggle has a class of Button-active when value is true'
    );

    tt.falsy(
        falseToggle.render().children().first().hasClass('Button-active'),
        'toggle has not a class of Button-active when value is false'
    );
});
