import { useState } from 'react';

import { handleRequestError } from '@grafana/api-clients';
import {
  CorrelationsPage,
  type CorrelationsPageLayoutProps,
  type GetCorrelationsParams,
  type RemoveCorrelationParams,
  setCorrelationsDataSourcePicker,
  useCorrelations,
  useCorrelationsK8s,
} from '@grafana/correlations';
import { config } from '@grafana/runtime';
// Imported for its side effect: enhances the generated correlations API endpoints
// with app notification handling before the package components use them.
import { useDeleteCorrelationMutation } from 'app/api/clients/correlations/v0alpha1';
import { Page } from 'app/core/components/Page/Page';
import { useNavModel } from 'app/core/hooks/useNavModel';
import { contextSrv } from 'app/core/services/context_srv';
import { DataSourcePicker } from 'app/features/datasources/components/picker/DataSourcePicker';
import { AccessControlAction } from 'app/types/accessControl';

setCorrelationsDataSourcePicker(DataSourcePicker);

function CorrelationsPageLayout({ subTitle, actions, children }: CorrelationsPageLayoutProps) {
  const navModel = useNavModel('correlations');

  return (
    <Page navModel={navModel} subTitle={subTitle} actions={actions}>
      <Page.Contents>{children}</Page.Contents>
    </Page>
  );
}

const canWriteCorrelations = () => contextSrv.hasPermission(AccessControlAction.DataSourcesWrite);

export function CorrelationsPageLegacy() {
  const { remove, get } = useCorrelations();
  return (
    <CorrelationsPage
      canWriteCorrelations={canWriteCorrelations()}
      PageLayout={CorrelationsPageLayout}
      fetchCorrelations={get.execute}
      correlations={get.value}
      isLoading={get.loading}
      error={get.error}
      removeFn={remove.execute}
    />
  );
}

export function CorrelationsPageAppPlatform() {
  const [page, setPage] = useState(1);
  const limit = 100;
  const { currentData, isLoading, error, doesContinue } = useCorrelationsK8s(limit, page);
  const [deleteCorrelation] = useDeleteCorrelationMutation();

  // we cant do a straight refetch, we have to pass in new pages if necessary
  const enhRefetch = (params: GetCorrelationsParams) => {
    return { correlations: currentData, page: params.page, limit, totalCount: 0, doesContinue };
  };

  const fmtedError = error ? handleRequestError(error) : undefined;

  return (
    <CorrelationsPage
      canWriteCorrelations={canWriteCorrelations()}
      PageLayout={CorrelationsPageLayout}
      fetchCorrelations={enhRefetch}
      changePageFn={(toPage) => {
        setPage(toPage);
      }}
      correlations={{
        correlations: currentData,
        page: 0,
        limit: limit,
        totalCount: 0,
        doesContinue: doesContinue,
      }}
      isLoading={isLoading}
      error={fmtedError?.error}
      removeFn={(params: RemoveCorrelationParams) => {
        const deleteData = deleteCorrelation({ name: params.uid });
        return deleteData.unwrap();
      }}
    />
  );
}

export default function CorrelationsPageWrapper() {
  if (config.featureToggles.kubernetesCorrelations) {
    return <CorrelationsPageAppPlatform />;
  }

  return <CorrelationsPageLegacy />;
}
