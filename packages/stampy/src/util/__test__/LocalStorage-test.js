// Code from redux: https://github.com/reactjs/redux/blob/master/LICENSE.md

import test from 'ava';
import {spy} from 'sinon';
import {LocalStorageLoad} from '../LocalStorage';
import {LocalStorageSave} from '../LocalStorage';

const storage = {
    key: `{"foo": "bar"}`,
    other: 'OTHER'
};

test.beforeEach(t => {
    global.localStorage = {
        getItem: (key) => storage[key],
        setItem: (key, value) => storage[key] = value
    };
});

test.afterEach(t => {
    delete global.localStorage;
});

test('LocalStorageLoad gets a value', t => {
    return LocalStorageLoad('key')
        .then(data => t.is('bar', data.foo))
    ;
});

test('LocalStorageLoad return an Promise<undefined> if thongin is found', t => {
    return LocalStorageLoad('baz')
        .then(data => t.is(undefined, data))
    ;
});






test('LocalStorageSave stores a value', t => {
    return LocalStorageSave('key', {bar: 'baz'})
        .then(() => t.is('{"bar":"baz"}', storage.key))
    ;
});

test('LocalStorageLoad will not try to save null values', t => {

    return Promise.all([
        LocalStorageSave('other', null),
        LocalStorageSave('other', undefined)
    ])
        .then(data => {
            t.is('OTHER', storage.other);
        });
});

