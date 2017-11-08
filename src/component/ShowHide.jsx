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
    children?: ChildrenArray<*>,
    className: string,
    modifier: SpruceModifier,
    onClick: (show: boolean) => void,
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
        onClick: (data) => data,
        peer: '',
        show: false,
        spruceName: 'ShowHide',
        style: {}
    };

    render(): Element<*> {
        const {
            children,
            className,
            modifier,
            onClick,
            peer,
            show,
            spruceName: name,
            style,
            toggle: Toggle
        } = this.props;

        return <div className={SpruceClassName({name, modifier, className, peer})} style={style}>
            <div className={`${name}_toggle`} onClick={() => onClick(!show)}>
                <Toggle value={show} show={show} />
            </div>
            {show && <div className={`${name}_children`}>{children}</div>}
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
 * return <ShowHide show={false} onClick={props.onClick} toggle={() => <div>Toggle Me!</div>}>
 *     <h1>Hello!</h1>
 * </ShowHide>
 */

type ShowHideStateProps = {
    children?: ChildrenArray<*>,
    className?: string,
    defaultShow?: boolean,
    modifier?: SpruceModifier,
    onClick?: (show: boolean) => void,
    peer?: string,
    spruceName?: string,
    toggle?: ComponentType<*>
};

type StatefulChildProps = {
    onChange: (newState: Object) => {},
    value: {
        show: boolean
    }
};

export const ShowHideState: ComponentType<ShowHideStateProps> = Compose(
    StateHock(({defaultShow = false}: ShowHideStateProps): Object => ({
        show: defaultShow
    })),
    (Component) => (props: StatefulChildProps): Element<*> => {
        return <Component
            {...props}
            show={props.value.show}
            onChange={(show) => props.onChange({show})}
        />;
    }
);

export const ShowHideStateful = ShowHideState(ShowHide);
