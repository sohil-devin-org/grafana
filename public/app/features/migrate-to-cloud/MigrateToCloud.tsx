import { MigrateToCloud, setMigrateToCloudDependencies } from '@grafana/migrate-to-cloud';
import { useGetFolderQueryFacade } from 'app/api/clients/folder/v1beta1/hooks';
import { Page } from 'app/core/components/Page/Page';
import { useAppNotification } from 'app/core/copy/appNotification';
import { formatDate } from 'app/core/internationalization/dates';
import { getLocalPlugins } from 'app/features/plugins/admin/api';

// Wires app-specific services into the extracted @grafana/migrate-to-cloud package.
setMigrateToCloudDependencies({
  useGetFolderQueryFacade,
  useAppNotification,
  formatDate,
  getLocalPlugins,
});

export default function MigrateToCloudPage() {
  return (
    <Page navId="migrate-to-cloud">
      <MigrateToCloud />
    </Page>
  );
}
