// @flow
import * as React from "react";
import { filter } from "fuzzaldrin-plus";
import update from "immutability-helper";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import noop from "noop2";
import { highlightChars } from "highlight-matches-utils";
import Table from "antd/lib/table";
import Icon from "antd/lib/icon";
import Input from "antd/lib/input";
import Divider from "antd/lib/divider";
import Checkbox from "antd/lib/checkbox";
import Radio from "antd/lib/radio";
import { css } from "react-emotion";
import DraggableBodyRow from "./DraggableBodyRow";
import { mergeConnectorsAndFormConnectors } from "./utils";
import type { WebServiceConnector, FormConnector } from "../_lib/types";

const anchorTagsStyles = css`
  a {
    cursor: pointer;
    color: #007bff !important;
  }
`;

const checkboxAndRadioStyle = { display: "block", marginLeft: 0 };

const MyDivider = () => (
  <div>
    <Divider type="vertical" style={{ height: "90%", top: "5%" }} />
  </div>
);

export type ConnectorToAssign = {|
  ...FormConnector,
  ...{| key: string, selected?: boolean |}
|};

type P = {
  connectors: WebServiceConnector[],
  formConnectors: FormConnector[],
  onChange: (formConnectors: FormConnector[]) => void,
  onChangeConnectorsToAssign: (connectorsToAssign: ConnectorToAssign[]) => void
};

type S = {
  searchText: string,
  connectors: WebServiceConnector[],
  filteredConnectors: ?(WebServiceConnector[]),
  connectorsToAssign: ConnectorToAssign[]
};

class AssignConnectors extends React.PureComponent<P, S> {
  static displayName = "AssignConnectors";

  static defaultProps = {
    onChangeConnectorsToAssign: noop
  };

  state = {
    searchText: "",
    connectors: this.props.connectors.map(cds => ({
      ...cds,
      key: cds.name
    })),
    filteredConnectors: undefined,
    connectorsToAssign: mergeConnectorsAndFormConnectors(
      this.props.connectors,
      this.props.formConnectors
    )
  };

  notifyChange = () => {
    const formConnectors: FormConnector[] = this.state.connectorsToAssign
      .filter(ac => ac.selected)
      .map(ac => {
        const { key, selected, ...formConnector } = ac;
        return formConnector;
      });
    this.props.onChange(formConnectors);
    this.props.onChangeConnectorsToAssign(this.state.connectorsToAssign);
  };

  constructor(props) {
    super(props);
    this.notifyChange();
  }

  columns = [
    {
      title: "Connector",
      dataIndex: "name",
      key: "name",
      onHeaderCell(column) {
        return { id: column.key };
      },
      filterMultiple: false,
      filters: [
        { text: "Selected", value: "SELECTED" },
        { text: "Unselected", value: "UNSELECTED" },
        { text: "All", value: "ALL" }
      ],
      onFilter: (
        value: "SELECTED" | "UNSELECTED" | "ALL",
        record: WebServiceConnector
      ) => {
        if (value === "ALL") {
          return true;
        }

        const currentRecordIsSelected = this.state.connectorsToAssign.some(
          ({ name, selected }) => name === record.name && selected
        );
        if (value === "SELECTED") {
          return currentRecordIsSelected;
        }
        if (value === "UNSELECTED") {
          return !currentRecordIsSelected;
        }

        throw new Error(`Unrecognized filter value: ${value}`);
      },
      render: text =>
        highlightChars(text, this.state.searchText, (s, i) => (
          <mark
            key={i}
            style={{
              padding: 0,
              fontWeight: 600,
              backgroundColor: "transparent"
            }}
          >
            {s}
          </mark>
        ))
    }
  ];

  getHeaderCell = headerCellProps => {
    if (headerCellProps.id === "name") {
      return (
        <th
          style={{
            display: "flex",
            alignItems: "center"
          }}
          {...headerCellProps}
        >
          {headerCellProps.children}
          <Input
            name="search"
            placeholder="Search..."
            style={{
              flexGrow: 1,
              marginLeft: 40,
              width: "auto"
            }}
            value={this.state.searchText}
            onChange={this.handleSearchTextChange}
          />
        </th>
      );
    }

    return <th {...headerCellProps} />;
  };

  components = {
    body: {
      row: DraggableBodyRow
    },
    header: {
      cell: this.getHeaderCell
    }
  };

