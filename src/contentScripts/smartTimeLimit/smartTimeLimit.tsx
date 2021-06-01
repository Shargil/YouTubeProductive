import * as React from "react";
import * as ReactDOM from "react-dom";

import { Modal, Button, Select } from "antd";
import "./smartTimeLimit.scss";
import { User } from "../../interfaces/User";
import * as _ from "lodash/object";
import NewSessionOrContinueModal from "./newSessionOrContinueModal/newSessionOrContinueModal";

// import _ from "lodash/object";
// asd
// const logoPath = require("./assets/Logo.svg") as string;
// import logo from "./assets/Logo.jpg";
// import MySVG from "-!svg-react-loader!src/assets/images/name.svg";

const { Option } = Select;

export interface ISmartTimeLimit {
  sessionTimeInM: number;
  secondsUsed: secondsItem;
  blockUntil: string;
  deleteMe: number;
}

interface secondsItem {
  [second: string]: Boolean;
}

const blockDurationHours = 2;

let containerElement = document.createElement("div");
containerElement.setAttribute("id", "smartTimeLimitContainer");
document.body.appendChild(containerElement);

export default function SmartTimeLimit(props): JSX.Element {
  // ------ State ------
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [limitMinutes, setLimitMinutes] = React.useState<number>(undefined);
  const [
    isNewSessionOrContinueModalVisible,
    setIsNewSessionOrContinueModalVisible,
  ] = React.useState(false);

  const main = () => {
    chrome.storage.sync.get("user", ({ user }: { user?: User }) => {
      chrome.storage.local.get("smartTimeLimit", (res) => {
        if (user.extensionMode === "searchOnly") {
          return;
        }

        if (needToBeBlocked(res.smartTimeLimit)) {
          block();
          return;
        }

        if (didUseYouTubeInTheLast(res.smartTimeLimit, 1)) {
          console.log("is on 20 min break");
          // Treat it like the user took a 20 min break and remembers he is in a session, resume counting and let them continue normally
          countUse();
        } else if (didUseYouTubeInTheLast(res.smartTimeLimit, 60 * 2)) {
          // Was it a long break or the user "stopped"\"ended" the last session before time ended?
          // They expect to continue session or set up a new one? I am not sure, so let's ask.
          setIsNewSessionOrContinueModalVisible(true);
        } else {
          // more then 2 hours since last used, reset and choose new session
          startNewSession();
        }
      });
    });
  };

  // ------ Hooks ------
  React.useEffect(() => {
    main();
  }, []);

  // ------ Events ------
  window.addEventListener("focus", function (e) {
    console.log("Focused");
    // main();
  });

  // ------ Extra Functions ------
  const startNewSession = () => {
    resetSmartTimeLimit();
    showModal();
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const needToBeBlocked = (smartTimeLimit: ISmartTimeLimit) => {
    return smartTimeLimit.blockUntil < new Date().toLocaleString();
  };

  const didUseYouTubeInTheLast = (
    smartTimeLimit: ISmartTimeLimit,
    minutes: Number
  ) => {
    if (howManySecondsUsed(smartTimeLimit.secondsUsed) === 0) return false;

    let mostRecentSecondUsed = getLastElementOfAnObject(
      smartTimeLimit.secondsUsed
    );

    const minutesPassed =
      (new Date().getTime() - new Date(mostRecentSecondUsed).getTime()) /
      1000 /
      60;
    return minutesPassed < minutes;
  };

  const getLastElementOfAnObject = (obj: Object) => {
    // TODO: Probably not good implementation, maybe I need to use Map (although storage can't save map and covert is to objects) or use new property lastUsedSecond
    return Object.keys(obj)[Object.keys(obj).length - 1];
  };

  const resetSmartTimeLimit = () => {
    chrome.storage.local.get("smartTimeLimit", (res) => {
      let updatedSmartTimeLimit: ISmartTimeLimit = res.smartTimeLimit;
      updatedSmartTimeLimit.sessionTimeInM = null;
      updatedSmartTimeLimit.secondsUsed = {};
      updatedSmartTimeLimit.blockUntil = null;
      chrome.storage.local.set(
        { smartTimeLimit: updatedSmartTimeLimit },
        () => {}
      );
    });
  };

  const getCurrentDate = () => {
    return new Date().toLocaleString();
  };

  const howManySecondsUsed = (secondsUsed: secondsItem) => {
    return Object.keys(secondsUsed).length;
  };

  const countUse = () => {
    const secondInMS = 1 * 1000;
    const delta = secondInMS;

    // Interval every second
    const interval = setInterval(function () {
      // Check If the tab has focus or video playing is partially visible
      if (
        document.hasFocus() ||
        (tabIsAtLeastPartiallyVisible() && videoIsCurrentlyPlaying())
      ) {
        chrome.storage.local.get("smartTimeLimit", (res) => {
          // Add current second. (We count acutal second strings and not just adding ones to a variable
          // to make sure that couple of content scripts not adding more then one for the same second
          let updatedSmartTimeLimit: ISmartTimeLimit = res.smartTimeLimit;
          updatedSmartTimeLimit.secondsUsed[getCurrentDate()] = true;
          // chrome.runtime.sendMessage(
          //   {
          //     contentScriptFuncs: "secondsUsed",
          //     data: { currentSecondUsed: getCurrentDate() },
          //   },
          //   (res) => {}
          // );

          // Using local here because saving all the secondes used in storage.sync throws error
          chrome.storage.local.set(
            { smartTimeLimit: updatedSmartTimeLimit },
            () => {
              chrome.storage.local.get("smartTimeLimit", (res) => {
                let updatedSmartTimeLimit: ISmartTimeLimit = res.smartTimeLimit;

                const secondsUsed = howManySecondsUsed(
                  res.smartTimeLimit.secondsUsed
                );

                // Check if user run out of time
                if (secondsUsed >= res.smartTimeLimit.sessionTimeInM * 60) {
                  // Set up blockUntil
                  let blockUntil = new Date();
                  blockUntil.setHours(
                    blockUntil.getHours() + blockDurationHours
                  );
                  updatedSmartTimeLimit.blockUntil =
                    blockUntil.toLocaleString();
                  chrome.storage.local.set(
                    { smartTimeLimit: updatedSmartTimeLimit },
                    () => {}
                  );

                  // Block and stop the interval
                  block();
                  clearInterval(interval);
                }
              });
            }
          );
        });
      }
    }, delta);
  };

  const tabIsAtLeastPartiallyVisible = () => {
    return !document.hidden;
  };

  const videoIsCurrentlyPlaying = () => {
    // TODO: Implement this
    return true;
  };

  const block = () => {
    document.body.innerHTML =
      "<div style='text-align: center; font-size: 14px; margin-top: 200px'; line-height: 1.4em;>" +
      "<div>The time you set for this session is over!</div>" +
      "<div>You Can come back to a new session after " +
      blockDurationHours +
      " hours. searchOnly is also allowed</div>" +
      "<div>Stopping watching YouTube is really f*cking annoying, it's helps me think about how much hours I could continue and waste.</div>" +
      "<div>Question, if it was your last day on earth what would you do right now?</div>" +
      "<div>P.S Redesign Me Please!</div>" +
      "</div>";
  };

  // ----- On Events -----
  const onSave = () => {
    chrome.storage.local.get(["smartTimeLimit"], ({ smartTimeLimit }) => {
      let updatedSmartTimeLimit: ISmartTimeLimit = smartTimeLimit;
      updatedSmartTimeLimit.sessionTimeInM = limitMinutes;
      chrome.storage.local.set(
        { smartTimeLimit: updatedSmartTimeLimit },
        () => {
          setIsModalVisible(false);
          countUse();
        }
      );
    });
  };

  // interface keyPathAndValue {
  //   [keyPath: string]: string | number | any;
  // }
  // const setStorage = (
  //   rootKey: string,
  //   keysPathsAndValues: Array<keyPathAndValue>
  // ) => {
  //   chrome.storage.sync.get([rootKey], ({ obj }) => {
  //     let updatedObj = obj;
  //     for (const keyPathAndValue of keysPathsAndValues) {
  //       _set(updatedObj, rootKey + keyPathAndValue[0], keyPathAndValue[1]);
  //     }
  //     chrome.storage.sync.set({ [rootKey]: updatedObj }, () => {});
  //   });
  // };
  // setStorage("user", [{ ".smartTimeLimit.sessionTimeInM": limitMinutes }]);

  const onChangeMinutes = (value: string) => {
    setLimitMinutes(parseInt(value));
  };

  const onContinue = () => {
    setIsNewSessionOrContinueModalVisible(false);
    countUse();
  };

  const onNewSession = () => {
    setIsNewSessionOrContinueModalVisible(false);
    startNewSession();
  };

  return (
    <div>
      <Modal
        // title="Let's make an aware decision"
        title="Session Time - Making an aware decision is better!"
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
            <p className="footer-text">
              After the time is up, if the video is about to end, no worry, you
              can finish it :) (WIP)
            </p>
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
        <p>Deicide how much time you want to spend to YouTube right now:</p>

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
      </Modal>
      <NewSessionOrContinueModal
        isModalVisible={isNewSessionOrContinueModalVisible}
        onContinue={onContinue}
        onNewSession={onNewSession}
      />
    </div>
  );
}

ReactDOM.render(
  <SmartTimeLimit />,
  document.getElementById("smartTimeLimitContainer")
);
