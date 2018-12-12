import test from 'ava';
import React from 'react';
import ReactDOM from 'react-dom';
import sinon from 'sinon';
import jsdom from 'jsdom';



const doc = jsdom.jsdom('<html><body><div id="container"></div></body></html>');
global.window = doc.defaultView;
global.document = window.document;
global.navigator = window.navigator;
global.getComputedStyle = window.getComputedStyle;


const ElementQueryHock = require('../ElementQueryHock').default;

const container = window.document.getElementById('container');
container.clientWidth = 1280;
container.clientHeight = 720;

const example = sinon.spy(() => {
    return <div>Example Component</div>;
});

const ElementQueryHockExample = ElementQueryHock(() => [
    {
        name: 'medium',
        widthBounds: [1000, 1600],
        heightBounds: [500, 1000]
    },
    {
        name: 'large',
        widthBounds: [1600]
    },
    {
        name: 'default'
    }
])(example);

const component = <ElementQueryHockExample/>;
ReactDOM.render(component, container);

test('ElementQueryHock', tt => {
    tt.is(
        example.callCount,
        2,
        'component render is called twice' // Once for initial render, then again once dimensions are available
    );

    tt.false(
        example.firstCall.args[0].eqReady,
        'component initially renders in unready state'
    );

    tt.true(
        example.secondCall.args[0].eqReady,
        'component then renders in ready state'
    );

    tt.is(
        example.secondCall.args[0].eqWidth,
        1280,
        'hock passes correct width'
    );

    tt.is(
        example.secondCall.args[0].eqHeight,
        720,
        'hock passes correct height'
    );

    tt.deepEqual(
        example.secondCall.args[0].eqActive,
        ['medium', 'default'],
        'hock gets correct active queries'
    );

    tt.deepEqual(
        example.secondCall.args[0].eqInactive,
        ['large'],
        'hock gets correct inactive queries'
    );


    ReactDOM.unmountComponentAtNode(container);

    tt.is(
        container.childNodes.length,
        0,
        'cleans up hidden element when unmounting'
    );

    window.close();


    // Check that state isn't set if dimenesions don't change

    const HockInstance = new ElementQueryHockExample();
    HockInstance.setState = sinon.spy(function() {});
    HockInstance.mounted = true;

    HockInstance.state = {width: 300, height: 600, active: [], inactive: []}; // manually set state cos react won't do it without a mounted component
    HockInstance.handleResize({clientWidth: 300, clientHeight: 600});
    HockInstance.state = {width: 300, height: 600, active: [], inactive: []};
    HockInstance.handleResize({clientWidth: 600, clientHeight: 600});
    HockInstance.state = {width: 600, height: 600, active: [], inactive: []};
    HockInstance.handleResize({clientWidth: 600, clientHeight: 600});


    tt.is(
        HockInstance.setState.callCount,
        1,
        'doesn\'t call set state if neither width nor height changes'
    );

    HockInstance.mounted = false;
    HockInstance.handleResize();

    tt.is(
        HockInstance.setState.callCount,
        1,
        'exits early if mouted is false'
    );

});

