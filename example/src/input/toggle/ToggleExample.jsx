import React, {Component} from 'react';
import Toggle from 'stampy/lib/component/Toggle';

class ToggleExample extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toggled: false
        };
    }
    render() {
        return <div>
            <p>Toggle</p>
            <Toggle
                value={true}
                modifier="large"
            >
                Toggle is on
            </Toggle>

            <Toggle
                value={false}
                modifier="large"
            >
                Toggle is off
            </Toggle>

            <Toggle
                value={this.state.toggled}
                onChange={ii => this.setState({toggled: ii})}
                modifier="large"
            >
                Toggle is  toggleable
            </Toggle>
        </div>
    }
}

export default ToggleExample;
