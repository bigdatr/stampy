import React from 'react';
import {Link} from 'react-router-dom';
import {routesList} from '../routes';

export default () => {
    const links = routesList
        .props
        .children
        .map(route => {
            const {path} = route.props;
            if(!path) {
                return null;
            }
            return <li key={path}>
                <Link to={path}>{path}</Link>
            </li>;
        })
        .filter(ii => ii);

    return <ul>{links}</ul>;
}
