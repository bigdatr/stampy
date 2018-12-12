// @flow
import type {Node} from 'react';
import type {ChildOption} from '../hock/SelectHock';
import type {ChildOptionList} from '../hock/SelectHock';

import React from 'react';
import SpruceComponent from '../util/SpruceComponent';
import ChildPureComponent from '../util/ChildPureComponent';

import map from 'unmutable/lib/map';
import get from 'unmutable/lib/get';
import filter from 'unmutable/lib/filter';
import doIf from 'unmutable/lib/doIf';
import isEmpty from 'unmutable/lib/isEmpty';
import pipeWith from 'unmutable/lib/util/pipeWith';


type Props = {
    onChangeShow: (payload: boolean) => void,
    options: ChildOptionList<*>,
    parent: string,
    renderEmpty: () => Node,
    renderOption: (option: ChildOption<*>) => Node
};

const OptionList = SpruceComponent(`_optionList`, 'ul');

export default class CollectionSelect_optionList extends ChildPureComponent<Props> {
    render(): Node {
        const {onChangeShow} = this.props;
        const {options} = this.props;
        const {parent} = this.props;
        const {renderEmpty} = this.props;
        const {renderOption} = this.props;

        return <OptionList
            parent={parent}
            children={pipeWith(
                options,
                filter(get('matched')),
                map((item: ChildOption<*>) => renderOption({
                    ...item,
                    onChange: () => {
                        item.onChange();
                        onChangeShow(false);
                    }
                })),
                doIf(isEmpty(), renderEmpty)
            )}
        />;
    }
}
