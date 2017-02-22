/* @flow */
/* eslint-disable no-unused-vars */

import {PropTypes} from 'react';

export const StampyPropTypes = {

    className: PropTypes.string,

    htmlProps: PropTypes.object,

    onChange: PropTypes.func,

    onChangeBoolean: PropTypes.func,

    onChangeMulti: PropTypes.func,

    onClick: PropTypes.func,

    spruceModifier: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object
    ]),

    spruceName: PropTypes.string
};
