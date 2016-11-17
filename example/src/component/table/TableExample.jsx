import React from 'react';
import {Table} from 'stampy';

export default () => {
    const schema = [
        {
            heading: 'Name',
            value: 'name'
        },
        {
            heading: 'BMI',
            value: (row) => {
                const {height, mass} = row.toObject();
                return mass / height * height;
            }
        },
        {
            heading: 'Avatar',
            render: row => <img src={row.get('avatarUrl')} />
        }
    ];

    const data = [
        {
            name: 'John Smith',
            avatarUrl: 'https://unsplash.it/150/150',
            height: 300,
            mass: 120
        },
        {
            name: 'Jane Doe',
            avatarUrl: 'https://unsplash.it/150/150',
            height: 280,
            mass: 175
        }
    ];


    return <div>
        <Table data={data} schema={schema} />
    </div>
}
