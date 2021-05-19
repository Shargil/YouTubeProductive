import React from "react";
import { AutoComplete } from "antd";

const allChannelsListsNames = [];
for (let i = 0; i < 23; i++) {
  allChannelsListsNames.push({
    id: i,
    name: `UX/UI ${i}`,
  });
}

const options = allChannelsListsNames.map((item) => {
  return { value: item.id.toString(), label: item.name };
});

export default function SearchChannelsLists({ onChange }): JSX.Element {
  const onSelect = (channelsListID) => {
    onChange(parseInt(channelsListID));
  };
  return (
    <>
      <AutoComplete
        onSelect={onSelect}
        style={{
          maxWidth: "50%",
        }}
        options={options}
        placeholder="Channels Category like Science or Calisthenics"
        filterOption={(inputValue, option: any) =>
          // Case insensitive
          option.label.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
        }
      />
    </>
  );
}
