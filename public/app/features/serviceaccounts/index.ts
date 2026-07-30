import { setServiceAccountsDeps } from '@grafana/serviceaccounts';
import { Permissions } from 'app/core/components/AccessControl/Permissions';
import { Page } from 'app/core/components/Page/Page';
import { UserRolePicker } from 'app/core/components/RolePicker/UserRolePicker';
import { fetchRoleOptions, updateUserRoles } from 'app/core/components/RolePicker/api';
import { RolePickerSelect } from 'app/core/components/RolePickerDrawer/RolePickerSelect';
import { contextSrv } from 'app/core/services/context_srv';

// Wires app-specific services into the @grafana/serviceaccounts package.
setServiceAccountsDeps({
  contextSrv,
  Page,
  UserRolePicker,
  RolePickerSelect,
  Permissions,
  fetchRoleOptions,
  updateUserRoles,
});
