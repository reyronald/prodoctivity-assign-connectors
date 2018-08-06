// @flow

export type FormConnector = {|
  name: string,
  output: Array<{ name: string }>,
  shouldDisableOnData: boolean,
  shouldDisableOnNoData: boolean,
  noDataMessage: string
|};

export type WebServiceConnector = {
  name: string,
  inputMapping: Array<{
    dataElement: { name: string }
  }>,
  outputMapping: Array<{
    dataElement: { name: string }
  }>
};
