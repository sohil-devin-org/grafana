import { useCallback } from 'react';

import { type NavModel, type NavModelItem } from '@grafana/data';
import { setTeamsDependencies } from '@grafana/teams';
import { useCreateFolder } from 'app/api/clients/folder/v1beta1/hooks';
import { extractErrorMessage } from 'app/api/utils';
import { appEvents } from 'app/core/app_events';
import { Permissions } from 'app/core/components/AccessControl/Permissions';
import { SlideDown } from 'app/core/components/Animations/SlideDown';
import { CloseButton } from 'app/core/components/CloseButton/CloseButton';
import EmptyListCTA from 'app/core/components/EmptyListCTA/EmptyListCTA';
import { Page } from 'app/core/components/Page/Page';
import { TeamRolePicker } from 'app/core/components/RolePicker/TeamRolePicker';
import { fetchRoleOptions } from 'app/core/components/RolePicker/api';
import { useRoleOptions } from 'app/core/components/RolePicker/hooks';
import { SharedPreferences } from 'app/core/components/SharedPreferences/SharedPreferences';
import { ProBadge } from 'app/core/components/Upgrade/ProBadge';
import { UpgradeBox, UpgradeContent } from 'app/core/components/Upgrade/UpgradeBox';
import { useAppNotification } from 'app/core/copy/appNotification';
import { updateNavIndex } from 'app/core/reducers/navModel';
import { getNavModel } from 'app/core/selectors/navModel';
import { contextSrv } from 'app/core/services/context_srv';
import { getMessageFromError } from 'app/core/utils/errors';
import { addFilteredDisplayName } from 'app/core/utils/roles';
import { EnterpriseAuthFeaturesCard } from 'app/features/admin/EnterpriseAuthFeaturesCard';
import { highlightTrial } from 'app/features/admin/utils';
import { ShowModalReactEvent } from 'app/types/events';
import { useDispatch, useSelector } from 'app/types/store';
import userProfilePng from 'img/user_profile.png';

function useTeamsNavModel(id: string, fallback: NavModel): NavModel {
  return useSelector((state) => getNavModel(state.navIndex, id, fallback));
}

function useUpdateNavIndex() {
  const dispatch = useDispatch();
  return useCallback(
    (item: NavModelItem) => {
      dispatch(updateNavIndex(item));
    },
    [dispatch]
  );
}

function useTeamsCreateFolder() {
  const [trigger] = useCreateFolder();
  return [
    async (folder: { title: string; teamOwnerReferences?: Array<{ uid: string; name: string }> }) => {
      const result = await trigger(folder);
      return { data: result.data ? { url: result.data.url } : undefined, error: result.error };
    },
  ] as const;
}

/**
 * Wires app-shell services and components into the extracted @grafana/teams package.
 * Must run before any of the package's components or hooks are used, so it is imported
 * for its side effect from the app routes registration.
 */
setTeamsDependencies({
  contextSrv,
  Page,
  TeamRolePicker,
  Permissions,
  SharedPreferences,
  SlideDown,
  CloseButton,
  EmptyListCTA,
  UpgradeBox,
  UpgradeContent,
  EnterpriseAuthFeaturesCard,
  proBadge: (props) => ProBadge(props),
  highlightTrial,
  fetchRoleOptions: () => fetchRoleOptions(),
  useRoleOptions,
  useAppNotification,
  showModal: (component, props) => {
    appEvents.publish(new ShowModalReactEvent({ component, props }));
  },
  useNavModel: useTeamsNavModel,
  useUpdateNavIndex,
  useCreateFolder: useTeamsCreateFolder,
  extractErrorMessage,
  getMessageFromError,
  addFilteredDisplayName,
  userProfilePngUrl: userProfilePng,
});

// eslint-disable-next-line no-barrel-files/no-barrel-files
export * from '@grafana/teams';
