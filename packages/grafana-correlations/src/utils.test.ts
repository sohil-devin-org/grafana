import { SupportedTransformationType } from '@grafana/data';
import { type DataQuery } from '@grafana/schema';

import { type EditFormDTO, type FormDTO } from './Forms/types';
import { type Correlation } from './types';
import { type CorrelationsPaneInfo, generateDefaultLabel, generatePartialEditSpec } from './utils';
import * as utils from './utils';

jest.mock('@grafana/runtime/unstable', () => ({
  ...jest.requireActual('@grafana/runtime/unstable'),
  getDataSourceInstance: jest.fn().mockResolvedValue({
    name: 'getTest',
    getRef: () => {
      return { type: 'testTypeFromLookup', uid: 'testUidFromLookup' };
    },
  }),
}));

describe('correlations utils', () => {
  it('generates a partial spec with config and nulled target only when nothing is edited and the correlation is external', () => {
    const correlation: Correlation = {
      uid: 'test',
      sourceUID: 'test',
      label: 'test',
      provisioned: false,
      type: 'external',
      config: { field: 'test', target: { url: 'test' } },
    };
    const editForm: EditFormDTO = { ...correlation, label: correlation.label! };
    const partialSpec = generatePartialEditSpec(editForm, correlation);
    expect(partialSpec).toStrictEqual({ config: { field: 'test', target: { url: 'test' } }, target: null });
  });

  it('generates a partial spec as expected when things are edited', () => {
    const correlation: Correlation = {
      uid: 'test',
      sourceUID: 'test',
      label: 'test',
      provisioned: false,
      type: 'external',
      config: { field: 'test', target: { url: 'test' } },
    };
    const editForm: EditFormDTO = {
      ...correlation,
      label: 'diffLabel',
      description: 'diffDesc',
      type: 'query',
      config: {
        field: 'diffField',
        target: { diff: 'target' },
        transformations: [
          {
            type: SupportedTransformationType.Logfmt,
            expression: 'diffExp',
            mapValue: 'diffMapValue',
            field: 'diffField',
          },
        ],
      },
    };
    const partialSpec = generatePartialEditSpec(editForm, correlation);
    expect(partialSpec).toStrictEqual({
      label: 'diffLabel',
      description: 'diffDesc',
      type: 'query',
      config: {
        field: 'diffField',
        target: { diff: 'target' },
        transformations: [{ expression: 'diffExp', field: 'diffField', mapValue: 'diffMapValue', type: 'logfmt' }],
      },
    });
  });

  it('generates the expected label from pane datasource when not mixed', async () => {
    const queries: DataQuery[] = [{ refId: 'A', datasource: { uid: 'testQuery' } }];
    const sourcePane: CorrelationsPaneInfo = {
      datasourceInstance: { name: 'testA', meta: { mixed: false } },
      queries: queries,
    } as unknown as CorrelationsPaneInfo;
    const targetPane: CorrelationsPaneInfo = {
      datasourceInstance: { name: 'testB', meta: { mixed: false } },
      queries: queries,
    } as unknown as CorrelationsPaneInfo;
    const label = await generateDefaultLabel(sourcePane, targetPane);
    expect(label).toBe('testA to testB');
  });

  it('generates the expected label from query datasources when mixed', async () => {
    const queriesA: DataQuery[] = [{ refId: 'A', datasource: { uid: 'testQueryA' } }];
    const queriesB: DataQuery[] = [{ refId: 'B', datasource: { uid: 'testQueryB' } }];
    const sourcePane: CorrelationsPaneInfo = {
      datasourceInstance: { name: 'testA', meta: { mixed: true } },
      queries: queriesA,
    } as unknown as CorrelationsPaneInfo;
    const targetPane: CorrelationsPaneInfo = {
      datasourceInstance: { name: 'testB', meta: { mixed: false } },
      queries: queriesB,
    } as unknown as CorrelationsPaneInfo;
    const label = await generateDefaultLabel(sourcePane, targetPane);
    expect(label).toBe('getTest to testB');
  });

  it('does not add target data when the correlation is external', async () => {
    const addForm = {
      config: { field: 'test', target: { url: 'test' } },
      sourceUID: 'test',
      label: 'test',
      description: 'test',
      targetUID: undefined,
      type: 'external',
    };
    // this mimics the real scenario this form gets in, even though it is technically invalid (external types shouldn't have the targetUID property)
    const addSpec = await utils.generateAddSpec(addForm as FormDTO);
    expect(addSpec.target).not.toBeDefined();
  });
});
