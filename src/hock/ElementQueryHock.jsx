// @flow

import React, {Component} from 'react';
import {findDOMNode} from 'react-dom';
import elementResizeDetectorMaker from 'element-resize-detector';

type ElementQuery = {
    name: string,
    widthBounds: number[],
    heightBounds: number[]
};

type ElementQueryHockProps = {
    eqWidth: number,
    eqHeight: number,
    eqActive: string[],
    eqInactive: string[],
    eqReady: boolean
};

let erd = null;
if(typeof window !== 'undefined') { // Don't try to detect resize events on server
    erd = elementResizeDetectorMaker({strategy: "scroll"});
}

/**
 * @module Hocks
 */

const ElementQueryDecorator = (eqs: ElementQuery[]): HockApplier => {
    return (ComposedComponent: ReactClass<any>): ReactClass<any> => {

        /**
         * @component
         *
         * ElementQueryHock is designed to allow components to respond to the size of their
         * containing element rather than to the size of the window. When used on a component,
         * your component will receive some extra props.
         *
         * @example
         * const example = (props) => {
         *     if(!props.eqReady) return <div>No data yet</div>;
         *     return <div>
         *         <div>width: {props.eqWidth}</div>
         *         <div>height: {props.eqHeight}</div>
         *         <div>active queries: {props.eqActive.join(', ')}</div>
         *         <div>inactive queries: {props.eqInactive.join(', ')}</div>
         *     </div>
         * }
         *
         * const ElementQueryHockExample = ElementQueryHock([
         *     {
         *         name: 'medium',
         *         widthBounds: [300, 600],
         *         heightBounds: [200, 400]
         *     },
         *     {
         *         name: 'large',
         *         widthBounds: [600, 1200],
         *         heightBounds: [400, 1800]
         *     }
         * ])(example);
         *
         * @decorator {ElementQueryHock}
         *
         * @childprop {number}
         * eqWidth The current width of the parent element.
         *
         * @childprop {number} eqHeight
         * The current height of the parent element.
         *
         * @childprop {Array<string>} eqActive
         * An array of currently active queries.
         *
         * @childprop {Array<string>} eqInactive
         * An array of currently inactive queries.
         *
         * @childprop {boolean} eqReady
         * A boolean that can be used to determine whether the ElementQueryHock has been able
         * to read the parent node's height and width yet.
         *
         * @memberof module:Hocks
         */

        class ElementQueryHock extends Component {
            handleResize: Function;
            state: Object;
            mounted: boolean;

            constructor(props: ElementQueryHockProps) {
                super(props);
                this.handleResize = this.handleResize.bind(this);
                this.mounted = false;
                this.state = {
                    ready: false
                };
            }

            componentDidMount() {
                this.mounted = true;
                if(erd) {
                    const container = findDOMNode(this).parentNode;
                    erd.listenTo(container, this.handleResize);
                    this.handleResize(container);
                }
            }

            componentWillUnmount() {
                this.mounted = false;
                if(erd) {
                    erd.removeListener(findDOMNode(this).parentNode, this.handleResize);
                }
            }

            checkIfActive(
                widthBounds: number[] = [],
                heightBounds: number[] = [],
                width: number,
                height: number
            ): boolean {
                return width  >= (widthBounds[0]  || 0)         &&
                       width  <  (widthBounds[1]  || Infinity)  &&
                       height >= (heightBounds[0] || 0)         &&
                       height <  (heightBounds[1] || Infinity);
            }

            handleResize(element: HTMLElement) {
                // This method uses native es3 js functionality for (admittedly minute) performance
                // improvements. Seeing as this method is called alotta times it is (probably) worth it
                var width = element.clientWidth;
                var height = element.clientHeight;

                if(width === this.state.width && height === this.state.height) return;

                var active = [];
                var inactive = [];

                for (var i = 0; i < eqs.length; i++) {
                    var eq = eqs[i];
                    if(this.checkIfActive(eq.widthBounds, eq.heightBounds, width, height)) {
                        active.push(eq.name);
                    } else {
                        inactive.push(eq.name);
                    }
                }

                if(this.mounted) {
                    this.setState({width, height, active, inactive, ready: true});
                }
            }

            render(): React.Element<any> {
                return <ComposedComponent
                    {...Object.assign({}, this.props, {
                        eqWidth: this.state.width,
                        eqHeight: this.state.height,
                        eqActive: this.state.active,
                        eqInactive: this.state.inactive,
                        eqReady: this.state.ready
                    })}
                />;
            }
        }

        return ElementQueryHock;
    }
}

/**
 * Provides configuration for `ElementQueryHock`.
 *
 * @callback ElementQueryHock
 *
 * @param {Array<ElementQueryObject>} eqs An array of element queries to check for.
 *
 * @return {ElementQueryWrapper}
 */

/**
 * A function that accepts the component you want to wrap in a `ElementQueryHock`.
 *
 * @callback ElementQueryWrapper
 *
 * @param {ReactComponent} ComponentToDecorate
 * The component you wish to wrap in an `ElementQueryHock`.
 *
 * @return {ReactComponent}
 * The decorated component.
 */

/**
 * @typedef ElementQueryObject
 *
 * @property {String} name
 * The name of the element query.
 *
 * @property {Number[]} [widthBounds=[0, Infinity]]
 * An array containing two values for the minimum (inclusive) and maximum (exclusive)
 * widths allowed by this element query. If the second array item is excluded it is
 * assumed that there is no maximum.
 *
 * @property {Number[]} [heightBounds=[0, Infinity]]
 * An array containing two values for the minimum (inclusive) and maximum (exclusive)
 * heights allowed by this element query. If the second array item is excluded it is
 * assumed that there is no maximum.
 */

export default ElementQueryDecorator;

