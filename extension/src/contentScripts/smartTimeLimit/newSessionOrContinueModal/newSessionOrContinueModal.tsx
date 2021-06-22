import React from "react";
import { Modal, Button } from "antd";

export default function NewSessionOrContinueModal({
  isModalVisible = false,
  onContinue,
  onNewSession,
}): JSX.Element {
  return (
    <Modal
      title="Continue your lest session or set up a new one?"
      visible={isModalVisible}
      zIndex={2500}
      closable={false}
      keyboard={false}
      maskClosable={false}
      destroyOnClose={true}
      maskStyle={{ backgroundColor: "rgba(0, 0, 0, 0.75)" }}
      footer={[
        <Button key="newSession" type="default" onClick={onNewSession}>
          New Session
        </Button>,
        <Button key="continue" type="primary" onClick={onContinue}>
          Continue
        </Button>,
      ]}
    >
      <p>
        You didn't watched YouTube for more then 20 minutes but less then 2
        hours, do you want a new session or was it just a break (continue)?
      </p>
    </Modal>
  );
}
