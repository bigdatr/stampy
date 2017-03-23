import React from 'react';
import {Link} from 'react-router-dom';
import Routes from '../routes';

export default () => {
    const links = Routes
        .props
        .children
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
