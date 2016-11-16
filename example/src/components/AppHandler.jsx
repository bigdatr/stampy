import React from 'react';
import {Link} from 'react-router';
export default (props) => {
    return <div>
        {props.children}
        <Link to='/'>Home</Link>
    </div>
}
