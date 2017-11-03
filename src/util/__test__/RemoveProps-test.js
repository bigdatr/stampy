import test from 'ava';
import {fromJS, is} from 'immutable';
import RemoveProps from '../RemoveProps';

test('removes props', tt => {
    tt.true(
        is(
            fromJS(
                RemoveProps(['b','d'], {
                    a: "A",
                    b: "B",
                    c: "C",
                    d: "D"
                })
            ),
            fromJS({
                a: "A",
                c: "C"
            })
        ),
        "Removes props when propList is an array"
    );

    tt.true(
        is(
            fromJS(
                RemoveProps(fromJS(['b','d']), {
                    a: "A",
                    b: "B",
                    c: "C",
                    d: "D"
                })
            ),
            fromJS({
                a: "A",
                c: "C"
            })
        ),
        "Removes props when propList is an immutable list"
    );

    tt.true(
        is(
            fromJS(
                RemoveProps(['e','f'], {
                    a: "A",
                    b: "B",
                    c: "C",
                    d: "D"
                })
            ),
            fromJS({
                a: "A",
                b: "B",
                c: "C",
                d: "D"
            })
        ),
        "Can cope with props that are not found on the props object"
    );

    var originalProps = {
        a: "A",
        b: "B"
    };

    RemoveProps(['a'], originalProps);

    tt.true(
         is(
            fromJS(originalProps),
            fromJS({
                a: "A",
                b: "B"
            })
        ),
        "It does not mutate the original props object"
    );

    const moreProps = {
        a: "A",
        b: "B",
        c: {
            cool: true
        }
    };

    tt.is(
        moreProps.c,
        RemoveProps(['a'], moreProps).c,
        "It does not clone object references on props that are passed through"
    );
});

test('removes props with objects', tt => {
    tt.true(
        is(
            fromJS(
                RemoveProps({a: false, b: true, d: true}, {
                    a: "A",
                    b: "B",
                    c: "C",
                    d: "D"
                })
            ),
            fromJS({
                a: "A",
                c: "C"
            })
        ),
        "Removes props when propList is an object"
    );

    tt.true(
        is(
            fromJS(
                RemoveProps(fromJS({b: true, d: true}), {
                    a: "A",
                    b: "B",
                    c: "C",
                    d: "D"
                })
            ),
            fromJS({
                a: "A",
                c: "C"
            })
        ),
        "Removes props when propList is an immutable map"
    );
});

