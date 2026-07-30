import { getServiceAccountsDeps } from './deps';
import { AccessControlAction, type ServiceAccountDTO } from './types';

type ServiceAccountPermissionsProps = {
  serviceAccount: ServiceAccountDTO;
};

export const ServiceAccountPermissions = (props: ServiceAccountPermissionsProps) => {
  const { contextSrv, Permissions } = getServiceAccountsDeps();
  const canSetPermissions = contextSrv.hasPermissionInMetadata(
    AccessControlAction.ServiceAccountsPermissionsWrite,
    props.serviceAccount
  );

  return (
    <Permissions
      addPermissionTitle="Add permission"
      buttonLabel="Add permission"
      resource="serviceaccounts"
      resourceId={props.serviceAccount.uid}
      canSetPermissions={canSetPermissions}
    />
  );
};
