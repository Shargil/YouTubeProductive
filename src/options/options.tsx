import React from "react";
import { Layout, Menu } from "antd";
import {
  PlayCircleOutlined,
  UserOutlined,
  UnorderedListOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import MyYouTube from "./MyYouTube/MyYouTube";

import { MemoryRouter as Router, Switch, Route, Link } from "react-router-dom";

import "./options.scss";
import CreateChannelsList from "./CreateChannelsList/CreateChannelsList";
import { Home } from "./Home/Home";
import { FocusLevel } from "./FocusLevel/FocusLevel";

const { Header, Content, Footer, Sider } = Layout;

export default function Options() {
  const [firstOptionsConfig, setFirstOptionsConfig] = React.useState();
  React.useEffect(() => {
    chrome.storage.sync.get("user", ({ user }) => {
      setFirstOptionsConfig(user.firstOptionsConfig);
    });
  }, []);

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
              <Menu.Item id="HomeMenuItem" key="1" icon={<HomeOutlined />}>
                Home
                <Link to="/" />
              </Menu.Item>
              <Menu.Item
                id="MyYouTubeMenuItem"
                key="2"
                icon={<PlayCircleOutlined />}
              >
                My YouTube
                <Link to="/MyYouTube" />
              </Menu.Item>
              <Menu.Item
                id="FocusLevelMenuItem"
                key="3"
                icon={<UserOutlined />}
              >
                Focus Level
                <Link to="/FocusLevel" />
              </Menu.Item>
              <Menu.Item
                id="CreateChannelsListMenuItem"
                key="4"
                icon={<UnorderedListOutlined />}
              >
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
                  <MyYouTube firstOptionsConfig={firstOptionsConfig} />
                </Route>
                <Route path="/FocusLevel">
                  <FocusLevel firstOptionsConfig={firstOptionsConfig} />
                </Route>
                <Route path="/CreateChannelsList">
                  <CreateChannelsList />
                </Route>
                <Route path="/">
                  <Home firstOptionsConfig={firstOptionsConfig} />
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
