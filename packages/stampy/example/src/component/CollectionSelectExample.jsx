import React, {Component} from 'react';
import CollectionSelect from 'stampy/lib/component/CollectionSelect';

const options = [
    {id: 'zero'},
    {id: 'one'},
    {id: 'two'},
    {id: 'three'},
    {id: 'four'},
    {id: 'five'},
    {id: 'six'},
    {id: 'seven'},
    {id: 'eight'},
    {id: 'nine'},
    {id: 'ten'}
];

class CollectionSelectExample extends Component {
    constructor(props: *) {
        super(props);
        this.state = {
            selectValue: options[0],
            selectValueMulti: [options[0]]
        };
    }
    render(): Node {


        return <div>
            <p>CollectionSelect</p>
            <CollectionSelect
                labelKey
                value={this.state.selectValue}
                options={options}
                onChange={selectValue => this.setState({selectValue})}
                renderOption={(item, index) => !item.matched ? null : <li key={index} onClick={item.onChange} style={{listStyleType: item.focused ? 'disc' : 'circle'}}>
                    <span style={{opacity: item.selected ? .5 : 1}}>{item.value.id} {item.selected ? '✔︎' : ''}</span>
                </li>}
            />


            <p>CollectionSelect Multi</p>
            <CollectionSelect
                multi
                labelKey="id"
                value={this.state.selectValueMulti}
                options={options}
                onChange={selectValueMulti => this.setState({selectValueMulti})}
                renderOption={(item, index) => <li key={index} onClick={item.onChange} style={{listStyleType: item.focused ? 'disc' : 'circle'}}>
                    <span>{item.value.id} </span>
                    <span>{item.matched ? 'matched' : ''} </span>
                    <span>{item.selected ? 'selected' : ''} </span>
                </li>}
            />
        </div>
    }
}

export default CollectionSelectExample;
