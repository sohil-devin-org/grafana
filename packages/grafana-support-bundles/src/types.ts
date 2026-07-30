import { type ThunkAction, type ThunkDispatch, type UnknownAction } from '@reduxjs/toolkit';

type SupportBundleState = 'complete' | 'error' | 'timeout' | 'pending';

export interface SupportBundle {
  uid: string;
  state: SupportBundleState;
  creator: string;
  createdAt: number;
  expiresAt: number;
}

export interface SupportBundlesState {
  supportBundles: SupportBundle[];
  isLoading: boolean;
  createBundlePageLoading: boolean;
  supportBundleCollectors: SupportBundleCollector[];
  loadBundlesError: string;
  createBundleError: string;
}

export interface SupportBundleCollector {
  uid: string;
  displayName: string;
  description: string;
  includedByDefault: boolean;
  default: boolean;
}

export interface SupportBundleCreateRequest {
  collectors: string[];
}

/**
 * Minimal shape of the app store this feature depends on. The app's full
 * StoreState is structurally assignable to this, so thunks typed against it
 * can be dispatched from the app store.
 */
export interface SupportBundlesRootState {
  supportBundles: SupportBundlesState;
}

export type SupportBundlesThunkResult<R> = ThunkAction<R, SupportBundlesRootState, undefined, UnknownAction>;

export type SupportBundlesThunkDispatch = ThunkDispatch<SupportBundlesRootState, undefined, UnknownAction>;
