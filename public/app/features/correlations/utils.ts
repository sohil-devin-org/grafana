import { generatedAPI as correlationsAPIv0alpha1 } from '@grafana/api-clients/rtkq/correlations/v0alpha1';
import { getCorrelationsBySourceUIDs, toEnrichedCorrelationDataK8s } from '@grafana/correlations';
import { type DataFrame, DataLinkConfigOrigin } from '@grafana/data';
import { config, type CorrelationData, type CorrelationsData } from '@grafana/runtime';
import { getDataSourceInstance } from '@grafana/runtime/unstable';
import { type DataQuery, type DataSourceRef } from '@grafana/schema';
import { MIXED_DATASOURCE_NAME } from 'app/plugins/datasource/mixed/MixedDataSource';
import { type ThunkDispatch } from 'app/types/store';

import { formatValueName } from '../explore/PrometheusListView/ItemLabels';
import { getDatasourceUIDs } from '../explore/state/utils';
import { parseLogsFrame } from '../logs/logsFrame';

type DataFrameRefIdToDataSourceUid = Record<string, string>;

/**
 * Creates data links from provided CorrelationData object
 *
 * @param dataFrames list of data frames to be processed
 * @param correlations list of of possible correlations that can be applied
 * @param dataFrameRefIdToDataSourceUid a map that for provided refId references corresponding data source ui
 */
export const attachCorrelationsToDataFrames = (
  dataFrames: DataFrame[],
  correlations: CorrelationData[],
  dataFrameRefIdToDataSourceUid: DataFrameRefIdToDataSourceUid
): DataFrame[] => {
  dataFrames.forEach((dataFrame) => {
    const frameRefId = dataFrame.refId;
    if (!frameRefId) {
      return;
    }
    let dataSourceUid = dataFrameRefIdToDataSourceUid[frameRefId];

    // rawPrometheus queries append a value to refId to a separate dataframe for the table view
    if (dataSourceUid === undefined && dataFrame.meta?.preferredVisualisationType === 'rawPrometheus') {
      const formattedRefID = formatValueName(frameRefId);
      dataSourceUid = dataFrameRefIdToDataSourceUid[formattedRefID];
    }

    const sourceCorrelations = correlations.filter((correlation) => correlation.source.uid === dataSourceUid);
    decorateDataFrameWithInternalDataLinks(dataFrame, fixLokiDataplaneFields(sourceCorrelations, dataFrame));
  });

  return dataFrames;
};

const decorateDataFrameWithInternalDataLinks = (dataFrame: DataFrame, correlations: CorrelationData[]) => {
  dataFrame.fields.forEach((field) => {
    field.config.links = field.config.links?.filter((link) => link.origin !== DataLinkConfigOrigin.Correlations) || [];
    correlations.map((correlation) => {
      if (correlation.config.field === field.name) {
        if (correlation.type === 'query') {
          const targetQuery = correlation.config.target || {};
          field.config.links!.push({
            internal: {
              query: { ...targetQuery, datasource: { uid: correlation.target.uid } },
              datasourceUid: correlation.target.uid,
              datasourceName: correlation.target.name,
            },
            url: '',
            title: correlation.label || correlation.target.name,
            origin: DataLinkConfigOrigin.Correlations,
            meta: {
              transformations: correlation.config.transformations,
            },
          });
        } else if (correlation.type === 'external') {
          const externalTarget = correlation.config.target;
          field.config.links!.push({
            url: externalTarget.url,
            title: correlation.label || 'External URL',
            origin: DataLinkConfigOrigin.Correlations,
            meta: { transformations: correlation.config?.transformations },
          });
        }
      }
    });
  });
};

/*
If a correlation was made based on the log line field prior to the loki data plane, they would use the field "Line"

Change it to use whatever the body field name is post-loki data plane
*/
const fixLokiDataplaneFields = (correlations: CorrelationData[], dataFrame: DataFrame) => {
  return correlations.map((correlation) => {
    if (
      correlation.source.meta?.id === 'loki' &&
      config.featureToggles.lokiLogsDataplane === true &&
      correlation.config.field === 'Line'
    ) {
      const logsFrame = parseLogsFrame(dataFrame);
      if (logsFrame != null && logsFrame.bodyField.name !== undefined) {
        correlation.config.field = logsFrame?.bodyField.name;
      }
    }
    return correlation;
  });
};

// legacy just needs uid for lookup, remote storage needs name/group
// this is just for retrieving in explore, so pagination features are not needed
export const getCorrelationsFromStorage = async (
  dispatch: ThunkDispatch,
  queries: DataQuery[],
  instanceUid: string
): Promise<CorrelationsData> => {
  let correlations: CorrelationsData;
  if (config.featureToggles.kubernetesCorrelations) {
    let queryDSRefList: DataSourceRef[];
    if (instanceUid === MIXED_DATASOURCE_NAME) {
      // filter out undefineds and duplicates. typescript doesnt recognize the null check when combined
      queryDSRefList = queries
        .map((q) => q.datasource)
        .filter((ref) => ref !== undefined && ref !== null)
        .filter(
          (ref, index, array) =>
            ref.type !== undefined &&
            ref.uid !== undefined &&
            array.findIndex((ref2) => ref2?.uid === ref?.uid && ref2?.type === ref?.type) === index
        );
    } else {
      const instanceDS = await getDataSourceInstance(instanceUid);
      const instanceDSRef = instanceDS.getRef();
      queryDSRefList = [instanceDSRef];
    }
    const labelStr = queryDSRefList
      .map((ref) => {
        if (ref !== undefined && ref.type !== undefined && ref.uid !== undefined) {
          return `${ref.type}.${ref.uid}`;
        } else {
          return undefined;
        }
      })
      .filter((r) => r !== undefined)
      .join();
    const labelSelectString = `correlations.grafana.app/sourceDS-ref in (${labelStr})`;
    const { data } = await dispatch(
      correlationsAPIv0alpha1.endpoints.listCorrelation.initiate({
        labelSelector: labelSelectString,
      })
    );
    // this is just for retrieving in explore, so pagination features are not needed
    const enrichedCorr = (
      await Promise.all((data?.items ?? []).map((item) => toEnrichedCorrelationDataK8s(item)))
    ).filter((i) => i !== undefined);
    correlations = {
      correlations: enrichedCorr,
      page: 0,
      limit: 1000,
      totalCount: enrichedCorr.length,
    };
  } else {
    const datasourceUIDs = getDatasourceUIDs(instanceUid, queries);
    correlations = await getCorrelationsBySourceUIDs(datasourceUIDs);
  }

  return correlations;
};
