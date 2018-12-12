import React from 'react';
import SpruceComponent from 'stampy/lib/util/SpruceComponent';

const Table = SpruceComponent('Table', 'table');
export default () => {
    return <div>
        <Table modifier="large">
            <tbody>
                <tr><td>rad</td><td>cool</td></tr>
                <tr><td>awesome</td><td>winner</td></tr>
            </tbody>
        </Table>
    </div>
}