  moveRow = (dragIndex: number, hoverIndex: number) => {
    this.setState(prevState => {
      const { connectors, connectorsToAssign } = update(prevState, {
        connectors: {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, prevState.connectors[dragIndex]]
          ]
        },
        connectorsToAssign: {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, prevState.connectorsToAssign[dragIndex]]
          ]
        }
      });

      return { connectors, connectorsToAssign };
    }, this.notifyChange);
  };

  handleSearchTextChange = (e: SyntheticEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;

    this.setState(prevState => {
      const filteredConnectors = value
        ? filter(prevState.connectors, value, {
            key: "name"
          })
        : undefined;

      return { searchText: value, filteredConnectors };
    });
  };

  rowSelection = {
    onChange: (selectedRowKeys, selectedRows: Array<WebServiceConnector>) => {
      this.setState(prevState => {
        const connectorsToAssign = prevState.connectorsToAssign.map(c => {
          c.selected = selectedRows.some(row => c.name === row.name);
          return c;
        });

        return { connectorsToAssign };
      }, this.notifyChange);
    }
  };

  expandedRowRender = (record: WebServiceConnector) => {
    let index = this.state.connectorsToAssign.findIndex(
      c => c.name === record.name
    );
    const assignedConnector = this.state.connectorsToAssign[index];

    return (
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-around"
        }}
      >
        <div>
          {record.inputMapping.map(r => (
            <div key={r.dataElement.name}>
              <Icon type="key" /> {r.dataElement.name}
            </div>
          ))}
        </div>

        <MyDivider />

        <Checkbox.Group
          defaultValue={assignedConnector.output.map(i => i.name)}
          onChange={names => {
            this.setState(prevState => {
              const connectorsToAssign = [...prevState.connectorsToAssign];
              connectorsToAssign[index].output = names.map(name => ({
                name
              }));
              return { connectorsToAssign };
            }, this.notifyChange);
          }}
        >
          {record.outputMapping.filter(r => r.dataElement != null).map(r => (
            <Checkbox
              style={checkboxAndRadioStyle}
              key={r.dataElement.name}
              value={r.dataElement.name}
            >
              {r.dataElement.name}
            </Checkbox>
          ))}
        </Checkbox.Group>

        <MyDivider />

        <div>
          <div style={{ marginBottom: "1rem", marginRight: "2rem" }}>
            <strong>Data found</strong>
            <div>
              <Radio.Group
                name="shouldDisableOnData"
                defaultValue={assignedConnector.shouldDisableOnData}
                onChange={e => {
                  this.setState(prevState => {
                    const connectorsToAssign = [
                      ...prevState.connectorsToAssign
                    ];
                    connectorsToAssign[index].shouldDisableOnData =
                      e.target.value;
                    return { connectorsToAssign };
                  }, this.notifyChange);
                }}
              >
                <Radio style={checkboxAndRadioStyle} value={true}>
                  Disable
                </Radio>
                <Radio style={checkboxAndRadioStyle} value={false}>
                  Enable
                </Radio>
              </Radio.Group>
            </div>
          </div>
          <div>
            <strong>No data found</strong>
            <div>
              <Radio.Group
                name="shouldDisableOnNoData"
                defaultValue={assignedConnector.shouldDisableOnNoData}
                onChange={e => {
                  this.setState(prevState => {
                    const connectorsToAssign = [
                      ...prevState.connectorsToAssign
                    ];
                    connectorsToAssign[index].shouldDisableOnNoData =
                      e.target.value;
                    return { connectorsToAssign };
                  }, this.notifyChange);
                }}
              >
                <Radio style={checkboxAndRadioStyle} value={true}>
                  Disable
                </Radio>
                <Radio style={checkboxAndRadioStyle} value={false}>
                  Enable
                </Radio>
              </Radio.Group>
            </div>
          </div>
        </div>

        <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <div>No data found message:</div>
          <textarea
            defaultValue={assignedConnector.noDataMessage}
            style={{ width: "100%", height: "100%" }}
            onChange={e => {
              const message = e.currentTarget.value;
              this.setState(prevState => {
                const connectorsToAssign = [...prevState.connectorsToAssign];
                connectorsToAssign[index].noDataMessage = message;
                return { connectorsToAssign };
              }, this.notifyChange);
            }}
          />
        </div>
      </div>
    );
  };

  onRow = (record, index) => ({ index, moveRow: this.moveRow });

  render() {
    const { filteredConnectors, connectors, connectorsToAssign } = this.state;

    const selectedRowKeys = connectorsToAssign
      .filter(({ selected }) => selected)
      .map(({ name }) => name);

    return (
      <Table
        className={anchorTagsStyles}
        bordered
        components={this.components}
        rowSelection={{
          selectedRowKeys,
          onChange: this.rowSelection.onChange
        }}
        expandedRowRender={this.expandedRowRender}
        onRow={this.onRow}
        columns={this.columns}
        dataSource={filteredConnectors || connectors}
      />
    );
  }
}

export default DragDropContext(HTML5Backend)(AssignConnectors);
