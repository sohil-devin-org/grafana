import { createContext, useContext, type ReactNode } from 'react';

import { type CommandPaletteAction, type DeepSearchDashboardResult } from './types';

export interface SearchResultsState {
  searchResults: CommandPaletteAction[];
  isFetchingSearchResults: boolean;
}

export interface DeepSearchResultsState {
  deepSearchResults: DeepSearchDashboardResult[];
  isFetchingDeepSearchResults: boolean;
}

/**
 * Extension point through which the host application injects its action sources
 * into the command palette. The palette owns the dialog, search input, result
 * rendering and keyboard navigation; everything app-specific (static navigation
 * actions, recent/searched dashboards, scopes, deep search) is provided here.
 *
 * All `use*` members are React hooks and must have a stable identity across
 * renders (define them once at module scope).
 */
export interface CommandPaletteExtensions {
  /** Registers static navigation/preference actions with kbar. */
  useRegisterStaticActions: () => void;
  /** Registers recently viewed dashboards as kbar actions. */
  useRegisterRecentDashboardsActions: () => void;
  /** Registers recently used scopes as kbar actions. */
  useRegisterRecentScopesActions: () => void;
  /** Registers scope-tree actions and optionally returns a row shown under the search input. */
  useRegisterScopesActions: (
    searchQuery: string,
    onApply: () => void,
    parentId?: string | null
  ) => { scopesRow?: ReactNode };
  /** Keyword search over dashboards and folders. */
  useSearchResults: (options: { searchQuery: string; show: boolean }) => SearchResultsState;
  /** Semantic (vector) dashboard search shown in the deep search column. */
  useDeepSearchResults: (options: { searchQuery: string; show: boolean; enabled: boolean }) => DeepSearchResultsState;
  /** Whether the deep search column is enabled. */
  useIsDeepSearchEnabled: () => boolean;
  /** Renders a badge for actions managed by an external system (provisioning). */
  renderManagedBadge?: (managedBy: string) => ReactNode;
}

export const defaultCommandPaletteExtensions: CommandPaletteExtensions = {
  useRegisterStaticActions: () => {},
  useRegisterRecentDashboardsActions: () => {},
  useRegisterRecentScopesActions: () => {},
  useRegisterScopesActions: () => ({ scopesRow: undefined }),
  useSearchResults: () => ({ searchResults: [], isFetchingSearchResults: false }),
  useDeepSearchResults: () => ({ deepSearchResults: [], isFetchingDeepSearchResults: false }),
  useIsDeepSearchEnabled: () => false,
};

export const CommandPaletteExtensionsContext = createContext<CommandPaletteExtensions>(defaultCommandPaletteExtensions);

export function useCommandPaletteExtensions(): CommandPaletteExtensions {
  return useContext(CommandPaletteExtensionsContext);
}
