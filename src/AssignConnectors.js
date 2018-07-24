// @flow
import React from "react";
import { Table, Checkbox, Icon, Divider, Radio, Input } from "antd";
import { filter, match } from "fuzzaldrin-plus";
import { splitMatches } from "./utils";

const rowSelection = {
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

const style = { display: "block", marginLeft: 0 };

export default class AssignConnectors extends React.Component<
  { completeDataSource: {}[] },
  { searchText: string, dataSource: {}[] }
> {
  state = { searchText: "", dataSource: this.props.completeDataSource };

  columns = [
    {
      title: "Connector",
      dataIndex: "name",
      key: "name",
      sortOrder: "ascend",
      onHeaderCell(column) {
        return { id: column.key };
      },
      sorter(a, b) {
        // TODO try set this to 'ascend' or something
        if (a.name == null) return -1;
        if (b.name == null) return 1;
        if (a.name.toLowerCase() > b.name.toLowerCase()) return -1;
        if (a.name.toLowerCase() < b.name.toLowerCase()) return 1;
        return 0;
      },
      filterMultiple: false,
      filters: [
        { text: "Selected", value: "SELECTED" },
        { text: "Unselected", value: "UNSELECTED" },
        { text: "All", value: "ALL" }
      ],
      onFilter(value, record) {
        if (value === "SELECTED") {
          return record.selected;
        }
        if (value === "UNSELECTED") {
          return !record.selected;
        }
        return true;
      },
      render: text => {
        const matches = match(text, this.state.searchText);
        const splitMatchesResult = splitMatches(text, matches);

        const result = splitMatchesResult.reduce((prev, curr) => {
          return (
            <React.Fragment>
              {prev}
              {curr.isMatch ? <strong>{curr.str}</strong> : curr.str}
            </React.Fragment>
          );
        }, "");
        console.log(splitMatchesResult);
        return result;
        return text;
      }
    }
  ];

  handleSearchTextChange = (e: SyntheticEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;

    // const dataSource = this.props.completeDataSource.filter(record => {
    //   return record.name.toLowerCase().includes(value.toLowerCase());
    // });

    const dataSource = value
      ? filter(this.props.completeDataSource, value, {
          key: "name"
        })
      : this.props.completeDataSource;

    this.setState({ searchText: value, dataSource });
  };

  render() {
    const { searchText, dataSource } = this.state;

    return (
      <Table
        components={{
          header: {
            cell: props => {
              if (props.id === "name") {
                return (
                  <th
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}
                    {...props}
                  >
                    {props.children}
                    <Input
                      style={{ width: "70%" }}
                      value={searchText}
                      onChange={this.handleSearchTextChange}
                    />
                  </th>
                );
              }
              return <th {...props} />;
            }
          }
        }}
        bordered
        rowSelection={rowSelection}
        columns={this.columns}
        dataSource={dataSource}
        expandedRowRender={record => {
          return (
            <div style={{ display: "flex" }}>
              <Checkbox.Group style={{}}>
                <Checkbox style={style}>
                  Cedula <Icon type="key" />
                </Checkbox>
                <Checkbox style={style}>Nombre</Checkbox>
                <Checkbox style={style}>Apellido</Checkbox>
                <Checkbox style={style}>Direccion</Checkbox>
                <Checkbox style={style}>Estado Civil</Checkbox>
              </Checkbox.Group>

              <div>
                <Divider
                  type="vertical"
                  style={{ height: "80%", top: "10%" }}
                />
              </div>

              <div>
                <strong>Data found</strong>
                <div>
                  <Radio.Group defaultValue={true}>
                    <Radio style={style} value={true}>
                      Deshabilitar
                    </Radio>
                    <Radio style={style} value={false}>
                      Habilitar
                    </Radio>
                  </Radio.Group>
                </div>
              </div>

              <div>
                <strong>No data found</strong>
                <div>
                  <Radio.Group defaultValue={true}>
                    <Radio style={style} value={true}>
                      Allow complete
                    </Radio>
                    <Radio style={style} value={false}>
                      Do not allow complete
                    </Radio>
                  </Radio.Group>
                </div>
              </div>
            </div>
          );
        }}
      />
    );
  }
}
