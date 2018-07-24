import React from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import "./index.css";

import AssignConnectors from "./AssignConnectors";

const data = [
  { key: 1, name: "Junta Central Electoral" },
  { key: 2, name: "Conector X" },
  { key: 3, name: "Conector Y" },
  { key: 4, name: "Conector Z" }
];

ReactDOM.render(
  <AssignConnectors completeDataSource={data} />,
  document.getElementById("container")
);
