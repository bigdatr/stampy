import test from 'ava';
import ConfigureHock from './ConfigureHock';

test('ConfigureHock should return a function that returns the contents of hockcreator', tt => {
    tt.is(ConfigureHock(() => 123)(), 123);
});

test('ConfigureHock should pass the the two config args through to the hockCreator function', tt => {
    var myConfig = () => ({cool: true});
    var myApplierConfig = {grand: true};
    var myHock = ConfigureHock((config, applierConfig) => {
        tt.deepEqual(config(), myConfig(), 'config should pass through to hockCreator function');
        tt.deepEqual(applierConfig, myApplierConfig, 'applierConfig should pass through to hockCreator function');
    });

    myHock(myConfig, myApplierConfig);
});

test('ConfigureHock should default config to a function that returns an empty object', tt => {
    ConfigureHock((config) => {
        tt.is(typeof config, "function", 'config is function');
        tt.deepEqual(config(), {}, 'config should return empty object');
    });
});

test('ConfigureHock should default config to a function that returns an empty object if passed null', tt => {
    var myHock = ConfigureHock((config) => {
        tt.is(typeof config, "function", 'config is function');
        tt.deepEqual(config(), {}, 'config should return empty object');
    });

    myHock(null);
});

test('ConfigureHock should default applierConfig to an empty object', tt => {
    ConfigureHock((config, applierConfig) => {
        tt.deepEqual(applierConfig, {}, 'applierConfig should be empty object');
    }, () => ({}));
});

test('ConfigureHock should aplly defaults to individual config keys', tt => {
    var myConfig = () => ({cool: true, choice: true});
    var myHock = ConfigureHock(
        (config) => {
            tt.deepEqual(config(), {cool: true, nice: false, choice: true});
        },
        () => ({
            nice: false,
            choice: false
        })
    );

    myHock(myConfig);
});

test('ConfigureHock should pass props to config function', tt => {
    var myConfig = () => ({});
    var myHock = ConfigureHock(
        (config) => {
            tt.deepEqual(config({niceProp: "!!!"}), {nice: "!!!", choice: false});
        },
        (props) => ({
            nice: props.niceProp,
            choice: false
        })
    );

    myHock(myConfig);
});

test('ConfigureHock should default individual applierConfig keys', tt => {
    var myApplierConfig = {cool: true, choice: true};
    var myHock = ConfigureHock(
        (config, myApplierConfig) => {
            tt.deepEqual(myApplierConfig, {cool: true, nice: false, choice: true});
        },
        () => ({}),
        {
            nice: false,
            choice: false
        }
    );

    myHock(() => ({}), myApplierConfig);
});

test('ConfigureHock should error if config is not a function', tt => {
    var myHock = ConfigureHock(() => {});

    tt.truthy(tt.throws(() => {
        myHock({
            imAnObjectConfig: true
        });
    }));

    tt.truthy(tt.throws(() => {
        myHock(123);
    }));

    tt.notThrows(() => {
        myHock(null);
    });

    tt.notThrows(() => {
        myHock(() => ({}));
    });
});


test('ConfigureHock should error if config does not return an object', tt => {
    var myHock = ConfigureHock((config) => {
        config();
    });

    tt.truthy(tt.throws(() => {
        myHock(() => 123);
    }));

    tt.truthy(tt.throws(() => {
        myHock(() => "123");
    }));

    tt.notThrows(() => {
        myHock(() => ({}));
    });
});

test('ConfigureHock should error if applierConfig is not an object', tt => {
    var myHock = ConfigureHock(() => {});

    tt.notThrows(() => {
        myHock(() => ({}), {
            imAnObjectConfig: true
        });
    });

    tt.truthy(tt.throws(() => {
        myHock(() => ({}), 123);
    }));

    tt.truthy(tt.throws(() => {
        myHock(() => ({}), () => {});
    }));
});
