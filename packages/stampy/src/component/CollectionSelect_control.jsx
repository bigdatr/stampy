// @flow
import React from 'react';
import type {Node} from 'react';
import SpruceComponent from '../util/SpruceComponent';
import Input from '../component/Input';
import ChildPureComponent from '../util/ChildPureComponent';

type Props = {
    closeIcon?: NodeThunk,
    match: string,
    onChangeMatch: OnChange,
    onChangeShow: (payload: boolean) => void,
    onKeyDownInput: (event: Event) => void,
    openIcon?: NodeThunk,
    parent: string,
    placeholder: string,
    show: boolean,
    valueList: NodeThunk
};

const Control = SpruceComponent(`_control`, 'div');
const OpenClose = SpruceComponent(`_openClose`, 'div');


export default class CollectionSelect_control extends ChildPureComponent<Props> {
    render(): Node {
        const {parent} = this.props;
        const {match} = this.props;
        const {placeholder} = this.props;
        const {show} = this.props;
        const {onChangeMatch} = this.props;
        const {onKeyDownInput} = this.props;
        const {onChangeShow} = this.props;

        const {valueList} = this.props;
        const {openIcon = () => <div>▾</div>} = this.props;
        const {closeIcon = () => <div style={{transform: 'rotate(180deg)'}}>▾</div>} = this.props;

        return <Control parent={parent}>
            <Input
                value={show ? match : ''}
                spruceName="_input"
                parent={parent}
                onChange={onChangeMatch}
                inputProps={{
                    placeholder,
                    onKeyDown: (event: Event) => {
                        if(event.keyCode === 13 || event.keyCode === 27) {
                            onChangeShow(false);
                        } else {
                            onChangeShow(true);
                        }
                        onKeyDownInput(event);
                    },
                    onClick: () => onChangeShow(true),
                    onFocus: () => onChangeShow(true),
                    onBlur: () => onChangeShow(false)
                }}
            />
            {(!match || !show) && valueList()}
            <OpenClose parent={parent}>
                {show ? closeIcon() : openIcon()}
            </OpenClose>
        </Control>;
    }
}
