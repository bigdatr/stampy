// @flow
import React from 'react';
import type {ChildrenArray, ComponentType, Element} from 'react';
import StateHock from '../hock/StateHock';
import SpruceClassName from '../util/SpruceClassName';
import Compose from '../util/Compose';

/**
 * @module Components
 */

/**
 * @component
 *
 * `ShowHide` is a controlled component that displays children based on the value of `props.show`.
 * It does not keep state but provides an onChange function toggle `props.show`.
 *
 * @example
 * return <ShowHide show={false} onChange={props.onChange} toggle={() => <div>Toggle Me!</div>}>
 *     <h1>Hello!</h1>
 * </ShowHide>
 */

type Props = {
    children?: (props: {
        onChange: (show: boolean) => void
    }) => ChildrenArray<*>,
    className: string,
    modifier: SpruceModifier,
    onChange: (show: boolean) => void,
    closeOnBlur?: boolean,
    parent: string, // ${SpruceParent}
    peer: string,
    show: boolean,
    spruceName: string,
    style: Object, // React style object to apply to the rendered HTML element
    toggle: ComponentType<*>
};

export default class ShowHide extends React.Component<Props> {
    static defaultProps = {
        className: '',
        modifier: '',
        parent: '',
        onChange: (data) => data,
        parent: '',
        peer: '',
        show: false,
        spruceName: 'ShowHide',
        style: {}
    };

    wrapperRef: *;
    constructor(props: Props) {
        super(props);
        this.wrapperRef;

        if(this.props.closeOnBlur) {
            document.addEventListener('mousedown', this.handleClickOutside);
        }
    }
    componentWillUnmount() {
        if(this.props.closeOnBlur) {
            document.removeEventListener('mousedown', this.handleClickOutside);
        }
    }
    handleClickOutside = (event: *) => {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            this.props.onChange(false);
        }
    }

    render(): Element<*> {
        const {
            children,
            className,
            modifier,
            onChange,
            parent,
            peer,
            show,
            spruceName: name,
            style,
            toggle
        } = this.props;

        return <div
            ref={ref => this.wrapperRef = ref}
            className={SpruceClassName({name, modifier, className, parent, peer})}
            style={style}
        >
            <div className={`${name}_toggle`}>
                {toggle({show, onChange})}
            </div>
            {show && <div className={`${name}_children`}>{children && children({onChange})}</div>}
        </div>;
    }
}

/**
 * @component
 *
 * `ShowHideStateful` is a stateful version of ShowHide.
 *
 *
 * @example
 * return <ShowHide show={false} onChange={props.onChange} toggle={() => <div>Toggle Me!</div>}>
 *     <h1>Hello!</h1>
 * </ShowHide>
 */

type ShowHideStateProps = {
    children?: ChildrenArray<*>,
    className?: string,
    defaultShow?: boolean,
    modifier?: SpruceModifier,
    onChange?: (show: boolean) => void,
    peer?: string,
    spruceName?: string,
    toggle?: ComponentType<*>
};

type StatefulChildProps = {
    onChangeState: (newState: Object) => {},
    onChange?: (show: boolean) => void,
    value: {
        show: boolean
    }
};

export const ShowHideState: ComponentType<ShowHideStateProps> = Compose(
    StateHock({
        initialState: ({defaultShow = false}: ShowHideStateProps): Object => ({
            show: defaultShow
        }),
        onChangeProp: () => 'onChangeState'
    }),
    (Component) => (props: StatefulChildProps): Element<*> => {
        return <Component
            {...props}
            show={props.value.show}
            onChange={(show: boolean) => {
                props.onChange && props.onChange(show);
                props.onChangeState({show});
            }}
        />;
    }
);

export const ShowHideStateful = ShowHideState(ShowHide);
