import { Button, message, Radio } from "antd";
import Title from "antd/lib/typography/Title";
import React from "react";
import { User } from "../../interfaces/User";
import { EXTN_MODE, FOCUS_LEVEL } from "../../constantsDemo";

export function FocusLevel({ firstOptionsConfig }): JSX.Element {
  // ----- State -----
  const [value, setValue] = React.useState();
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
      <Title level={3}>Focus Level</Title>
      <Title level={5}>
        Decide how much help you want with staying in focus and not letting
        YouTube become a distraction
      </Title>
      <Radio.Group onChange={onChange} value={value}>
        <Radio value={FOCUS_LEVEL.Regular}>
          Regular
          <ul>
            <li>Default extension mode: MyYouTube</li>
          </ul>
        </Radio>
        <Radio value={FOCUS_LEVEL.DeepFocus}>
          Deep Focus
          <ul>
            <li>
              Default extension mode: SearchOnly (When entering youtube no
              suggestions, no distractions)
            </li>
            <li>
              When switching to MyYouTube you will need to{" "}
              <strong>decide how much time</strong> you want to spend in the
              upcoming session! After the time is up, you will be blocked from
              youtube for couple of minutes and then back to searchOnly so you
              be able to use youtube, if you need it to work.
            </li>
          </ul>
        </Radio>
      </Radio.Group>
      {firstOptionsConfig ? (
        <Button onClick={onFinish} disabled={isButtonDisabled}>
          Finish
        </Button>
      ) : (
        <Button onClick={onSave} disabled={isButtonDisabled}>
          Save
        </Button>
      )}
    </>

    // <RadioCard.Group onChange={onChange} value={value}>
    //     <RadioCard value={1}>
    //     <div>asd</div>
    //     </RadioCard>
    //     <RadioCard value={2} title="" media="" points="">B</RadioCard>
    //     <RadioCard value={3}>C</RadioCard>
    //     <RadioCard value={4}>D</RadioCard>
    // </Radio.Group>
  );
}
