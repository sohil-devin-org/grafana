import { config } from '@grafana/runtime';

import { Page as CloudPage } from './cloud/Page';
import { Page as OnPremPage } from './onprem/Page';

export function MigrateToCloud() {
  return config.cloudMigrationIsTarget ? <CloudPage /> : <OnPremPage />;
}
