import React from "react";
import { axiosClient } from "../../libraries/axiosClient";
import { Table } from "antd";
import moment from "moment";

function Orders() {
  //Set State: để chứa data của component và lưu sự thay đổi của data:
  const [orders, setOrders] = React.useState([]);

  const columns = [
    // {
    //   title: "Product",
    //   dataIndex: "product",
    //   key: "product",
    //   width: "12%",
    //   render: (text, record) => {
    //     return (
    //       <strong style={{ color: "blue" }}>
            
    //       </strong>
    //     );
    //   },
    // },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      key: "createDate",
      width: "12%",
      render: (text) => {
        return <span>{moment(text).format("DD/MM/yyyy")}</span>;
      },
    },
    {
      title: "Shipped Date",
      dataIndex: "shippedDate",
      key: "shippedDate",
      width: "12%",
      render: (text) => {
        return <span>{moment(text).format("DD/MM/yyyy")}</span>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "12%",
      render: (text) => {
        return <strong style={{ color: "red" }}>{text}</strong>;
      },
    },
    {
      title: "Payment Type",
      dataIndex: "paymentType",
      key: "paymentType",
      width: "12%",
      render: (text) => {
        return <strong style={{ color: "blue" }}>{text}</strong>;
      },
    },
    {
      title: "Shipping Address",
      dataIndex: "shippingAddress",
      key: "shippingAddress",
      width: "12%",
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
      width: "12%",
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
      width: "12%",
      render: (text, record) => {
        return (
          <strong style={{ color: "orange" }}>
            {record.employee.fullName}
          </strong>
        );
      },
    },
  ];

  //Set useEffect: gắn component con vào component cha. Phương thức get Data.
  React.useEffect(() => {
    axiosClient.get("/orders").then((response) => {
      setOrders(response.data);
      console.log(response.data);
    });
  }, []);
  return (
    <div style={{ padding: "50px" }}>
      <Table dataSource={orders} columns={columns} />
    </div>
  );
}

export default Orders;
