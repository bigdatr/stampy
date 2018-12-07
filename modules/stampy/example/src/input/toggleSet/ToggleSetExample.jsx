import React, {Component} from 'react';
import ToggleSet from 'stampy/lib/component/ToggleSet';

class ToggleSetExample extends Component {
    constructor(props) {
        super(props);
        this.state = {
            singleValue: '',
            multiValue: [],
            clearableValue: [],
            multiDisabledValue: ['one']
        };
    }
    render() {
        const options = [
            { value: 'one', label: 'One' },
            { value: 'two', label: 'Two' },
            { value: 'three', label: 'Three' }
        ];

        return <div>
            <p>Toggle set</p>
            <ToggleSet
                value={this.state.singleValue}
                options={options}
                onChange={singleValue => this.setState({singleValue})}
            />
            <p>Clearable toggle set</p>
            <ToggleSet
                value={this.state.clearableValue}
                options={options}
                onChange={clearableValue => this.setState({clearableValue})}
                clearable
            />
            <p>Multi toggle set</p>
            <ToggleSet
                value={this.state.multiValue}
                options={options}
                onChange={multiValue => this.setState({multiValue})}
                multi
            />
            <p>Disabled toggle set</p>
            <ToggleSet
                disabled
                value={this.state.multiDisabledValue}
                options={options}
                onChange={multiDisabledValue => this.setState({multiDisabledValue})}
                multi
            />
        </div>
    }
}

export default ToggleSetExample;
