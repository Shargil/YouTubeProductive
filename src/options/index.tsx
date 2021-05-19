import * as React from "react";
import * as ReactDOM from "react-dom";
import Options from "./options";

chrome.tabs.query({ active: true, currentWindow: true }, (tab) => {
  ReactDOM.render(<Options />, document.getElementById("options"));
});
