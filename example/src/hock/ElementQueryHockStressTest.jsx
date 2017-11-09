import React from 'react';
import ElementQueryHock from 'stampy/lib/hock/ElementQueryHock';

const example = (props) => {
    if(!props.eqReady) return <div>No data yet</div>;
    return <div style={{
        fontSize: '8px',
        fontFamily: 'Helvetica',
        lineHeight: 1,
    }}>
        <div>width: {props.eqWidth}</div>
        <div>height: {props.eqHeight}</div>
        <div>active queries: {props.eqActive.join(', ')}</div>
        <div>inactive queries: {props.eqInactive.join(', ')}</div>
    </div>
}

const ElementQueryHockExample = ElementQueryHock(() => [
    {
        name: 'tiny',
        widthBounds: [0, 100]
    },
    {
        name: 'small',
        widthBounds: [100, 200],
        heightBounds: [0, 1800]
    }
])(example);

export default class ElemenQueryHockStressTest extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            grid: 16
        };
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(e) {
        this.setState({
            grid: parseInt(e.target.value)
        });
    }
    render() {
        const grid = this.state.grid;
        return <div>
            <div style={{
                position: 'absolute',
                top: '0',
                height: '50px',
                left: '0'
            }}>
                <input type="range" value={grid} min='1' max='30' onChange={this.handleChange}/>
                <span>Testing with {grid}x{grid} grid</span>
            </div>
            <div style={{
                position: 'absolute',
                top: '50px',
                bottom: '0',
                left: '0',
                right: '0'
            }}>
                {
                    Array(Math.pow(grid, 2)).join(' ').split(' ').map((aa, ii) => {
                        return <div key={ii} style={{
                            position: 'absolute',
                            top: `${(100 / grid) * Math.floor(ii / grid)}%`,
                            left: `${(100 / grid) * (ii % grid)}%`,
                            width: `${(100 / grid)}%`,
                            height: `${(100 / grid)}%`,
                            border: '1px solid #ccc',
                            boxSizing: 'border-box'
                        }}>
                            <ElementQueryHockExample/>
                        </div>
                    })
                }
            </div>
        </div>
    }
};