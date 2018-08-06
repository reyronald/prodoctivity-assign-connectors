import { mergeConnectorsAndFormConnectors } from "../utils";

describe("mergeConnectorsAndFormConnectors", () => {
  it("should create default ConnectorToAssign array when there were no form connectors saved", () => {
    const connectors = [
      {
        name: "Social Security Database",
        outputMapping: [
          { dataElement: { name: "First Name" } },
          { dataElement: { name: "Last Name" } },
          { dataElement: { name: "Gender" } }
        ]
      }
    ];

    expect(mergeConnectorsAndFormConnectors(connectors)).toEqual([
      {
        key: "Social Security Database",
        name: "Social Security Database",
        output: [],
        shouldDisableOnData: true,
        shouldDisableOnNoData: false,
        noDataMessage: ""
      }
    ]);
  });

  it("should add default properties to ConnectorToAssign if were not present", () => {
    const connectors = [
      {
        name: "Social Security Database",
        outputMapping: [
          { dataElement: { name: "First Name" } },
          { dataElement: { name: "Last Name" } },
          { dataElement: { name: "Gender" } }
        ]
      }
    ];

    const formConnectors = [
      {
        name: "Social Security Database",
        output: []
      }
    ];

    expect(
      mergeConnectorsAndFormConnectors(connectors, formConnectors)
    ).toEqual([
      {
        key: "Social Security Database",
        name: "Social Security Database",
        output: [],
        selected: true,
        shouldDisableOnData: true,
        shouldDisableOnNoData: false,
        noDataMessage: ""
      }
    ]);
  });

  it("existing data elements from connectors should remain in form connectors", () => {
    const connectors = [
      {
        name: "Social Security Database",
        outputMapping: [
          { dataElement: { name: "First Name" } },
          { dataElement: { name: "Last Name" } },
          { dataElement: { name: "Gender" } }
        ]
      }
    ];

    const formConnectors = [
      {
        name: "Social Security Database",
        output: [{ name: "First Name" }, { name: "Last Name" }]
      }
    ];

    expect(
      mergeConnectorsAndFormConnectors(connectors, formConnectors)
    ).toEqual([
      {
        key: "Social Security Database",
        name: "Social Security Database",
        output: [{ name: "First Name" }, { name: "Last Name" }],
        selected: true,
        shouldDisableOnData: true,
        shouldDisableOnNoData: false,
        noDataMessage: ""
      }
    ]);
  });

  it("not existing data elements from connectors should be removed in form connectors", () => {
    const connectors = [
      {
        name: "Social Security Database",
        outputMapping: [
          { dataElement: { name: "Last Name" } },
          { dataElement: { name: "Gender" } }
        ]
      }
    ];

    const formConnectors = [
      {
        name: "Social Security Database",
        output: [{ name: "First Name" }, { name: "Last Name" }]
      }
    ];

    expect(
      mergeConnectorsAndFormConnectors(connectors, formConnectors)
    ).toEqual([
      {
        key: "Social Security Database",
        name: "Social Security Database",
        output: [{ name: "Last Name" }],
        selected: true,
        shouldDisableOnData: true,
        shouldDisableOnNoData: false,
        noDataMessage: ""
      }
    ]);
  });

  it("not existing connectors should be removed from form connectors", () => {
    const connectors = [
      {
        name: "Customers",
        outputMapping: [
          { dataElement: { name: "Identification" } },
          { dataElement: { name: "Address" } },
          { dataElement: { name: "Civil Status" } }
        ]
      }
    ];

    const formConnectors = [
      {
        name: "Social Security Database",
        output: []
      }
    ];

    expect(
      mergeConnectorsAndFormConnectors(connectors, formConnectors)
    ).toEqual([
      {
        key: "Customers",
        name: "Customers",
        output: [],
        shouldDisableOnData: true,
        shouldDisableOnNoData: false,
        noDataMessage: ""
      }
    ]);
  });

  it("properties from form connectors should not be lost", () => {
    const connectors = [
      {
        name: "Social Security Database",
        outputMapping: [
          { dataElement: { name: "First Name" } },
          { dataElement: { name: "Last Name" } },
          { dataElement: { name: "Gender" } }
        ]
      }
    ];

    const formConnectors = [
      {
        name: "Social Security Database",
        output: [],
        shouldDisableOnData: false,
        shouldDisableOnNoData: true,
        noDataMessage: "No data message"
      }
    ];

    expect(
      mergeConnectorsAndFormConnectors(connectors, formConnectors)
    ).toEqual([
      {
        key: "Social Security Database",
        name: "Social Security Database",
        output: [],
        selected: true,
        shouldDisableOnData: false,
        shouldDisableOnNoData: true,
        noDataMessage: "No data message"
      }
    ]);
  });

  it("should preverse the order of the connectors when building assigned connectors", () => {
    const connectors = [
      {
        name: "Social Security Database",
        outputMapping: [{ dataElement: { name: "First Name" } }]
      },
      {
        name: "Customers",
        outputMapping: [{ dataElement: { name: "First Name" } }]
      }
    ];

    const formConnectors = [
      {
        name: "Customers",
        output: []
      }
    ];

    expect(
      mergeConnectorsAndFormConnectors(connectors, formConnectors)
    ).toEqual([
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
        selected: true,
        shouldDisableOnData: true,
        shouldDisableOnNoData: false,
        noDataMessage: ""
      }
    ]);
  });
});
