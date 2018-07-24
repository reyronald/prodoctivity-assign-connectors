import React from "react";
import ReactDOM from "react-dom";
import { Icon } from "antd";
import "antd/dist/antd.css";
import "./index.css";

import AssignConnectors from "./AssignConnectors";

const data = [
  { key: 1, name: "Social Security Database" },
  { key: 2, name: "Connector X" },
  { key: 3, name: "Connector Y" },
  { key: 4, name: "Connector Z" }
];

ReactDOM.render(
  <main
    style={{
      padding: "24px 60px",
      backgroundColor: "white",
      maxWidth: 800,
      height: "100vh",
      margin: "0 auto"
    }}
  >
    <h1>Connectors</h1>

    <ul>
      <li>Rows are sortable by drag and dropping.</li>

      <li>
        <span style={{ textDecoration: "line-through" }}>
          Rows are sortable by alphabetical order using the{" "}
          <Icon type="caret-up" /> <Icon type="caret-down" /> icons.
        </span>{" "}
        <i>
          Removed because the order of the rows is relevant for the user and the
          data.
        </i>
      </li>

      <li>
        Selected and unselected rows are filterable using the{" "}
        <Icon type="filter" /> icon.
      </li>

      <li>
        The input filter does a fuzzy search among the connector names, but
        doesn't allow typos.
      </li>
      <li>
        Matched characters from the search filter will be highlighted in bold.
      </li>
    </ul>

    <AssignConnectors
      completeDataSource={data}
      onDataSourceChanged={console.log}
    />

    <footer>
      Ronald Rey <br />
      <a href="https://github.com/reyronald" target="_blank">
        https://github.com/reyronald
      </a>
      <br />
      <a href="mailto:reyronald@gmail.com">reyronald@gmail.com</a>
    </footer>
  </main>,
  document.getElementById("container")
);
