import React from 'react';
import {Field, reduxForm} from 'redux-form';
import {FieldMessage, Input} from 'stampy';
import { createStore } from 'redux';

const validate = values => {
    const errors = {};

    if (!values.name) {
        // Probably not the best idea to structure errors as an object but this shows that it is possible
        errors.name = {'length': 'Name field is required', 'other': 'You did something else wrong'};
    }
    return errors;
};


const warn = values => {
    const warnings = {};

    if (values.name && values.name.length > 5) {
        warnings.name = 'That\'s a pretty long name you got there';
    }
    return warnings;
};

const renderField = ({input, label, type, meta}) => {
    return <div>
        <Input {...input}/>
        <FieldMessage {...meta}/>
    </div>;
};

const Form = (props) => {
    return <div>
        <Field name='name' component={renderField}/>
    </div>
};


export default reduxForm({
    form: 'FieldMessageExample',
    validate,
    warn
})(Form);
