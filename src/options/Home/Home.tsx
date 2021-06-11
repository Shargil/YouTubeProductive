import { Button } from "antd";
import Title from "antd/lib/typography/Title";
import React from "react";
import { NavigateToButton } from "../../shared/NavigateToButton/NavigateToButton";

export function Home({ firstOptionsConfig }): JSX.Element {
  // ----- State -----

  // ----- Hooks -----

  // ----- Extra Functions -----

  // ----- On Events -----
  return (
    <>
      <Title level={3}>Logo YouTube Productive</Title>
      <Title level={5}>
        One liner which state the vision so well it hurts.
      </Title>
      {firstOptionsConfig ? (
        <>
          <p>
            Choose what type of videos you want ot don't want to see. start now!
          </p>
          <NavigateToButton
            text="Let's Start!"
            clickOnElementId="MyYouTubeMenuItem"
            path="/MyYouTube"
            disabled={false}
            onClick={null}
          />
        </>
      ) : null}
    </>
  );
}
