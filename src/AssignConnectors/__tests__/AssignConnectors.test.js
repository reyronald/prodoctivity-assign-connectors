import React from "react";
import { render } from "react-dom";
import { Simulate } from "react-dom/test-utils";
import noop from "noop2";
import AssignConnectors from "../";

describe("AssignConnectors", () => {
  it("should render properly and call onChange immediately", () => {
    const onChangeConnectorsToAssign = jest.fn();
    const mountNode = document.createElement("div");
    render(
      <AssignConnectors
        connectors={getData()}
        onChange={noop}
        onChangeConnectorsToAssign={onChangeConnectorsToAssign}
      />,
      mountNode
    );

    expect(onChangeConnectorsToAssign).toHaveBeenCalledTimes(1);
    expect(onChangeConnectorsToAssign).toHaveBeenLastCalledWith([
      {
        key: "Social Security Database",
        name: "Social Security Database",
        output: [],
        shouldDisableOnData: true,
        shouldDisableOnNoData: false,
        noDataMessage: ""
      },
      {
        key: "Customers",
        name: "Customers",
        output: [],
        shouldDisableOnData: true,
        shouldDisableOnNoData: false,
        noDataMessage: ""
      },
      {
        key: "People",
        name: "People",
        output: [],
        shouldDisableOnData: true,
        shouldDisableOnNoData: false,
        noDataMessage: ""
      }
    ]);
  });

  it("checking (selecting) connectors should work", () => {
    const onChangeConnectorsToAssign = jest.fn();
    const mountNode = document.createElement("div");
    let assignedConnectors = null;
    render(
      <AssignConnectors
        connectors={getData()}
        onChange={noop}
        onChangeConnectorsToAssign={args => {
          onChangeConnectorsToAssign(args);
          assignedConnectors = args;
        }}
      />,
      mountNode
    );

    const selectionInputs = mountNode.querySelectorAll(
      ".ant-table-selection-column input"
    );
    selectionInputs[1].checked = true;
    Simulate.change(selectionInputs[1]);
    selectionInputs[3].checked = true;
    Simulate.change(selectionInputs[3]);

    const selectedConnectors = assignedConnectors.filter(a => a.selected);
    expect(onChangeConnectorsToAssign).toHaveBeenCalledTimes(3);
    expect(selectedConnectors).toHaveLength(2);
    expect(selectedConnectors.map(sc => sc.name)).toEqual([
      "Social Security Database",
      "People"
    ]);

    selectionInputs[1].checked = false;
    Simulate.change(selectionInputs[1]);
    const selectedConnectors2 = assignedConnectors.filter(a => a.selected);
    expect(onChangeConnectorsToAssign).toHaveBeenCalledTimes(4);
    expect(selectedConnectors2).toHaveLength(1);
    expect(selectedConnectors2.map(sc => sc.name)).toEqual(["People"]);

    /**
     * Testing filters
     */
    const filterIcon = mountNode.querySelector('i[title="Filter menu"]');
    Simulate.click(filterIcon);

    const menuItems = Array.from(
      mountNode.querySelectorAll(".ant-dropdown-menu-item")
    );

    const getMenuItem = value => {
      return menuItems.find(menuItem =>
        Array.from(menuItem.querySelectorAll("span")).some(
          span => span.textContent === value
        )
      );
    };

    // 'Selected' filter
    const selectedMenuItem = getMenuItem("Selected");
    Simulate.click(selectedMenuItem);
    Simulate.click(mountNode.querySelector(".confirm"));
    expect(mountNode.querySelectorAll("tr td:nth-of-type(3)")).toHaveLength(1);

    // 'Unselected' filter
    const unselectedMenuItem = getMenuItem("Unselected");
    Simulate.click(unselectedMenuItem);
    Simulate.click(mountNode.querySelector(".confirm"));
    expect(mountNode.querySelectorAll("tr td:nth-of-type(3)")).toHaveLength(2);

    // 'All' filter
    const allMenuItem = getMenuItem("All");
    Simulate.click(allMenuItem);
    Simulate.click(mountNode.querySelector(".confirm"));
    expect(mountNode.querySelectorAll("tr td:nth-of-type(3)")).toHaveLength(3);
  });

  it("fuzzy search should work", () => {
    const mountNode = document.createElement("div");
    render(
      <AssignConnectors connectors={getData()} onChange={noop} />,
      mountNode
    );

    const search = mountNode.querySelector('input[name="search"]');
    search.value = "ssd";
    Simulate.change(search);

    const tableCells = mountNode.querySelectorAll("tr td:nth-of-type(3)");
    const tableCell = tableCells[0];
    const searchedConnector = tableCell.textContent;
    expect(searchedConnector).toBe("Social Security Database");
    expect(tableCells).toHaveLength(1);
    expect(tableCell).toMatchSnapshot();

    search.value = "";
    Simulate.change(search);
    expect(mountNode.querySelectorAll("tr td:nth-of-type(3)")).toHaveLength(3);
  });

  it("should call onChange with updated data when UI is interacted with", () => {
    const onChangeConnectorsToAssign = jest.fn();
    const mountNode = document.createElement("div");
    render(
      <AssignConnectors
        connectors={[getData()[0]]}
        onChange={noop}
        onChangeConnectorsToAssign={onChangeConnectorsToAssign}
      />,
      mountNode
    );

    Simulate.click(mountNode.querySelector(".ant-table-row-expand-icon"));

    // Testing `output`
    const checkbox = mountNode.querySelector('input[value="Last Name"]');
    checkbox.checked = true;
    Simulate.change(checkbox);

    expect(onChangeConnectorsToAssign).toHaveBeenCalledTimes(2);
    expect(onChangeConnectorsToAssign).toHaveBeenLastCalledWith([
      {
        key: "Social Security Database",
        name: "Social Security Database",
        output: [{ name: "Last Name" }],
        shouldDisableOnData: true,
        shouldDisableOnNoData: false,
        noDataMessage: ""
      }
    ]);

    // Testing `shouldDisableOnData`
    const shouldDisableOnData = mountNode.querySelector(
      `input[name="shouldDisableOnData"][value="${false}"]`
    );
    shouldDisableOnData.checked = false;
    Simulate.change(shouldDisableOnData);

    expect(onChangeConnectorsToAssign).toHaveBeenLastCalledWith([
      {
        key: "Social Security Database",
        name: "Social Security Database",
        output: [{ name: "Last Name" }],
        shouldDisableOnData: false,
        shouldDisableOnNoData: false,
        noDataMessage: ""
      }
    ]);

    // Testing `shouldDisableOnNoData`
    const shouldDisableOnNoData = mountNode.querySelector(
      `input[name="shouldDisableOnNoData"][value="${true}"]`
    );
    shouldDisableOnNoData.checked = true;
    Simulate.change(shouldDisableOnNoData);
    expect(onChangeConnectorsToAssign).toHaveBeenLastCalledWith([
      {
        key: "Social Security Database",
        name: "Social Security Database",
        output: [{ name: "Last Name" }],
        shouldDisableOnData: false,
        shouldDisableOnNoData: true,
        noDataMessage: ""
      }
    ]);

    // Testing `noDataMessage`
    const textarea = mountNode.querySelector("textarea");
    textarea.value = "No data message";
    Simulate.change(textarea);
    expect(onChangeConnectorsToAssign).toHaveBeenLastCalledWith([
      {
        key: "Social Security Database",
        name: "Social Security Database",
        output: [{ name: "Last Name" }],
        shouldDisableOnData: false,
        shouldDisableOnNoData: true,
        noDataMessage: "No data message"
      }
    ]);
  });

  it("should not crash expanding connector that has no data element in output mapping", () => {
    const onChangeConnectorsToAssign = jest.fn();
    const mountNode = document.createElement("div");
    render(
      <AssignConnectors
        connectors={[
          {
            name: "Social Security Database",
            inputMapping: [{ dataElement: { name: "Identification" } }],
            outputMapping: [
              // Mapping object Doesn't have a "dataElement" prop
              { dataLookupExpression: "name" }
            ]
          }
        ]}
        onChange={noop}
        onChangeConnectorsToAssign={onChangeConnectorsToAssign}
      />,
      mountNode
    );

    Simulate.click(mountNode.querySelector(".ant-table-row-expand-icon"));
  });

  it("rows drag-n-drop mechanics should work as expected", () => {
    const onChange = jest.fn();
    const mountNode = document.createElement("div");
    // `react-dnd` adds event listeners to the `window` object. If we don't
    // attach our `mountNode` to the body of the document then their listeners
    // won't get called
    // https://github.com/react-dnd/react-dnd/issues/556
    document.body.appendChild(mountNode);
    render(
      <AssignConnectors connectors={getData()} onChange={onChange} />,
      mountNode
    );

    const getTableCells = () =>
      Array.from(mountNode.querySelectorAll("tr td:nth-of-type(3)"));

    expect(getTableCells().map(cell => cell.textContent)).toEqual([
      "Social Security Database",
      "Customers",
      "People"
    ]);

    const createBubbledEvent = (type, props = {}) => {
      const event = new Event(type, { bubbles: true });
      Object.assign(event, props);
      return event;
    };

    // Act & Assert 0: Drag-n-drop but don't move or change anything
    const tableCells0 = getTableCells();
    const startingNode0 = tableCells0[0];
    const endingNode0 = tableCells0[0];
    startingNode0.dispatchEvent(
      createBubbledEvent("dragstart", { clientX: 0, clientY: 0 })
    );
    endingNode0.dispatchEvent(
      createBubbledEvent("drop", { clientX: 0, clientY: 0 })
    );
    expect(getTableCells().map(cell => cell.textContent)).toEqual([
      "Social Security Database",
      "Customers",
      "People"
    ]);

    // Act & Assert 1: Drag-n-drop downward from first row to last row (third)
    const tableCells = getTableCells();
    const startingNode = tableCells[0];
    const endingNode = tableCells[2];
    startingNode.dispatchEvent(
      createBubbledEvent("dragstart", { clientX: 0, clientY: 0 })
    );

    endingNode.dispatchEvent(
      createBubbledEvent("dragover", { clientX: 0, clientY: 1 })
    );
    expect(
      Array.from(endingNode.closest("tr").classList).some(c =>
        c.endsWith("-downward")
      )
    ).toBeTruthy();

    endingNode.dispatchEvent(
      createBubbledEvent("drop", { clientX: 0, clientY: 1 })
    );
    expect(getTableCells().map(cell => cell.textContent)).toEqual([
      "Customers",
      "People",
      "Social Security Database"
    ]);

    // Act & Assert 2: Drag-n-drop upward from last row (third) to second row
    const tableCells2 = getTableCells();
    const startingNode2 = tableCells2[2];
    const endingNode2 = tableCells2[1];

    startingNode2.closest("tr").getBoundingClientRect = () => ({
      top: 20,
      left: 0
    });
    startingNode2.dispatchEvent(
      createBubbledEvent("dragstart", { clientX: 0, clientY: 20 })
    );

    endingNode2.dispatchEvent(
      createBubbledEvent("dragover", { clientX: 0, clientY: 10 })
    );
    expect(
      Array.from(endingNode2.closest("tr").classList).some(c =>
        c.endsWith("-upward")
      )
    ).toBeTruthy();

    endingNode2.dispatchEvent(
      createBubbledEvent("drop", { clientX: 0, clientY: 10 })
    );
    expect(getTableCells().map(cell => cell.textContent)).toEqual([
      "Customers",
      "Social Security Database",
      "People"
    ]);
  });

  it("should throw error with invalid filter enum value", () => {
    const instance = new AssignConnectors.DecoratedComponent({
      onChange: noop,
      onChangeConnectorsToAssign: noop,
      connectors: []
    });

    expect(() =>
      instance.columns[0].onFilter("INVALID_FILTER_ENUM_VALUE")
    ).toThrowError(/^Unrecognized filter value: INVALID_FILTER_ENUM_VALUE$/);
  });
});

function getData() {
  return [
    {
      key: 1,
      name: "Social Security Database",
      inputMapping: [{ dataElement: { name: "Identification" } }],
      outputMapping: [
        { dataElement: { name: "First Name" } },
        { dataElement: { name: "Last Name" } },
        { dataElement: { name: "Gender" } }
      ]
    },
    {
      key: 2,
      name: "Customers",
      inputMapping: [{ dataElement: { name: "Customer Name" } }],
      outputMapping: [
        { dataElement: { name: "Identification" } },
        { dataElement: { name: "Address" } },
        { dataElement: { name: "Civil Status" } }
      ]
    },
    {
      key: 3,
      name: "People",
      inputMapping: [{ dataElement: { name: "Person Name" } }],
      outputMapping: [
        { dataElement: { name: "Age" } },
        { dataElement: { name: "Height" } }
      ]
    }
  ];
}
