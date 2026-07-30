import { dateTimeFormat } from '@grafana/data';
import { Trans, t } from '@grafana/i18n';
import { Alert, LinkButton, Spinner, IconButton } from '@grafana/ui';

import { type SupportBundle } from './types';

export const NewBundleButton = (
  <LinkButton icon="plus" href="support-bundles/create" variant="primary">
    <Trans i18nKey="support-bundles.new-bundle-button.new-support-bundle">New support bundle</Trans>
  </LinkButton>
);

export interface SupportBundlesListProps {
  supportBundles: SupportBundle[];
  hasDeleteAccess: boolean;
  onRemove: (uid: string) => void;
}

export const SupportBundlesList = ({ supportBundles, hasDeleteAccess, onRemove }: SupportBundlesListProps) => {
  return (
    <>
      <Alert
        title={t('support-bundles.support-bundles-unconnected.deprecation-warning-title', 'Deprecated feature')}
        severity="warning"
      >
        <Trans i18nKey="support-bundles.support-bundles-unconnected.deprecation-warning-message">
          Support bundles are deprecated and will be removed soon. For troubleshooting, collect the relevant server
          logs, configuration, and diagnostic details manually, then attach them to your Grafana Support ticket.
        </Trans>
      </Alert>
      <table className="filter-table form-inline">
        <thead>
          <tr>
            <th>
              <Trans i18nKey="support-bundles.support-bundles-unconnected.created-on">Created on</Trans>
            </th>
            <th>
              <Trans i18nKey="support-bundles.support-bundles-unconnected.requested-by">Requested by</Trans>
            </th>
            <th>
              <Trans i18nKey="support-bundles.support-bundles-unconnected.expires">Expires</Trans>
            </th>
            <th style={{ width: '32px' }} />
            <th style={{ width: '1%' }} />
            <th style={{ width: '1%' }} />
          </tr>
        </thead>
        <tbody>
          {supportBundles?.map((bundle) => (
            <tr key={bundle.uid}>
              <th>{dateTimeFormat(bundle.createdAt * 1000)}</th>
              <th>{bundle.creator}</th>
              <th>{dateTimeFormat(bundle.expiresAt * 1000)}</th>
              <th>{bundle.state === 'pending' && <Spinner />}</th>
              <th>
                <LinkButton
                  fill="outline"
                  disabled={bundle.state !== 'complete'}
                  target={'_self'}
                  href={`/api/support-bundles/${bundle.uid}`}
                >
                  <Trans i18nKey="support-bundles.support-bundles-unconnected.download">Download</Trans>
                </LinkButton>
              </th>
              <th>
                {hasDeleteAccess && (
                  <IconButton
                    onClick={() => onRemove(bundle.uid)}
                    name="trash-alt"
                    variant="destructive"
                    tooltip={t('support-bundles.support-bundles-unconnected.tooltip-remove-bundle', 'Remove bundle')}
                  />
                )}
              </th>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
