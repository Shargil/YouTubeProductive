import { Col, Row } from "antd";
import Title from "antd/lib/typography/Title";
import React from "react";
import { NavigateToButton } from "../../shared/NavigateToButton/NavigateToButton";
import "./Home.scss"

import { Player } from '@lottiefiles/react-lottie-player';

export function Home({ firstOptionsConfig }): JSX.Element {
  // ----- State -----

  // ----- Hooks -----

  // ----- Extra Functions -----

  // ----- On Events -----
  return (
    <Row>
      <Col span={8} offset={7} style={{ minWidth: "500px" }}>
        <div className="first-section">
          <Title level={3}>Create the YouTube that grows you.</Title>
          <Title level={5}>YouTube has amazing algorithms. Using magic, they know what videos going to keep us watching YouTube the longest.</Title>
          <div className="spacer"></div>
          <div className="img-container float-in-space">
            <img src="../../assets/HomeSalyOnPhone.png" alt="Addicted To The Phone" height="200"></img>
          </div>
          <Title level={5}>Too many times we find our selfs watching stupid videos at 3 AM or not doing the work that we should.</Title>
          <Title level={5}>But blocking YouTube all together is not the solution.</Title>
          <Title level={5}>There is too much stuff to learn, too many interesting quality videos.</Title>
          <Title level={5}>The time has come.</Title>
          <Player
            autoplay
            loop
            src="https://assets5.lottiefiles.com/packages/lf20_pfjyrl26.json"
            style={{ height: '80px', width: '80px' }}
          >
          </Player>
        </div>
        <div className="second-section">
          <div className="img-container">
            <img src="../../assets/Logo.svg" alt="YouTube Productive Logo" height="80"></img>
          </div>
          <Title level={5}>Decide what to watch and for how long.</Title>
          <Title level={5}>Break free out of bad YouTube habits or addiction.</Title>
          <div className="img-container">
            <img src="../../assets/HomeSalyOnARocket.png" alt="Good Usage" height="270"></img>
          </div>
          <Title level={5}>Choose what type of videos you want or don't want to see. start now!</Title>
          <div className="submit-button">
            {firstOptionsConfig ? (
              <NavigateToButton
                text="Let's Start!"
                clickOnElementId="MyYouTubeMenuItem"
                path="/MyYouTube"
                disabled={false}
                onClick={null}
              />
            ) : null}
          </div>
        </div>
      </Col>
    </Row>

  );
}
