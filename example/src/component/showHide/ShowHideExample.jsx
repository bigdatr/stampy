import React, {Component} from 'react';
import {ShowHide, ShowHideStateful} from 'stampy';

class ShowHideExample extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectValue: null,
            multiSelectValue: null
        };
    }
    render() {
        function Click(props) {
            return <div>Click Me {props.show ? '-' : '+'}</div>;
        }

        return <div>
            <h2>Visible</h2>
            <ShowHide show={true} toggle={Click} onClick={(data) => console.log('ShowHide: ', data)}>Hello!</ShowHide>
            <hr/>

            <h2>Hidden</h2>
            <ShowHide show={false} toggle={Click} onClick={(data) => console.log('ShowHide: ', data)}>Hello!</ShowHide>
            <hr/>

            <h2>Stateful</h2>
            <ShowHideStateful toggle={Click} defaultShow={true}>Hello!</ShowHideStateful>
            <hr/>


            <h2>Stateful Hock</h2>
            <ShowHideStateful toggle={Click} initialState={{show: true}}>Hello!</ShowHideStateful>
            <hr/>

        </div>
    }
}

export default ShowHideExample;
