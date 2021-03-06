// @flow
import type {Element} from 'react';
import type {List} from 'immutable';
import React from 'react';
import Hock from '../util/Hock';

import isIndexed from 'unmutable/lib/util/isIndexed';
import concat from 'unmutable/lib/concat';
import del from 'unmutable/lib/delete';
import doIf from 'unmutable/lib/doIf';
import find from 'unmutable/lib/find';
import get from 'unmutable/lib/get';
import identity from 'unmutable/lib/identity';
import map from 'unmutable/lib/map';
import method from 'unmutable/lib/util/method';
import pipe from 'unmutable/lib/util/pipe';
import pipeWith from 'unmutable/lib/util/pipeWith';
import pop from 'unmutable/lib/pop';
import reduce from 'unmutable/lib/reduce';
import reverse from 'unmutable/lib/reverse';
import set from 'unmutable/lib/set';
import size from 'unmutable/lib/size';
import slice from 'unmutable/lib/slice';
import shift from 'unmutable/lib/shift';


const toLowerCase = method('toLowerCase');
const includes = method('includes');
const onChange = method('onChange');
const noop = () => {};



const cycle = (index) => (array) => pipeWith(
    array,
    slice(index),
    concat(slice(0, index)(array))
);


type Props = {
    getLabel: (item: *) => string,
    getValue: (item: *) => string,
    multi: boolean,
    onChange: Function,
    options: List<*>|Array<*>,
    value: List<*>|Array<*>,
    valueAsPrimitive: boolean
};
type State = {
    focusIndex: number,
    match: string,
    value: List<*>|Array<*>,
    optionByValue: Object,
    options: List<*>|Array<*>
};

export type ChildOption<OptionType> = {
    value: string,
    label: string,
    option: OptionType,
    focused: boolean,
    matched: boolean,
    onChange: () => void,
    onMouseOver: (event: Event) => void,
    selected: boolean
};

export type ChildValue<OptionType> = {
    value: string,
    label: string,
    onDelete: () => void,
    option: OptionType
};

export type ChildValueList<OptionType> = Array<ChildValue<OptionType>>|List<ChildValue<OptionType>>;
export type ChildOptionList<OptionType> = Array<ChildOption<OptionType>>|List<ChildOption<OptionType>>;


