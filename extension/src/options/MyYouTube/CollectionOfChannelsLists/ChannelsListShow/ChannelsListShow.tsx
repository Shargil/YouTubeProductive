import React from "react";
import { Avatar, List } from "antd";
import { channel } from "../../../../interfaces/ChannelsList";
import Title from "antd/lib/typography/Title";
import "./ChannelsListShow.scss"

interface types {
  list: Array<channel>;
}
export default function ChannelsListShow({ list }: types): JSX.Element {
  return (
    <List
      className="channels-list"
      itemLayout="horizontal"
      dataSource={list}
      renderItem={(item: channel) => (
        <List.Item>
          <List.Item.Meta
            avatar={<Avatar src={item.img} />}
            title={
              <a href={"https://www.youtube.com/" + item.id.toString()} target="_blank" rel="noopener noreferrer">
                <Title level={5}>{item.name}</Title>
              </a>
            }
          />
        </List.Item>
      )}
    />
  );
}
