import { useRegisterActions } from 'kbar';
import { useEffect, useMemo, useState } from 'react';

import { type CommandPaletteAction, useExtensionActions } from '@grafana/command-palette';

import { getRecentDashboardActions } from './dashboardActions';
import { useStaticActions } from './staticActions';

/**
 * Register navigation actions to different parts of grafana or some preferences stuff like themes.
 */
export function useRegisterStaticActions() {
  const extensionActions = useExtensionActions();
  const staticActions = useStaticActions();

  const navTreeActions = useMemo(() => {
    return [...staticActions, ...extensionActions];
  }, [staticActions, extensionActions]);

  useRegisterActions(navTreeActions, [navTreeActions]);
}

export function useRegisterRecentDashboardsActions() {
  const [recentDashboardActions, setRecentDashboardActions] = useState<CommandPaletteAction[]>([]);
  useEffect(() => {
    getRecentDashboardActions()
      .then((recentDashboardActions) => setRecentDashboardActions(recentDashboardActions))
      .catch((err) => {
        console.error('Error loading recent dashboard actions', err);
      });
  }, []);

  useRegisterActions(recentDashboardActions, [recentDashboardActions]);
}
