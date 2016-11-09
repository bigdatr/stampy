# Stampy

The new and improved stampy.

## Development

When adding new components they must have:
- Full test coverage (using ava)
- Jsdoc documentation
- Flow types
- Strict semver versioning

## Inputs

Inputs have a strict common interface to ensure predictable usage and compatibility with redux form. All components will be controlled.

### Props
#### Input props
 - `value: string|boolean` - the value that the input will show as being selected, or a boolean if the input represents a single boolean value such as a checkbox
 - `onChange: (newValue: string|boolean|array<string>|array<boolean>, ???...) => void` - a callback function that will be called by the input component when the value must change. NewValue is a string, unless multi is true in which case it is an array of strings
 - `disabled: boolean = false` - if true, the input should appear disabled and not accept user input
 - `placeholder: string` - placeholder text where applicable
 - `options: array<object>` - if input accepts multiple options these must be an array of {label: string, option: string, disabled: boolean} // what about immutable lists?
 - `multi: boolean = false` - if input accepts options and multi={true}, more than one option may be chosen at once
 - `clearable: boolean = true` - allows the input to be cleared / have zero choices selected

#### standard stampy props
 - `modifier: string` - spruce class modifier

#### other standard react / html props
 - `className: string` - class attribute
 - `onFocus: function`
 - `onBlur: function`
 - `onKeyUp: function`




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

