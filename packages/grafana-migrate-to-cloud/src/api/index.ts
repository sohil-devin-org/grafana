import { handleRequestError } from '@grafana/api-clients';
import { generatedAPI } from '@grafana/api-clients/internal/rtkq/legacy/migrate-to-cloud';

import { getMigrateToCloudDependencies, type LocalPlugin } from '../dependencies';

const cloudMigrationAPI = generatedAPI.injectEndpoints({
  endpoints: (build) => ({
    // Manually written because the Swagger specifications for the plugins endpoint do not exist
    getLocalPluginList: build.query<LocalPlugin[], void>({
      queryFn: async () => {
        try {
          const list = await getMigrateToCloudDependencies().getLocalPlugins();
          return { data: list };
        } catch (error) {
          return handleRequestError(error);
        }
      },
    }),
  }),
});

export const { useGetLocalPluginListQuery } = cloudMigrationAPI;
