import { useForm } from 'react-hook-form';

import { Trans, t } from '@grafana/i18n';
import { useFlagGrafanaNewPreferencesPage } from '@grafana/runtime/internal';
import { Button, Field, FieldSet, Input, Stack } from '@grafana/ui';

import { getTeamsDependencies, TeamsAction } from './dependencies';
import { useUpdateTeam } from './hooks';
import { type Team } from './types';

interface Props {
  team: Team;
}

const TeamSettings = ({ team }: Props) => {
  const { contextSrv, SharedPreferences, TeamRolePicker, useRoleOptions } = getTeamsDependencies();
  const canWriteTeamSettings = contextSrv.hasPermissionInMetadata(TeamsAction.ActionTeamsWrite, team);
  const currentOrgId = contextSrv.user.orgId;
  const [updateTeam] = useUpdateTeam();

  const [{ roleOptions }] = useRoleOptions(currentOrgId);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<Team>({ defaultValues: team });

  const canUpdateRoles =
    contextSrv.hasPermission(TeamsAction.ActionTeamsRolesAdd) &&
    contextSrv.hasPermission(TeamsAction.ActionTeamsRolesRemove);

  const canListRoles =
    contextSrv.hasPermissionInMetadata(TeamsAction.ActionTeamsRolesList, team) &&
    contextSrv.hasPermission(TeamsAction.ActionRolesList);

  const onSubmit = async (formTeam: Team) => {
    return updateTeam({
      uid: team.uid,
      team: {
        name: formTeam.name,
        email: formTeam.email || '',
      },
    });
  };
  const newPrefsEnabled = useFlagGrafanaNewPreferencesPage();
  const teamResourceUri = newPrefsEnabled ? `team-${team.uid}` : `teams/${team.id}`;

  return (
    <Stack direction={'column'} gap={3}>
      <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: '600px' }}>
        <FieldSet label={t('teams.team-settings.label-team-details', 'Team details')}>
          <Stack direction="column" gap={2}>
            <Field
              noMargin
              label={t('teams.team-settings.label-numerical-identifier', 'Numerical identifier')}
              disabled={true}
            >
              <Input value={team.id} id="id-input" />
            </Field>
            <Field
              noMargin
              label={t('teams.team-settings.label-name', 'Name')}
              disabled={!canWriteTeamSettings || !!team.isProvisioned}
              required
              invalid={!!errors.name}
              error="Name is required"
            >
              <Input {...register('name', { required: true })} id="name-input" />
            </Field>

            {contextSrv.licensedAccessControlEnabled() && canListRoles && (
              <Field noMargin label={t('teams.team-settings.label-role', 'Role')}>
                <TeamRolePicker teamId={team.id} roleOptions={roleOptions} disabled={!canUpdateRoles} maxWidth="100%" />
              </Field>
            )}

            <Field
              noMargin
              label={t('teams.team-settings.label-email', 'Email')}
              description={t(
                'teams.team-settings.description-email',
                'This is optional and is primarily used to set the team profile avatar (via the Gravatar service)'
              )}
              disabled={!canWriteTeamSettings}
            >
              <Input
                {...register('email')}
                // eslint-disable-next-line @grafana/i18n/no-untranslated-strings
                placeholder="team@example.com"
                type="email"
                id="email-input"
              />
            </Field>
          </Stack>
        </FieldSet>
        <Button type="submit" disabled={!canWriteTeamSettings}>
          <Trans i18nKey="teams.team-settings.save">Save team details</Trans>
        </Button>
      </form>
      <SharedPreferences resourceUri={teamResourceUri} disabled={!canWriteTeamSettings} preferenceType="team" />
    </Stack>
  );
};

export default TeamSettings;
