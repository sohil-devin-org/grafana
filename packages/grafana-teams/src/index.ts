export {
  getTeamsDependencies,
  setTeamsDependencies,
  TeamsAction,
  type Role,
  type TeamsContextSrv,
  type TeamsDependencies,
  type WithAccessControlMetadata,
} from './dependencies';
export { type Team, type TeamDTO, type TeamWithRoles } from './types';

export { TeamDeleteModal } from './TeamDeleteModal';
export { TeamFolders } from './TeamFolders';
export { default as TeamGroupSync, TeamSyncUpgradeContent } from './TeamGroupSync';
export { default as TeamList } from './TeamList';
export { default as TeamPages } from './TeamPages';
export { default as TeamPermissions } from './TeamPermissions';
export { default as TeamSettings } from './TeamSettings';
export { default as CreateTeam } from './create-team/CreateTeam';

export {
  canUpdateRoles,
  useDeleteTeam,
  useGetTeam,
  useGetTeamByUidQuery,
  useGetTeams,
  useLazyGetTeamByUidQuery,
  useLazySearchTeamsQuery,
  useUpdateTeam,
} from './hooks';
export { buildNavModel, getTeamLoadingNav } from './state/navModel';
