import test from 'ava';
import Hock from '../Hock';

test('Hock should return a function that returns the contents of its param.hock function', (tt: Object) => {
    tt.is(Hock({
        hock: () => 123
    })(), 123);
});

test('Hock should pass the config argument through to the hockCreator function', (tt: Object) => {
    var myHock = Hock({
        hock: (config: Object) => {
            tt.deepEqual(config, {cool: true}, 'config should pass through to hockCreator function');
        }
    });

    myHock({cool: true});
});

test('Hock should default config to an empty object', (tt: Object) => {
    Hock({
        hock: (config: Object) => {
            tt.deepEqual(config, {}, 'config should be an empty object');
        }
    })();
});

test('Hock should default config to a function that returns an empty object if passed null', (tt: Object) => {
    Hock({
        hock: (config: Object) => {
            tt.deepEqual(config, {}, 'config should be an empty object');
        }
    })(null);
});

test('Hock should apply defaults to individual config keys', (tt: Object) => {
    var myHock = Hock({
        hock: (config: Object) => {
            tt.deepEqual(config, {cool: true, nice: false, choice: true});
        },
        defaultConfig: {
            nice: false,
            choice: false
        }
    });

    // hock usage overriding defaults
    myHock({
        cool: true,
        choice: true
    });
});

test('Hock should error if params.hock is not provided', (tt: Object) => {
    tt.truthy(tt.throws(() => {
        Hock({});
    }));
});

test('Hock should error if config is truthy and not an object, while shorthandKey is not set', (tt: Object) => {
    var myHock = Hock({
        hock: () => {}
    });

    tt.truthy(tt.throws(() => {
        myHock(123);
    }));

    tt.truthy(tt.throws(() => {
        myHock("???");
    }));

    tt.truthy(tt.throws(() => {
        myHock(() => ({}));
    }));
});

test('Hock should error if config is truthy and not an object or function, while shorthandKey is set', (tt: Object) => {
    var myHock = Hock({
        hock: () => {},
        shorthandKey: "abc"
    });

    tt.truthy(tt.throws(() => {
        myHock(123);
    }));

    tt.truthy(tt.throws(() => {
        myHock("???");
    }));
});

test('Hock should use shorthandKey if set, and config is passed a function', (tt: Object) => {
    tt.plan(1);

    var myHock = Hock({
        hock: (config: Object) => {
            config.foo();
        },
        shorthandKey: "foo"
    });

    myHock(() => {
        tt.pass();
    });
});
