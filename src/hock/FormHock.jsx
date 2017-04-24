import React, {PropTypes} from 'react';
import {fromJS, Map} from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {getIn, setIn} from '../util/CollectionUtils';

type FormHockConfig = {
    fields: Object
};

function FormHock(config: FormHockConfig = {}): Function {

    const configFields: List<string> = fromJS(config.fields || []);

    return (ComponentToDecorate: *): * => {
        class FormHockDecorator extends React.Component {

            onChange(changedValue: *, path: Array<string>) {
                const {onChange, value} = this.props;
                onChange(setIn(value, path, changedValue));
            }

            render(): React.Element<any> {
                const valueProp: Object|Map<string,*> = this.props.value || {};

                const fields: Object = configFields
                    .reduce((fields: Map<string,*>, pathString: string): Map<string,*> => {
                        const path: Array<string> = pathString.split(".");
                        const value: * = getIn(valueProp, path, "");
                        const onChange: Function = (newValue: *) => this.onChange(newValue, path);
                        return fields.setIn(path, {value, onChange});
                    }, Map())
                    .toJS();

                return <ComponentToDecorate
                    {...this.props}
                    fields={fields}
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
