import { Button } from "antd";
import React from "react";
import { useHistory } from "react-router-dom";

export function NavigateToButton({
  text,
  clickOnElementId,
  path,
  disabled,
  onClick,
}): JSX.Element {
  let history = useHistory();

  const navigateTo = (path) => {
    history.push(path);
  };

  const clickOnElement = (elementId) => {
    document.getElementById(elementId).click();
  };

  return (
    <Button
      type="primary"
      disabled={disabled}
      onClick={() => {
        clickOnElement(clickOnElementId);
        navigateTo(path);
        if (onClick) onClick();
      }}
    >
      {text}
    </Button>
  );
}
