import React from "react";
import { Button, message } from "antd";

export default function ChannelURLWarning({}): JSX.Element {
  return (
    <>
      <div>It doesn't look like a YouTube Channel URL that contains ID </div>
      <div>
        Like this: https://www.youtube.com/channel/
        <span style={{ color: "#52c41a" }}>UCY1kMZp36IQSyNx_9h4mpCg</span>
      </div>
      <div>
        Maybe YouTube showed you something like this:
        https://www.youtube.com/user/
        <span style={{ color: "#faad14" }}>onemeeeliondollars</span>
      </div>
      <div>
        You can get the right one by: Click on a video -{">"} Click on the
        channel name
      </div>
      <div>Got the URL with the ID this time?</div>
      <br></br>
      <Button
        onClick={() => {
          message.destroy("thisMessageKey");
        }}
      >
        Close
      </Button>
    </>
  );
}
