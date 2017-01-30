// @flow
import React, {PropTypes} from 'react';
import SpruceClassName from '../../util/SpruceClassName';

type ShowHideProps = {
    children: React.Element<any>,
    className: ?string,
    modifier: Modifier,
    onClick: (value: boolean) => void,
    show: ?boolean,
    toggle: ReactClass<any>
}

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

function ShowHide(props: ShowHideProps): React.Element<any> {
    const {
        children,
        className,
        modifier,
        onClick,
        show,
        toggle: Toggle
    } = props;

    return <div className={SpruceClassName({name: 'ShowHide', modifier, className})}>
        <div className="ShowHide_toggle" onClick={() => onClick(!show)}>
            <Toggle value={show} show={show} />
        </div>
        {show && <div className="ShowHide_children">{children}</div>}
    </div>;
}

ShowHide.propTypes = {
    className: PropTypes.string,
    modifier: PropTypes.string,
    onChange: PropTypes.func,
    show: PropTypes.bool,
    toggle: PropTypes.func.isRequired
};

ShowHide.defaultProps = {
    onClick: (data) => data,
    show: false
}

export default ShowHide;


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

export class ShowHideStateful extends React.Component {
    state: Object;
    toggle: Function;

    constructor(props: Object) {
        super(props);
        this.state = {
            show: props.defaultShow || false
        };
        this.toggle = this.toggle.bind(this);
    }
    toggle(newState: boolean) {
        this.setState({
            show: newState
        });
        if(this.props.onClick) {
            this.props.onClick(newState);
        }
    }
    render(): React.Element<ShowHide> {
        const {show} = this.state;
        return <ShowHide {...this.props} show={show} onClick={this.toggle}/>;
    }
}

ShowHideStateful.propTypes = Object.assign({}, ShowHide.propTypes, {
    // Default choice to show or hide the content
    defaultShow: PropTypes.bool
});


