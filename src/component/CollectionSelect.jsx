// @flow
import type {Node} from 'react';
import type {ChildOption} from '../hock/SelectHock';
import type {ChildValue} from '../hock/SelectHock';
import type {ChildOptionList} from '../hock/SelectHock';
import type {ChildValueList} from '../hock/SelectHock';

import React from 'react';
import map from 'unmutable/lib/map';
import pipeWith from 'unmutable/lib/util/pipeWith';

import SpruceComponent from '../util/SpruceComponent';
import {ShowHideStateful} from './ShowHide';
import SelectHock from '../hock/SelectHock';
import CollectionSelect_control from './CollectionSelect_control';
import CollectionSelect_optionItem from './CollectionSelect_optionItem';
import CollectionSelect_valueItem from './CollectionSelect_valueItem';
import CollectionSelect_optionList from './CollectionSelect_optionList';


type Props = {
    className: string, // {ClassName}
    defaultShow?: boolean,
    modifier: SpruceModifier, // {SpruceModifier}
    options: ChildOptionList<*>,
    spruceName: string, // {SpruceName}
    match: string,
    onChangeMatch: OnChange,
    onKeyDown: Function,
    renderOption?: (item: *) => Node,
    renderValue?: (item: *) => Node,
    emptyMessage?: () => Node,
    placeholder?: string,
    openIcon?: () => Node,
    closeIcon?: () => Node,
    value: ChildValueList<*>
};


const ValueList = SpruceComponent(`_valueList`, 'ul');
const OptionItem = SpruceComponent(`_optionItem`, 'li');


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

export default class CollectionSelect extends React.Component<Props> {
    static defaultProps = {
        spruceName: 'CollectionSelect'
    };
    renderControl = ({show, onChange}: *): Node => {
        const {closeIcon} = this.props;
        const {match} = this.props;
        const {onKeyDown} = this.props;
        const {openIcon} = this.props;
        const {onChangeMatch} = this.props;
        const {spruceName} = this.props;
        const {placeholder = ''} = this.props;
        const {value} = this.props;
        const {renderValue = this.renderValue} = this.props;

        return <CollectionSelect_control
            dangerouslyInsideParentComponent={true}
            closeIcon={closeIcon}
            match={match}
            onChangeMatch={onChangeMatch}
            onChangeShow={onChange}
            onKeyDownInput={onKeyDown}
            openIcon={openIcon}
            parent={spruceName}
            placeholder={placeholder}
            show={show}
            valueList={(): Node => {
                return <ValueList parent={spruceName}>
                    {pipeWith(
                        value,
                        map(renderValue)
                    )}
                </ValueList>;
            }}
        />;
    }
    renderValue = (value: ChildValue<*>, index: number): Node => {
        const {spruceName} = this.props;

        return <CollectionSelect_valueItem
            dangerouslyInsideParentComponent={true}
            key={value.label + index}
            value={value}
            parent={spruceName}
        />;
    }
    renderOptionList = ({onChange}: *): Node => {
        const {renderOption = this.renderOption} = this.props;
        const {options} = this.props;
        const {spruceName} = this.props;
        const {emptyMessage = () => 'No items found'} = this.props;
        const renderEmpty = () => <OptionItem parent={spruceName}>{emptyMessage()}</OptionItem>;

        return <CollectionSelect_optionList
            dangerouslyInsideParentComponent={true}
            onChangeShow={onChange}
            options={options}
            parent={spruceName}
            renderEmpty={renderEmpty}
            renderOption={renderOption}
        />;
    }
    renderOption = (option: ChildOption<*>): Node => {
        const {focused} = option;
        const {selected} = option;
        const {label} = option;
        const {value} = option;
        const {onChange} = option;
        const {onMouseOver} = option;
        const {spruceName} = this.props;

        return <CollectionSelect_optionItem
            key={value}
            dangerouslyInsideParentComponent={true}
            focused={focused}
            selected={selected}
            label={label}
            onChange={onChange}
            onMouseOver={onMouseOver}
            parent={spruceName}
        />;
    }
    render(): Node {
        const {spruceName} = this.props;
        const {modifier} = this.props;
        const {className} = this.props;
        const {defaultShow} = this.props;

        return <ShowHideStateful
            closeOnBlur={true}
            spruceName={spruceName}
            modifier={modifier}
            className={className}
            toggle={this.renderControl}
            defaultShow={defaultShow}
            children={this.renderOptionList}
        />;
    }
}

export const CollectionSelectStateful = SelectHock({})(CollectionSelect);

