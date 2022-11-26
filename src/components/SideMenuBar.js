import React from "react";
import {
  HomeOutlined,
  DatabaseOutlined,
  SettingOutlined,
  FolderOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { useNavigate } from "react-router-dom";

const items = [
  { label: "Home", key: "home", icon: <HomeOutlined /> },
  {
    label: "Data Management",
    key: "data/management",
    icon: <DatabaseOutlined />,
    children: [
      {
        label: "Categories",
        key: "management/categories",
      },
      {
        label: "Customers",
        key: "management/customers",
      },
      {
        label: "Employees",
        key: "management/employees",
      },
      {
        label: "Products",
        key: "management/products",
      },
      {
        label: "Suppliers",
        key: "management/suppliers",
      },
    ],
  },
  {
    label: "Sales Management",
    key: "sales/management",
    icon: <FolderOutlined />,
    children: [
      {
        label: "Orders",
        key: "orders",
        children: [
          { label: "By Status", key: "sales/orders/status" },
          { label: "By Payment Types", key: "sales/orders/paymenttype" },
        ],
      },
    ],
  },
  {
    label: "Setting",
    key: "setting",
    icon: <SettingOutlined />,
  },
];

function SideMenuBar() {
  const navigate = useNavigate();
  const onClick = ({ key }) => {
    console.log("click ", key);
    navigate("/" + key);
  };
  return (
    <div style={{ minHeight: "100vh" }}>
      <Menu theme="dark" onClick={onClick} mode="inline" items={items} />
    </div>
  );
}

export default SideMenuBar;
