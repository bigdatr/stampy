import test from 'ava';
import SpruceClassName from './SpruceClassName';

test('modifier splitting', tt => {
    tt.is(SpruceClassName({name: 'Test', modifier:'rad cool'}), 'Test Test-rad Test-cool ');
});

test('modifier splitting', tt => {
    tt.is(SpruceClassName({name: 'Test'}, 'extra'), 'Test extra');
});
