import React from "react";

import { Button, Form, Input, Typography } from "antd";

import "./CreateChannelsList.scss";
import { channel, channelsList } from "../../interfaces/ChannelsList";
import AddChannelsFormItem from "./AddChannelsFormItem/AddChannelsFormItem";

const { Title } = Typography;

interface FormValues {
  title: string;
  addChannelsFormItem: { channels: Array<channel> };
}

export default function CreateChannelsList(props): JSX.Element {
  // ------ State ------

  // ------ Hooks ------
  React.useEffect(() => {}, []);

  // ------ Extra Functions ------

  // ----- On  Events -----
  const onCreate = (values: FormValues) => {
    const newChannelsList: channelsList = {
      id: new Date().getTime(),
      name: values.title,
      author: "It's me",
      upVotes: parseInt(new Date().getTime().toString().slice(-2)),
      numOfUsers: parseInt(new Date().getTime().toString().slice(-3)),
      list: values.addChannelsFormItem.channels,
    };
    console.log("Success:", newChannelsList);
    // I want to save it to the server // create fake server in storage
    // show them success message, and clean the form
    // 
  };

  const onCreateFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const onValuesChange = (changedValues: FormValues, allValues: FormValues) => {
    console.log(allValues);
  };

  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 8,
    },
  };

  const tailLayout = {
    wrapperCol: {
      offset: 8,
      span: 8,
    },
  };
  return (
    <>
      <Title level={3}>Create A New Channels List For The Community</Title>
      {/* <Title level={5}>For yourself and the cumiinty</Title> */}
      <Form
        {...layout}
        name="CreateChannelsList"
        initialValues={{}}
        onValuesChange={onValuesChange}
        onFinish={onCreate}
        onFinishFailed={onCreateFailed}
      >
        <Form.Item
          label="Channels List Title"
          name="title"
          rules={[
            {
              required: true,
              message: "Please input title",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Paste Channel URL"
          name="addChannelsFormItem"
          className="channelsListContainer"
          tooltip="Go to the channel page in YouTube, copy the url and past it here. P.S It’s super annoying to paste URLs, we don’t have a better feasible way right now. If you are a programmer and have any ideas tell us 😊"
          rules={[
            {
              validator: async (_, addChannelsFormItem) => {
                debugger;
                if (
                  !addChannelsFormItem ||
                  !addChannelsFormItem.channels ||
                  addChannelsFormItem.channels.length < 1
                ) {
                  return Promise.reject(new Error("At least 1 channel"));
                }
              },
            },
          ]}
        >
          <AddChannelsFormItem />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Create
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
