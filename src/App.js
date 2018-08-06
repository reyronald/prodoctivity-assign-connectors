import * as React from "react";
import AssignConnectors from "./AssignConnectors";

const connectors = getConnectors();
const formConnectors = getFormConnectors();

export default class AssignConnectorsApp extends React.PureComponent {
  state = { connectorsToAssign: [], formConnectors: [] };

  onChange = formConnectors => this.setState({ formConnectors });
  onChangeConnectorsToAssign = connectorsToAssign =>
    this.setState({ connectorsToAssign });

  render() {
    return (
      <div>
        <AssignConnectors
          connectors={connectors}
          formConnectors={formConnectors}
          onChange={this.onChange}
          onChangeConnectorsToAssign={this.onChangeConnectorsToAssign}
        />

        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <div>
            <h5>Internal Component State</h5>
            <pre>{JSON.stringify(this.state.connectorsToAssign, " ", 2)}</pre>
          </div>

          <div>
            <h5>To send to back-end</h5>
            <pre>{JSON.stringify(this.state.formConnectors, " ", 2)}</pre>
          </div>
        </div>
      </div>
    );
  }
}

function getConnectors() {
  return [
    {
      name: "Social Security Database",
      inputMapping: [{ dataElement: { name: "Identification" } }],
      outputMapping: [
        { dataElement: { name: "First Name" } },
        { dataElement: { name: "Last Name" } },
        { dataElement: { name: "Gender" } }
      ]
    },
    {
      name: "Customers",
      inputMapping: [{ dataElement: { name: "Customer Name" } }],
      outputMapping: [
        { dataElement: { name: "Identification" } },
        { dataElement: { name: "Address" } },
        { dataElement: { name: "Civil Status" } }
      ]
    },
    {
      name: "People",
      inputMapping: [{ dataElement: { name: "Person Name" } }],
      outputMapping: [
        { dataElement: { name: "Age" } },
        { dataElement: { name: "Height" } }
      ]
    },
    {
      name: "Cities",
      inputMapping: [{ dataElement: { name: "City Name" } }],
      outputMapping: [
        { dataElement: { name: "Country" } },
        { dataElement: { name: "Population" } }
      ]
    },
    {
      name: "Plans",
      inputMapping: [{ dataElement: { name: "Plan Name" } }],
      outputMapping: [{ dataElement: { name: "Cost" } }]
    },
    {
      name: "Nationalities",
      inputMapping: [{ dataElement: { name: "Nationality" } }],
      outputMapping: [{ dataElement: { name: "Country" } }]
    }
  ];
}

function getFormConnectors() {
  // return undefined
  return [
    {
      name: "People",
      output: [],
      shouldDisableOnData: true,
      shouldDisableOnNoData: false,
      noDataMessage: ""
    }
  ];
}
