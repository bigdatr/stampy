/* @flow */
/* eslint-disable no-unused-vars */

type ListOrArray = List<*> | Array<any>;

type Renderable = React.Element<any> | string | number | boolean | null;

type HockApplier = (ComposedComponent: ReactClass<any>) => ReactClass<any>;

type OnChange = (newValue: string|boolean) => void;

type OnClick = (event: Object) => void;

type Modifier = string | Object;
