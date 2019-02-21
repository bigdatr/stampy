// @flow

import React from 'react';
import type {ComponentType, Element} from 'react';
import Hock from '../util/Hock';
import elementResizeDetectorMaker from 'element-resize-detector';

type ElementQuery = {
    name: string,
    widthBounds: number[],
    heightBounds: number[]
};

type Props = {};

type State = {
    ready: boolean,
    active: string[],
    inactive: [],
    width?: number,
    height?: number
};

type ChildProps = {
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


const ElementQueryHock = (config: {eqs: () => Array<ElementQuery>}): HockApplier => {
    const eqs = config.eqs;
    return (ComposedComponent: ComponentType<Props>): ComponentType<ChildProps> => {

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

        class ElementQueryHock extends React.Component<Props, State> {

            handleResize: Function;
            mounted: boolean;
            wrapper: ?HTMLElement;

            constructor(props: Object) {
                super(props);
                this.handleResize = this.handleResize.bind(this);
                this.mounted = false;
                this.state = {
                    ready: false,
                    active: [],
                    inactive: []
                };
            }

            componentDidMount() {
                this.mounted = true;
                if(erd && this.wrapper) {
                    const container = this.wrapper.parentNode;
                    erd.listenTo(container, this.handleResize);
                    this.handleResize(container);
                }
            }

            componentWillUnmount() {
                this.mounted = false;
                if(erd && this.wrapper) {
                    erd.removeListener(this.wrapper.parentNode, this.handleResize);
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
                if(!this.mounted) {
                    return;
                }

                // This method uses native es3 js functionality for (admittedly minute) performance
                // improvements. Seeing as this method is called alotta times it is (probably) worth it
                var width = element.clientWidth;
                var height = element.clientHeight;

                if(width === this.state.width && height === this.state.height) return;

                var updated = false;
                var active = [];
                var inactive = [];
                const eqList = eqs();

                for (var i = 0; i < eqList.length; i++) {
                    var eq = eqList[i];
                    if(this.checkIfActive(eq.widthBounds, eq.heightBounds, width, height)) {
                        if(this.state.active.indexOf(eq.name) === -1) {
                            updated = true;
                        }
                        active.push(eq.name);
                    } else {
                        if(this.state.inactive.indexOf(eq.name) === -1) {
                            updated = true;
                        }
                        inactive.push(eq.name);
                    }
                }

                // Don't change active and inactive arrays if nothing changed (stops unnecessary rerenders)
                if(!updated) {
                    active = this.state.active;
                    inactive = this.state.inactive;
                }

                this.setState({width, height, active, inactive, ready: true});
            }

            render(): Element<*> {
                return <span ref={(ii) => this.wrapper = ii}>
                    <ComposedComponent
                        {...Object.assign({}, this.props, {
                            eqWidth: this.state.width,
                            eqHeight: this.state.height,
                            eqActive: this.state.active,
                            eqInactive: this.state.inactive,
                            eqReady: this.state.ready
                        })}
                    />
                </span>;
            }
        }

        return ElementQueryHock;
    };
};

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

export default Hock({
    hock: ElementQueryHock,
    defaultConfig: {
        eqs: () => []
    },
    shorthandKey: "eqs"
});


