import { isEqual } from 'lodash';
import { lastValueFrom } from 'rxjs';

import { type CorrelationSpec } from '@grafana/api-clients/rtkq/correlations/v0alpha1';
import { type DataSourceApi } from '@grafana/data';
import { type CorrelationsData, getBackendSrv } from '@grafana/runtime';
import { getDataSourceInstance } from '@grafana/runtime/unstable';
import { type DataQuery } from '@grafana/schema';

import { type EditFormDTO, type FormDTO } from './Forms/types';
import { type Correlation, type CreateCorrelationParams, type CreateCorrelationResponse } from './types';
import { type CorrelationsResponse, getData, toEnrichedCorrelationsData } from './useCorrelations';

export const getCorrelationsBySourceUIDs = async (sourceUIDs: string[]): Promise<CorrelationsData> => {
  return lastValueFrom(
    getBackendSrv().fetch<CorrelationsResponse>({
      url: `/api/datasources/correlations`,
      method: 'GET',
      showErrorAlert: false,
      params: {
        sourceUID: sourceUIDs,
      },
    })
  )
    .then(getData)
    .then(toEnrichedCorrelationsData);
};

export const createCorrelation = async (
  sourceUID: string,
  correlation: CreateCorrelationParams
): Promise<CreateCorrelationResponse> => {
  return getBackendSrv().post<CreateCorrelationResponse>(`/api/datasources/uid/${sourceUID}/correlations`, correlation);
};

/**
 * The minimal shape of an explore pane needed to generate a default correlation label.
 * Structurally compatible with the app's ExploreItemState.
 */
export interface CorrelationsPaneInfo {
  datasourceInstance?: DataSourceApi | null;
  queries: DataQuery[];
}

const getDSInstanceForPane = async (pane: CorrelationsPaneInfo) => {
  if (pane.datasourceInstance?.meta.mixed) {
    return await getDataSourceInstance(pane.queries[0].datasource);
  } else {
    return pane.datasourceInstance;
  }
};

export const generateDefaultLabel = async (sourcePane: CorrelationsPaneInfo, targetPane: CorrelationsPaneInfo) => {
  return Promise.all([getDSInstanceForPane(sourcePane), getDSInstanceForPane(targetPane)]).then((dsInstances) => {
    return dsInstances[0]?.name !== undefined && dsInstances[1]?.name !== undefined
      ? `${dsInstances[0]?.name} to ${dsInstances[1]?.name}`
      : '';
  });
};

export const generatePartialEditSpec = (data: EditFormDTO, correlation: Correlation): Partial<CorrelationSpec> => {
  let partialSpec: Partial<CorrelationSpec> = {};

  // we will want to clear any target data if the correlation is being updated to external
  // null sent in a PATCH will delete the property
  if (data.type === 'external') {
    partialSpec.target = null;
  }

  if (data.label !== correlation.label) {
    partialSpec.label = data.label;
  }
  if (data.description !== correlation.description) {
    partialSpec.description = data.description;
  }
  if (data.type !== correlation.type) {
    partialSpec.type = data.type;
  }

  // target is only loosely defined as an object, so always copy it
  partialSpec.config = { field: data.config.field, target: data.config.target };

  if (
    data.config.transformations !== undefined &&
    !isEqual(data.config.transformations, correlation.config.transformations)
  ) {
    partialSpec.config.transformations = data.config.transformations.map((t) => {
      return { expression: t.expression, field: t.field, mapValue: t.mapValue, type: t.type };
    });
  }
  return partialSpec;
};

export const generateAddSpec = async (data: FormDTO): Promise<CorrelationSpec> => {
  const sourceDs = await getDataSourceInstance(data.sourceUID);
  let targetDs;
  if ('targetUID' in data && data.targetUID !== undefined) {
    targetDs = await getDataSourceInstance(data.targetUID!);
  }

  return {
    label: data.label,
    description: data.description,
    source: { group: sourceDs.type, name: sourceDs.uid },
    target: targetDs?.uid !== undefined ? { group: targetDs.type, name: targetDs?.uid } : undefined,
    type: data.type,
    config: {
      field: data.config.field,
      target: { ...data.config.target },
      transformations: data.config.transformations,
    },
  };
};