export default Hock({
    hock: (config: *) => (Component: *): * => {

        /**
         * @component
         *
         * Select hock provided the functions required to build a select-like component.
         *
         * @example
         * // Select
         * import {SelectHock} from 'stampy';
         *
         * const example = (props) => {
         *     const {options} = props;
         *     return <div onKeyDown={onKeyDown}>
         *         {options.map(option => <button onClick={option.onChange}>{options.value}</button>)}
         *     </div>
         * }
         *
         * const withSelect = SelectHock();
         * export default withSelect(example);
         *
         * @childprop {number} focusIndex
         * @childprop {Object[]} options
         * @childprop {boolean} options[].focused
         * @childprop {boolean} options[].matched
         * @childprop {function} options[].onChange
         * @childprop {boolean} options[].selected
         * @childprop {any} options[].value
         * @childprop {any} value
         * @childprop {function} onKeyDown
         * @childprop {function} onHover
         *
         * @decorator {SelectHock}
         * @decorator {HockApplier}
         *
         * @memberof module:Hocks
         */
        class SelectHock extends React.Component<Props, State> {
            static defaultProps = {
                getValue: get('id'),
                getLabel: get('name'),
                multi: false,
                valueAsPrimitive: false,
                onChange: identity()
            }
            mapValueToOptions = (options: *): * => {
                return map(id => this.state.optionByValue[id])(options);
            }
            constructor(props: Object) {
                super(props);
                this.state = this.constructState(props, {
                    match: ''
                });
            }
            componentWillReceiveProps(nextProps: Props) {
                this.setState(this.constructState(nextProps, this.state));
            }
            constructState(props: Props, state: *): State {
                const {getValue} = props;
                const {getLabel} = props;
                const {options} = props;
                const {match} = state;
                const {valueAsPrimitive} = props;
                const focusIndex = state.focusIndex || 0;

                // make sure the value is a list and is primitive
                const value = pipeWith(
                    props.value,
                    doIf(isIndexed, identity(), (value) => [].concat(value || [])),
                    valueAsPrimitive ? identity() : map(getValue)
                );

                const containsSearchTerm = pipe(
                    doIf(getLabel, getLabel, getValue),
                    toLowerCase(),
                    includes(match.toLowerCase()),
                );

                const isSelected = item => pipeWith(
                    value,
                    includes(getValue(item))
                );


                return {
                    focusIndex,
                    value,
                    match,
                    optionByValue: pipeWith(
                        options,
                        reduce((rr, ii) => set(getValue(ii), ii)(rr), {})
                    ),
                    options: pipeWith(
                        props.options,
                        map((option: *, index: number): ChildOption<*> => {

                            const onChange = () => this.onChange(option);
                            const selected = isSelected(option);
                            const canFocusSelectedItems = config.focusSelected || !selected;

                            const matched = (match === '') ? true : containsSearchTerm(option);

                            return {
                                focused: focusIndex === index,
                                matched,
                                onChange: (!config.allowDuplicates && selected) ? noop : onChange,
                                onMouseOver: () => canFocusSelectedItems && this.setIndex(index),
                                selected,
                                label: getLabel(option),
                                value: getValue(option),
                                option
                            };
                        })
                    )
                };
            }
            onChangeMatch = (match: string) => {
                this.setState(this.constructState(this.props, {...this.state, match}));
            }
            onChange = (payload: *) => {
                const {multi} = this.props;
                const {getValue} = this.props;
                const {value} = this.state;

                pipeWith(
                    payload,
                    getValue,
                    data => [].concat(data), // make sure we have an array
                    multi ? (payload) => value.concat(payload) : identity(), // concat values if multi
                    this.onChangeMulti
                );
            }
            onChangeMulti = (value: Array<*>) => {
                const {multi} = this.props;
                const {valueAsPrimitive} = this.props;

                pipeWith(
                    value,
                    valueAsPrimitive ? identity() : this.mapValueToOptions,  // if not primitive map id back to its option
                    multi ? identity() : get(0), // if not multi get the first item out of the list
                    this.props.onChange
                );
            }

            setIndex = (focusIndex: number) => {
                this.setState(this.constructState(this.props, {...this.state, focusIndex}));
            }
            findSafeIndex = (delta: number) => {
                const {options} = this.state;
                const {focusIndex} = this.state;
                const backwards = delta < 0;

                // backawards splicing is from the end of the array
                // because it will be reversed becuase backwards
                const splicePoint = (backwards)
                    ? size()(options) - 1 - (focusIndex + delta)
                    : focusIndex + delta
                ;

                pipeWith(
                    options,
                    // create an entry object to preserve our original index
                    map((option, index) => ({option, index})),
                    // move the items that are at the 'behind' the splice point to
                    // the end of the array so the find can cycle around the ends of the array
                    backwards ? reverse() : identity(),
                    cycle(splicePoint),
                    // find the next index of something allowed to be focused by config
                    find(({option}: *): boolean => {
                        const canFocusUnmatchedItems = config.focusUnmatched || option.matched;
                        const canFocusSelectedItems = config.focusSelected || !option.selected;
                        return canFocusUnmatchedItems && canFocusSelectedItems;
                    }),
                    // only set a new index if something was found
                    doIf(identity(), pipe(get('index'), this.setIndex))
                );
            }
            onKeyDown = (event: SyntheticKeyboardEvent<*>): * => {
                const {keyCode} = event;
                const {options} = this.state;
                const {value} = this.state;
                const {match} = this.state;

                switch(keyCode) {
                    case 13: // return
                        return pipeWith(
                            options,
                            get(this.state.focusIndex),
                            onChange()
                        );

                    case 8: // backspace
                    case 46: // delete
                        if(match) {
                            return;
                        }
                        return pipeWith(
                            value,
                            keyCode === 8 ? pop() : shift(),
                            this.onChangeMulti
                        );

                    case 40: // down
                        return this.findSafeIndex(1);
                    case 38: // up
                        return this.findSafeIndex(-1);
                }
            }
            render(): Element<*> {
                const {focusIndex} = this.state;
                const {options} = this.state;
                const {value} = this.state;
                const {match} = this.state;
                const {getValue} = this.props;
                const {getLabel} = this.props;

                const childValues: Array<ChildValue<*>> = pipeWith(
                    this.mapValueToOptions(this.state.value),
                    map((option: *, index: number): ChildValue<*> => ({
                        option,
                        onDelete: () => pipeWith(value, del(index), this.onChangeMulti),
                        value: getValue(option),
                        label: getLabel(option)
                    }))
                );

                return <Component
                    {...this.props}
                    match={match}
                    onChangeMatch={this.onChangeMatch}
                    focusIndex={focusIndex}
                    options={options}
                    value={childValues}
                    onKeyDown={this.onKeyDown}
                    onHover={this.setIndex}
                />;
            }
        }

        return SelectHock;
    },
    defaultConfig: {
        allowDuplicates: false,
        focusUnmatched: false,
        focusSelected: false
    }
});

