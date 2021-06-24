import React, { useEffect, useState } from "react";
import { AutoComplete, Input, message, Modal, Select, Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import CreateChannelsList from "./CreateChannelsList/CreateChannelsList";
import { fetchS } from "../../../../shared/fetchS";

const mapOptions = (channelsListsPartial) => {
  return channelsListsPartial.map((item) => {
    return { value: item._id.toString(), label: item.name };
  });
};

export default function ChannelsListsSearch({
  onSelectAutoComplete,
}): JSX.Element {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [options, setOptions] = useState([]);

  useEffect(() => {

    async function fetchData() {
      const data = await fetchS("GET", "/channelsList", null, () => {
        setIsLoading(false);
        setIsError(true);
        message.error("Couldn't get Channels Lists");
      });

      setOptions(mapOptions(data));
      setIsLoading(false);
    }
    fetchData();
  }, []);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const showModal = (e) => {
    setIsModalVisible(true);
    e.preventDefault();
  };

  const onOk = () => {
    setIsModalVisible(false);
  };

  const onCancel = () => {
    setIsModalVisible(false);
  };

  const onSelect = (channelsListID) => {
    onSelectAutoComplete(channelsListID);
  };

  return (
    <>
      <AutoComplete
        onSelect={onSelect}
        options={options}
        filterOption={(inputValue, option: any) =>
          // Case insensitive
          option.label.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
        }
        children={
          <Input
            placeholder="Channels Category like Science or Calisthenics"
            addonBefore={
              isLoading ? (
                <Spin size="small" />
              ) : isError ? (
                <div>error!</div>
              ) : null
            }
            addonAfter={<PlusOutlined onClick={showModal} />}
          />
        }
      ></AutoComplete>
      <Modal
        title="Create A New Channels List"
        visible={isModalVisible}
        onOk={onOk}
        onCancel={onCancel}
        maskClosable={false}
        width={"60%"}
        footer={null}
      >
        <CreateChannelsList closeModal={() => setIsModalVisible(false)} />
      </Modal>
    </>
  );
}
