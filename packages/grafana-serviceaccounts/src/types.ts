import { type PayloadAction, type ThunkAction } from '@reduxjs/toolkit';

import { type OrgRole, type TimeZone, type WithAccessControlMetadata } from '@grafana/data';

export interface Role {
  uid: string;
  name: string;
  displayName: string;
  description: string;
  group: string;
  global?: boolean;
  delegatable?: boolean;
  mapped?: boolean;
  hidden?: boolean;
  version: number;
  created: string;
  updated: string;
  filteredDisplayName: string; // name to be shown in filtered role list
}

export interface ApiKey extends WithAccessControlMetadata {
  id?: number;
  name: string;
  role: OrgRole;
  secondsToLive: number | null;
  expiration?: string;
  secondsUntilExpiration?: number;
  hasExpired?: boolean;
  isRevoked?: boolean;
  created?: string;
  lastUsedAt?: string;
}

// Subset of the Grafana access control actions used by the service accounts feature.
export enum AccessControlAction {
  ServiceAccountsRead = 'serviceaccounts:read',
  ServiceAccountsCreate = 'serviceaccounts:create',
  ServiceAccountsWrite = 'serviceaccounts:write',
  ServiceAccountsDelete = 'serviceaccounts:delete',
  ServiceAccountsPermissionsRead = 'serviceaccounts.permissions:read',
  ServiceAccountsPermissionsWrite = 'serviceaccounts.permissions:write',
  ActionRolesList = 'roles:read',
  ActionUserRolesList = 'users.roles:read',
  ActionUserRolesAdd = 'users.roles:add',
  ActionUserRolesRemove = 'users.roles:remove',
}

export interface ServiceAccountDTO extends WithAccessControlMetadata {
  id: number;
  uid: string;
  orgId: number;
  tokens: number;
  name: string;
  login: string;
  avatarUrl?: string;
  createdAt: string;
  isDisabled: boolean;
  isExternal?: boolean;
  requiredBy?: string;
  teams: string[];
  role: OrgRole;
  roles?: Role[];
}

export interface ServiceAccountCreateApiResponse {
  avatarUrl?: string;
  id: number;
  uid: string;
  isDisabled: boolean;
  login: string;
  name: string;
  orgId: number;
  role: OrgRole;
  tokens: number;
}

export interface ServiceAccountProfileState {
  serviceAccount: ServiceAccountDTO;
  isLoading: boolean;
  rolesLoading?: boolean;
  tokens: ApiKey[];
}

export enum ServiceAccountStateFilter {
  All = 'All',
  WithExpiredTokens = 'WithExpiredTokens',
  External = 'External',
  Disabled = 'Disabled',
}

export interface ServiceAccountsState {
  serviceAccounts: ServiceAccountDTO[];
  isLoading: boolean;
  roleOptions: Role[];

  // search / filtering
  query: string;
  perPage: number;
  page: number;
  totalPages: number;
  showPaging: boolean;
  serviceAccountStateFilter: ServiceAccountStateFilter;
}

// Minimal shape of the host app's redux store that this feature relies on.
export interface ServiceAccountsRootState {
  serviceAccounts: ServiceAccountsState;
  serviceAccountProfile: ServiceAccountProfileState;
  user: { timeZone?: TimeZone };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ThunkResult<R> = ThunkAction<R, ServiceAccountsRootState, undefined, PayloadAction<any>>;
