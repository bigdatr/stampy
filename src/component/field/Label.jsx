// @flow
import React from 'react';
import SpruceClassName from '../../util/SpruceClassName';
import RemoveProps from '../../util/RemoveProps';

type LabelProps = {
    className: ?string,
    modifier: Modifier,
    children: React.Element<any>
}

/**
 * @module Components
 */

/**
 * `Label` is a simple component that displays a label.
 *
 * @param {Object} props
 * @param {ClassName} [props.className]
 * @param {Modifier} [props.modifier]
 * @param {ReactElement} [props.children]
 *
 * @example
 * return <Label for='something'>Label for thing</Label>
 */

function Label(props: LabelProps): React.Element<any> {
    const {modifier, className} = props;

    const propsToRemove = {
        modifier: true
    };

    return <label
        {...RemoveProps(propsToRemove, props)}
        className={SpruceClassName({name: 'Label', modifier, className})}
    >{props.children}</label>;
}

Label.defaultProps = {
    className: '',
    modifier: ''
}

export default Label;
