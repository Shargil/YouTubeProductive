import React from "react";
//  Import the less file (and not the the css) to enable costume styling in webpack.common
import "antd/dist/antd.less";
import { Layout, Menu } from "antd";
import {
  PlayCircleOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import OtherOptionsIcon from "../shared/customAnatIcons/OtherOptionsIcon"
import FocusIcon from "../shared/customAnatIcons/FocusIcon";
import MyYouTube from "./MyYouTube/MyYouTube";

import { MemoryRouter as Router, Switch, Route, Link } from "react-router-dom";

import "./options.scss";
// import CreateChannelsList from "./CreateChannelsList/CreateChannelsList";
import { Home } from "./Home/Home";
import { FocusLevel } from "./FocusLevel/FocusLevel";
import { OtherOptions } from "./OtherOptions/OtherOptions";
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
          <img src="../assets/LogoSmall.svg" alt="React Logo" width="165" />
        </Header>
        <Layout>
          <Sider width={200} className="my-sider">
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
                icon={<FocusIcon />}
              >
                Focus Level
                <Link to="/FocusLevel" />
              </Menu.Item>
              <Menu.Item
                id="OtherOptionsMenuItem"
                key="4"
                icon={<OtherOptionsIcon />}
              >
                Other Options
                <Link to="/OtherOptions" />
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout style={{ padding: "0 24px 24px" }}>
            <Content
            >
              <Switch>
                <Route path="/MyYouTube">
                  <MyYouTube firstOptionsConfig={firstOptionsConfig} />
                </Route>
                <Route path="/FocusLevel">
                  <FocusLevel firstOptionsConfig={firstOptionsConfig} />
                </Route>
                <Route path="/OtherOptions">
                  <OtherOptions firstOptionsConfig={firstOptionsConfig} />
                </Route>
                <Route path="/">
                  <Home firstOptionsConfig={firstOptionsConfig} />
                </Route>
              </Switch>
            </Content>
          </Layout>
        </Layout>
        <Footer style={{ textAlign: "center", fontSize: "14px", paddingTop: "12px", paddingBottom: "12px" }}>
          YouTube Productive - Made With ❤ By <a href="https://github.com/Shargil">Shargil</a>
          <div style={{ fontSize: "10px" }}>if you want follow/ star me <a href="https://github.com/Shargil?tab=stars">here</a> or upvote any thing <a href="https://stackoverflow.com/users/2593480/yam-shargil">here</a>, you are a ⭐</div>
          {/* <div style={{ fontSize: "10px" }}>Do you know where are the right places to click? <a href="https://github.com/Shargil?tab=stars">here</a> and <a href="https://stackoverflow.com/users/2593480/yam-shargil">here</a> 😅</div> */}
          {/* <div style={{ fontSize: "10px" }}>Some of the best people in this Galaxy 🌌 did it, will you? <a href="https://github.com/Shargil?tab=stars">here</a> and <a href="https://stackoverflow.com/users/2593480/yam-shargil">here</a> 🌎 </div> */}
        </Footer>
      </Layout>
    </Router>
  );
}