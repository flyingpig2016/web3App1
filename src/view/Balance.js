import React from "react";
import { Button, Row, Col, Statistic, Card } from "antd";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { setTokenWaller } from "../redux/slice/balanceSlice";

function convert(n) {
  if (!window.web) return;
  return window.web.web3.utils.fromWei(n, "ether");
}

export default function Balance() {
  const {
    TokenWallet, //位转换,需要字符串，不是数字
    TokenExchange,
    EtherWallet,
    Etherchange,
  } = useSelector((state) => state.balance);
  const dispatch = useDispatch();

  //   console.log(state);
  return (
    <div style={{ border: "1px solid #ccc", marginBottom: "1rem" }}>
      <Row gutter={24}>
        <Col span={6}>
          <Card bordered={false} hoverable>
            <Statistic
              title="钱包中的以太币"
              value={convert(EtherWallet)}
              precision={3}
              valueStyle={{ color: "#3f8600" }}
              prefix={<ArrowUpOutlined />}
              suffix="ETH"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} hoverable>
            <Statistic
              title="钱包中的KWT"
              value={convert(TokenWallet)}
              precision={3}
              valueStyle={{ color: "#cf1322" }}
              prefix={<ArrowDownOutlined />}
              suffix="KWT"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} hoverable>
            <Statistic
              title="交易所中的以太币"
              value={convert(Etherchange)}
              precision={3}
              valueStyle={{ color: "#3f6600" }}
              prefix={<ArrowUpOutlined />}
              suffix="ETH"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} hoverable>
            <Statistic
              title="交易所中的KWT"
              value={convert(TokenExchange)}
              precision={3}
              valueStyle={{ color: "#f2d322" }}
              prefix={<ArrowDownOutlined />}
              suffix="KWT"
            />
          </Card>
        </Col>
      </Row>
      {/* <Button
        onClick={() => {
          dispatch(setTokenWaller("1000"));
        }}
      >
        click
      </Button> */}
    </div>
  );
}
