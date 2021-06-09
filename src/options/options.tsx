import React from "react";
import { Layout, Menu } from "antd";
import {
  PlayCircleTwoTone,
  UserOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import MyYouTube from "./MyYouTube/MyYouTube";

import { MemoryRouter as Router, Switch, Route, Link } from "react-router-dom";

import "./options.scss";
import CreateChannelsList from "./CreateChannelsList/CreateChannelsList";

const { Header, Content, Footer, Sider } = Layout;

export default function Options() {
  return (
    <Router>
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
                <Link to="/MyYouTube" />
              </Menu.Item>
              <Menu.Item key="2" icon={<UserOutlined />}>
                option2
              </Menu.Item>
              <Menu.Item key="3" icon={<UserOutlined />}>
                option3
              </Menu.Item>
              <Menu.Item key="4" icon={<UnorderedListOutlined />}>
                Create Channels List
                <Link to="/CreateChannelsList" />
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout style={{ padding: "0 24px 24px" }}>
            <Content
              className="site-layout-background"
              style={{
                padding: 24,
                margin: 0,
                minHeight: 280,
                backgroundColor: "white",
              }}
            >
              <Switch>
                <Route path="/MyYouTube">
                  <MyYouTube />
                </Route>
                <Route path="/CreateChannelsList">
                  <CreateChannelsList />
                </Route>
              </Switch>
            </Content>
          </Layout>
        </Layout>
        <Footer>Footer time!</Footer>
      </Layout>
    </Router>
  );
}
