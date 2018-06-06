// @flow
import {PureComponent} from 'react';

type Props = {
    dangerouslyInsideParentComponent: boolean
};

export default class ChildPureComponent<T> extends PureComponent<T & Props> {
    constructor(props: T & Props) {
        super(props);
        if(!props.dangerouslyInsideParentComponent) {
            throw new Error(`ChildComponents can not be nested outside of their parent. Check instances of ${this.constructor.name}`);
        }
    }
}
