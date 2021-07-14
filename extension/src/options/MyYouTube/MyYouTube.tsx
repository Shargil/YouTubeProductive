import React, { useEffect } from "react";
import {
  Row,
  Col,
  Typography,
  Form,
  Button,
  Radio,
  message,
  Spin,
  Tooltip,
} from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import "./MyYouTube.scss";
import { User } from "../../interfaces/User";
import { LIST_TYPE } from "../../constantsDemo";
import CollectionOfChannelsLists from "./CollectionOfChannelsLists/CollectionOfChannelsLists";
import { channelsList } from "../../interfaces/ChannelsList";
import { NavigateToButton } from "../../shared/NavigateToButton/NavigateToButton";

const { Title } = Typography;

interface FormValues {
  blackOrWhiteListMode: String;
  channelsListsFormItemBlack: {
    collection: Array<channelsList>;
  };
  channelsListsFormItemWhite: {
    collection: Array<channelsList>;
  };
}

export default function MyYouTube({ firstOptionsConfig }): JSX.Element {
  const [form] = Form.useForm();

  // ----- State -----
  const [isSaveDisabled, setIsSaveDisabled] = React.useState(true);
  const [initialValues, setInitialValues] = React.useState<FormValues>(null);
  const [editingBlackOrWhite, setEditingBlackOrWhite] = React.useState(null);

  // ----- Hooks -----
  useEffect(() => {
    chrome.storage.sync.get("user", (res) => {
      const user: User = res.user;
      loadInitialValues(user);
      setEditingBlackOrWhite(user.myYoutube.listType);
    });
  }, []);

  // ----- Extra Functions -----
  const loadInitialValues = (user: User) => {
    setInitialValues({
      blackOrWhiteListMode: user.myYoutube.listType,
      channelsListsFormItemBlack: {
        collection: user.myYoutube.fullListsBlack,
      },
      channelsListsFormItemWhite: {
        collection: user.myYoutube.fullListsWhite,
      },
    });
  }

  const createPerformanceList: any = (channelsLists) => {
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
  const areThereChangesToSave = () => {
    return !isSaveDisabled;
  };

  // ----- On Events -----
  const onSave = (values: FormValues) => {
    chrome.storage.sync.get("user", (res) => {
      // Update User
      let updatedUser: User = res.user;
      updatedUser.myYoutube.listType = values.blackOrWhiteListMode;
      updatedUser.myYoutube.fullListsBlack = values.channelsListsFormItemBlack.collection;
      updatedUser.myYoutube.fullListsWhite = values.channelsListsFormItemWhite.collection;

      if (values.blackOrWhiteListMode === LIST_TYPE.BLACK_LIST) {
        updatedUser.myYoutube.list = createPerformanceList(
          values.channelsListsFormItemBlack.collection
        );
      }
      if (values.blackOrWhiteListMode === LIST_TYPE.WHITE_LIST) {
        updatedUser.myYoutube.list = createPerformanceList(
          values.channelsListsFormItemWhite.collection
        );
      }

      chrome.storage.sync.set({ user: updatedUser }, () => {
        message.success("Your new options are saved!");
        setIsSaveDisabled(true);
      });
    });
  };

  const onValuesChange = (changedValues: FormValues, allValues: FormValues) => {
    setIsSaveDisabled(false);
    setEditingBlackOrWhite(allValues.blackOrWhiteListMode)
  };

  return (

    <Row>
      <Col span={21} offset={2}>

        <Row className="space-between-children">
          <Title level={3}>Decide what type of channels you want or don't want to watch!</Title>
          <Tooltip title="Choose couple of channels list, videos from those channels will be removed from your YouTube by the extension. You can always come back here and change it">
            <div className="how-it-works">
              <QuestionCircleOutlined style={{ marginRight: 10 }} /> How it works?
            </div>
          </Tooltip>
        </Row>
        <Title level={5}>YouTube amazing algorithms suck away your time with addicting trashy videos. You deserve YouTube that grows you. Choose your catagories.</Title>
        <div className="spacer"></div>

        {!initialValues ? (
          <Spin size="large" />
        ) : (
          <Form
            form={form}
            onFinish={onSave}
            onValuesChange={onValuesChange}
            initialValues={initialValues}
          >
            <Form.Item name="blackOrWhiteListMode" style={{ marginBottom: "5px" }}>
              <Radio.Group value={LIST_TYPE.BLACK_LIST} className="display-flex">
                <Radio value={LIST_TYPE.BLACK_LIST} className="half">
                  I want MyYoutube to be everything but:
                </Radio>
                <Radio value={LIST_TYPE.WHITE_LIST} className="half">
                  I want MyYouTube to be only:
                </Radio>
              </Radio.Group>
            </Form.Item>

            <div className="display-flex">
              <Form.Item name="channelsListsFormItemBlack" className="half">
                <CollectionOfChannelsLists
                  initialValues={initialValues.channelsListsFormItemBlack.collection}
                  disabled={editingBlackOrWhite === LIST_TYPE.WHITE_LIST}
                />
              </Form.Item>
              <Form.Item name="channelsListsFormItemWhite" className="half">
                <CollectionOfChannelsLists
                  initialValues={initialValues.channelsListsFormItemWhite.collection}
                  disabled={editingBlackOrWhite === LIST_TYPE.BLACK_LIST}
                />
              </Form.Item>
            </div>

            <Form.Item className="submit-button">
              {firstOptionsConfig ? (
                <NavigateToButton
                  text="Next"
                  clickOnElementId="FocusLevelMenuItem"
                  path="/FocusLevel"
                  disabled={isSaveDisabled}
                  onClick={() => {
                    if (areThereChangesToSave()) {
                      form.submit();
                    }
                  }}
                />
              ) : <Button
                type="primary"
                htmlType="submit"
                disabled={isSaveDisabled}
              >
                Save
              </Button>}
            </Form.Item>
          </Form>
        )}
      </Col>
    </Row>
  );
}