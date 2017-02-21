import React from 'react';
import test from 'ava';
import sinon from 'sinon';
import QueryStringHock from './QueryStringHock';
import {fromJS} from 'immutable';

test('QueryStringHock passes props straight through to children', tt => {

    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = QueryStringHock()(componentToWrap);
    const myWrappedComponent = new WrappedComponent();

    myWrappedComponent.props = {
        myProp: 'propettyProp'
    };

    // remove props provided by QueryString
    const expectedProps = fromJS(myWrappedComponent.render().props)
        .delete('setQuery')
        .delete('updateQuery')
        .delete('query')
        .toJS();

    tt.deepEqual(expectedProps, myWrappedComponent.props);
});

test('QueryStringHock passes query from react router location prop', tt => {

    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = QueryStringHock()(componentToWrap);
    const myWrappedComponent = new WrappedComponent();

    const query = {
        a: "A"
    };

    myWrappedComponent.props = {
        location: {query}
    };

    tt.deepEqual(myWrappedComponent.render().props.query, query);

});

test('QueryStringHock should change the name of the query prop if given queryPropName in config', tt => {

    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = QueryStringHock({
        queryPropName: "coolQueryTime"
    })(componentToWrap);
    const myWrappedComponent = new WrappedComponent();

    const query = {
        a: "A"
    };

    myWrappedComponent.props = {
        location: {query}
    };

    tt.deepEqual(myWrappedComponent.render().props.coolQueryTime, query);

});

test('QueryStringHock should convert missing or singular params to array when config.arrayParams is used', tt => {

    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = QueryStringHock({
        arrayParams: ['a', 'b', 'c']
    })(componentToWrap);
    const myWrappedComponent = new WrappedComponent();

    const query = {
        a: "A",
        b: ["B", "B2"],
        d: "D"
    };

    myWrappedComponent.props = {
        location: {query}
    };

    tt.deepEqual(myWrappedComponent.render().props.query.a, ["A"], "single query param should now be an array");
    tt.deepEqual(myWrappedComponent.render().props.query.b, ["B", "B2"], "multiple query param should still array");
    tt.deepEqual(myWrappedComponent.render().props.query.c, [], "missing query param should be an empty array");
    tt.deepEqual(myWrappedComponent.render().props.query.d, "D", "other params should remain as they are");

});

test('QueryStringHock should use defaultQuery params when not present in query', tt => {

    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = QueryStringHock({
        defaultQuery: {
            a: "A",
            b: "B",
            c: "C"
        }
    })(componentToWrap);
    const myWrappedComponent = new WrappedComponent();

    const query = {
        b: "B!",
        c: ""
    };

    myWrappedComponent.props = {
        location: {query}
    };

    tt.deepEqual(myWrappedComponent.render().props.query.a, "A", "Params not in query should use default query");
    tt.deepEqual(myWrappedComponent.render().props.query.b, "B!", "Params in query string should appear as specified");
    tt.deepEqual(myWrappedComponent.render().props.query.c, "", "Params in query string as empty strings should not override defaults");

});

test('QueryStringHock should set query via history prop for react-router v1 using pushState', tt => {

    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = QueryStringHock()(componentToWrap);
    const myWrappedComponent = new WrappedComponent();

    const pushState = sinon.spy();
    const replaceState = sinon.spy();

    const pathname = "PATH";
    const query = {};

    myWrappedComponent.context = {};
    myWrappedComponent.props = {
        location: {
            query,
            pathname
        },
        history: {
            pushState,
            replaceState
        }
    };

    const newQuery = {
        a: "A"
    };

    myWrappedComponent.render().props.setQuery(newQuery);

    tt.true(pushState.calledOnce, 'history.pushState is called');
    tt.is(pushState.firstCall.args[0], null, 'First arg should be null');
    tt.is(pushState.firstCall.args[1], pathname, 'Second arg should be location.pathname');
    tt.deepEqual(pushState.firstCall.args[2], newQuery, 'Third arg should be the query passed in');
    tt.false(replaceState.called, 'history.replaceState should not be called');
});

test('QueryStringHock should set query via history prop for react-router v1 using replaceState', tt => {

    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = QueryStringHock({
        replaceState: true
    })(componentToWrap);
    const myWrappedComponent = new WrappedComponent();

    const pushState = sinon.spy();
    const replaceState = sinon.spy();

    const pathname = "PATH";
    const query = {};

    myWrappedComponent.context = {};
    myWrappedComponent.props = {
        location: {
            query,
            pathname
        },
        history: {
            pushState,
            replaceState
        }
    };

    const newQuery = {
        a: "A"
    };

    myWrappedComponent.render().props.setQuery(newQuery);

    tt.true(replaceState.calledOnce, 'history.replaceState is called');
    tt.is(replaceState.firstCall.args[0], null, 'First arg should be null');
    tt.is(replaceState.firstCall.args[1], pathname, 'Second arg should be location.pathname');
    tt.deepEqual(replaceState.firstCall.args[2], newQuery, 'Third arg should be the query passed in');
    tt.false(pushState.called, 'history.pushState should not be called');
});

