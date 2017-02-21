/* @flow */
/* eslint-disable no-unused-vars */

import {List} from 'immutable';

type ClassName = string;

type HockApplier = (ComposedComponent: ReactClass<any>) => ReactClass<any>;

type HtmlProps = Object;

type ListOrArray = List<*> | Array<any>;

type SpruceModifier = string | Object;

type OnChangeMeta = {
    event: Object,
    element: Object
}

type OnChange = (newValue: string|boolean, meta: OnChangeMeta) => void;

type OnChangeMulti = (newValue: Array<string|boolean>, meta: OnChangeMeta) => void;

type OnClick = (event: Object) => void;
