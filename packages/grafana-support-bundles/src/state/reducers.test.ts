import { type SupportBundle, type SupportBundleCollector, type SupportBundlesState } from '../types';

import {
  supportBundlesReducers,
  supportBundlesLoaded,
  fetchBegin,
  fetchEnd,
  supportBundleCollectorsLoaded,
  setLoadBundleError,
  setCreateBundleError,
} from './reducers';

const reducer = supportBundlesReducers.supportBundles;

const initialState: SupportBundlesState = reducer(undefined, { type: '@@INIT' });

describe('supportBundles reducer', () => {
  it('has the expected initial state', () => {
    expect(initialState).toEqual({
      supportBundles: [],
      isLoading: false,
      supportBundleCollectors: [],
      createBundlePageLoading: false,
      loadBundlesError: '',
      createBundleError: '',
    });
  });

  it('stores loaded bundles and clears loading state', () => {
    const bundles: SupportBundle[] = [{ uid: 'abc', state: 'complete', creator: 'admin', createdAt: 1, expiresAt: 2 }];
    const state = reducer({ ...initialState, isLoading: true }, supportBundlesLoaded(bundles));
    expect(state.supportBundles).toEqual(bundles);
    expect(state.isLoading).toBe(false);
  });

  it('tracks fetch begin/end', () => {
    const loading = reducer(initialState, fetchBegin());
    expect(loading.isLoading).toBe(true);
    expect(reducer(loading, fetchEnd()).isLoading).toBe(false);
  });

  it('stores loaded collectors', () => {
    const collectors: SupportBundleCollector[] = [
      { uid: 'basic', displayName: 'Basic', description: '', includedByDefault: true, default: true },
    ];
    const state = reducer(
      { ...initialState, createBundlePageLoading: true },
      supportBundleCollectorsLoaded(collectors)
    );
    expect(state.supportBundleCollectors).toEqual(collectors);
    expect(state.createBundlePageLoading).toBe(false);
  });

  it('stores errors', () => {
    expect(reducer(initialState, setLoadBundleError('load error')).loadBundlesError).toBe('load error');
    expect(reducer(initialState, setCreateBundleError('create error')).createBundleError).toBe('create error');
  });
});
