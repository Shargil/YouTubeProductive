import { Col, List, Row } from "antd";
import React from "react";
import "./CollectionOfChannelsList.scss";
import ChannelsList, { channelsList } from "./ChannelsList/ChannelsList";
import SearchChannelsLists from "./SearchChannelsLists/SearchChannelsLists";
import ShowChannels from "./ShowChannels/ShowChannels";

export default function CollectionOfChannelsLists({
  value = {},
  onChange = null,
  initialValues = [],
}): JSX.Element {
  // ------ State ------
  const [collection, setCollection] = React.useState(initialValues);
  const [selectedItem, setSelectedItem] =
    React.useState<channelsList | undefined>();

  // ------ Extra Functions ------
  // This helps make this component work with ant Form https://ant.design/components/form/#components-form-demo-customized-form-controls
  const triggerChange = (changedValue) => {
    onChange?.({
      collection,
      ...value,
      ...changedValue,
    });
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

  const checkIsSelected = (id) => {
    return selectedItem && selectedItem.id === id;
  };

  // ----- On Events -----
  const onSelectAutoComplete = (id) => {
    const isSelectedAllReady = collection.some((el) => el.id === id);

    if (!isSelectedAllReady) {
      const currChannelsList = fetchChannelsList(id);
      const newCollection = collection.concat(currChannelsList);

      setCollection(newCollection);

      triggerChange({
        collection: newCollection,
      });
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
    <>
      <Row style={{ marginBottom: "1em" }}>
        <Col span={14}>
          <SearchChannelsLists
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
            itemLayout="vertical"
            size="small"
            dataSource={collection}
            renderItem={(item: channelsList) => (
              <List.Item key={item.id}>
                <ChannelsList
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
          {selectedItem ? <ShowChannels channelsList={selectedItem} /> : null}
        </Col>
      </Row>
    </>
  );
}
