// @flow

import type { WebServiceConnector, FormConnector } from "../_lib/types";
import type { ConnectorToAssign } from "./AssignConnectors";

export function mergeConnectorsAndFormConnectors(
  connectors: Array<WebServiceConnector>,
  formConnectors: Array<FormConnector> = []
): Array<ConnectorToAssign> {
  const _formConnectors = formConnectors.slice(0);
  const connectorsToAssign = connectors.map(connector => {
    const formConnector = pluck(
      _formConnectors,
      fc => fc.name === connector.name
    );

    if (!formConnector) {
      return {
        key: connector.name,
        name: connector.name,
        output: [],
        shouldDisableOnData: true,
        shouldDisableOnNoData: false,
        noDataMessage: ""
      };
    }

    return {
      selected: true,
      key: formConnector.name,
      name: formConnector.name,
      output: formConnector.output.filter(o =>
        connector.outputMapping.some(om => om.dataElement.name === o.name)
      ),
      shouldDisableOnData:
        formConnector.shouldDisableOnData == null
          ? true
          : formConnector.shouldDisableOnData,
      shouldDisableOnNoData:
        formConnector.shouldDisableOnNoData == null
          ? false
          : formConnector.shouldDisableOnNoData,
      noDataMessage: formConnector.noDataMessage || ""
    };
  });

  return connectorsToAssign;
}

function pluck<T>(
  array: T[],
  predicate: (value: T, index: number, obj: T[]) => boolean
): ?T {
  const index = array.findIndex(predicate);
  if (index > -1) {
    return array.splice(index, 1)[0];
  }
}
