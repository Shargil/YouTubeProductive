import React from "react";
import "./CollectionOfChannelsList.scss";
import { List, Row, Col, Avatar } from "antd";
import ChannelsList, {
  channel,
  channelsList,
} from "./ChannelsList/ChannelsList";

export default function CollectionOfChannelsLists({
  collection,
  remove,
}): JSX.Element {
  const [selectedItem, setSelectedItem] =
    React.useState<channelsList | undefined>();

  const onClick = (item) => {
    setSelectedItem(item);
  };

  const onRemove = (channelsListID) => {
    remove(channelsListID);
    if (selectedItem && selectedItem.id === channelsListID)
      setSelectedItem(null);
  };

  const checkIsSelected = (id) => {
    return selectedItem && selectedItem.id === id;
  };

  const showListChannels = (selectedItem) => {
    return (
      <List
        itemLayout="horizontal"
        dataSource={selectedItem.list}
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
            {selectedItem.id}
          </List.Item>
        )}
      />
    );
  };

  return (
    <Row>
      <Col span={14} className="container">
        <List
          itemLayout="vertical"
          size="small"
          dataSource={collection}
          renderItem={(item: channelsList) => (
            <List.Item key={item.id}>
              <ChannelsList
                channelsList={item}
                onClick={() => {
                  onClick(item);
                }}
                remove={onRemove}
                isSelected={checkIsSelected(item.id)}
              />
            </List.Item>
          )}
        />
      </Col>
      <Col span={1}></Col>
      <Col span={9}>{selectedItem ? showListChannels(selectedItem) : null}</Col>
    </Row>
  );
}
