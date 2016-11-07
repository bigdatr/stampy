/* @flow */
/* eslint-disable no-unused-vars */
import {List} from 'immutable';
import React from 'react';

/**
 * Either and Immutable List or a Javascript Array
 */
type ListOrArray = List<*> | Array<any>;

/**
 * Renderable Content
 */
type Renderable = React.Element<any> | string | number | boolean | null
