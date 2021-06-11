import React from "react";
import { Avatar, Input, List, message, Tooltip } from "antd";
import { channel } from "../../../interfaces/ChannelsList";
import { PlusOutlined } from "@ant-design/icons";
import ChannelURLWarning from "./ChannelURLWarning";
import { numberToDisplayFormatter } from "../../../shared/numberToDisplayFormatter";

export default function AddChannelsFormItem({
  value = {},
  onChange = null,
}): JSX.Element {
  // ----- State -----
  const [urlInput, setUrlInput] = React.useState("");
  const [channels, setChannels] = React.useState([]);

  // ----- Extra Functions -----
  // This helps make this component work with ant Form https://ant.design/components/form/#components-form-demo-customized-form-controls
  const triggerChange = (changedValue) => {
    onChange?.({
      channels,
      ...value,
      ...changedValue,
    });
  };

  const fetchChanelAndAdd = (channelId) => {
    // To save some queries to YouTube - I can check here if I have the Id stored at my DB, if the last time it was updated was more then 2 (or x) months I can re-query YouTube and also update the channel in my DB
    fetch(
      "https://youtube-v31.p.rapidapi.com/channels?part=snippet%2Cstatistics&id=" +
        channelId,
      {
        method: "GET",
        headers: {
          "x-rapidapi-key":
            "06b6013060msh678afa5c6a5cf22p116a90jsn8b2b444ad800",
          "x-rapidapi-host": "youtube-v31.p.rapidapi.com",
        },
      }
    )
      .then((response) => {
        response.json().then((parsedJson) => {
          if (parsedJson.pageInfo.totalResults > 0) {
            try {
              const newChannel: channel = {
                id: parsedJson.items[0].id,
                name: parsedJson.items[0].brandingSettings.channel.title,
                img: parsedJson.items[0].snippet.thumbnails.default.url,
                subs: parsedJson.items[0].statistics.subscriberCount,
              };
              addChannel(newChannel);
            } catch (e) {
              console.error("Couldn't create or add new chanel", e);
            }
          }
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const addChannel = (channel) => {
    setChannels([...channels, channel]);

    triggerChange({
      channels: [...channels, channel],
    });
  };

  // ----- On Events -----
  const onUrlInputChange = (e) => {
    setUrlInput(e.target.value);
  };

  const onChannelAdd = (urlInput: string) => {
    const regex = /https:\/\/www\.youtube\.com\/channel\/([\w-]{24})$/;
    const matches = urlInput.match(regex);
    if (matches !== null) {
      const channelId = matches[1];
      fetchChanelAndAdd(channelId);
    } else {
      // Should maybe change to better UI for this purpose like Modal or Notification
      message.warning({
        content: <ChannelURLWarning />,
        duration: 0,
        key: "thisMessageKey",
      });
    }
  };

  return (
    <div>
      <Input
        type="text"
        value={urlInput}
        onChange={onUrlInputChange}
        addonAfter={
          <Tooltip title="Add this channel">
            <PlusOutlined
              onClick={() => {
                onChannelAdd(urlInput);
              }}
            />
          </Tooltip>
        }
      />

      <List
        itemLayout="horizontal"
        dataSource={channels}
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
            <div>{numberToDisplayFormatter(item.subs, 1)} subscribers</div>
          </List.Item>
        )}
      />
    </div>
  );
}
