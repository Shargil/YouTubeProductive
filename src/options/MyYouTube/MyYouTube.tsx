import React, { useEffect } from "react";
import { Row, Col, Typography, Form, Button, Radio, message } from "antd";
import SearchChannelsLists from "./SearchChannelsLists/SearchChannelsLists";
import CollectionOfChannelsLists from "./CollectionOfChannelsLists/CollectionOfChannelsLists";
import { channelsList } from "./CollectionOfChannelsLists/ChannelsList/ChannelsList";

const { Title } = Typography;

export default function MyYouTube(props): JSX.Element {
  const [form] = Form.useForm();

  const [listMode, setListMode] = React.useState("black");
  const [isSaveDisabled, setIsSaveDisabled] = React.useState(true);
  const [isInitialValuesLoaded, setIsInitialValuesLoaded] =
    React.useState(false);
  const [initialValues, setInitialValues] = React.useState({});

  useEffect(() => {
    // Update the document title using the browser API
    chrome.storage.sync.get("user", (res) => {
      const user: User = res.user;
      setTimeout(() => {
        setInitialValues({
          blackOrWhiteListMode: user.listType,
          searchLists: null,
          channelsLists: user.fullLists,
        });
        setIsInitialValuesLoaded(true);
      }, 2000);
    });
  });

  const onChangeListMode = (e) => {
    switch (e.target.value) {
      case 0:
        setListMode("black");
        break;
      case 1:
        setListMode("white");
        break;
    }
  };

  const fetchChannelsList = (id: number): channelsList => {
    return {
      id: id,
      name: `UX/UI ${id}`,
      author: "Shargil69",
      upVotes: 20 + id,
      numOfUsers: 1204 + id,
      list: [
        {
          id: "c/MarkRober",
          name: "Not Mark Robber",
          img: "https://yt3.ggpht.com/ytc/AAUvwnhL2suWx4XHAshVXnSqPdXWHR_kQV_m1bkxDJw=s176-c-k-c0x00ffffff-no-rj",
        },
        {
          id: "channel/UCp68_FLety0O-n9QU6phsgw",
          name: "Not Colin Furze",
          img: "https://yt3.ggpht.com/ytc/AAUvwnjwlZk_WSLOOmPVUR_hQl6m6G0v8Mq2PX5Kpmo3=s176-c-k-c0x00ffffff-no-rj-mo",
        },
        {
          id: "channel/UCsn6cjffsvyOZCZxvGoJxGg",
          name: "Not Corddiror Digital",
          img: "https://yt3.ggpht.com/ytc/AAUvwngV2u6kCW61w-y5xNzy0nqrJE9tIeST4VipdIOs7Q=s176-c-k-c0x00ffffff-no-rj-mo",
        },
        {
          id: "channel/UCVYamHliCI9rw1tHR1xbkfw",
          name: "Not Dave2D",
          img: "https://yt3.ggpht.com/ytc/AAUvwniSYmTa5NLqubBNeXbONaln1U2FAIzqrzVNWpjrJw=s176-c-k-c0x00ffffff-no-rj-mo",
        },
      ],
    };
  };

  // Move this to appropriate file!
  interface Storage {
    user: User;
  }
  interface User {
    extensionMode: typeof EXTN_MODE;
    listType: String;
    list: ListItem;
    fullLists: Array<channelsList>;
  }

  interface ListItem {
    channelName: Boolean;
  }

  const EXTN_MODE = {
    SEARCH_ONLY: "searchOnly",
    FILTER: "filter",
    ANOTHER_OPTION: "anotherOption",
    OFF: "off",
  };

  const LIST_TYPE = {
    WHITE_LIST: "white_list",
    BLACK_LIST: "black_list",
  };

  const createPerformanceList = (channelsLists) => {
    debugger;
    let newPerformanceList = {};
    for (let key in channelsLists) {
      const list = channelsLists[key].list;
      for (let innerKey in list) {
        const channelName = list[innerKey].name;
        newPerformanceList[channelName] = true;
      }
    }
    return newPerformanceList;
  };

  // Delete Me!
  function timeToRunFunc(func) {
    const t0 = performance.now();
    const output = func();
    const t1 = performance.now();
    console.log("Call took " + (t1 - t0) + " milliseconds.");
    return output;
  }

  const onSave = (values) => {
    console.log(values);
    chrome.storage.sync.get("user", (res) => {
      let updatedUser: User = res.user;
      updatedUser.listType = LIST_TYPE.BLACK_LIST;
      updatedUser.fullLists = values.channelsLists;
      updatedUser.list = timeToRunFunc(() => {
        return createPerformanceList(values.channelsLists);
      });
      chrome.storage.sync.set({ user: updatedUser }, () => {
        // Finished Save

        // Show Message
        message.success("Your new options are saved!");

        // Disable Save Button until someone changed something
        setIsSaveDisabled(true);
      });
    });
  };

  const onReset = () => {
    form.resetFields();
  };

  const onValuesChange = (changedValues, allValues) => {
    setIsSaveDisabled(false);
  };

  const onSelect = (id: number) => {
    const isSelectedAllReady = form
      .getFieldValue("channelsLists")
      .some((el) => el.id === id);

    if (!isSelectedAllReady) {
      const currChannelsList = fetchChannelsList(id);
      debugger;
      form.setFieldsValue({
        channelsLists: form
          .getFieldValue("channelsLists")
          .concat(currChannelsList),
      });
      setIsSaveDisabled(!isSaveDisabled);
    }
  };

  return (
    <>
      <Row style={{ textAlign: "center" }}>
        <Col span={24}>
          <Title level={3}>You deserve YouTube that grows you.</Title>
        </Col>
      </Row>
      <Row style={{ textAlign: "center", marginBottom: "2em" }}>
        <Col span={24}>
          <Title level={3}>That doesn&apos;t suck away your time.</Title>
        </Col>
      </Row>

      <Row>
        <Col span={1}></Col>

        <Col span={11}>
          {!isInitialValuesLoaded ? (
            <div>Loading...</div>
          ) : (
            <Form
              form={form}
              onFinish={onSave}
              onValuesChange={onValuesChange}
              initialValues={initialValues}
            >
              <Form.Item>
                <Form.Item name="blackOrWhiteListMode" noStyle>
                  <Radio.Group onChange={onChangeListMode}>
                    <Radio value={"black_list"}>
                      I want MyYoutube to be everything but:
                    </Radio>{" "}
                  </Radio.Group>
                </Form.Item>
                <Form.Item name="searchLists" noStyle>
                  <SearchChannelsLists
                    onChange={(id) => {
                      onSelect(id);
                    }}
                  />
                </Form.Item>
              </Form.Item>
              <Form.Item name="channelsLists">
                <CollectionOfChannelsLists
                  collection={form.getFieldValue("channelsLists")}
                  remove={(channelsListID) => {
                    const newList = form
                      .getFieldValue("channelsLists")
                      .filter((item) => {
                        return item.id !== channelsListID;
                      });
                    form.setFieldsValue({ channelsLists: newList });
                  }}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={isSaveDisabled}
                >
                  Save
                </Button>
              </Form.Item>
            </Form>
          )}
        </Col>
        <Col span={11}></Col>
      </Row>
      <Row>
        <Col span={2}></Col>
        <Col span={20}></Col>
        <Col span={2}></Col>
      </Row>
    </>
  );
}
