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

test('QueryStringHock passes search from react router location prop', tt => {

    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = QueryStringHock()(componentToWrap);
    const myWrappedComponent = new WrappedComponent();

    myWrappedComponent.props = {
        location: {
            search: "?a=A",
            pathname: "/"
        }
    };

    const expectedQuery = {
        a: "A"
    };

    tt.deepEqual(myWrappedComponent.render().props.query, expectedQuery);

});

test('QueryStringHock passes empty object as query if location prop not provided', tt => {

    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = QueryStringHock()(componentToWrap);
    const myWrappedComponent = new WrappedComponent();

    myWrappedComponent.props = {};

    tt.deepEqual(myWrappedComponent.render().props.query, {});

});

test('QueryStringHock should change the name of the query prop if given queryPropName in config', tt => {

    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = QueryStringHock({
        queryPropName: "coolQueryTime"
    })(componentToWrap);
    const myWrappedComponent = new WrappedComponent();

    myWrappedComponent.props = {
        location: {
            search: "?a=A",
            pathname: "/"
        }
    };

    const expectedQuery = {
        a: "A"
    };

    tt.deepEqual(myWrappedComponent.render().props.coolQueryTime, expectedQuery);

});

test('QueryStringHock should convert missing or singular params to array when config.arrayParams is used', tt => {

    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = QueryStringHock({
        arrayParams: ['a', 'b', 'c']
    })(componentToWrap);
    const myWrappedComponent = new WrappedComponent();

    myWrappedComponent.props = {
        location: {
            search: "?a=A&b=B&b=B2&d=D",
            pathname: "/"
        }
    };

    const expectedQuery = {
        a: ["A"], // single query param should now be an array
        b: ["B", "B2"], // multiple query param should still array
        c: [], // missing query param should be an empty array
        d: "D" // other params should remain as they are
    };

    tt.deepEqual(myWrappedComponent.render().props.query, expectedQuery);

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

    myWrappedComponent.props = {
        location: {
            search: "?b=B!&c=",
            pathname: "/"
        }
    };

    const expectedQuery = {
        a: "A", // Params not in query should use default query
        b: "B!", // Params in query string should appear as specified
        c: "C" // Params in query string as empty strings should not override defaults
    };

    tt.deepEqual(myWrappedComponent.render().props.query, expectedQuery);

});

