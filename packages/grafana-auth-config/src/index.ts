import { type AuthProviderInfo, type GetStatusHook, type AuthProviderStatus } from './types';

const registeredAuthProviders: AuthProviderInfo[] = [];
const authProvidersConfigHooks: Record<string, GetStatusHook> = {};

export function registerAuthProvider(provider: AuthProviderInfo, getConfigHook?: GetStatusHook) {
  if (!registeredAuthProviders.find((p) => p.id === provider.id)) {
    registeredAuthProviders.push(provider);
    if (getConfigHook) {
      authProvidersConfigHooks[provider.id] = getConfigHook;
    }
  }
}

export function getRegisteredAuthProviders(): AuthProviderInfo[] {
  return registeredAuthProviders;
}

export async function getAuthProviderStatus(providerId: string): Promise<AuthProviderStatus> {
  if (authProvidersConfigHooks[providerId]) {
    const getStatusHook = authProvidersConfigHooks[providerId];
    return getStatusHook();
  }
  return { configured: false, enabled: false };
}

export { setAuthConfigDeps, type AuthConfigDeps } from './deps';
export { type AuthConfigStoreState } from './store';
export * from './types';

export { default as AuthProvidersListPage } from './AuthProvidersListPage';
export { default as ProviderConfigPage } from './ProviderConfigPage';
export { ProviderConfigForm } from './ProviderConfigForm';
export { default as authConfigReducers } from './state/reducers';
export { loadSettings, loadProviders, saveSettings } from './state/actions';
