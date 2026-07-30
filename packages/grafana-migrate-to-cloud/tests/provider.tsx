import { configureStore } from '@reduxjs/toolkit';
import { useState } from 'react';
import { Provider } from 'react-redux';
import { map, type Observable } from 'rxjs';

import { MockBackendSrv } from '@grafana/api-clients';
import { generatedAPI as migrateToCloudAPI } from '@grafana/api-clients/internal/rtkq/legacy/migrate-to-cloud';
import { type BackendSrvRequest, type FetchResponse, setBackendSrv } from '@grafana/runtime';

import { setMigrateToCloudDependencies } from '../src/dependencies';

// Like the real BackendSrv, reject on non-2xx responses so RTKQ surfaces them as errors.
class TestBackendSrv extends MockBackendSrv {
  fetch<T>(options: BackendSrvRequest): Observable<FetchResponse<T>> {
    return super.fetch<T>(options).pipe(
      map((response) => {
        if (!response.ok) {
          throw response;
        }
        return response;
      })
    );
  }
}

// Initialize BackendSrv for tests - this allows RTKQ to make HTTP requests
// The actual HTTP requests will be intercepted by MSW (registerMockAPI)
// @ts-ignore
setBackendSrv(new TestBackendSrv());

setMigrateToCloudDependencies({
  useGetFolderQueryFacade: () => ({ data: undefined, isLoading: false, isError: false }),
  useAppNotification: () => ({ success: jest.fn(), warning: jest.fn(), error: jest.fn() }),
  formatDate: (value) => new Date(value).toISOString(),
  getLocalPlugins: () => Promise.resolve([]),
});

export function createTestStore() {
  return configureStore({
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false,
      }).concat(migrateToCloudAPI.middleware),
    reducer: {
      [migrateToCloudAPI.reducerPath]: migrateToCloudAPI.reducer,
    },
  });
}

export function TestProvider({ children }: React.PropsWithChildren) {
  const [store] = useState(createTestStore);
  return <Provider store={store}>{children}</Provider>;
}
