import React from "react";
import { Table, Button, Form, message, Select } from "antd";
import { axiosClient } from "../../../libraries/axiosClient";
import { PaymentType } from "../../../meta/PaymentType";
import numeral from "numeral";

function SearchOrdersByPaymentType() {
  const columns = [
    {
      title: "Product Name",
      dataIndex: "product",
      key: "product",
      render: (text, record) => {
        return (
          <strong style={{ color: "blue" }}>
            {record.orderDetails[0].product.name}
          </strong>
        );
      },
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (text, record) => {
        return (
          <strong style={{ color: "brown" }}>
            {record.orderDetails[0].quantity}
          </strong>
        );
      },
    },
    {
      title: "Payment Type",
      dataIndex: "paymentType",
      key: "paymentType",
      render: (text, record) => {
        return (
          <strong style={{ color: "blueviolet" }}>{record.paymentType}</strong>
        );
      },
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
      render: (text, record) => {
        return (
          <strong style={{ color: "blueviolet" }}>
            {record.customer.fullName}
          </strong>
        );
      },
    },
    {
      title: "Employee",
      dataIndex: "employee",
      key: "employee",
      render: (text, record) => {
        return (
          <strong style={{ color: "blueviolet" }}>
            {record.employee.fullName}
          </strong>
        );
      },
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (text, record) => {
        const { orderDetails } = record;

        let total = 0;
        orderDetails.forEach((od) => {
          let sum = od.quantity * od.product.total;
          total = total + sum;
        });
        return (
          <strong style={{ color: "red" }}>
            {numeral(total).format("0,0$")}
          </strong>
        );
      },
    },
  ];

  const [loading, setLoading] = React.useState(false);
  const [orders, setOrders] = React.useState([]);
  const [searchForm] = Form.useForm();

  const onFinish = (values) => {
    setLoading(true);
    axiosClient
      .post("/orders/questions/77", values)
      .then((response) => {
        setOrders(response.data);
        setLoading(false);
      })
      .catch((err) => {
        message.error("Errors!");
        console.log(err);
        setLoading(false);
      });
  };
  const onFinishFailed = (error) => {
    console.log("🐣", error);
  };
  return (
    <div style={{padding: "50px"}}>
      <Form
        form={searchForm}
        name="search-form"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ paymentType: "Choose Payment Type" }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="on"
      >
        <Form.Item label="Payment Type" name="paymentType">
          <Select options={PaymentType} />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            {loading ? "Loading" : "Sorting"}
          </Button>
        </Form.Item>
      </Form>
      <Table rowKey="_id" dataSource={orders} columns={columns} />
    </div>
  );
}

export default SearchOrdersByPaymentType;
