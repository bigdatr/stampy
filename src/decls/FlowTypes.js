/* @flow */
/* eslint-disable no-unused-vars */

import {List} from 'immutable';

type ClassName = string;

type HockApplier = (ComposedComponent: ReactClass<any>) => ReactClass<any>;

type HockConfig = (props: Object) => Object;

type HtmlProps = Object;

type ListOrArray = List<*> | Array<any>;

type SpruceModifier = string | Object;

type OnChangeMeta = {
    event: Object,
    element: Object
};

type OnChange = (newValue: string, meta: OnChangeMeta) => void;

type OnChangeBoolean = (newValue: boolean, meta: OnChangeMeta) => void;

type OnChangeMulti = (newValues: Array<string>|string, meta: OnChangeMeta) => void;

type OnClick = (event: Object) => void;
