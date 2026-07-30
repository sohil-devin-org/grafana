import { useEffect, type JSX } from 'react';
import { connect, type ConnectedProps } from 'react-redux';

import { Trans, t } from '@grafana/i18n';
import { loadSupportBundleCollectors, createSupportBundle, SupportBundlesCreateForm } from '@grafana/support-bundles';
import { Page } from 'app/core/components/Page/Page';
import { type StoreState } from 'app/types/store';

const mapStateToProps = (state: StoreState) => {
  return {
    collectors: state.supportBundles.supportBundleCollectors,
    isLoading: state.supportBundles.createBundlePageLoading,
    loadCollectorsError: state.supportBundles.loadBundlesError,
    createBundleError: state.supportBundles.createBundleError,
  };
};

const mapDispatchToProps = {
  loadSupportBundleCollectors,
  createSupportBundle,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector>;

export const SupportBundlesCreateUnconnected = ({
  collectors,
  isLoading,
  loadCollectorsError,
  createBundleError,
  loadSupportBundleCollectors,
  createSupportBundle,
}: Props): JSX.Element => {
  useEffect(() => {
    loadSupportBundleCollectors();
  }, [loadSupportBundleCollectors]);

  const subTitle = (
    <span>
      <Trans i18nKey="support-bundles.support-bundles-create-unconnected.sub-title">
        Choose the components for the support bundle. The support bundle will be available for 3 days after creation.
      </Trans>
    </span>
  );

  return (
    <Page
      navId="support-bundles"
      pageNav={{
        text: t(
          'support-bundles.support-bundles-create-unconnected.text.create-support-bundle',
          'Create support bundle'
        ),
      }}
      subTitle={subTitle}
    >
      <Page.Contents isLoading={isLoading}>
        <SupportBundlesCreateForm
          collectors={collectors}
          loadCollectorsError={loadCollectorsError}
          createBundleError={createBundleError}
          onCreate={createSupportBundle}
        />
      </Page.Contents>
    </Page>
  );
};

export default connector(SupportBundlesCreateUnconnected);
