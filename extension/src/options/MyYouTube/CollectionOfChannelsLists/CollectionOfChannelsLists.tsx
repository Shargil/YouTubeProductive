import React from "react";
import { Col, List, message, Row } from "antd";
import "./CollectionOfChannelsList.scss";
import ChannelsListsSearch from "./ChannelsListsSearch/ChannelsListsSearch";
import ChannelsListCard from "./ChannelsListCard/ChannelsListCard";
import ChannelsListShow from "./ChannelsListShow/ChannelsListShow";
import { channelsList } from "../../../interfaces/ChannelsList";
import { fetchS } from "../../../shared/fetchS";

export default function CollectionOfChannelsLists({
  value = {},
  onChange = null,
  initialValues = [],
  disabled,
}): JSX.Element {
  // ----- State -----
  const [collection, setCollection] = React.useState(initialValues);
  const [selectedItem, setSelectedItem] =
    React.useState<channelsList | undefined>();

  // ----- Extra Functions -----
  // This helps make this component work with ant Form https://ant.design/components/form/#components-form-demo-customized-form-controls
  const triggerChange = (changedValue) => {
    onChange?.({
      collection,
      ...value,
      ...changedValue,
    });
  };

  const checkIsSelected = (id) => {
    return selectedItem && selectedItem.id === id;
  };

  // ----- On Events -----
  const onSelectAutoComplete = async (id) => {
    const isSelectedAllReady = collection.some((el) => el.id === id);

    if (!isSelectedAllReady) {
      const data = await fetchS("GET", "/channelsList/" + id, null, () =>
        message.error("Couldn't get Channels List")
      );

      const currChannelsList = data;
      const newCollection = collection.concat(currChannelsList);

      setCollection(newCollection);

      triggerChange({
        collection: newCollection,
      });

      setSelectedItem(currChannelsList);

      message.warning("If you need any more lists, create one :) It helps all the other users as well! Just click on the + icon")
    }
  };

  const onClickList = (item: channelsList) => {
    setSelectedItem(item);
  };

  const onRemove = (channelsListID) => {
    const newCollection = collection.filter((item) => {
      return item.id !== channelsListID;
    });
    setCollection(newCollection);
    triggerChange({
      collection: newCollection,
    });

    if (selectedItem && selectedItem.id === channelsListID)
      setSelectedItem(null);
  };

  return (
    <div style={disabled ? { pointerEvents: "none", opacity: "0.3" } : {}}>
      <Row style={{ marginBottom: "1em" }}>
        <Col span={14}>
          <ChannelsListsSearch
            onSelectAutoComplete={(id) => {
              onSelectAutoComplete(id);
            }}
          />
        </Col>
        <Col span={10}></Col>
      </Row>
      <Row>
        <Col span={14} className="container">
          <List
            className="collection-list"
            itemLayout="vertical"
            size="small"
            dataSource={collection}
            renderItem={(item: channelsList) => (
              <List.Item key={item.id}>
                <ChannelsListCard
                  channelsList={item}
                  remove={onRemove}
                  onSelect={() => {
                    onClickList(item);
                  }}
                  isSelected={checkIsSelected(item.id)}
                />
              </List.Item>
            )}
          />
        </Col>
        <Col span={1}></Col>
        <Col span={9}>
          {selectedItem ? <ChannelsListShow list={selectedItem.list} /> : null}
        </Col>
      </Row>
    </div>
  );
}
