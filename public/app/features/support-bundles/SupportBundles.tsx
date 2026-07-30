import { useEffect } from 'react';
import { connect, type ConnectedProps } from 'react-redux';

import { Trans } from '@grafana/i18n';
import { loadBundles, removeBundle, checkBundles, NewBundleButton, SupportBundlesList } from '@grafana/support-bundles';
import { Page } from 'app/core/components/Page/Page';
import { contextSrv } from 'app/core/services/context_srv';
import { AccessControlAction } from 'app/types/accessControl';
import { type StoreState } from 'app/types/store';

const mapStateToProps = (state: StoreState) => {
  return {
    supportBundles: state.supportBundles.supportBundles,
    isLoading: state.supportBundles.isLoading,
  };
};

const mapDispatchToProps = {
  loadBundles,
  removeBundle,
  checkBundles,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector>;

const SupportBundlesUnconnected = ({ supportBundles, isLoading, loadBundles, removeBundle, checkBundles }: Props) => {
  const isPending = supportBundles.some((b) => b.state === 'pending');

  useEffect(() => {
    loadBundles();
  }, [loadBundles]);

  useEffect(() => {
    if (isPending) {
      checkBundles();
    }
  });

  const hasAccess = contextSrv.hasPermission(AccessControlAction.ActionSupportBundlesCreate);
  const hasDeleteAccess = contextSrv.hasPermission(AccessControlAction.ActionSupportBundlesDelete);

  const actions = hasAccess ? NewBundleButton : undefined;

  const subTitle = (
    <span>
      <Trans i18nKey="support-bundles.support-bundles-unconnected.sub-title">
        Support bundles allow you to easily collect and share Grafana logs, configuration, and data with the Grafana
        Labs team.
      </Trans>
    </span>
  );

  return (
    <Page navId="support-bundles" subTitle={subTitle} actions={actions}>
      <Page.Contents isLoading={isLoading}>
        <SupportBundlesList supportBundles={supportBundles} hasDeleteAccess={hasDeleteAccess} onRemove={removeBundle} />
      </Page.Contents>
    </Page>
  );
};

export default connector(SupportBundlesUnconnected);
