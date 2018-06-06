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

// export function CheckStructure(layoutPropKey: string, element: Element<*>, check: (shallowWrapper: *) => *) {
//     const TestLayout = (props: *): Node => {
//         check(shallow(props.layoutProps[layoutPropKey]()));
//         return <div/>;
//     };
//     shallow(React.cloneElement(element, {layout: TestLayout}));
// }

export function ClassName(node: Node): boolean {
    return shallow(node).prop('className');
}

