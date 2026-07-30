import { getTeamsDependencies, TeamsAction } from './dependencies';
import { type Team } from './types';

type TeamPermissionsProps = {
  team: Team;
};

// TeamPermissions component replaces TeamMembers component when the accesscontrol feature flag is set
const TeamPermissions = (props: TeamPermissionsProps) => {
  const { contextSrv, Permissions } = getTeamsDependencies();
  let canSetPermissions = contextSrv.hasPermissionInMetadata(TeamsAction.ActionTeamsPermissionsWrite, props.team);

  if (props.team.isProvisioned) {
    canSetPermissions = false;
  }

  return (
    <Permissions
      addPermissionTitle="Add member"
      buttonLabel="Add member"
      emptyLabel="There are no members in this team or you do not have the permissions to list the current members."
      resource="teams"
      resourceId={props.team.id}
      canSetPermissions={canSetPermissions}
    />
  );
};

export default TeamPermissions;
