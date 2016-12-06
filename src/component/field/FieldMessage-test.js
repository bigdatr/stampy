import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';
import sinon from 'sinon';
import FieldMessage from './FieldMessage';
import {List, Map} from 'immutable';

test('FieldMessage', tt => {

    tt.is(
        shallow(<FieldMessage/>).html(),
        null,
        'doesn\'t render anything with no input'
    );

    tt.is(
        shallow(<FieldMessage error='Error' warning='Warning' touched={false}/>).html(),
        null,
        'doesn\'t render when untouched'
    );


    tt.is(
        shallow(<FieldMessage error='Error' warning='Warning' touched={true}/>)
            .find('div')
            .children()
            .length,
        2,
        'renders both warnings and errors'
    );

    tt.true(
        shallow(<FieldMessage warning='Warning' touched={true}/>)
            .find('div')
            .children()
            .at(0)
            .hasClass('FieldMessage-warning'),
        'renders warnings without errors'
    );


    tt.true(
        shallow(<FieldMessage error='Error' warning='Warning' touched={true}/>)
            .find('div')
            .children()
            .at(0)
            .hasClass('FieldMessage-error'),
        'renders errors before warnings'
    );


    tt.is(
        shallow(<FieldMessage error={['Error1', 'Error2']} warning={{warning: 'Warning'}} touched={true}/>)
            .find('div')
            .children()
            .length,
        3,
        'handles errors being passed as arrays or objects'
    );


    tt.is(
        shallow(<FieldMessage error={List(['Error1', 'Error2'])} warning={Map({warning: 'Warning'})} touched={true}/>)
            .find('div')
            .children()
            .length,
        3,
        'handles errors being passed as lists or maps'
    );


});



