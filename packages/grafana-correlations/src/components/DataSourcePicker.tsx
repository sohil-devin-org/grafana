import { type ComponentType } from 'react';

import { type DataSourceInstanceSettings } from '@grafana/data';
import { DataSourcePicker as RuntimeDataSourcePicker } from '@grafana/runtime';

/**
 * The subset of data source picker props used by the correlations forms. The host app can
 * register a richer picker implementation (e.g. Grafana core's advanced picker) via
 * {@link setCorrelationsDataSourcePicker}; otherwise the default picker from
 * `@grafana/runtime` is used.
 */
export interface CorrelationsDataSourcePickerProps {
  onChange: (ds: DataSourceInstanceSettings) => void;
  current: string | null | undefined;
  noDefault?: boolean;
  inputId?: string;
  width?: number;
  disabled?: boolean;
}

let pickerComponent: ComponentType<CorrelationsDataSourcePickerProps> = RuntimeDataSourcePicker;

export function setCorrelationsDataSourcePicker(picker: ComponentType<CorrelationsDataSourcePickerProps>) {
  pickerComponent = picker;
}

export function CorrelationsDataSourcePicker(props: CorrelationsDataSourcePickerProps) {
  const Picker = pickerComponent;
  return <Picker {...props} />;
}
