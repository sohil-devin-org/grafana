import { throttle } from 'lodash';

import { getBackendSrv, locationService } from '@grafana/runtime';

import {
  type SupportBundle,
  type SupportBundleCollector,
  type SupportBundleCreateRequest,
  type SupportBundlesThunkDispatch,
  type SupportBundlesThunkResult,
} from '../types';

import {
  collectorsFetchBegin,
  collectorsFetchEnd,
  fetchBegin,
  fetchEnd,
  setCreateBundleError,
  setLoadBundleError,
  supportBundleCollectorsLoaded,
  supportBundlesLoaded,
} from './reducers';

export function loadBundles(skipPageRefresh = false): SupportBundlesThunkResult<void> {
  return async (dispatch) => {
    try {
      if (!skipPageRefresh) {
        dispatch(fetchBegin());
      }
      const result = await getBackendSrv().get<SupportBundle[]>('/api/support-bundles');
      dispatch(supportBundlesLoaded(result));
    } finally {
      dispatch(fetchEnd());
    }
  };
}

const checkBundlesStatusThrottled = throttle(async (dispatch: SupportBundlesThunkDispatch) => {
  const result = await getBackendSrv().get<SupportBundle[]>('/api/support-bundles');
  dispatch(supportBundlesLoaded(result));
}, 1000);

export function checkBundles(): SupportBundlesThunkResult<void> {
  return async (dispatch) => {
    dispatch(checkBundlesStatusThrottled);
  };
}

export function removeBundle(uid: string): SupportBundlesThunkResult<void> {
  return async (dispatch) => {
    await getBackendSrv().delete(`/api/support-bundles/${uid}`);
    dispatch(loadBundles(true));
  };
}

export function loadSupportBundleCollectors(): SupportBundlesThunkResult<void> {
  return async (dispatch) => {
    try {
      dispatch(collectorsFetchBegin());
      const result = await getBackendSrv().get<SupportBundleCollector[]>('/api/support-bundles/collectors');
      dispatch(supportBundleCollectorsLoaded(result));
    } catch (err) {
      dispatch(setLoadBundleError('Error loading support bundles data collectors'));
    } finally {
      dispatch(collectorsFetchEnd());
    }
  };
}

export function createSupportBundle(data: SupportBundleCreateRequest): SupportBundlesThunkResult<void> {
  return async (dispatch) => {
    try {
      await getBackendSrv().post('/api/support-bundles', data);
      locationService.push('/support-bundles');
    } catch (err) {
      dispatch(setCreateBundleError('Error creating support bundle'));
    }
  };
}
