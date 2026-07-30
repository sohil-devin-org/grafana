import { type NavModelItem, type NavModel } from '@grafana/data';
import { t } from '@grafana/i18n';
import { config, featureEnabled } from '@grafana/runtime';

import { getTeamsDependencies, TeamsAction } from '../dependencies';
import { type Team } from '../types';

// Same value as the app's TeamPermissionLevel.Member
const TEAM_PERMISSION_LEVEL_MEMBER = 0;

const loadingTeam = {
  avatarUrl: '',
  id: 1,
  uid: '',
  name: 'Loading',
  email: 'loading',
  memberCount: 0,
  permission: TEAM_PERMISSION_LEVEL_MEMBER,
  accessControl: { isEditor: false },
  orgId: 0,
  updated: '',
  isProvisioned: false,
};

export function buildNavModel(team: Team): NavModelItem {
  const { contextSrv, highlightTrial, proBadge, userProfilePngUrl } = getTeamsDependencies();
  // Means team is not loaded yet and we have just a placeholder team object
  const isLoadingTeam = team === loadingTeam;

  const navModel: NavModelItem = {
    img: isLoadingTeam ? userProfilePngUrl : team.avatarUrl,
    id: 'team-' + team.uid,
    subTitle: t('teams.build-nav-model.nav-model.subTitle.manage-members-and-settings', 'Manage members and settings'),
    url: `org/teams/edit/${team.uid}`,
    text: team.name,
    children: [
      // With RBAC this tab will always be available (but not always editable)
      // With Legacy it will be hidden by hideTabsFromNonTeamAdmin should the user not be allowed to see it
      {
        active: false,
        icon: 'sliders-v-alt',
        id: `team-settings-${team.uid}`,
        text: t('teams.build-nav-model.nav-model.text.settings', 'Settings'),
        url: `org/teams/edit/${team.uid}/settings`,
      },
    ],
  };

  // While team is loading we leave the members tab
  // With RBAC the Members tab is available when user has ActionTeamsPermissionsRead for this team
  // With Legacy it will always be present
  if (isLoadingTeam || contextSrv.hasPermissionInMetadata(TeamsAction.ActionTeamsPermissionsRead, team)) {
    navModel.children!.unshift({
      active: false,
      icon: 'users-alt',
      id: `team-members-${team.uid}`,
      text: t('teams.build-nav-model.text.members', 'Members'),
      url: `org/teams/edit/${team.uid}/members`,
    });
  }

  const teamGroupSync: NavModelItem = {
    active: false,
    icon: 'sync',
    id: `team-groupsync-${team.uid}`,
    text: t('teams.build-nav-model.team-group-sync.text.external-group-sync', 'External group sync'),
    url: `org/teams/edit/${team.uid}/groupsync`,
  };

  if (highlightTrial()) {
    teamGroupSync.tabSuffix = () =>
      proBadge({ experimentId: isLoadingTeam ? '' : 'feature-highlights-team-sync-badge', eventVariant: 'trial' });
  }

  // With both Legacy and RBAC the tab is protected being featureEnabled
  // While team is loading we leave the teamsync tab
  // With RBAC the External Group Sync tab is available when user has ActionTeamsPermissionsRead for this team
  if (featureEnabled('teamsync')) {
    if (isLoadingTeam || contextSrv.hasPermissionInMetadata(TeamsAction.ActionTeamsPermissionsRead, team)) {
      navModel.children!.push(teamGroupSync);
    }
  } else if (config.featureToggles.featureHighlights) {
    navModel.children!.push({
      ...teamGroupSync,
      tabSuffix: () => proBadge({ experimentId: isLoadingTeam ? '' : 'feature-highlights-team-sync-badge' }),
    });
  }

  // Section for team folders tab
  if (
    // If team is loading we won't show this which is probably fine so we don't end up with bad urls.
    !isLoadingTeam &&
    contextSrv.hasPermissionInMetadata(TeamsAction.ActionTeamsRead, team)
  ) {
    // Add it after settings tab
    // TODO: this array construction could probably be simplified so we don't have to do random splicing and unshifts
    const settingsTabIndex = navModel.children!.findIndex((child) => child.id === `team-settings-${team.uid}`);
    navModel.children!.splice(settingsTabIndex + 1, 0, {
      active: false,
      icon: 'folder-open',
      id: `team-folders-${team.uid}`,
      text: t('teams.build-nav-model.team-folders.text.folders', 'Folders'),
      url: `org/teams/edit/${team.uid}/folders`,
    });
  }

  return navModel;
}

export function getTeamLoadingNav(pageName: string): NavModel {
  const main = buildNavModel(loadingTeam);

  let node: NavModelItem;

  // find active page
  for (const child of main.children!) {
    if (child.id!.indexOf(pageName) > 0) {
      child.active = true;
      node = child;
      break;
    }
  }

  return {
    main: main,
    node: node!,
  };
}
