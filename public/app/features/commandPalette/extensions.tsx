import { type CommandPaletteExtensions } from '@grafana/command-palette';
import { useFlagDashboardVectorSearch, useFlagGrafanaVectorSearchCmdk } from '@grafana/runtime/internal';
import { type ManagerKind } from 'app/features/apiserver/types';
import { ManagedBadge } from 'app/features/provisioning/components/ManagedBadge';

import { useSearchResults } from './actions/dashboardActions';
import { useDeepSearchResults } from './actions/deepSearchActions';
import { useRegisterRecentDashboardsActions, useRegisterStaticActions } from './actions/useActions';
import { useRegisterRecentScopesActions, useRegisterScopesActions } from './scopes/scopeActions';

// Both the backend vector-search endpoint flag and the command-palette flag are required
function useIsDeepSearchEnabled(): boolean {
  const dashboardVectorSearchEnabled = useFlagDashboardVectorSearch();
  const vectorSearchCmdkEnabled = useFlagGrafanaVectorSearchCmdk();
  return dashboardVectorSearchEnabled && vectorSearchCmdkEnabled;
}

/**
 * Wires Grafana's app-specific action sources (static navigation actions, dashboard
 * search, scopes, deep search, provisioning badge) into the @grafana/command-palette
 * extension point.
 */
export const commandPaletteExtensions: CommandPaletteExtensions = {
  useRegisterStaticActions,
  useRegisterRecentDashboardsActions,
  useRegisterRecentScopesActions,
  useRegisterScopesActions,
  useSearchResults,
  useDeepSearchResults,
  useIsDeepSearchEnabled,
  // The package models managedBy as a plain string; the values always come from ManagerKind
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  renderManagedBadge: (managedBy) => <ManagedBadge managerKind={managedBy as ManagerKind} />,
};
