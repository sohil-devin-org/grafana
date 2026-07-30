/* eslint-disable no-restricted-imports */
import { type Action } from '@reduxjs/toolkit';
import {
  type TypedUseSelectorHook,
  useDispatch as useDispatchUntyped,
  useSelector as useSelectorUntyped,
} from 'react-redux';
import { type ThunkAction, type ThunkDispatch } from 'redux-thunk';

import { type AuthConfigState } from './types';

/**
 * The slice of the host application's redux state that this package operates
 * on. The host app registers `authConfigReducers` under the `authConfig` key.
 */
export interface AuthConfigStoreState {
  authConfig: AuthConfigState;
}

export type ThunkResult<R> = ThunkAction<R, AuthConfigStoreState, undefined, Action>;

export const useDispatch: () => ThunkDispatch<AuthConfigStoreState, undefined, Action> = useDispatchUntyped;
export const useSelector: TypedUseSelectorHook<AuthConfigStoreState> = useSelectorUntyped;
