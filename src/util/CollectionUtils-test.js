import test from 'ava';
import {fromJS, is} from 'immutable';
import {has, get, getIn, set, setIn} from './CollectionUtils';

test('has() works with Objects', tt => {
    const obj = {
        a: "123"
    };

    tt.true(has(obj, 'a'));
    tt.false(has(obj, 'b'));
});

test('has() works with Maps', tt => {
    const map = fromJS({
        a: "123"
    });

    tt.true(has(map, 'a'));
    tt.false(has(map, 'b'));
});

test('has() works with Arrays', tt => {
    const arr = [
        "123"
    ];

    tt.true(has(arr, 0));
    tt.false(has(arr, 1));
    tt.false(has(arr, -1));
});

test('has() works with Lists', tt => {
    const list = fromJS([
        "123"
    ]);

    tt.true(has(list, 0));
    tt.false(has(list, 1));
});

test('get() works with Objects', tt => {
    const obj = {
        a: "123"
    };

    tt.is(get(obj, 'a', 'nope'), '123');
    tt.is(get(obj, 'b', 'nope'), 'nope');
});

test('get() works with Maps', tt => {
    const map = fromJS({
        a: "123"
    });

    tt.is(get(map, 'a', 'nope'), '123');
    tt.is(get(map, 'b', 'nope'), 'nope');
});

test('get() works with Arrays', tt => {
    const arr = [
        "123"
    ];

    tt.is(get(arr, 0, 'nope'), '123');
    tt.is(get(arr, 1, 'nope'), 'nope');
});

test('get() works with Lists', tt => {
    const list = fromJS([
        "123"
    ]);

    tt.is(get(list, 0, 'nope'), '123');
    tt.is(get(list, 1, 'nope'), 'nope');
});

test('getIn() works with Objects', tt => {
    const obj = {
        a: {
            b: "123"
        }
    };

    tt.is(getIn(obj, ['a', 'b'], 'nope'), '123');
    tt.is(getIn(obj, ['b', 'b'], 'nope'), 'nope');
    tt.is(getIn(obj, ['a', 'a'], 'nope'), 'nope');
});

test('getIn() works with Maps', tt => {
    const map = fromJS({
        a: {
            b: "123"
        }
    });

    tt.is(getIn(map, ['a', 'b'], 'nope'), '123');
    tt.is(getIn(map, ['b', 'b'], 'nope'), 'nope');
    tt.is(getIn(map, ['a', 'a'], 'nope'), 'nope');
});

test('getIn() works with Arrays', tt => {
    const arr = [
        [null, "123"]
    ];

    tt.is(getIn(arr, [0,1], 'nope'), '123');
    tt.is(getIn(arr, [1,1], 'nope'), 'nope');
    tt.is(getIn(arr, [1,0], 'nope'), 'nope');
});

test('getIn() works with Lists', tt => {
    const list = fromJS([
        [null, "123"]
    ]);

    tt.is(getIn(list, [0,1], 'nope'), '123');
    tt.is(getIn(list, [1,1], 'nope'), 'nope');
    tt.is(getIn(list, [1,0], 'nope'), 'nope');
});


test('set() works with Objects', tt => {
    const obj = {
        a: "123"
    };

    const expectedObj = {
        a: "123",
        b: "456"
    };

    tt.deepEqual(
        set(obj, 'b', '456'),
        expectedObj
    );
});

test('set() works with Maps', tt => {
    const map = fromJS({
        a: "123"
    });

    const expectedMap = fromJS({
        a: "123",
        b: "456"
    });

    tt.true(
        is(
            set(map, 'b', '456'),
            expectedMap
        )
    );
});

test('set() works with Arrays', tt => {
    const arr = [3];
    const expectedArr = [3,4];

    tt.deepEqual(
        set(arr, 1, 4),
        expectedArr
    );
});

test('set() works with Lists', tt => {
    const list = fromJS([3]);
    const expectedList = fromJS([3,4]);

    tt.true(
        is(
            set(list, 1, 4),
            expectedList
        )
    );
});


test('setIn() works at depth 1 on existing key', tt => {
    const obj = {
        a: "123"
    };

    const expectedObj = {
        a: "456"
    };

    tt.deepEqual(setIn(obj, ['a'], '456'), expectedObj);
});

test('setIn() works at depth 1 on new key', tt => {
    const obj = {
        a: "123"
    };

    const expectedObj = {
        a: "123",
        b: "456"
    };

    tt.deepEqual(setIn(obj, ['b'], '456'), expectedObj);
});

test('setIn() works at depth 2 on existing key', tt => {
    const obj = {
        a: {
            b: "123"
        }
    };

    const expectedObj = {
        a: {
            b: "456"
        }
    };

    tt.deepEqual(setIn(obj, ['a', 'b'], '456'), expectedObj);
});

test('setIn() works at depth 2 on new key', tt => {
    const obj = {
        a: {
            b: "123"
        }
    };

    const expectedObj = {
        a: {
            b: "123",
            c: "456"
        }
    };

    tt.deepEqual(setIn(obj, ['a', 'c'], '456'), expectedObj);
});

test('setIn() works at depth 2 on new key with new container', tt => {
    const obj = {
        a: {
            b: "123"
        }
    };

    const expectedObj = {
        a: {
            b: "123"
        },
        c: {
            d: "456"
        }
    };

    tt.deepEqual(setIn(obj, ['c', 'd'], '456'), expectedObj);
});

test('setIn() works at depth 3 on existing key', tt => {
    const obj = {
        a: [
            {
                c: "123"
            }
        ]
    };

    const expectedObj = {
        a: [
            {
                c: "456"
            }
        ]
    };

    tt.deepEqual(setIn(obj, ['a', 0, 'c'], '456'), expectedObj);
});
