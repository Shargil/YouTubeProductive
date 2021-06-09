import React from "react";
import { AutoComplete, Input, message, Spin } from "antd";

const mapOptions = (channelsListsPartial) => {
  return channelsListsPartial.map((item) => {
    return { value: item.id.toString(), label: item.name };
  });
};

export default function ChannelsListsSearch({
  onSelectAutoComplete,
}): JSX.Element {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isError, setIsError] = React.useState(false);
  const [options, setOptions] = React.useState([]);

  React.useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: { Authorization: "Bearer fake-jwt-token" },
    };

    fetch("./channelsJustNamesAndIDs", requestOptions)
      .then((res) => {
        res.text().then((resText) => {
          setOptions(mapOptions(JSON.parse(resText)));
          setIsLoading(false);
        });
      })
      .catch((err) => {
        setIsLoading(false);
        setIsError(true);
        message.error("Couldn't get Channels Lists :(");
      });
  }, []);

  const onSelect = (channelsListID) => {
    onSelectAutoComplete(parseInt(channelsListID));
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
      >
        <>
          <Input
            placeholder="Channels Category like Science or Calisthenics"
            addonAfter={
              isLoading ? (
                <Spin size="small" />
              ) : isError ? (
                <div>error!</div>
              ) : null
            }
          />
        </>
      </AutoComplete>
    </>
  );
}
