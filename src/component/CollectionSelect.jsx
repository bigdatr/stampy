// @flow
import React from 'react';
import type {Node} from 'react';
import type {List} from 'immutable';
import SpruceComponent from '../util/SpruceComponent';
import {ShowHideStateful} from './ShowHide';
import SelectHock from '../hock/SelectHock';
import StateHock from '../hock/StateHock';
import Input from '../component/Input';
import Compose from '../util/Compose';

import map from 'unmutable/lib/map';
import get from 'unmutable/lib/get';
import filter from 'unmutable/lib/filter';
import doIf from 'unmutable/lib/doIf';
import isEmpty from 'unmutable/lib/isEmpty';
import pipeWith from 'unmutable/lib/util/pipeWith';





type Props = {
    className: string, // {ClassName}
    modifier: SpruceModifier, // {SpruceModifier}
    options: Array<*>|List<*>,
    spruceName: string, // {SpruceName}
    labelKey: string,
    valueKey: string,
    match: string,
    onChangeState: (string) => void,
    onKeyDown: Function,
    renderOption: (item: *, index: number) => Node,
    renderValue: (item: *, index: number) => Node,
    emptyMessage: () => Node,
    placeholder?: string,
    openIcon: () => Node,
    deleteItemIcon: () => Node,
    closeIcon: () => Node,
    value: *
};

const OptionList = SpruceComponent(`_optionList`, 'ul');
const Control = SpruceComponent(`_control`, 'div');
const OptionItem = SpruceComponent(`_optionItem`, 'li');
const ValueList = SpruceComponent(`_valueList`, 'ul');
const ValueItem = SpruceComponent(`_valueItem`, 'li');
const OpenClose = SpruceComponent(`_openClose`, 'div');
const Box = SpruceComponent('Box', 'div');


/**
 * @component
 *
 * `CollectionSelect` is a small wrapper around [react-select](https://github.com/JedWatson/react-select).
 *
 * @prop {Boolean} [multi]
 * Toggles the between single and multi select mode.
 * Multiselect onChange will return an array to `newValue`
 *
 * @prop {boolean} [clearable]
 * @prop {boolean} [disabled]
 * @prop {boolean} [multi]
 * @prop {OnChange|OnChangeMulti} [onChange]
 * @prop {Object[]} [options]
 * @prop {string} [placeholder]
 * @prop {any} [value]
 * @prop {string} [valueKey]
 *
 * @example
 * const options = [
 *     {
 *         value: 'foo',
 *         label: 'Foo'
 *     },
 *     {
 *         value: 'bar',
 *         label: 'Bar'
 *     }
 * ]
 * return <CollectionSelect onChange={(val) => doStuff(val)} options={options}/>
 */

class CollectionSelect extends React.Component<Props> {
    static defaultProps = {
        spruceName: 'CollectionSelect'
    };
    onChangeMatch = (payload: string, {event}: *) => {
        event.stopPropagation();
        this.props.onChangeState(payload);
    }
    renderValue = (value: *, index: number): Node => {
        const {spruceName: name} = this.props;
        const {renderValue = (value: *, index: number) => <span
            key={index}
            onClick={() => value.onDelete()}
            children={`${value.label} ×`}
        />} = this.props;

        return <ValueItem
            parent={name}
            key={value.label + index}
            onMouseDown={event => event.preventDefault()}
            children={renderValue(value, index)}
        />;
    }
    render(): Node {
        const {spruceName: name} = this.props;
        const {modifier} = this.props;
        const {className} = this.props;
        const {options} = this.props;
        const {onKeyDown} = this.props;
        const {match} = this.props;
        const {emptyMessage = () => <span>No items found</span>} = this.props;
        const {placeholder} = this.props;
        const {openIcon = () => <div>▾</div>} = this.props;
        const {closeIcon = () => <div style={{transform: 'rotate(180deg)'}}>▾</div>} = this.props;

        const {renderOption = (oo: *, index: number): Node => {
            return <OptionItem
                parent={name}
                key={oo.value + index}
                modifier={`${oo.matched ? 'matched ' : ''}${oo.selected ? 'selected ': ''}${oo.focused ? 'focused': ''}`}
                onMouseDown={(event: Event) => event.preventDefault()}
                onClick={() => oo.onChange()}
                onMouseOver={oo.onMouseOver}
                children={oo.label}
            />;
        }} = this.props;


        const toggle = ({show, onChange}) => <Control parent={name}>
            <Input
                value={show ? match : ''}
                spruceName="_input"
                parent={name}
                onChange={this.onChangeMatch}
                inputProps={{
                    placeholder,
                    onKeyDown: (event: Event) => {
                        if(event.keyCode === 13 || event.keyCode === 27) {
                            onChange(false);
                        } else {
                            onChange(true);
                        }
                        onKeyDown(event);
                    },
                    onClick: () => console.log('onClick input') || onChange(true),
                    onFocus: () => onChange(true),
                    onBlur: () => onChange(false)
                }}
            />
            {(!match || !show) && <ValueList parent={name}>
                {pipeWith(
                    this.props.value,
                    map(this.renderValue)
                )}
            </ValueList>}
            <OpenClose parent={name}>
                {show ? closeIcon() : openIcon()}
            </OpenClose>
        </Control>;

        return <Box>
            <ShowHideStateful
                closeOnBlur={true}
                spruceName={name}
                modifier={modifier}
                className={className}
                toggle={toggle}
                children={({onChange}) => <OptionList parent={name}>
                    {pipeWith(
                        options,
                        filter(get('matched')),
                        map((item: *, index: number) => renderOption({
                            ...item,
                            onChange: () => {
                                item.onChange();
                                onChange(false);
                            }
                        }, index)),
                        doIf(isEmpty(), () => <OptionItem>{emptyMessage()}</OptionItem>)
                    )}
                </OptionList>}
            />
        </Box>;
    }
}

export const ShowHideState: ComponentType<*> = Compose(
    StateHock({
        initialState: () => '',
        onChangeProp: () => 'onChangeState',
        valueProp: () => 'match'
    }),
    SelectHock({})
);


export default ShowHideState(CollectionSelect);
