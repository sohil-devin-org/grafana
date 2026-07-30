import { Trans } from '@grafana/i18n';
import { Button, Field, Checkbox, LinkButton, Stack, Alert } from '@grafana/ui';

import { Form } from './components/Form';
import { type SupportBundleCollector, type SupportBundleCreateRequest } from './types';

const collator = new Intl.Collator();

export interface SupportBundlesCreateFormProps {
  collectors: SupportBundleCollector[];
  loadCollectorsError: string;
  createBundleError: string;
  onCreate: (data: SupportBundleCreateRequest) => void;
}

export const SupportBundlesCreateForm = ({
  collectors,
  loadCollectorsError,
  createBundleError,
  onCreate,
}: SupportBundlesCreateFormProps) => {
  const onSubmit = (data: Record<string, boolean>) => {
    const selectedLabelsArray = Object.keys(data).filter((key) => data[key]);
    onCreate({ collectors: selectedLabelsArray });
  };

  // turn components into a uuid -> enabled map
  const values: Record<string, boolean> = collectors.reduce((acc, curr) => {
    return { ...acc, [curr.uid]: curr.default };
  }, {});

  return (
    <>
      {loadCollectorsError && <Alert title={loadCollectorsError} severity="error" />}
      {createBundleError && <Alert title={createBundleError} severity="error" />}
      {!!collectors.length && (
        <Form defaultValues={values} onSubmit={onSubmit} validateOn="onSubmit">
          {({ register }) => {
            return (
              <Stack direction="column" gap={2}>
                {[...collectors]
                  .sort((a, b) => collator.compare(a.displayName, b.displayName))
                  .map((component) => {
                    return (
                      <Field key={component.uid} noMargin>
                        <Checkbox
                          {...register(component.uid)}
                          label={component.displayName}
                          id={component.uid}
                          description={component.description}
                          defaultChecked={component.default}
                          disabled={component.includedByDefault}
                        />
                      </Field>
                    );
                  })}
                <Stack>
                  <Button type="submit">
                    <Trans i18nKey="support-bundles.support-bundles-create-unconnected.create">Create</Trans>
                  </Button>
                  <LinkButton href="/support-bundles" variant="secondary">
                    <Trans i18nKey="support-bundles.support-bundles-create-unconnected.cancel">Cancel</Trans>
                  </LinkButton>
                </Stack>
              </Stack>
            );
          }}
        </Form>
      )}
    </>
  );
};
