import React from "react";
import { Avatar, List } from "antd";
import { channel } from "../../../../interfaces/ChannelsList";

interface t {
  list: Array<channel>;
}
export default function ChannelsListShow({ list }: t): JSX.Element {
  return (
    <List
      itemLayout="horizontal"
      dataSource={list}
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
        </List.Item>
      )}
    />
  );
}
