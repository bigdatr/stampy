//@flow
import type {Node} from 'react';
import React from 'react';
import {shallow} from 'enzyme';


export function CheckHockChildProps(hock: Function, props: *, render: (props: *) => void) {
    const Component = hock((props: Object): Node => {
        render(props);
        return <div/>;
    });
    shallow(<Component {...props}/>).dive();
}

export function CheckChildProps(node: Node, check: (props: *) => void) {
    check(shallow(node).props());
}


export function CheckClassName(node: Node, className: string): boolean {
    return shallow(node).prop('className') === className;
}
