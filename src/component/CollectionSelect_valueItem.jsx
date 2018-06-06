// @flow
import type {Node} from 'react';
import type {ChildValue} from '../hock/SelectHock';

import React from 'react';
import SpruceComponent from '../util/SpruceComponent';
import ChildPureComponent from '../util/ChildPureComponent';

type Props = {
    value: ChildValue<*>,
    parent: string
};

const ValueItem = SpruceComponent(`_valueItem`, 'li');

export default class CollectionSelect_valueItem extends ChildPureComponent<Props> {
    render(): Node {
        const {value} = this.props;
        const {parent} = this.props;

        return <ValueItem
            parent={parent}
            onMouseDown={event => event.preventDefault()}
            onClick={() => value.onDelete()}
            children={`${value.label} ×`}
        />;
    }
}
