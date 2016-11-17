

# General component requirements

When adding new components they must have:
- Full test coverage (using ava)
- [JSDoc documentation](#docs)
- Flow types
- Strict semver versioning
- A working [example](#examples)

---

# Specific component requirements

## Inputs

Inputs have a strict common interface to ensure predictable usage and compatibility with [redux form](http://redux-form.com/). All components will be controlled.

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

---

# Component styling

Component styles are build by a group of shell scripts in the [scripts](/scripts) folder.

The CSS build will output a bunch of different files into the `lib` folder.

- It aggregates all the base styles for components into a `base.css` file. 
- It combines base _and_ default styles (seeing as you'd never want default without base) into a `default.css` file.
- It creates sass and css files for individual components so that you can pick and choose what files you want.
- As well as creating the `.css` files it also combines and moves the sass files across to allow users to handle sass compilation if they would prefer.

For example if you had a `Table-base.scss` and `Table-default.scss` file it would output the following files:

```
lib
├── base.css
├── base.scss
├── default.css
├── default.scss
├── component
│   └── table
│       ├── Table-base.css
│       ├── Table-base.scss
│       ├── Table-default.css
│       ├── Table-default.scss
│       └── Table.js
```


---

# Examples

All components should be accompanied by implementation examples. Simple code examples can be placed in [JSDoc comments](http://usejsdoc.org/tags-example.html) but any complex or varied functionality that the component allows should be shown with working examples in the [example](/example) folder.

## Building the examples

You can run the examples build from the parent stampy folder by running:

```
yarn run build-examples
```

This will cd into the example folder and run `yarn install` and `yarn run build`. Once the task finishes you can view the examples by running your favourite webserver in the `example` folder.


## Developing examples

The example folder contains a basic webpack/babel build setup. To start working on examples go into the example folder and run:

```
yarn install
```

The two main tasks are _build_ and _watch_.

```
yarn run build
```
Will do a production build of the examples.

```
yarn run watch
```
will start up webpack-dev-server and allow for rapid development.

New examples should be added to the list in [IndexPage.jsx](/example/src/components/IndexPage.jsx).

---

# Docs

Documentation is written using [JSDoc](http://usejsdoc.org/) comments.

@TODO add more info here about documentation standards.
