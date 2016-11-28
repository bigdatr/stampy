/* @flow */
/* eslint-disable no-unused-vars */
import {List} from 'immutable';
import React from 'react';

type ListOrArray = List<*> | Array<any>;

type Renderable = React.Element<any> | string | number | boolean | null;

type HockApplier = (ComposedComponent: ReactClass<any>) => ReactClass<any>;

type onChangeMeta = {
    event: Object,
    element: Object
}

type OnChange = (newValue: string|boolean, meta: onChangeMeta) => void;

type OnClick = (event: Object) => void;

type Modifier = string | Object;
