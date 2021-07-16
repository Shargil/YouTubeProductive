import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { Button, Modal, Select } from "antd";
const { Option } = Select;

import "./deepFocus.scss";

import { EXTN_MODE, FOCUS_LEVEL } from "../../constantsDemo";
import { User } from "../../interfaces/User";

// Create a dom element to render this component to
let containerElement = document.createElement("div");
containerElement.setAttribute("id", "deepFocusContainer");
document.body.appendChild(containerElement);

export function DeepFocus({ }): JSX.Element {
  // ----- State -----
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [limitMinutes, setLimitMinutes] = React.useState<number>(undefined);

  const time = 2000;
  useEffect(() => {
    main();
    // Listen to when another deepFocus.js (from different tab) say to Block.
    chrome.runtime.onMessage.addListener(function (req, sender, sendRes) {
      if (req.backgroundFuncs && req.backgroundFuncs === "blockUI") blockUI();
    });
  }, []);

  const main = () => {
    chrome.storage.sync.get("user", ({ user }: { user?: User }) => {
      if (user.focus.focusLevel === FOCUS_LEVEL.DeepFocus) {
        if (shouldBeBlocked(user.focus)) {
          blockUI();
          changeToSearchOnly();
          chrome.runtime.sendMessage(
            { contentScriptFuncs: "blockAllOtherYouTubeTabs" },
            (res) => { }
          );
          return;
        }
        if (deepFocusNeedToRunOnThisExtensionMode(user.extensionMode)) {
          if (inMiddleOfSession(user.focus)) {
            continuoInterval();
          } else {
            setIsModalVisible(true);
          }
        } else {
          continuoInterval();
        }
      } else {
        continuoInterval();
      }
    });
  };

  const continuoInterval = () => {
    setTimeout(main, time);
  };

  const blockDurationMinutes = 10;
  const shouldBeBlocked = (focus: User["focus"]) => {
    const blockStartTime = new Date(focus.blockStartTime).getTime();
    const currTime = new Date().getTime();
    let blockUntil = new Date(focus.blockStartTime);
    blockUntil.setMinutes(blockUntil.getMinutes() + blockDurationMinutes);

    return blockStartTime < currTime && currTime < blockUntil.getTime();
  };

  const blockUI = () => {
    document.body.innerHTML =
      "<div style='text-align: center; font-size: 14px; margin-top: 200px'; line-height: 1.4em;>" +
      "<div>The time you set for this session is over :/</div>" +
      "<br/>" +
      "<div>YouTube is blocked for " +
      blockDurationMinutes +
      " minuets, so you can ease out of the need to watch.</div>" +
      "<div>After, you can refresh the page. YouTube Productive will be set to SearchOnly so you can continue with no distractions.</div>" +
      "<div>Stopping watching YouTube is really f*cking annoying. Sometimes, it's helps me to think about how much hours I could continue and waste.</div>" +
      "<div>Question... if it was your last day on earth what would you do right now?</div>" +
      "<div>P.S Redesign Me Please!</div>" +
      "</div>";
    // "You should probably not be here anymore:/ and whats the fastest way to make a human being change a tab? ADssss."
    // Maybe create stupid ad games that loosing is when you clicking them, ot the opposite, or just games when loosing it click the ad as punishment. 
    muteAudio();
  };

  const muteAudio = () => {
    console.log("mute all audios...");
    const audios = document.getElementsByTagName("audio");
    for (let i = 0; i < audios.length; i++) {
      console.log(audios[i]);
      audios[i].muted = true;
    }
  };

  const changeToSearchOnly = () => {
    chrome.storage.sync.get("user", (res) => {
      let updatedUser: User = res.user;
      updatedUser.extensionMode = EXTN_MODE.SearchOnly;
      chrome.storage.sync.set({ user: updatedUser }, () => { });
    });
  };

  const deepFocusNeedToRunOnThisExtensionMode = (extensionMode) => {
    return extensionMode === EXTN_MODE.Filter;
  };

  const inMiddleOfSession = (focus: User["focus"]) => {
    const currTime = new Date();
    return (
      new Date(focus.sessionStartTime).getTime() < currTime.getTime() &&
      currTime.getTime() < new Date(focus.blockStartTime).getTime()
    );
  };

  const useUntil = (limitMinutes) => {
    let date = new Date();
    date.setMinutes(date.getMinutes() + limitMinutes);
    return date.toTimeString().split(" ")[0].slice(0, 5);
  };

  const calcBlockStartTime = (minutesToBlock) => {
    let blockStartTime = new Date();
    blockStartTime.setMinutes(blockStartTime.getMinutes() + minutesToBlock);
    return blockStartTime.toLocaleString();
  };

  // ----- On Events -----
  const onSave = () => {
    chrome.storage.sync.get("user", ({ user }) => {
      let updatedUser: User = user;
      updatedUser.focus.sessionStartTime = new Date().toLocaleString();
      updatedUser.focus.blockStartTime = calcBlockStartTime(limitMinutes);
      chrome.storage.sync.set({ user: updatedUser }, () => {
        setIsModalVisible(false);
        main();
      });
    });
  };

  const onChangeMinutes = (value: string) => {
    setLimitMinutes(parseInt(value));
  };
  return (
    <div>
      <Modal
        title="Deep Focus - Making an aware decision is better!"
        // title={<img src={logo} alt="Logo" />}
        visible={isModalVisible}
        zIndex={2500}
        closable={false}
        keyboard={false}
        maskClosable={false}
        destroyOnClose={true}
        maskStyle={{ backgroundColor: "rgba(0, 0, 0, 0.75)" }}
        footer={[
          <div className="footer-container" key={"1"}>
            {/* <p className="footer-text">
              After the time is up, if the video is about to end, no worry, you
              can finish it :) (WIP)
            </p> */}
            <Button
              key="submit"
              type="primary"
              onClick={onSave}
              disabled={limitMinutes === undefined}
            >
              Save
            </Button>
          </div>,
        ]}
      >
        <p>Deicide how much time you want to spend on YouTube right now:</p>

        <div className="childrenInRow">
          <div className="select-container">
            <Select
              style={{ width: 180 }}
              dropdownStyle={{ zIndex: 2501 }}
              onChange={onChangeMinutes}
              placeholder="Select Session Time"
            >
              <Option value="1">1 min</Option>
              <Option value="10">10 min</Option>
              <Option value="15">15 min</Option>
              <Option value="30">30 min</Option>
              <Option value="45">45 min</Option>
            </Select>
          </div>
          {limitMinutes ? (
            <p>
              Use until: <strong>{useUntil(limitMinutes)}</strong>
            </p>
          ) : null}
        </div>
      </Modal>
    </div>
  );
}

ReactDOM.render(<DeepFocus />, document.getElementById("deepFocusContainer"));

// check if we are in deep focus mode
//  check if shouldBeBlocked
//        block
//        change back to search Only
//        return
//  check if deepFocusNeedToRunOnThisExtensionMode(MyYouTube?)
//      check if we inMiddleOfSession
//          add this second
//      else
//          show new session modal (and then count)

// Scenarios:
// - Entering a youtube watching the whole time in same tab
// - Start watching in one tab and finish in another one
// - open many tabs, watch in one of them, stopping, come back tomorrow (should it auto restart to search only?)
// - open many tabs, watch in one of them, changing to searchOnly, what happens in the different tabs? (Maybe the block function should happen in all? maybe reload in all)
// - Start watch in one tab, stop watching, come back to another one in two hours
