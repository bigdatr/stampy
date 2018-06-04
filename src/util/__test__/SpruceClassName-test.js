import test from 'ava';
import SpruceClassName from '../SpruceClassName';

test('modifier splitting', tt => {
    const className = SpruceClassName({name: 'Test', modifier:'rad cool'});

    tt.truthy(
        className.match(/\bTest\b/) &&
        className.match(/\bTest-rad\b/) &&
        className.match(/\bTest-cool\b/)
    );
});

test('peer splitting', tt => {
    const className = SpruceClassName({name: 'Test', peer:'rad cool'});

    tt.truthy(
        className.match(/\bTest\b/) &&
        className.match(/\bTest--rad\b/) &&
        className.match(/\bTest--cool\b/)
    );
});

test('extra classnames params', tt => {
    const className = SpruceClassName({name: 'Test'}, 'extra');
    tt.truthy(
        className.match(/\bTest\b/) &&
        className.match(/\bextra\b/)
    );
});

test('modifier splitting with objects', tt => {
    const className = SpruceClassName({
        name: 'Test',
        modifier: {
            yes: true,
            no: false
        }
    });

    tt.truthy(
        className.match(/\bTest\b/) &&
        className.match(/\bTest-yes\b/) &&
        !className.match(/\bTest-no\b/)
    );
});


test('parent prefixing', tt => {
    const className = SpruceClassName({
        name: '_child',
        parent: 'Parent'
    });

    tt.is(className.trim(), 'Parent_child');
});


test('child without a parent will throw', tt => {
    tt.throws(() => SpruceClassName({name: '_child', parent: ''}));
});

test('Parent without an underscored child will throw', tt => {
    tt.throws(() => SpruceClassName({parent: 'Parent', name: 'Child'}));
});


