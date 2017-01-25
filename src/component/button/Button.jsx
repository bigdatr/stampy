// @flow
import React, {PropTypes} from 'react';
import SpruceClassName from '../../util/SpruceClassName';
import RemoveProps from '../../util/RemoveProps';

type ButtonProps = {
    className: ?string,
    disabled: ?boolean,
    modifier: Modifier,
    onClick: Function,
    type: ?string
}

/**
 * @module Components
 */

/**
 * @component
 *
 * `Button` is a simple component that displays a button.
 * It does not keep state.
 *
 * @prop {ClassName} [className]
 * @prop {boolean} [disabled] Set to true to disable the button, and onClick calls will no longer be called when clicked
 * @prop {Modifier} [modifier]
 * @prop {OnClick} [onClick]
 * @prop {string} [type = "button"] HTML button type
 *
 * @example
 * return <Button>Button text</Button>
 */

function Button(props: ButtonProps): React.Element<any> {
    const {
        modifier,
        className,
        disabled
    } = props;

    const propsToRemove = {
        modifier: true,
        onClick: !!disabled // explicity removs onClick when disabled in case underlying elements change from using a <button>
    };
    const filteredProps: Object = RemoveProps(propsToRemove, props);

    return <button
        {...filteredProps}
        className={SpruceClassName({name: 'Button', modifier, className})}
    />;
}

Button.propTypes = {
    className: PropTypes.string,
    disabled: PropTypes.bool,
    modifier: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object
    ]),
    onClick: PropTypes.func,
    type: PropTypes.string
};

Button.defaultProps = {
    className: '',
    modifier: '',
    type: 'button'
}

export default Button;
