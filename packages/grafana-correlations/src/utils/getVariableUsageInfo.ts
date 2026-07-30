import { uniqBy } from 'lodash';

import { type ScopedVars } from '@grafana/data';
import { getTemplateSrv, type VariableInterpolation } from '@grafana/runtime';

// See https://grafana.com/docs/grafana/latest/dashboards/variables/add-template-variables/#global-variables
const builtInVariables = [
  '__from',
  '__to',
  '__interval',
  '__interval_ms',
  '__org',
  '__user',
  '__range',
  '__rate_interval',
  '__timeFilter',
  'timeFilter',
  // These are only applicable in dashboards so should not affect this for Explore
  // '__dashboard',
  //'__name',
];

/**
 * Use variable map from templateSrv to determine if all variables have values
 * @param query
 * @param scopedVars
 */
export function getVariableUsageInfo(
  query: object,
  scopedVars: ScopedVars
): { variables: VariableInterpolation[]; allVariablesDefined: boolean } {
  let variables: VariableInterpolation[] = [];
  const replaceFn = getTemplateSrv().replace.bind(getTemplateSrv());
  // This adds info to the variables array while interpolating
  replaceFn(getStringsFromObject(query), scopedVars, undefined, variables);
  variables = uniqBy(variables, 'variableName');
  return {
    variables: variables,
    allVariablesDefined: variables
      // We filter out builtin variables as they should be always defined but sometimes only later, like
      // __range_interval which is defined in prometheus at query time.
      .filter((v) => !builtInVariables.includes(v.variableName))
      .every((variable) => variable.found),
  };
}

// Recursively get all strings from an object into a simple list with space as separator.
function getStringsFromObject(obj: Object): string {
  let acc = '';
  let k: keyof typeof obj;

  for (k in obj) {
    if (typeof obj[k] === 'string') {
      acc += ' ' + obj[k];
    } else if (typeof obj[k] === 'object') {
      acc += ' ' + getStringsFromObject(obj[k]);
    }
  }
  return acc;
}
