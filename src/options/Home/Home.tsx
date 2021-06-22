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
        One liner which state the vision soo well it hurts.
      </Title>
      <br></br>
      <Title level={5}>Hey Savera, new version of YoutubeProductive :)</Title>
      <ul>
        <p>New things:</p>
        <li>
          - I reimagine the "smart time limit" and created "deep focus". It
          works differently, so give it a chance.
        </li>
        <li>
          - Now, after installation, there is onboarding/ setup process in the
          extension options (That you are going through right now!)
        </li>
        <br></br>
        <p>Still working on:</p>
        <li>
          - The creation of channels list for MyYouTube Mode doesn't really work
          (because I don't have a backend server yet), so if you create a list,
          it wouldn't really effect anything :/ but you can try it and see the
          UX
        </li>
        <li> - Everything need to be designed!</li>
      </ul>
      {firstOptionsConfig ? (
        <>
          <p>
            <strong>
              Choose what type of videos you want ot don't want to see. start
              now!
            </strong>
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
