import React, { useState } from "react";
import { Button, Row, Col, Table, Card } from "antd";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { setTokenWaller } from "../redux/slice/balanceSlice";
import moment from "moment";

function convert(n) {
  if (!window.web) return;
  return window.web.web3.utils.fromWei(n, "ether");
}

function coverTime(n) {
  return moment.unix(n).format("YYYY-MM-DD HH:mm:ss");
}

function getRenderOrder(order, type) {
  if (!window.web) return [];
  let account = window.web.account;
  //排除已完成以及取消的订单
  let filterIds = [...order.CancelOrders, ...order.FillOrders].map(
    (item) => item.id
  );
  let pendingOrders = order.AllOrders.filter(
    (item) => !filterIds.includes(item.id)
  );
  console.log(pendingOrders);
  if (type === 1) {
    return pendingOrders.filter((item) => item.user === account);
  } else {
    return pendingOrders.filter((item) => item.user !== account);
  }
}

export default function Order() {
  const dispatch = useDispatch();
  const [dataSource, setDataSource] = useState([]);
  const order = useSelector((state) => state.order);
  console.log(order);

  const columns = [
    {
      title: "时间",
      dataIndex: "timestamp",
      render: (time) => {
        return <div>{coverTime(time)}</div>;
      },
    },
    {
      title: "KWT",
      dataIndex: "amountGet",
      render: (amountGet) => {
        return <b>{convert(amountGet)}</b>;
      },
    },
    {
      title: "ETH",
      dataIndex: "amountGive",
      render: (amountGive) => {
        return <b>{convert(amountGive)}</b>;
      },
    },
  ];
  return (
    <div style={{ border: "1px solid #ccc" }}>
      <Row gutter={24}>
        <Col span={8}>
          <Card bordered={false} hoverable title="已完成交易">
            <Table
              dataSource={order.FillOrders}
              columns={columns}
              rowKey={(item) => item.id}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false} hoverable title="交易中-我创建的订单">
            <Table
              dataSource={getRenderOrder(order, 1)}
              columns={columns}
              rowKey={(item) => item.id}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false} hoverable title="交易中-其他人的订单">
            <Table
              dataSource={getRenderOrder(order, 2)}
              columns={columns}
              rowKey={(item) => item.id}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
