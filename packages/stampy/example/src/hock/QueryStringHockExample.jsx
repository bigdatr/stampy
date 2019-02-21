import PropTypes from 'prop-types';
import React from 'react';
import QueryStringHock from 'stampy/lib/hock/QueryStringHock';

const Example = (props) => {
    const {
        query,
        setQuery,
        updateQuery
    } = props;

    console.log('Props:', props);

    return <div>
        <button onClick={() => updateQuery({foo: "FOO"})}>Add "foo=FOO" to query string</button>
        <button onClick={() => updateQuery({foo: "YEAH"})}>Add "foo=YEAH" to query string</button>
        <button onClick={() => updateQuery({bar: "BAR"})}>Add "bar=BAR" to query string</button>
        <button onClick={() => updateQuery({bar: null})}>Remove "bar" from query string</button>
        <button onClick={() => updateQuery({arr: ["A", "B"]})}>Add "arr=A&arr=B" to query string</button>
        <button onClick={() => setQuery({baz: "BAZ"})}>Replace query string completely with "baz=BAZ"</button>
        <button onClick={() => setQuery({})}>Clear query string</button>
    </div>;
}

Example.propTypes = {
    setQuery: PropTypes.func,
    updateQuery: PropTypes.func
};

const QueryStringHockExample = QueryStringHock({
    arrayParams: ['arr']
})(Example);

export default QueryStringHockExample;
