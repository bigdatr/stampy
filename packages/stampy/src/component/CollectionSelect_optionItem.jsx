// @flow
import React from 'react';
import type {Node} from 'react';
import SpruceComponent from '../util/SpruceComponent';
import ChildPureComponent from '../util/ChildPureComponent';

type Props = {
    focused: boolean,
    label: string,
    onChange: () => *,
    onMouseOver: (event: Event) => void,
    parent: string,
    selected: boolean
};

const OptionItem = SpruceComponent(`_optionItem`, 'li');

export default class CollectionSelect_optionItem extends ChildPureComponent<Props> {
    render(): Node {
        const {parent} = this.props;
        const {selected} = this.props;
        const {focused} = this.props;
        const {onChange} = this.props;
        const {onMouseOver} = this.props;
        const {label} = this.props;

        return <OptionItem
            parent={parent}
            modifier={`${selected ? 'selected ': ''}${focused ? 'focused': ''}`}
            onMouseDown={event => event.preventDefault()}
            onClick={() => onChange()}
            onMouseOver={onMouseOver}
            children={label}
        />;
    }
}
