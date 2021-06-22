import * as React from "react";
import * as ReactDOM from "react-dom";
import Options from "./options";

import { configureFakeBackend } from "../shared/configureFakeBackend";
configureFakeBackend();

chrome.tabs.query({ active: true, currentWindow: true }, (tab) => {
  ReactDOM.render(<Options />, document.getElementById("options"));
});