test('QueryStringHock should set query via history prop for react-router v1 using pushState', tt => {

    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = QueryStringHock()(componentToWrap);
    const myWrappedComponent = new WrappedComponent();

    const pushState = sinon.spy();
    const replaceState = sinon.spy();

    const pathname = "PATH";

    myWrappedComponent.context = {};
    myWrappedComponent.props = {
        location: {
            search: "",
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

    myWrappedComponent.context = {};
    myWrappedComponent.props = {
        location: {
            search: "",
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

test('QueryStringHock should set query for react-router v2 and v3 using context.router.push', tt => {

    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = QueryStringHock()(componentToWrap);
    const myWrappedComponent = new WrappedComponent();

    const push = sinon.spy();
    const replace = sinon.spy();

    const pathname = "PATH";

    myWrappedComponent.context = {
        router: {
            push,
            replace
        }
    };
    myWrappedComponent.props = {
        location: {
            search: "",
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

test('QueryStringHock should set query for react-router v2 and v3 using context.router.replace', tt => {

    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = QueryStringHock({
        replaceState: true
    })(componentToWrap);
    const myWrappedComponent = new WrappedComponent();

    const push = sinon.spy();
    const replace = sinon.spy();

    const pathname = "PATH";

    myWrappedComponent.context = {
        router: {
            push,
            replace
        }
    };
    myWrappedComponent.props = {
        location: {
            search: "",
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


test('QueryStringHock should set query for react-router v4 using context.router.history.push', tt => {

    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = QueryStringHock()(componentToWrap);
    const myWrappedComponent = new WrappedComponent();

    const push = sinon.spy();
    const replace = sinon.spy();

    const pathname = "PATH";

    myWrappedComponent.context = {
        router: {
            history: {
                push,
                replace
            }
        }
    };
    myWrappedComponent.props = {
        location: {
            search: "",
            pathname
        }
    };

    const newQuery = {
        a: "A"
    };

    const newPathname = `${pathname}?a=A`;

    myWrappedComponent.render().props.setQuery(newQuery);

    tt.true(push.calledOnce, 'router.push is called');
    tt.is(push.firstCall.args[0], newPathname, 'First arg should contain new pathname');
    tt.false(replace.called, 'router.replace should not be called');
});

test('QueryStringHock should set query for react-router v4 using context.router.history.replace', tt => {

    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = QueryStringHock({
        replaceState: true
    })(componentToWrap);
    const myWrappedComponent = new WrappedComponent();

    const push = sinon.spy();
    const replace = sinon.spy();

    const pathname = "PATH";

    myWrappedComponent.context = {
        router: {
            history: {
                push,
                replace
            }
        }
    };
    myWrappedComponent.props = {
        location: {
            search: "",
            pathname
        }
    };

    const newQuery = {
        a: "A"
    };

    const newPathname = `${pathname}?a=A`;

    myWrappedComponent.render().props.setQuery(newQuery);

    tt.true(replace.calledOnce, 'router.replace is called');
    tt.is(replace.firstCall.args[0], newPathname, 'First arg should contain new pathname');
    tt.false(push.called, 'router.push should not be called');
});

test('QueryStringHock should not change path if path is the same for react-router v4', tt => {
    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = QueryStringHock()(componentToWrap);
    const myWrappedComponent = new WrappedComponent();

    const push = sinon.spy();
    const replace = sinon.spy();

    const pathname = "PATH";

    myWrappedComponent.context = {
        router: {
            history: {
                push,
                replace
            }
        }
    };
    myWrappedComponent.props = {
        location: {
            search: "?a=A",
            pathname
        }
    };

    const newQuery = {
        a: "A"
    };

    myWrappedComponent.render().props.setQuery(newQuery);
    tt.false(push.called, 'router.push should not be called');
    tt.false(replace.called, 'router.replace should not be called');
});

test('QueryStringHock should not set a query string when no query using react-router v4', tt => {

    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = QueryStringHock()(componentToWrap);
    const myWrappedComponent = new WrappedComponent();

    const push = sinon.spy();

    const pathname = "PATH";

    myWrappedComponent.context = {
        router: {
            history: {
                push
            }
        }
    };
    myWrappedComponent.props = {
        location: {
            search: "?old=OLD",
            pathname
        }
    };

    const newQuery = {};

    myWrappedComponent.render().props.setQuery(newQuery);

    tt.true(push.calledOnce, 'router.push is called');
    tt.is(push.firstCall.args[0], pathname, 'First arg should contain new pathname');
});

test('QueryStringHock should stringify array params correctly using react-router v4', tt => {

    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = QueryStringHock()(componentToWrap);
    const myWrappedComponent = new WrappedComponent();

    const push = sinon.spy();

    const pathname = "PATH";

    myWrappedComponent.context = {
        router: {
            history: {
                push
            }
        }
    };
    myWrappedComponent.props = {
        location: {
            search: "",
            pathname
        }
    };

    const newQuery = {
        a: ["A", "B", "C"],
        z: "Z"
    };

    myWrappedComponent.render().props.setQuery(newQuery);

    const newPathname = `${pathname}?a=A&a=B&a=C&z=Z`;

    tt.true(push.calledOnce, 'router.push is called');
    tt.is(push.firstCall.args[0], newPathname, 'First arg should contain new pathname');
});

test('QueryStringHock setQuery should replace existing query completely', tt => {

    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = QueryStringHock()(componentToWrap);
    const myWrappedComponent = new WrappedComponent();

    const push = sinon.spy();

    myWrappedComponent.context = {
        router: {
            push
        }
    };
    myWrappedComponent.props = {
        location: {
            search: "?c=C&d=D",
            pathname: '/'
        }
    };

    const newQuery = {
        a: "A",
        b: "B"
    };

    myWrappedComponent.render().props.setQuery(newQuery);

    tt.deepEqual(push.firstCall.args[0].query, newQuery);
});

test('QueryStringHock setQuery should replace pathname if provided as a param', tt => {

    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = QueryStringHock()(componentToWrap);
    const myWrappedComponent = new WrappedComponent();
    const push = sinon.spy();

    myWrappedComponent.context = {
        router: {
            push
        }
    };
    myWrappedComponent.props = {
        location: {
            search: "?foo=bar",
            pathname: '/'
        }
    };


    myWrappedComponent.render().props.setQuery({}, '/foo');

    tt.is(push.firstCall.args[0].pathname, '/foo');
});

test('QueryStringHock setQuery should noop on missing location prop', tt => {

    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = QueryStringHock()(componentToWrap);
    const myWrappedComponent = new WrappedComponent();

    const push = sinon.spy();

    myWrappedComponent.context = {
        router: {
            push
        }
    };
    myWrappedComponent.props = {};

    const newQuery = {
        a: "A",
        b: "B"
    };

    myWrappedComponent.render().props.setQuery(newQuery);

    tt.false(push.called);
});

test('QueryStringHock setQuery should filter out empty strings and nulls', tt => {

    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = QueryStringHock()(componentToWrap);
    const myWrappedComponent = new WrappedComponent();

    const push = sinon.spy();

    myWrappedComponent.context = {
        router: {
            push
        }
    };
    myWrappedComponent.props = {
        location: {
            search: "",
            pathname: '/'
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

    tt.deepEqual(push.firstCall.args[0].query, expectedQuery);
});

test('QueryStringHock updateQuery should merge with existing query', tt => {

    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = QueryStringHock()(componentToWrap);
    const myWrappedComponent = new WrappedComponent();

    const push = sinon.spy();

    const pathname = "PATH";

    myWrappedComponent.context = {
        router: {
            push
        }
    };
    myWrappedComponent.props = {
        location: {
            search: "?c=C&d=D",
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


test('QueryStringHock updateQuery should noop on missing location prop', tt => {

    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = QueryStringHock()(componentToWrap);
    const myWrappedComponent = new WrappedComponent();

    const push = sinon.spy();

    myWrappedComponent.context = {
        router: {
            push
        }
    };
    myWrappedComponent.props = {};

    const newQuery = {
        a: "A",
        b: "B"
    };

    myWrappedComponent.render().props.updateQuery(newQuery);

    tt.false(push.called);
});


test('QueryStringHock updateQuery should filter out empty strings and nulls', tt => {

    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = QueryStringHock()(componentToWrap);
    const myWrappedComponent = new WrappedComponent();

    const push = sinon.spy();

    myWrappedComponent.context = {
        router: {
            push
        }
    };
    myWrappedComponent.props = {
        location: {
            search: "?b=B&c=C",
            pathname: '/'
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

    tt.deepEqual(push.firstCall.args[0].query, expectedQuery);
});

test('QueryStringHock updateQuery can cope with merging and not merging array params', tt => {

    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = QueryStringHock({
        arrayParams: [
            "noneToNone",
            "noneToOne",
            "noneToTwo",
            "oneToNone",
            "oneToOne",
            "oneToTwo",
            "twoToNone",
            "twoToOne",
            "twoToTwo"
        ]
    })(componentToWrap);
    const myWrappedComponent = new WrappedComponent();

    const push = sinon.spy();

    const search = "?"+[
        "oneToNone=one",
        "oneToOne=one",
        "oneToTwo=one",
        "twoToNone=1",
        "twoToOne=1",
        "twoToTwo=1",
        "twoToNone=2",
        "twoToOne=2",
        "twoToTwo=2"
    ].join("&");

    myWrappedComponent.context = {
        router: {
            push
        }
    };
    myWrappedComponent.props = {
        location: {
            search,
            pathname: '/'
        }
    };

    const newQuery = {
        noneToNone: "",
        noneToOne: "one!",
        noneToTwo: ["1!", "2!"],
        oneToNone: "",
        oneToOne: "one!",
        oneToTwo: ["1!", "2!"],
        twoToNone: null,
        twoToOne: "one!",
        twoToTwo: ["1!", "2!"]
    };

    const expectedQuery = {
        noneToOne: "one!",
        noneToTwo: ["1!", "2!"],
        oneToOne: "one!",
        oneToTwo: ["1!", "2!"],
        twoToOne: "one!",
        twoToTwo: ["1!", "2!"]
    };

    myWrappedComponent.render().props.updateQuery(newQuery);

    tt.deepEqual(push.firstCall.args[0].query, expectedQuery);
});

test('QueryStringHock updateQuery should replace pathname if provided as a param', tt => {

    const componentToWrap = () => <div>Example Component</div>;
    const WrappedComponent = QueryStringHock()(componentToWrap);
    const myWrappedComponent = new WrappedComponent();
    const push = sinon.spy();

    myWrappedComponent.context = {
        router: {
            push
        }
    };
    myWrappedComponent.props = {
        location: {
            search: "?foo=bar",
            pathname: '/'
        }
    };


    myWrappedComponent.render().props.updateQuery({}, '/foo');

    tt.is(push.firstCall.args[0].pathname, '/foo');
});

