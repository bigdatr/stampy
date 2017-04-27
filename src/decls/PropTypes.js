/* @flow */
/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';

const StampyPropTypes = {

    className: PropTypes.string,

    element: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.string,
        PropTypes.func
    ]),

    htmlProps: PropTypes.object,

    onChange: PropTypes.func,

    onChangeBoolean: PropTypes.func,

    onChangeMulti: PropTypes.func,

    onClick: PropTypes.func,

    spruceModifier: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object
    ]),

    spruceName: PropTypes.string,

    style: PropTypes.object
};

export default StampyPropTypes;
