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
  channelsListsFormItem: {
    collection: Array<channelsList>;
  };
}

export default function MyYouTube({ firstOptionsConfig }): JSX.Element {
  const [form] = Form.useForm();

  // ----- State -----
  const [isSaveDisabled, setIsSaveDisabled] = React.useState(true);
  const [isNextDisabled, setIsNextDisabled] = React.useState(true);
  const [initialValues, setInitialValues] = React.useState<FormValues>(null);

  // ----- Hooks -----
  useEffect(() => {
    chrome.storage.sync.get("user", (res) => {
      const user: User = res.user;
      setInitialValues({
        blackOrWhiteListMode: user.listType,
        channelsListsFormItem: {
          collection: user.fullLists,
        },
      });
    });
  }, []);

  // ----- Extra Functions -----
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
      updatedUser.listType = LIST_TYPE.BLACK_LIST;
      updatedUser.fullLists = values.channelsListsFormItem.collection;
      updatedUser.list = createPerformanceList(
        values.channelsListsFormItem.collection
      );

      chrome.storage.sync.set({ user: updatedUser }, () => {
        message.success("Your new options are saved!");
        setIsSaveDisabled(true);
      });
    });
  };

  const onValuesChange = (changedValues: FormValues, allValues: FormValues) => {
    setIsSaveDisabled(false);
    setIsNextDisabled(false);
  };

  return (
    <>
      {/* <Row style={{ textAlign: "center" }}>
        <Col span={24}>
          <Title level={3}>You deserve YouTube that grows you.</Title>
        </Col>
      </Row>
      <Row style={{ textAlign: "center", marginBottom: "2em" }}>
        <Col span={24}>
          <Title level={3}>That doesn&apos;t suck away your time.</Title>
        </Col>
      </Row> */}
      <Row>
        <Col span={24} className="title">
          {/* <Title level={3}>
            Choose the categories you want or don't want to watch
          </Title> */}
          <Title level={3}>
            Decide what type of channels you want or don't want to watch!
          </Title>
          <Title level={5}>
            YouTube amazing algorithms suck away your time with addicting trashy
            videos. You deserve YouTube that grows you. Choose your catagories.
          </Title>
          {/* <Title level={5}>To Make the most of your time on YouTube</Title>
          <Title level={5}>
            You deserve YouTube that grows you. That doesn't suck away your
            time.
          </Title> */}
          <Tooltip title="prompt text">
            <span>
              how MyYouTube works <QuestionCircleOutlined />
            </span>
          </Tooltip>
        </Col>
      </Row>

      <Row>
        <Col span={1}></Col>

        <Col span={11}>
          {!initialValues ? (
            <Spin size="large" />
          ) : (
            <Form
              form={form}
              onFinish={onSave}
              onValuesChange={onValuesChange}
              initialValues={initialValues}
            >
              <Form.Item name="blackOrWhiteListMode">
                <Radio.Group value={null} onChange={null}>
                  <Radio value={LIST_TYPE.BLACK_LIST}>
                    I want MyYoutube to be everything but:
                  </Radio>

                  <Radio value="b">item 2</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item name="channelsListsFormItem">
                <CollectionOfChannelsLists
                  initialValues={initialValues.channelsListsFormItem.collection}
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
        <Col span={2}>
          {firstOptionsConfig ? (
            <NavigateToButton
              text="Next"
              clickOnElementId="FocusLevelMenuItem"
              path="/FocusLevel"
              disabled={isNextDisabled}
              onClick={() => {
                if (areThereChangesToSave()) {
                  form.submit();
                }
              }}
            />
          ) : null}
        </Col>
      </Row>
    </>
  );
}
