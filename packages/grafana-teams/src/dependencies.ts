import { type ComponentType, type HTMLAttributes, type ReactElement, type ReactNode } from 'react';

import { type RoleDto } from '@grafana/api-clients/internal/rtkq/legacy';
import { type NavModel, type NavModelItem } from '@grafana/data';
import { type IconName } from '@grafana/ui';

/** Subset of the app's `AccessControlAction` enum used by the teams feature. */
export const TeamsAction = {
  ActionTeamsCreate: 'teams:create',
  ActionTeamsDelete: 'teams:delete',
  ActionTeamsRead: 'teams:read',
  ActionTeamsWrite: 'teams:write',
  ActionTeamsPermissionsRead: 'teams.permissions:read',
  ActionTeamsPermissionsWrite: 'teams.permissions:write',
  ActionRolesList: 'roles:read',
  ActionTeamsRolesList: 'teams.roles:read',
  ActionTeamsRolesAdd: 'teams.roles:add',
  ActionTeamsRolesRemove: 'teams.roles:remove',
  ActionUserRolesAdd: 'users.roles:add',
  ActionUserRolesRemove: 'users.roles:remove',
} as const;

export interface Role extends RoleDto {
  filteredDisplayName: string;
}

export interface WithAccessControlMetadata {
  accessControl?: Record<string, boolean>;
}

export interface TeamsContextSrv {
  hasPermission(action: string): boolean;
  hasPermissionInMetadata(action: string, object: WithAccessControlMetadata): boolean;
  licensedAccessControlEnabled(): boolean;
  fetchUserPermissions(): Promise<void>;
  user: { orgId: number };
}

export interface TeamsPageProps {
  navId?: string;
  pageNav?: NavModelItem;
  actions?: ReactNode;
  children: ReactNode;
}

export interface TeamRolePickerProps {
  teamId: number;
  roles?: Role[];
  isLoading?: boolean;
  roleOptions: Role[];
  disabled?: boolean;
  apply?: boolean;
  onApplyRoles?: (roles: Role[]) => void;
  pendingRoles?: Role[];
  width?: number;
  maxWidth?: string | number;
}

export interface UpgradeBoxProps extends HTMLAttributes<HTMLOrSVGElement> {
  featureName: string;
  featureId: string;
  text?: string;
  eventVariant?: string;
}

export interface UpgradeContentProps {
  listItems: string[];
  image: string;
  featureUrl?: string;
  featureName: string;
  description?: string;
  action?: { text: string; link?: string; onClick?: () => void };
}

export interface EmptyListCTAProps {
  title: string;
  buttonIcon: IconName;
  buttonLink?: string;
  buttonTitle: string;
  buttonDisabled?: boolean;
  onClick?: (event: React.MouseEvent) => void;
  proTip?: string;
  proTipLink?: string;
  proTipLinkTitle?: string;
  proTipTarget?: string;
}

export interface PermissionsProps {
  title?: string;
  addPermissionTitle?: string;
  buttonLabel?: string;
  emptyLabel?: string;
  resource: string;
  resourceId: string | number;
  canSetPermissions: boolean;
}

export interface SharedPreferencesProps {
  resourceUri: string;
  disabled?: boolean;
  preferenceType: 'org' | 'team' | 'user';
}

export type CreateFolderResult = Promise<{
  data?: { url?: string };
  error?: unknown;
}>;

export interface TeamsDependencies {
  contextSrv: TeamsContextSrv;
  Page: ComponentType<TeamsPageProps> & { Contents: ComponentType<{ isLoading?: boolean; children: ReactNode }> };
  TeamRolePicker: ComponentType<TeamRolePickerProps>;
  Permissions: ComponentType<PermissionsProps>;
  SharedPreferences: ComponentType<SharedPreferencesProps>;
  SlideDown: ComponentType<{ in: boolean; children: ReactNode }>;
  CloseButton: ComponentType<{ onClick: () => void }>;
  EmptyListCTA: ComponentType<EmptyListCTAProps>;
  UpgradeBox: ComponentType<UpgradeBoxProps>;
  UpgradeContent: ComponentType<UpgradeContentProps>;
  EnterpriseAuthFeaturesCard: ComponentType<{ page: 'teams' | 'users' }>;
  /** Renders the trial "pro" badge used as a nav tab suffix. */
  proBadge: (props: { experimentId: string; eventVariant?: string }) => ReactElement;
  highlightTrial: () => boolean | undefined;
  /** Fetch available RBAC role options. */
  fetchRoleOptions: () => Promise<Role[]>;
  /** Hook resolving RBAC role options for an org. */
  useRoleOptions: (orgId: number) => readonly [{ roleOptions: Role[] }, unknown];
  /** Hook returning the app notification API (only `error` is used here). */
  useAppNotification: () => { error: (title: string) => void };
  /** Opens a modal rendered from a React component (app modal event bus). */
  showModal: <P extends object>(
    component: ComponentType<P & { isOpen: boolean; onDismiss: () => void }>,
    props: P
  ) => void;
  /** Hook resolving a nav model from the app nav index with a fallback. */
  useNavModel: (id: string, fallback: NavModel) => NavModel;
  /** Hook returning a function that stores a nav model item in the app nav index. */
  useUpdateNavIndex: () => (item: NavModelItem) => void;
  /** Hook returning a trigger that creates a folder (optionally owned by teams). */
  useCreateFolder: () => readonly [
    (folder: { title: string; teamOwnerReferences?: Array<{ uid: string; name: string }> }) => CreateFolderResult,
    ...unknown[],
  ];
  extractErrorMessage: (error: unknown) => string | undefined;
  getMessageFromError: (err: unknown) => string;
  /** Adds the filtered display name used by role picker option lists. */
  addFilteredDisplayName: (role: RoleDto) => Role;
  /** Avatar placeholder image URL used while a team is loading. */
  userProfilePngUrl: string;
}

let dependencies: TeamsDependencies | undefined;

export function setTeamsDependencies(deps: TeamsDependencies): void {
  dependencies = deps;
}

export function getTeamsDependencies(): TeamsDependencies {
  if (!dependencies) {
    throw new Error('@grafana/teams dependencies have not been set. Call setTeamsDependencies() during app bootstrap.');
  }
  return dependencies;
}
