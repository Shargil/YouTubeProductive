import React from "react";
import { AutoComplete } from "antd";

// TODO: Need to fetch this from server
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

export default function SearchChannelsLists({
  onSelectAutoComplete,
}): JSX.Element {
  const onSelect = (channelsListID) => {
    onSelectAutoComplete(parseInt(channelsListID));
  };
  return (
    <>
      <AutoComplete
        onSelect={onSelect}
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
