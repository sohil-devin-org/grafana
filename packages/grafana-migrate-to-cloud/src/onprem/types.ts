import { type MigrateDataResponseItemDto } from '@grafana/api-clients/internal/rtkq/legacy/migrate-to-cloud';

import { type LocalPlugin } from '../dependencies';

export interface ResourceTableItem extends MigrateDataResponseItemDto {
  showDetails: (resource: ResourceTableItem) => void;
  plugin: LocalPlugin | undefined;
}
