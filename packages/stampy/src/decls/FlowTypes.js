/* @flow */
/* eslint-disable no-unused-vars */

import type {ComponentType} from 'react';
import type {Node} from 'react';
import type {List} from 'immutable';

type ClassName = string;

type HockApplier = (ComposedComponent: ComponentType<any>) => ComponentType<any>;

type HockConfig = (props: Object) => Object;

type HtmlProps = Object;

type ListOrArray = List<*> | Array<any>;

type SpruceModifier = string | Object;

type SprucePeer= string | Object;

type OnChangeMeta = {
    event: Object,
    element: Object
};

type OnChange = (newValue: string, meta: OnChangeMeta) => void;

type OnChangeBoolean = (newValue: boolean, meta: OnChangeMeta) => void;

type OnChangeMulti = (newValues: Array<string>|string, meta: OnChangeMeta) => void;

type OnClick = (event: Object) => void;

type ValueChangePair = List<string> | Array<string>;

type ValueChangePairList = List<string>;

type NodeThunk = () => Node;
