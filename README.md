# Stampy

The new and improved stampy.

## Hello there please re-write this or something

When adding new components they must have:
- Full test coverage (using ava)
- Jsdoc documentation
- Flow types
- Strict semver versioning

## To do:
- Run babel and jsdoc on build
- Run tests including flow type checking to get a passing build
- Replace jsdoc minami theme with [jsdonk](https://github.com/dxinteractive/jsdonk) when that's ready to use
- Set the `docs/` dir to output to [this github page](https://bigdatr.github.io/stampy)

<!--

Leaving for later reference of flattening

// deepRecurse through the childNodes, pushing each leaf
// to the reduction. This will flatten the any deep children
// but retain their ordering
const data: List<any> = fromJS(props.data)
    // A fake parent node has to be created so that
    // the deepReduce can start with a child
    .update(ii => Map().set(childNodeName, ii))
    .update(deepReduceOutwards((reduction, item) => {
        return reduction.push(item);
    }, List(), [childNodeName]))
    .skip(1); // The first node is our fake root node.

test('child flattening', tt => {
    const nestedData = [
        {
            foo: 'bar',
            children: [
                {
                    foo: 'bar'
                }
            ]
        }
    ];
    const wrapper = shallow(<Table data={nestedData} schema={schema} />);
    tt.is(wrapper.find('tbody tr').length, 2);
    tt.is(shallow(<Table data={nestedData} schema={schema} childNodeName="other"/>).find('tbody tr').length, 1);
})

-->

