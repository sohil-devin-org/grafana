import type { JSX } from 'react';

import { type OrgRole } from '@grafana/data';
import { t } from '@grafana/i18n';
import { Label } from '@grafana/ui';

import { getServiceAccountsDeps } from '../deps';
import { AccessControlAction, type Role, type ServiceAccountDTO } from '../types';

import { OrgRolePicker } from './OrgRolePicker';

interface Props {
  label: string;
  serviceAccount: ServiceAccountDTO;
  onRoleChange: (role: OrgRole) => void;
  roleOptions: Role[];
}

export const ServiceAccountRoleRow = ({ label, serviceAccount, roleOptions, onRoleChange }: Props): JSX.Element => {
  const inputId = `${label}-input`;
  const { contextSrv, UserRolePicker } = getServiceAccountsDeps();
  const canUpdateRole = contextSrv.hasPermissionInMetadata(AccessControlAction.ServiceAccountsWrite, serviceAccount);

  return (
    <tr>
      <td>
        <Label htmlFor={inputId}>{label}</Label>
      </td>
      {contextSrv.licensedAccessControlEnabled() ? (
        <td colSpan={3}>
          <UserRolePicker
            userId={serviceAccount.id}
            orgId={serviceAccount.orgId}
            basicRole={serviceAccount.role}
            onBasicRoleChange={onRoleChange}
            roleOptions={roleOptions}
            basicRoleDisabled={!canUpdateRole}
            disabled={serviceAccount.isExternal || serviceAccount.isDisabled}
          />
        </td>
      ) : (
        <>
          <td>
            <OrgRolePicker
              width={24}
              inputId={inputId}
              aria-label={t('serviceaccounts.service-account-role-row.aria-label-role', 'Role')}
              value={serviceAccount.role}
              disabled={serviceAccount.isExternal || serviceAccount.isDisabled}
              onChange={onRoleChange}
            />
          </td>
          <td colSpan={2}></td>
        </>
      )}
    </tr>
  );
};
