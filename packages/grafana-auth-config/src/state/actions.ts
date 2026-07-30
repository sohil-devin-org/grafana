import { lastValueFrom } from 'rxjs';

import { getBackendSrv, isFetchError } from '@grafana/runtime';

import { getAuthProviderStatus, getRegisteredAuthProviders } from '..';
import { getAuthConfigDeps } from '../deps';
import { type ThunkResult } from '../store';
import {
  type AuthProviderStatus,
  type Settings,
  type SettingsError,
  type SSOProvider,
  type UpdateSettingsQuery,
} from '../types';

import {
  loadingBegin,
  loadingEnd,
  providersLoaded,
  providerStatusesLoaded,
  resetError,
  setError,
  settingsUpdated,
} from './reducers';

const SETTINGS_READ_ACTION = 'settings:read';
const SETTINGS_WRITE_ACTION = 'settings:write';

export function loadSettings(showSpinner = true): ThunkResult<Promise<Settings>> {
  return async (dispatch) => {
    if (getAuthConfigDeps().contextSrv.hasPermission(SETTINGS_READ_ACTION)) {
      if (showSpinner) {
        dispatch(loadingBegin());
      }
      dispatch(loadProviders());
      const result = await getBackendSrv().get('/api/admin/settings');
      dispatch(settingsUpdated(result));
      await dispatch(loadProviderStatuses());
      if (showSpinner) {
        dispatch(loadingEnd());
      }
      return result;
    }
  };
}

export function loadProviders(provider = ''): ThunkResult<Promise<SSOProvider[]>> {
  return async (dispatch) => {
    const result = await getBackendSrv().get(`/api/v1/sso-settings${provider ? `/${provider}` : ''}`);
    dispatch(providersLoaded(provider ? [result] : result));
    return result;
  };
}

function loadProviderStatuses(): ThunkResult<void> {
  return async (dispatch) => {
    const registeredProviders = getRegisteredAuthProviders();
    const providerStatuses: Record<string, AuthProviderStatus> = {};
    const getStatusPromises: Array<Promise<AuthProviderStatus>> = [];
    for (const provider of registeredProviders) {
      getStatusPromises.push(getAuthProviderStatus(provider.id));
    }
    const statuses = await Promise.all(getStatusPromises);
    for (let i = 0; i < registeredProviders.length; i++) {
      const provider = registeredProviders[i];
      providerStatuses[provider.id] = statuses[i];
    }
    dispatch(providerStatusesLoaded(providerStatuses));
  };
}

export function saveSettings(data: UpdateSettingsQuery): ThunkResult<Promise<boolean>> {
  return async (dispatch) => {
    if (getAuthConfigDeps().contextSrv.hasPermission(SETTINGS_WRITE_ACTION)) {
      try {
        await lastValueFrom(
          getBackendSrv().fetch({
            url: '/api/admin/settings',
            method: 'PUT',
            data,
            showSuccessAlert: false,
            showErrorAlert: false,
          })
        );
        dispatch(resetError());
        return true;
      } catch (error) {
        console.log(error);
        if (isFetchError(error)) {
          error.isHandled = true;
          const updateErr: SettingsError = {
            message: error.data?.message,
            errors: error.data?.errors,
          };
          dispatch(setError(updateErr));
          return false;
        }
      }
    }
    return false;
  };
}
