// Code from redux: https://github.com/reactjs/redux/blob/master/LICENSE.md

import test from 'ava';
import Compose from '../Compose';

test('Compose composes from right to left', tt => {
    const double = x => x * 2;
    const square = x => x * x;
    tt.is(Compose(square)(5), 25);
    tt.is(Compose(square, double)(5), 100);
    tt.is(Compose(double, square, double)(5), 200);
})

test('Compose composes functions from right to left', tt => {
    const a = next => x => next(x + 'a');
    const b = next => x => next(x + 'b');
    const c = next => x => next(x + 'c');
    const final = x => x;

    tt.is(Compose(a, b, c)(final)(''), 'abc');
    tt.is(Compose(b, c, a)(final)(''), 'bca');
    tt.is(Compose(c, a, b)(final)(''), 'cab');
})

test('Compose throws at runtime if argument is not a function', tt => {
    const square = x => x * x;
    const add = (x, y) => x + y;

    tt.throws(() => Compose(square, add, false)(1, 2));
    tt.throws(() => Compose(square, add, undefined)(1, 2));
    tt.throws(() => Compose(square, add, true)(1, 2));
    tt.throws(() => Compose(square, add, NaN)(1, 2));
    tt.throws(() => Compose(square, add, '42')(1, 2));
})

test('Compose can be seeded with multiple arguments', tt => {
    const square = x => x * x;
    const add = (x, y) => x + y;
    tt.is(Compose(square, add)(1, 2), 9);
})

test('Compose returns the first given argument if given no functions', tt => {
    tt.is(Compose()(1, 2), 1);
    tt.is(Compose()(3), 3);
    tt.is(Compose()(), undefined);
})

test('Compose returns the first function if given only one', tt => {
    const fn = () => {};

    tt.is(Compose(fn), fn);
})
