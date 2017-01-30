import React, {Component} from 'react';
import {Select} from 'stampy';

class SelectExample extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectValue: null,
            multiSelectValue: null
        };
    }
    render() {
        const options = [
            { value: 'one', label: 'One' },
            { value: 'two', label: 'Two' },
            { value: 'three', label: 'Three' }
        ];

        return <div>
            <p>Select</p>
            <Select
                name="optional-name"
                value={this.state.selectValue}
                options={options}
                onChange={selectValue => this.setState({selectValue})}
            />
            <p>Multi select</p>
            <Select
                value={this.state.multiSelectValue}
                options={options}
                onChange={multiSelectValue => this.setState({multiSelectValue})}
                multi={true}
            />
            <p>Disabled select</p>
            <Select
                disabled
                value={this.state.multiSelectValue}
                options={options}
                onChange={multiSelectValue => this.setState({multiSelectValue})}
                multi={true}
            />
        </div>
    }
}

export default SelectExample;
