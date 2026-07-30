import { type ComponentType, type ReactNode } from 'react';

import { type NavModelItem, type OrgRole, type WithAccessControlMetadata } from '@grafana/data';

import { type Role } from './types';

export interface ContextSrvLike {
  user: { orgId: number };
  hasPermission(action: string): boolean;
  hasPermissionInMetadata(action: string, object: WithAccessControlMetadata): boolean;
  licensedAccessControlEnabled(): boolean;
  fetchUserPermissions(): Promise<void>;
}

export interface PageProps {
  navId?: string;
  pageNav?: NavModelItem;
  subTitle?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
}

export interface PageContentsProps {
  isLoading?: boolean;
  children: ReactNode;
}

export type PageComponent = ComponentType<PageProps> & { Contents: ComponentType<PageContentsProps> };

export interface UserRolePickerProps {
  basicRole: OrgRole;
  roles?: Role[];
  userId: number;
  orgId?: number;
  onBasicRoleChange: (newRole: OrgRole) => void;
  roleOptions: Role[];
  disabled?: boolean;
  basicRoleDisabled?: boolean;
  basicRoleDisabledMessage?: string;
  apply?: boolean;
  onApplyRoles?: (newRoles: Role[], userId: number, orgId: number | undefined) => void;
  pendingRoles?: Role[];
  maxWidth?: string | number;
  width?: string | number;
  isLoading?: boolean;
}

export interface PermissionsProps {
  addPermissionTitle?: string;
  buttonLabel?: string;
  resource: string;
  resourceId: string | number;
  canSetPermissions: boolean;
}

/**
 * App services and components that are too entangled with the host app
 * (redux store, navigation chrome, RBAC pickers) to live in this package.
 * The host app wires them in via {@link setServiceAccountsDeps} before
 * rendering any of the exported pages.
 */
export interface ServiceAccountsDeps {
  contextSrv: ContextSrvLike;
  Page: PageComponent;
  UserRolePicker: ComponentType<UserRolePickerProps>;
  RolePickerSelect: ComponentType;
  Permissions: ComponentType<PermissionsProps>;
  fetchRoleOptions: (orgId?: number) => Promise<Role[]>;
  updateUserRoles: (roles: Role[], userId: number, orgId?: number) => Promise<unknown>;
}

let deps: ServiceAccountsDeps | undefined;

export function setServiceAccountsDeps(newDeps: ServiceAccountsDeps): void {
  deps = newDeps;
}

export function getServiceAccountsDeps(): ServiceAccountsDeps {
  if (!deps) {
    throw new Error(
      '@grafana/serviceaccounts dependencies have not been initialized. Call setServiceAccountsDeps() before rendering.'
    );
  }
  return deps;
}
