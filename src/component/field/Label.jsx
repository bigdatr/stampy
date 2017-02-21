// @flow
import React, {PropTypes} from 'react';
import SpruceClassName from '../../util/SpruceClassName';
import RemoveProps from '../../util/RemoveProps';

type LabelProps = {
    children: React.Element<any>,
    className: ?string,
    modifier: SpruceModifier,
    spruceName: string
}

/**
 * @module Components
 */

/**
 * @component
 *
 * `Label` is a simple component that displays a label.
 *
 * @prop {ClassName} [className]
 * @prop {SpruceModifier} [modifier]
 * @prop {string} [spruceName = "Label"]
 *
 * @example
 * return <Label for='something'>Label for thing</Label>
 */

function Label(props: LabelProps): React.Element<any> {
    const {modifier, className, spruceName} = props;

    const propsToRemove = {
        modifier: true,
        spruceName
    };

    return <label
        {...RemoveProps(propsToRemove, props)}
        className={SpruceClassName({name: spruceName, modifier, className})}
    >{props.children}</label>;
}

Label.propTypes = {
    className: PropTypes.string,
    modifier: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object
    ]),
    spruceName: PropTypes.string
};

Label.defaultProps = {
    className: '',
    modifier: '',
    spruceName: 'Label'
}

export default Label;
