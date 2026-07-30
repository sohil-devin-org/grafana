import { memo, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom-v5-compat';

import { config, featureEnabled } from '@grafana/runtime';

import { TeamFolders } from './TeamFolders';
import TeamGroupSync, { TeamSyncUpgradeContent } from './TeamGroupSync';
import TeamPermissions from './TeamPermissions';
import TeamSettings from './TeamSettings';
import { getTeamsDependencies, TeamsAction } from './dependencies';
import { useGetTeam } from './hooks';
import { getTeamLoadingNav } from './state/navModel';

type TeamPageRouteParams = {
  uid: string;
  page?: string;
};

enum PageTypes {
  Members = 'members',
  Settings = 'settings',
  Folders = 'folders',
  GroupSync = 'groupsync',
}

function getPageType(page: string | undefined): PageTypes | undefined {
  switch (page) {
    case PageTypes.Members:
      return PageTypes.Members;
    case PageTypes.Settings:
      return PageTypes.Settings;
    case PageTypes.Folders:
      return PageTypes.Folders;
    case PageTypes.GroupSync:
      return PageTypes.GroupSync;
    default:
      return undefined;
  }
}

const TeamPages = memo(() => {
  const { contextSrv, Page, UpgradeBox, useNavModel } = getTeamsDependencies();
  const isSyncEnabled = useRef(featureEnabled('teamsync'));
  const { uid: teamUid = '', page } = useParams<TeamPageRouteParams>();

  const { data: team, isLoading } = useGetTeam({ uid: teamUid });

  let defaultPage = PageTypes.Members;
  // With RBAC the settings page will always be available
  if (!team || !contextSrv.hasPermissionInMetadata(TeamsAction.ActionTeamsPermissionsRead, team)) {
    defaultPage = PageTypes.Settings;
  }
  const currentPage = getPageType(page) ?? defaultPage;
  const teamLoadingNav = useMemo(() => getTeamLoadingNav(currentPage), [currentPage]);
  const pageNav = useNavModel(`team-${currentPage}-${teamUid}`, teamLoadingNav).main;

  const renderPage = () => {
    const canReadTeam = contextSrv.hasPermissionInMetadata(TeamsAction.ActionTeamsRead, team!);
    const canReadTeamPermissions = contextSrv.hasPermissionInMetadata(TeamsAction.ActionTeamsPermissionsRead, team!);
    const canWriteTeamPermissions = contextSrv.hasPermissionInMetadata(TeamsAction.ActionTeamsPermissionsWrite, team!);

    switch (currentPage) {
      case PageTypes.Members:
        if (canReadTeamPermissions) {
          return <TeamPermissions team={team!} />;
        }
        return null;
      case PageTypes.Settings:
        return canReadTeam && <TeamSettings team={team!} />;
      case PageTypes.Folders:
        return canReadTeam && <TeamFolders teamUid={teamUid} />;
      case PageTypes.GroupSync:
        if (isSyncEnabled.current) {
          if (canReadTeamPermissions) {
            return <TeamGroupSync isReadOnly={!canWriteTeamPermissions} teamUid={teamUid} />;
          }
        } else if (config.featureToggles.featureHighlights) {
          return (
            <>
              <UpgradeBox featureName={'team sync'} featureId={'team-sync'} />
              <TeamSyncUpgradeContent />
            </>
          );
        }
    }

    return null;
  };

  return (
    <Page navId="teams" pageNav={pageNav}>
      <Page.Contents isLoading={isLoading}>{team && Object.keys(team).length !== 0 && renderPage()}</Page.Contents>
    </Page>
  );
});

TeamPages.displayName = 'TeamPages';

export default TeamPages;
