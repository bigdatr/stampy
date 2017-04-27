import React, {PropTypes} from 'react';
import {fromJS, Map} from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import memoize from 'lru-memoize';
import {getIn, setIn} from '../util/CollectionUtils';

type FormHockConfig = {
    fields: Object
};

/**
 * @module Hocks
 */

function FormHock(config: FormHockConfig = {}): Function {

    const configFields: List<string> = fromJS(config.fields || []);

    return (ComponentToDecorate: *): * => {

        /**
         * @component
         *
         * `FormHock` allows you to treat a group of input components as a single input.
         * A component that has been hocked with a FormHock accepts a `value`
         * and an `onChange` prop.
         *
         * The `value` prop passed to your hocked component should be an object or a Map,
         * containing values that you want to edit with individual input components.
         *
         * This hock passes down a `fields` prop, which contains values and onChange
         * functions for reading and writing individual fields. These can be spread
         * directly onto input components as per the example.
         *
         * You can nominate which fields you would like to read and write using FormHock's config.
         *
         * @example
         * function MyForm(props) {
         *     const {name, age} = props.fields;
         *     return <div>
         *         <p>First name: <Input {...name.first} /></p>
         *         <p>Last name: <Input {...name.last} /></p>
         *         <p>Age: <Input {...age} /></p>
         *     </div>;
         * }
         *
         * const withForm = FormHock({
         *    fields: ['name.first', 'name.last', 'age']
         * });
         *
         * class FormHandler extends Component {
         *     constructor(props) {
         *         this.state = {
         *             form: {
         *                 name: {first: 'Bob', last: 'Frost'},
         *                 age: '67'
         *             }
         *         };
         *         this.onChange = this.onChange.bind(this);
         *     }
         *     onChange(form) {
         *         this.setState({form});
         *     }
         *     render() {
         *         return <MyForm
         *             value={this.state.form}
         *             onChange={this.onChange}
         *         />;
         *     }
         * }
         *
         * @decorator {FormHock}
         *
         * @prop {Object|Map} value
         * The entire form's value, whose contents will be made available
         * as `value`s and `onChange` functions for reading and writing individual fields.
         *
         * @prop {OnChange}
         *
         * @childprop {Object} fields The object containing the `value`s and `onChange`
         * functions for reading and writing individual fields. E.g. if a field exists in
         * the form's `value` at `value.name.first`, then this value can be accessed via
         * `fields.name.first.value`.
         *
         * @memberof module:Hocks
         */

        class FormHock extends React.Component {

            constructor(props: Object) {
                super(props);
                // memoize only the most recently generated fields prop
                this.getFields = memoize()(this.getFields.bind(this));

                // create onChange functions for each field
                this.fieldOnChange = configFields
                    .reduce((obj: Object, pathString: string) => {
                        obj[pathString] = (newValue: *) => this.onChange(newValue, pathString.split("."));
                        return obj;
                    }, {});
            }

            onChange(changedValue: *, path: Array<string>) {
                const {onChange, value} = this.props;
                onChange(setIn(value, path, changedValue));
            }

            getFields(valueProp: Object): Object {
                return configFields
                    .reduce((fields: Map<string,*>, pathString: string): Map<string,*> => {
                        const path: Array<string> = pathString.split(".");
                        const value: * = getIn(valueProp, path, "");
                        const onChange: Function = this.fieldOnChange[pathString];
                        return fields.setIn(path, {value, onChange});
                    }, Map())
                    .toJS();
            }

            render(): React.Element<any> {
                const value: Object|Map<string,*> = this.props.value || {};

                return <ComponentToDecorate
                    {...this.props}
                    fields={this.getFields(value)}
                />;
            }
        }

        FormHock.propTypes = {
            value: PropTypes.oneOfType([
                PropTypes.object,
                ImmutablePropTypes.map
            ]).isRequired,
            onChange: PropTypes.func
        };

        return FormHock;
    };
}

/**
 * Provides configuration for `FormHock`.
 *
 * @callback FormHock
 *
 * @param {FormHockConfig} config Provides configuration for FormHock.
 *
 * @return {FormWrapper}
 */

/**
 * Configuration object for the FormHock.
 *
 * @typedef FormHockConfig
 *
 * @property {Array<string>} [fields]
 * An array of strings indicating which nested properties of `FormHock`s
 * `value` prop should have `field`s created for them.
 * Use dots to specify nested props, see example.
 */

/**
 * A function that accepts the component you want to wrap in a `FormHock`.
 *
 * @callback FormWrapper
 *
 * @param {ReactComponent} ComponentToDecorate
 * The component you wish to wrap in an `FormHock`.
 *
 * @return {ReactComponent}
 * The decorated component.
 */

export default FormHock;
