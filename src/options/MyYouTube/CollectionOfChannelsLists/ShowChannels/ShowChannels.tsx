import React from "react";
import { Avatar, List } from "antd";
import { channel } from "../ChannelsList/ChannelsList";

export default function ShoeChannels({ channelsList }): JSX.Element {
  return (
    <List
      itemLayout="horizontal"
      dataSource={channelsList.list}
      renderItem={(item: channel) => (
        <List.Item>
          <List.Item.Meta
            avatar={<Avatar src={item.img} />}
            title={
              <a href={"https://www.youtube.com/" + item.id.toString()}>
                {item.name}
              </a>
            }
          />
          {channelsList.id}
        </List.Item>
      )}
    />
  );
}
