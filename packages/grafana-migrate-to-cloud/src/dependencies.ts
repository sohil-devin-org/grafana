/**
 * App-provided services that are too entangled with the Grafana app to move into this package
 * (redux-backed hooks, app notifications, i18n date formatting, plugin catalog API).
 * The app-side shim wires them in via {@link setMigrateToCloudDependencies} before rendering.
 */

export interface LocalPlugin {
  id: string;
  name?: string;
  info?: {
    logos?: {
      small?: string;
      large?: string;
    };
  };
}

export interface FolderQueryFacadeResult {
  data?:
    | {
        title?: string;
        parents?: Array<{ title?: string }>;
      }
    | undefined;
  isLoading: boolean;
  isError: boolean;
}

export interface AppNotification {
  success: (title: string, text?: string) => void;
  warning: (title: string, text?: string) => void;
  error: (title: string, text?: string) => void;
}

export interface MigrateToCloudDependencies {
  useGetFolderQueryFacade: (uid?: string) => FolderQueryFacadeResult;
  useAppNotification: () => AppNotification;
  formatDate: (value: number | Date | string, format?: Intl.DateTimeFormatOptions) => string;
  getLocalPlugins: () => Promise<LocalPlugin[]>;
}

let dependencies: MigrateToCloudDependencies | undefined;

export function setMigrateToCloudDependencies(deps: MigrateToCloudDependencies): void {
  dependencies = deps;
}

export function getMigrateToCloudDependencies(): MigrateToCloudDependencies {
  if (!dependencies) {
    throw new Error(
      '@grafana/migrate-to-cloud dependencies have not been set. Call setMigrateToCloudDependencies() first.'
    );
  }

  return dependencies;
}
