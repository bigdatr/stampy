// @flow

import React, {Component} from 'react';
import {findDOMNode} from 'react-dom';
import {fromJS, Map, List} from 'immutable';
import elementResizeDetectorMaker from 'element-resize-detector';

/**
 * @module Hocks
 */

const erd = elementResizeDetectorMaker({strategy: "scroll"});

const ElementQueryHof = (eqs): HockApplier => {
    const elementQueries = fromJS(eqs);

    return (ComposedComponent: ReactClass<any>): ReactClass<ElementQueryHock> => {    
        return class ElementQueryHock extends Component {
            constructor(props) {
                super(props);
                this.handleResize = this.handleResize.bind(this);
                this.state = {};
            }

            componentDidMount() {
                const container = findDOMNode(this).parentNode;
                erd.listenTo(container, this.handleResize)
            }

            componentWillUnmount() {
                erd.removeListener(findDOMNode(this).parentNode, this.handleResize);
            }

            checkIfActive(eq, width, height) {
                const widthMin = eq.getIn([0,0]) || 0;
                const widthMax = eq.getIn([0,1]) || Infinity;

                const heightMin = eq.getIn([1,0]) || 0;
                const heightMax = eq.getIn([1,1]) || Infinity;

                return width  >= widthMin  &&
                       width  <= widthMax  &&
                       height >= heightMin &&
                       height <= heightMax;
            }

            handleResize(elem) {
                var start = performance.now();
                const width = elem.clientWidth;
                const height = elem.clientHeight;

                const checkedQueries = elementQueries.reduce((checked, eq, name) => {
                    const status = this.checkIfActive(eq, width, height) ? 'active' : 'inactive'
                    return checked.set(status, (checked.get(status) || List()).push(name));
                }, Map());
                

                this.setState({eq : Map({
                    width,
                    height,
                    active: checkedQueries.get('active') || List(),
                    inactive: checkedQueries.get('inactive') || List()
                })});

                console.log(performance.now() - start);
            }

            render(): React.Element<any> {
                return <ComposedComponent {...this.props} eq={this.state.eq} />;
            }
        }
    }
}

export default ElementQueryHof;

