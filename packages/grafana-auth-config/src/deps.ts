import { type ComponentType, type ReactNode } from 'react';

import { type NavModelItem } from '@grafana/data';

export interface PageContentsProps {
  isLoading?: boolean;
  children: ReactNode;
}

export interface PageComponentProps {
  navId?: string;
  pageNav?: NavModelItem;
  subTitle?: ReactNode;
  actions?: ReactNode;
  renderTitle?: (title: string) => ReactNode;
  children: ReactNode;
}

export type PageComponent = ComponentType<PageComponentProps> & {
  Contents: ComponentType<PageContentsProps>;
};

export interface FormPromptProps {
  confirmRedirect?: boolean;
  onDiscard: () => void;
}

export interface AppNotifier {
  success: (title: string, text?: string) => void;
  warning: (title: string, text?: string) => void;
  error: (title: string, text?: string) => void;
}

export interface AuthConfigContextSrv {
  isGrafanaAdmin: boolean;
  hasPermission: (action: string) => boolean;
}

/**
 * App-provided services required by the auth-config UI. The host application
 * must register these via `setAuthConfigDeps` before rendering any component
 * or dispatching any thunk from this package.
 */
export interface AuthConfigDeps {
  Page: PageComponent;
  PageNotFound: ComponentType;
  FormPrompt: ComponentType<FormPromptProps>;
  CloudEnterpriseBadge: ComponentType;
  useAppNotification: () => AppNotifier;
  contextSrv: AuthConfigContextSrv;
  isOpenSourceEdition: () => boolean;
  isOpenSourceBuildOrUnlicenced: () => boolean;
}

let deps: AuthConfigDeps | undefined;

export function setAuthConfigDeps(newDeps: AuthConfigDeps): void {
  deps = newDeps;
}

export function getAuthConfigDeps(): AuthConfigDeps {
  if (!deps) {
    throw new Error('@grafana/auth-config: dependencies not registered. Call setAuthConfigDeps() at app startup.');
  }
  return deps;
}
