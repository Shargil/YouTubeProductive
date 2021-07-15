import { Button, Col, message, Radio, Row } from "antd";
import Title from "antd/lib/typography/Title";
import React from "react";
import { User } from "../../interfaces/User";
import { EXTN_MODE, FOCUS_LEVEL } from "../../constantsDemo";
import "./FocusLevel.scss"
import { InputCard } from "../../shared/InputCard/InputCard";

export function FocusLevel({ firstOptionsConfig }): JSX.Element {
  // ----- State -----
  const [value, setValue] = React.useState<FOCUS_LEVEL>();
  const [isButtonDisabled, setIsButtonDisabled] = React.useState(true);

  // ----- On Events -----
  const onChange = (e) => {
    setValue(e.target.value);
    setIsButtonDisabled(false);
  };

  const onFinish = () => {
    chrome.storage.sync.get("user", (res) => {
      let updatedUser: User = res.user;
      updatedUser.focus.focusLevel = value;
      if (value === FOCUS_LEVEL.DeepFocus)
        updatedUser.extensionMode = EXTN_MODE.SearchOnly;
      updatedUser.firstOptionsConfig = false;
      chrome.storage.sync.set({ user: updatedUser }, () => {
        message.success(
          <>
            <div>First Options Setup Successful!</div>
            <div>Go enjoy YouTube that grows you,</div>
            <div>
              You can come back here, to options, in any time and change
              anything
            </div>
          </>,
          10
        );
        setIsButtonDisabled(true);
      });
    });
  };

  const onSave = () => {
    chrome.storage.sync.get("user", (res) => {
      let updatedUser: User = res.user;
      updatedUser.focus.focusLevel = value;
      if (value === FOCUS_LEVEL.DeepFocus)
        updatedUser.extensionMode = EXTN_MODE.SearchOnly;
      chrome.storage.sync.set({ user: updatedUser }, () => {
        message.success("Your new options are saved!");
        setIsButtonDisabled(true);
      });
    });
  };

  return (
    <>
      <Row>
        <Col span={16} offset={3} style={{ minWidth: "500px" }}>
          <div className="only-one-section">
            <Title level={3}>Focus Level</Title>
            <Title level={5}>Decide how much help you want with staying in focus and not letting YouTube become a distraction.</Title>
            <div className="spacer"></div>

            {/* <div className="cards-container">
            <InputCard
              value={value}
              isChecked={value === FOCUS_LEVEL.Regular}
              onChange={() => { setValue(FOCUS_LEVEL.Regular) }}
              title="Regular"
              imgPath=""
              points={["When Entering YouTube you can watch videos regularly.", "Default extension mode: MyYouTube"]} />
            <InputCard
              value={value}
              isChecked={value === FOCUS_LEVEL.DeepFocus}
              onChange={() => { setValue(FOCUS_LEVEL.DeepFocus) }}
              title="Deep Focus"
              imgPath=""
              points={["When Entering YouTube no suggestions, no distractions", "Default extension mode: SearchOnly", "When switching to MyYouTube mode you will need to decide how much time you want to spend in the session! After the time is up, you will be blocked from YouTube for couple of minutes. Set back to searchOnly so you be able to use YouTube, if you need it to work."]} />
          </div> */}

            <Radio.Group onChange={onChange} value={value} className="cards-container">

              <Radio value={FOCUS_LEVEL.Regular} className="radio-input-card-container">
                <InputCard
                  title="Regular"
                  checked={value === FOCUS_LEVEL.Regular}
                  imgPath="../../assets/FocusRegular.svg"
                  points={["When Entering YouTube you can watch videos regularly.", "Default extension mode: MyYouTube."]} />
              </Radio>

              <Radio value={FOCUS_LEVEL.DeepFocus} className="radio-input-card-container">
                <InputCard
                  title="Deep Focus"
                  checked={value === FOCUS_LEVEL.DeepFocus}
                  imgPath="../../assets/DeepFocus.svg"
                  points={["When Entering YouTube: no suggestions, no distractions.", "Default extension mode: SearchOnly.", "When switching to MyYouTube mode you will need to decide how much time you want to spend in the session! After the time is up, you will be blocked from YouTube for couple of minutes. Set back to searchOnly so you be able to use YouTube, if you need it for work."]} />
              </Radio>
            </Radio.Group>
            {firstOptionsConfig ? (
              <Button type="primary" onClick={onFinish} disabled={isButtonDisabled} className="submit-button">
                Finish
              </Button>
            ) : (
              <Button type="primary" onClick={onSave} disabled={isButtonDisabled} className="submit-button">
                Save
              </Button>
            )}
          </div>
        </Col>
      </Row>
    </>
  );
}
