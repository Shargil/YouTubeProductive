import * as React from "react";
import * as ReactDOM from "react-dom";

import { Modal, Button, Select } from "antd";
import "./smartTimeLimit.scss";
import { User } from "./interfaces/User";
import * as _ from "lodash/object";

// import _ from "lodash/object";

// const logoPath = require("./assets/Logo.svg") as string;
// import logo from "./assets/Logo.jpg";
// import MySVG from "-!svg-react-loader!src/assets/images/name.svg";

const { Option } = Select;

export interface ISmartTimeLimit {
  sessionStartedTime: string;
  sessionTimeInM: number;
  secondsUsed: secondsItem;
  blockUntil: string;
}

interface secondsItem {
  [second: string]: Boolean;
}

const blockDurationHours = 4;

let containerElement = document.createElement("div");
containerElement.setAttribute("id", "smartTimeLimitContainer");
document.body.appendChild(containerElement);

export default function SmartTimeLimit(props): JSX.Element {
  // ------ State ------
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [limitMinutes, setLimitMinutes] = React.useState<number>(undefined);

  // ------ Hooks ------
  React.useEffect(() => {
    chrome.storage.sync.get("user", ({ user }: { user?: User }) => {
      if (user.extensionMode === "searchOnly") return;

      if (needToBeBlocked(user)) {
        block();
        return;
      }

      if (didUseYouTubeInTheLast(user, 20)) {
        console.log("is on 20 min break");
        // Treat it like the user took a 20 min break and remembers he is in a session, resume counting and let them continue normally
        countUse();
      } else if (didUseYouTubeInTheLast(user, 60 * 2)) {
        // Was it a long break or the user "stopped"\"ended" the last session before time ended?
        // They expect to continue session or set up a new one? I am not sure, so let's ask.
        alert("ask! continue or set new one");
        // TODO: Set new one or continue counting
      } else {
        // more then 2 hours since last used, reset and choose new session
        resetUserSmartTimeLimit();
        showModal();
      }
    });
  }, []);

  // ------ Extra Functions ------
  const showModal = () => {
    setIsModalVisible(true);
  };

  const needToBeBlocked = (user: User) => {
    return user.smartTimeLimit.blockUntil < new Date().toLocaleString();
  };

  const didUseYouTubeInTheLast = (user: User, minutes: Number) => {
    if (user.smartTimeLimit.sessionStartedTime === null) return false;

    let mostRecentSecondUsed;
    if (howManySecondsUsed(user.smartTimeLimit.secondsUsed) === 0) {
      mostRecentSecondUsed = user.smartTimeLimit.sessionStartedTime;
    } else {
      mostRecentSecondUsed = getLastElementOfAnObject(
        user.smartTimeLimit.secondsUsed
      );
      // TODO: This will create a bug when ever you want to keep watching the next day same hour up to 20 minutes.
      // Probably need to save the last second used (full toLocalString()), or save all secondsUsed in full toLocalString() meaner
      const d = new Date();
      d.setHours(mostRecentSecondUsed.split(":")[0]);
      d.setMinutes(mostRecentSecondUsed.split(":")[1]);
      d.setSeconds(mostRecentSecondUsed.split(":")[2]);
      mostRecentSecondUsed = d.toLocaleString();
    }

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

  const resetUserSmartTimeLimit = () => {
    chrome.storage.sync.get("user", (res) => {
      let updatedUser: User = res.user;
      updatedUser.smartTimeLimit.sessionTimeInM = null;
      updatedUser.smartTimeLimit.secondsUsed = {};
      updatedUser.smartTimeLimit.blockUntil = null;
      updatedUser.smartTimeLimit.sessionStartedTime = null;
      chrome.storage.sync.set({ user: updatedUser }, () => {});
    });
  };

  const getCurrentSecond = () => {
    return new Date().toLocaleTimeString("en-US", {
      hour12: false,
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    });
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
        chrome.storage.sync.get("user", (res) => {
          // Add current second. (We count acutal second strings and not just adding ones to a variable
          // to make sure that couple of content scripts not adding more then one for the same second
          let updatedUser: User = res.user;
          updatedUser.smartTimeLimit.secondsUsed[getCurrentSecond()] = true;
          chrome.runtime.sendMessage(
            {
              contentScriptFuncs: "secondsUsed",
              data: { currentSecondUsed: getCurrentSecond() },
            },
            (res) => {}
          );

          chrome.storage.sync.set({ user: updatedUser }, () => {
            chrome.storage.sync.get("user", ({ user }: { user?: User }) => {
              let updatedUser: User = user;

              const secondsUsed = howManySecondsUsed(
                user.smartTimeLimit.secondsUsed
              );

              // Check if user run out of time
              if (secondsUsed >= user.smartTimeLimit.sessionTimeInM * 60) {
                // Set up blockUntil
                let blockUntil = new Date();
                blockUntil.setHours(blockUntil.getHours() + blockDurationHours);
                updatedUser.smartTimeLimit.blockUntil =
                  blockUntil.toLocaleString();
                chrome.storage.sync.set({ user: updatedUser }, () => {});

                // Block and stop the interval
                block();
                clearInterval(interval);
              }
            });
          });
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
    document.body.innerHTML = "<div>Blocked!</div>";
  };

  // ----- On Events -----
  const onSave = () => {
    chrome.storage.sync.get(["user"], ({ user }) => {
      let updatedUser: User = user;
      updatedUser.smartTimeLimit.sessionTimeInM = limitMinutes;
      updatedUser.smartTimeLimit.sessionStartedTime =
        new Date().toLocaleString();
      chrome.storage.sync.set({ user: updatedUser }, () => {
        setIsModalVisible(false);
        countUse();
      });
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

  return (
    <div className="antStyled">
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
              can finish it :)
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
            <Option value="30">30 min</Option>
            <Option value="45">45 min</Option>
            <Option value="60">60 min</Option>
            <Option value="90">90 min</Option>
          </Select>
        </div>
      </Modal>
    </div>
  );
}

ReactDOM.render(
  <SmartTimeLimit />,
  document.getElementById("smartTimeLimitContainer")
);
