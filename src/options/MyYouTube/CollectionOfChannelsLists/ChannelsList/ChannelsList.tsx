import React from "react";
import UsersIcon from "./UsersIcon";
import "./ChannelsList.scss";
import { Space, Typography, Row, Col, Divider } from "antd";
import {
  CaretUpOutlined,
  CaretDownOutlined,
  EditOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

const IconText = ({ icon, text, className }: any) => (
  <Space className={className}>
    {React.createElement(icon)}
    {text}
  </Space>
);

export interface channelsList {
  id: number;
  name: string;
  author: string;
  upVotes: number;
  numOfUsers: number;
  list: Array<channel>;
}

export interface channel {
  id: string;
  name: string;
  img: string;
}

export default function ChannelsList({
  channelsList,
  remove,
  onSelect,
  isSelected,
}): JSX.Element {
  return (
    <div id="channels-list">
      <Row
        align="middle"
        justify="space-between"
        gutter={20}
        className={isSelected ? "selected" : null}
      >
        <Col span={4} style={{ textAlign: "center" }}>
          <Row justify="center">
            <CaretUpOutlined className="vote-icon" />
          </Row>
          <Row justify="center" style={{ fontWeight: 600 }}>
            {channelsList.upVotes}
          </Row>
          <Row justify="center">
            <CaretDownOutlined className="vote-icon" />
          </Row>
        </Col>
        <Col span={16} onClick={() => onSelect()}>
          <Title level={5}>{channelsList.name}</Title>
          <Space split={<Divider type="vertical" />}>
            <IconText
              icon={UsersIcon}
              text={channelsList.numOfUsers}
              className="channels-list-info"
              key="list-vertical-star-o"
            />
            <IconText
              icon={EditOutlined}
              text={channelsList.author}
              className="list-info"
              key="list-vertical-author-o"
            />
          </Space>
        </Col>
        <Col span={4}>
          <MinusCircleOutlined
            className="delete-button"
            onClick={() => remove(channelsList.id)}
          />
        </Col>
      </Row>
    </div>
  );
}
