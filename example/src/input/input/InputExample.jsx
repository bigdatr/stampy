import React from 'react';
import {Input} from 'stampy';

export default class InputExample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 'what'
        };
    }

    render() {
        return <div>
            <h3>Input Controlling</h3>
            <p>Uncontrolled Input (with placeholder)</p>
            <Input placeholder="uncontrolled"/>

            <p>Controlled Input says: {this.state.value}</p>
            <Input
                value={this.state.value}
                onChange={(value, meta) => console.log(meta) || this.setState({value})}
            />

            <h3>Input Types</h3>

            <p>Text Input</p>
            <Input/>

            <p>Disabled Input</p>
            <Input disabled/>

            <p>button input</p>
            <Input type="button" value="Button"/>

            <p>checkbox input</p>
            <Input type="checkbox"/>

            <p>color input</p>
            <Input type="color"/>

            <p>date input</p>
            <Input type="date"/>

            <p>datetime input</p>
            <Input type="datetime"/>

            <p>email input</p>
            <Input type="email"/>

            <p>file input</p>
            <Input type="file"/>

            <p>hidden input</p>
            <Input type="hidden"/>

            <p>image input</p>
            <Input type="image"/>

            <p>month input</p>
            <Input type="month"/>

            <p>number input</p>
            <Input type="number"/>

            <p>password input</p>
            <Input type="password"/>

            <p>radio input</p>
            <Input type="radio"/>

            <p>range input</p>
            <Input type="range"/>

            <p>reset input</p>
            <Input type="reset"/>

            <p>search input</p>
            <Input type="search"/>

            <p>submit input</p>
            <Input type="submit"/>

            <p>tel input</p>
            <Input type="tel"/>

            <p>text input</p>
            <Input type="text"/>

            <p>time input</p>
            <Input type="time"/>

            <p>url input</p>
            <Input type="url"/>

            <p>week input</p>
            <Input type="week"/>

            <h3>Input Classes</h3>

            <p>Classy Input</p>
            <Input className="classy"/>

            <p>Modifier Input</p>
            <Input className="classy" modifier="large"/>
        </div>
    }
}



