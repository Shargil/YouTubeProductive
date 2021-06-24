import React, { useState } from "react";

import { Button, Form, Input, message, Typography } from "antd";

import "./CreateChannelsList.scss";
import { channel, channelsList } from "../../../../../interfaces/ChannelsList";
import AddChannelsFormItem from "./AddChannelsFormItem/AddChannelsFormItem";
import { fetchS } from "../../../../../shared/fetchS";

const { Title } = Typography;

interface FormValues {
  title: string;
  addChannelsFormItem: { channels: Array<channel> };
}

export default function CreateChannelsList({ closeModal }): JSX.Element {
  // ----- State -----
  const [isCreateDisabled, setIsCreateDisabled] = useState(true);

  // ----- Hooks -----

  // ----- Extra Functions -----

  // ----- On  Events -----

  const onCreate = async (values: FormValues) => {
    const newChannelsList: channelsList = {
      id: undefined,
      name: values.title,
      author: "It's me",
      upVotes: 0,
      numOfUsers: 0,
      list: values.addChannelsFormItem.channels,
    };

    const data = await fetchS("POST", "/channelsList", newChannelsList, () =>
      message.error("Couldn't create Channels List")
    );

    const msg =
      "Created new Channels List! You and others can choose it right now. (maybe a refresh is needed)";
    message.success(msg);
    setIsCreateDisabled(true);
    setTimeout(() => closeModal(), 2000);
  };

  const onCreateFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const onValuesChange = (changedValues: FormValues, allValues: FormValues) => {
    setIsCreateDisabled(false);
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
      {/* <Title level={5} className={"noMarginTop"}>
        Create a new list of channels. The community and yourself will be able
        to use it.
      </Title> */}
      <p>
        It can be around a subject like: Calisthenics, Best Makers or Education.
        The community and yourself will be able to use it.
        <br />
        Comprehensive and usable list will probably have high rank and more
        users.
      </p>
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
          <Button type="primary" htmlType="submit" disabled={isCreateDisabled}>
            Create
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
