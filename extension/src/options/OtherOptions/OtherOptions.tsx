import { Button, Col, Form, message, Radio, Row, Spin, Switch } from "antd";
import Title from "antd/lib/typography/Title";
import React, { useEffect } from "react";
import { User } from "../../interfaces/User";

import "./OtherOptions.scss"

interface FormValues {
  thumbnailsRemoved: boolean,
}

export function OtherOptions({ firstOptionsConfig }): JSX.Element {
  // ----- State -----
  const [isButtonDisabled, setIsButtonDisabled] = React.useState(true);
  const [initialValues, setInitialValues] = React.useState<FormValues>(null);


  // ----- Hooks -----
  useEffect(() => {
    loadInitialValues();
  }, []);

  // ----- Extra Functions -----
  const loadInitialValues = () => {
    chrome.storage.sync.get("user", (res) => {
      const user: User = res.user;
      setInitialValues({
        thumbnailsRemoved: user.options.thumbnailsRemoved
      });
    });
  }

  // ----- On Events -----
  const onSave = (values: FormValues) => {
    chrome.storage.sync.get("user", (res) => {
      let updatedUser: User = res.user;
      updatedUser.options.thumbnailsRemoved = values.thumbnailsRemoved;
      chrome.storage.sync.set({ user: updatedUser }, () => {
        message.success("Your new options are saved!");
        setIsButtonDisabled(true);
      });
    });
  };

  const onValuesChange = (changedValues: FormValues, allValues: FormValues) => {
    setIsButtonDisabled(false);
  };

  return (
    <Row>
      <Col span={16} offset={3} style={{ minWidth: "500px" }}>
        <div className="only-one-section">

          <Title level={3}>Other Options</Title>
          <Title level={5}>Toggle your personal experience</Title>
          <div className="spacer"></div>

          {!initialValues ? (
            <Spin size="large" />
          ) : (
            <Form
              name="otherOptionsForm"
              initialValues={initialValues}
              onValuesChange={onValuesChange}
              onFinish={onSave}>

              <div className="switch-container">
                <Form.Item name="thumbnailsRemoved" valuePropName="checked" noStyle >
                  <Switch />
                </Form.Item> <span className="switch-label">Remove thumbnails photos and preview gifs (WIP - works only in home, explore and watch)</span>
              </div>
              <div className="switch-container">
                <Form.Item name="iceCream" valuePropName="checked" noStyle >
                  <Switch />
                </Form.Item> <span className="switch-label">Give me ice cream. now.</span>
              </div>

              <Form.Item className="submit-button">
                <Button type="primary" htmlType="submit" disabled={isButtonDisabled} >
                  Save
                </Button>
              </Form.Item>

            </Form>
          )}
      </Col>
    </Row>
  );
}