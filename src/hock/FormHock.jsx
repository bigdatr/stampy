import React, {PropTypes} from 'react';
import {fromJS, Map} from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import memoize from 'fast-memoize';
import {getIn, setIn} from '../util/CollectionUtils';

type FormHockConfig = {
    fields: Object
};

function FormHock(config: FormHockConfig = {}): Function {

    const configFields: List<string> = fromJS(config.fields || []);

    return (ComponentToDecorate: *): * => {
        class FormHockDecorator extends React.Component {

            constructor(props: Object) {
                super(props);
                this.getFields = memoize(this.getFields.bind(this));
                this.createOnChange = memoize(this.createOnChange.bind(this));
            }

            onChange(changedValue: *, path: Array<string>) {
                const {onChange, value} = this.props;
                onChange(setIn(value, path, changedValue));
            }

            createOnChange(pathString: string): Function {
                return (newValue: *) => this.onChange(newValue, pathString.split("."));
            }

            getFields(valueProp: Object): Object {
                return configFields
                    .reduce((fields: Map<string,*>, pathString: string): Map<string,*> => {
                        const path: Array<string> = pathString.split(".");
                        const value: * = getIn(valueProp, path, "");
                        const onChange: Function = this.createOnChange(pathString);
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

        FormHockDecorator.propTypes = {
            value: PropTypes.oneOfType([
                PropTypes.object,
                ImmutablePropTypes.map
            ]).isRequired,
            onChange: PropTypes.func
        };

        return FormHockDecorator;
    };
}

export default FormHock;
