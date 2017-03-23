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
            return <li key={path}>
                <Link to={path}>{path}</Link>
            </li>;
        });
    return <ul>{links}</ul>;
}
