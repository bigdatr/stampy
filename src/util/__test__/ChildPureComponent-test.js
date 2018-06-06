// @flow
import test from 'ava';
import React from 'react';
import {cloneElement} from 'react';
import {shallow} from 'enzyme';
import {fake} from 'sinon';
import ChildPureComponent from '../ChildPureComponent';




//
// Tests
//

test('will throw if dangerouslyInsideParentComponent is not true', (t: *) => {

    class Child extends ChildPureComponent<{}> {
        render() {
            return <div/>;
        }
    }

    // $FlowBug - deliberate misuse of types for testing
    t.throws(() => shallow(<Child/>));

    t.notThrows(() => shallow(<Child dangerouslyInsideParentComponent={true} />));
});
