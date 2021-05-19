import React, { useEffect } from "react";
import { Layout, Menu } from "antd";
import { PlayCircleTwoTone, UserOutlined } from "@ant-design/icons";
import MyYouTube from "./MyYouTube/MyYouTube";

import "./options.scss";

const { Header, Content, Footer, Sider } = Layout;

export default function Options() {
  useEffect(() => {
    // Example of how to send a message to eventPage.ts.
    chrome.runtime.sendMessage({ optionsMounted: true });
  }, []);

  return (
    <>
      <Layout>
        <Header className="header">
          <div className="logo" />
        </Header>
        <Layout>
          <Sider width={200} className="site-layout-background">
            <Menu
              mode="inline"
              defaultSelectedKeys={["1"]}
              style={{ height: "100%", borderRight: 0 }}
            >
              <Menu.Item key="1" icon={<PlayCircleTwoTone />}>
                My YouTube
              </Menu.Item>
              <Menu.Item key="2" icon={<UserOutlined />}>
                option2
              </Menu.Item>
              <Menu.Item key="3" icon={<UserOutlined />}>
                option3
              </Menu.Item>
              <Menu.Item key="4" icon={<UserOutlined />}>
                option4
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout style={{ padding: "0 24px 24px" }}>
            <Content
              className="site-layout-background content-container"
              style={{
                
              }}
            >
              <MyYouTube></MyYouTube>
            </Content>
          </Layout>
        </Layout>
        <Footer>Footer time!</Footer>
      </Layout>
      {/* <Button type="primary">Ant Button!!</Button> */}
    </>
  );
}
