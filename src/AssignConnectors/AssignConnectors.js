// @flow
import * as React from "react";
import { Table, Checkbox, Icon, Divider, Radio, Input } from "antd";
import { filter, match } from "fuzzaldrin-plus";
import update from "immutability-helper";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import DragableBodyRow from "./DragableBodyRow";
import { splitMatches } from "./utils";

const checkboxAndRadioStyle = { display: "block", marginLeft: 0 };

type FilterValue = "SELECTED" | "UNSELECTED" | "ALL" | null | undefined;

class AssignConnectors extends React.Component<
  { completeDataSource: {}[], onDataSourceChanged: (dataSource: {}[]) => void },
  { searchText: string, dataSource: {}[], filteredDataSource: ?({}[]) }
> {
  // TODO test sCU
  state = {
    searchText: "",
    dataSource: this.props.completeDataSource,
    filteredDataSource: undefined
  };

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
      onFilter(value: FilterValue, record) {
        if (value === "SELECTED") {
          return record.selected;
        }
        if (value === "UNSELECTED") {
          return !record.selected;
        }
        return true;
      },
      render: text => {
        if (!this.state.searchText) {
          return text;
        }

        const matches = match(text, this.state.searchText);
        const splitMatchesResult = splitMatches(text, matches);
        const result = splitMatchesResult.reduce((prev, curr) => {
          return (
            <React.Fragment>
              {prev}
              {curr.isMatch ? (
                <mark
                  style={{
                    padding: 0,
                    fontWeight: 600,
                    backgroundColor: "transparent"
                  }}
                >
                  {curr.str}
                </mark>
              ) : (
                curr.str
              )}
            </React.Fragment>
          );
        }, "");
        return result;
      }
    }
  ];

  getHeaderCell = props => {
    if (props.id === "name") {
      return (
        <th
          style={{
            display: "flex",
            alignItems: "center"
          }}
          {...props}
        >
          {props.children}
          <Input
            placeholder="Filter..."
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

    return <th {...props} />;
  };

  components = {
    body: {
      row: DragableBodyRow
    },
    header: {
      cell: this.getHeaderCell
    }
  };

  moveRow = (dragIndex, hoverIndex) => {
    const { dataSource } = this.state;
    const dragRow = dataSource[dragIndex];

    // TODO: dont use immutability helper here
    this.setState(
      update(this.state, {
        dataSource: {
          $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]]
        }
      }),
      () => {
        this.props.onDataSourceChanged(this.state.dataSource);
      }
    );
  };

  handleSearchTextChange = (e: SyntheticEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;

    this.setState(prevState => {
      const filteredDataSource = value
        ? filter(prevState.dataSource, value, {
            key: "name"
          })
        : undefined;

      this.setState({ searchText: value, filteredDataSource });
    });
  };

  rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
    onSelect: (record, selected, selectedRows) => {
      record.selected = selected;
      console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      console.log(selected, selectedRows, changeRows);
    }
  };

  expandedRowRender = record => {
    return (
      <div style={{ display: "flex" }}>
        <Checkbox.Group>
          <Checkbox style={checkboxAndRadioStyle}>
            Id <Icon type="key" />
          </Checkbox>
          <Checkbox style={checkboxAndRadioStyle}>First Name</Checkbox>
          <Checkbox style={checkboxAndRadioStyle}>Last Name</Checkbox>
          <Checkbox style={checkboxAndRadioStyle}>Address</Checkbox>
          <Checkbox style={checkboxAndRadioStyle}>Civil Status</Checkbox>
        </Checkbox.Group>

        <div>
          <Divider type="vertical" style={{ height: "90%", top: "5%" }} />
        </div>

        <div>
          <strong>Data found</strong>
          <div>
            <Radio.Group defaultValue={true}>
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
            <Radio.Group defaultValue={true}>
              <Radio style={checkboxAndRadioStyle} value={true}>
                Allow complete
              </Radio>
              <Radio style={checkboxAndRadioStyle} value={false}>
                Do not allow complete
              </Radio>
            </Radio.Group>
          </div>
        </div>

        <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <div>No data found message:</div>
          <textarea style={{ width: "100%", height: "100%" }} />
        </div>
      </div>
    );
  };

  onRow = (record, index) => ({ index, moveRow: this.moveRow });

  render() {
    const { filteredDataSource, dataSource } = this.state;
    return (
      <Table
        bordered
        components={this.components}
        rowSelection={this.rowSelection}
        expandedRowRender={this.expandedRowRender}
        onRow={this.onRow}
        columns={this.columns}
        dataSource={filteredDataSource || dataSource}
      />
    );
  }
}

export default DragDropContext(HTML5Backend)(AssignConnectors);