test('QueryStringHock should set query via conext.router prop for react-router v2+ using pushState', tt => {

    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = QueryStringHock()(componentToWrap);
    const myWrappedComponent = new WrappedComponent();

    const push = sinon.spy();
    const replace = sinon.spy();

    const pathname = "PATH";
    const query = {};

    myWrappedComponent.context = {
        router: {
            push,
            replace
        }
    };
    myWrappedComponent.props = {
        location: {
            query,
            pathname
        }
    };

    const newQuery = {
        a: "A"
    };

    myWrappedComponent.render().props.setQuery(newQuery);

    tt.true(push.calledOnce, 'router.push is called');
    tt.deepEqual(push.firstCall.args[0], {pathname, query: newQuery}, 'First arg should contain pathname and new query');
    tt.false(replace.called, 'router.replace should not be called');
});


test('QueryStringHock should set query via conext.router prop for react-router v2+ using replaceState', tt => {

    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = QueryStringHock({
        replaceState: true
    })(componentToWrap);
    const myWrappedComponent = new WrappedComponent();

    const push = sinon.spy();
    const replace = sinon.spy();

    const pathname = "PATH";
    const query = {};

    myWrappedComponent.context = {
        router: {
            push,
            replace
        }
    };
    myWrappedComponent.props = {
        location: {
            query,
            pathname
        }
    };

    const newQuery = {
        a: "A"
    };

    myWrappedComponent.render().props.setQuery(newQuery);

    tt.true(replace.calledOnce, 'router.replace is called');
    tt.deepEqual(replace.firstCall.args[0], {pathname, query: newQuery}, 'First arg should contain pathname and new query');
    tt.false(push.called, 'router.push should not be called');
});

test('QueryStringHock setQuery should replace existing query completely', tt => {

    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = QueryStringHock()(componentToWrap);
    const myWrappedComponent = new WrappedComponent();

    const push = sinon.spy();
    const replace = sinon.spy();

    const pathname = "PATH";
    const query = {
        c: "C",
        d: "D"
    };

    myWrappedComponent.context = {
        router: {
            push,
            replace
        }
    };
    myWrappedComponent.props = {
        location: {
            query,
            pathname
        }
    };

    const newQuery = {
        a: "A",
        b: "B"
    };

    myWrappedComponent.render().props.setQuery(newQuery);

    tt.deepEqual(push.firstCall.args[0], {pathname, query: newQuery});
});

test('QueryStringHock setQuery should filter out empty strings and nulls', tt => {

    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = QueryStringHock()(componentToWrap);
    const myWrappedComponent = new WrappedComponent();

    const push = sinon.spy();
    const replace = sinon.spy();

    const pathname = "PATH";
    const query = {};

    myWrappedComponent.context = {
        router: {
            push,
            replace
        }
    };
    myWrappedComponent.props = {
        location: {
            query,
            pathname
        }
    };

    const newQuery = {
        a: "A",
        b: "",
        c: ["c", "C"],
        d: null
    };

    const expectedQuery = {
        a: "A",
        c: ["c", "C"]
    };

    myWrappedComponent.render().props.setQuery(newQuery);

    tt.deepEqual(push.firstCall.args[0], {pathname, query: expectedQuery});
});

test('QueryStringHock updateQuery should merge with existing query', tt => {

    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = QueryStringHock()(componentToWrap);
    const myWrappedComponent = new WrappedComponent();

    const push = sinon.spy();
    const replace = sinon.spy();

    const pathname = "PATH";
    const query = {
        c: "C",
        d: "D"
    };

    myWrappedComponent.context = {
        router: {
            push,
            replace
        }
    };
    myWrappedComponent.props = {
        location: {
            query,
            pathname
        }
    };

    const newQuery = {
        a: "A",
        b: "B"
    };

    const expectedQuery = {
        a: "A",
        b: "B",
        c: "C",
        d: "D"
    };

    myWrappedComponent.render().props.updateQuery(newQuery);

    tt.deepEqual(push.firstCall.args[0], {pathname, query: expectedQuery});
});

test('QueryStringHock updateQuery should filter out empty strings and nulls', tt => {

    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = QueryStringHock()(componentToWrap);
    const myWrappedComponent = new WrappedComponent();

    const push = sinon.spy();
    const replace = sinon.spy();

    const pathname = "PATH";
    const query = {
        b: "B",
        c: "C"
    };

    myWrappedComponent.context = {
        router: {
            push,
            replace
        }
    };
    myWrappedComponent.props = {
        location: {
            query,
            pathname
        }
    };

    const newQuery = {
        a: "A",
        b: "",
        c: "C!",
        d: null
    };

    const expectedQuery = {
        a: "A",
        c: "C!"
    };

    myWrappedComponent.render().props.updateQuery(newQuery);

    tt.deepEqual(push.firstCall.args[0], {pathname, query: expectedQuery});
});
