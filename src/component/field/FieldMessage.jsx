// @flow
import React from 'react';
import SpruceClassName from '../../util/SpruceClassName';
import {Map, List, fromJS} from 'immutable';

type FieldMessageProps = {
    className: ?string,
    containerClassName: ?string,
    modifier: Modifier,
    containerModifier: Modifier,
    error: string | string[] | {[key: any]: string} | Map<any, string> | List<string>,
    warning: string | string[] | {[key: any]: string} | Map<any, string> | List<string>,
    touched: boolean
}

/**
 * @module Components
 */

/**
 *
 * `FieldMessage` is a component designed to work with redux-form to remove the hassle from 
 * displaying error and warning messages. It is fairly flexible with how you structure your errors
 * and will accept either a string or an iterable with stringy values.
 *
 * @param {Object} props
 * @param {ClassName} [props.className]
 * @param {ClassName} [props.containerClassName] - Same as `props.className` but applied to container.
 * @param {Modifier} [props.modifier]
 * @param {Modifier} [props.containerModifier] - Same as `props.modifier` but applied to container.
 * @param {String|string[]|Object<any, string>|Map<any, string>|List<string>} [props.error] - The current error message or iterable of messages
 * @param {String|string[]|Object<any, string>|Map<any, string>|List<string>} [props.warning] - The current warning message or iterable of messages
 * @param {Boolean} [props.touched] - true if the field has been touched. By default this will be set when the field is blurred.
 *
 * @example
 * // This example uses redux form. See http://redux-form.com/6.2.1/examples/syncValidation/ for
 * // details on how the valiation bits work.
 * 
 * const renderField = ({input, label, type, meta}) => {
 *     return <div>
 *         <Input {...input}/>
 *         <FieldMessage {...meta}/>
 *     </div>;
 * }; * 

 * const Form = (props) => {
 *     return <div>
 *         <Field name='name' component={renderField}/>
 *     </div>
 * };
 * 
 * export default reduxForm({
 *     form: 'FieldMessageExample',
 *     validate,
 *     warn
 * })(Form);
 *
 */

function FieldMessage(props: FieldMessageProps): React.Element<any> | null {
    const {
        className,
        containerClassName,
        modifier,
        containerModifier,
        error,
        warning,
        touched
    } = props;

    const messageClassProps = {
        name: 'FieldMessage',
        modifier,
        className
    };

    return touched && (error || warning) && <div className={SpruceClassName({
        name: 'FieldMessageList',
        modifier: containerModifier,
        className: containerClassName
    })}>
        {error && messagesAsList(error).map((str) => message(str, messageClassProps, 'error'))}
        {warning && messagesAsList(warning).map((str) => message(str, messageClassProps, 'warning'))}
    </div> || null;
}

const message = (
    str: String,
    classNameProps: Object,
    type: 'error' | 'warning'
): React.Element<any> => {
    return <span
        key={str}
        className={SpruceClassName(classNameProps, 'FieldMessage-' + type)}
    >{str}</span>
};

const messagesAsList = (messages): List => {
    return fromJS(typeof messages === 'string' ? [messages] : messages).toList();
};

FieldMessage.defaultProps = {
    className: '',
    modifier: '',
    containerClassName: '',
    containerModifier: ''
}

export default FieldMessage;
