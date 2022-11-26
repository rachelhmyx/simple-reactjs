import React from "react";
import { axiosClient } from "../../../libraries/axiosClient";
import {
  Table,
  Button,
  Form,
  Input,
  message,
  Space,
  Popconfirm,
  Modal,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

function Suppliers() {
  //Set State: State để lưu trữ data của compononent và đc sử dụng khi trạng thái của data bị thay đổi.
  const [suppliers, setSuppliers] = React.useState([]);
  const [refresh, setRefresh] = React.useState(0);
  const [selectedRecord, setSelectedRecord] = React.useState(null);
  const [isVisibleEditForm, setIsVisibleEditForm] = React.useState(false);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "22.5%",
      render: (text) => {
        return <strong style={{ color: "blue" }}>{text}</strong>;
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "22.5%",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: "22.5%",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      width: "22.5%",
    },
    {
      title: "",
      key: "actions",
      width: "5%",
      render: (text, record) => {
        return (
          <Space>
            <Popconfirm
              title="Are you sure to delete this row?"
              //Delete:
              onConfirm={() => {
                const id = record._id;
                axiosClient
                  .delete("/suppliers/" + id)
                  .then((response) => {
                    message.success("Deleted Successful!");
                    setRefresh((f) => {
                      return f + 1;
                    });
                  })
                  .catch((err) => {
                    message.error("Deleted Failed!");
                    console.log("🧨", err);
                  });
                console.log("Delete", record);
              }}
              onCancel={() => {}}
              okText="Yes"
              cancelText="No"
            >
              <Button type="dashed" danger icon={<DeleteOutlined />}></Button>
            </Popconfirm>
            <Button
              type="dashed"
              icon={<EditOutlined />}
              onClick={() => {
                setIsVisibleEditForm(true);
                setSelectedRecord(record);
                console.log("Selected Record", record);
                updateForm.setFieldsValue(record);
              }}
            ></Button>
          </Space>
        );
      },
    },
  ];

  //Set useEffect: phương thức get, lấy data về:
  React.useEffect(() => {
    axiosClient.get("/suppliers").then((response) => {
      setSuppliers(response.data);
      console.log(response.data);
    });
  }, [refresh]);

  //Phương thức POST: thêm data mới vào bảng
  const onFinish = (values) => {
    axiosClient
      .post("/suppliers", values)
      .then((response) => {
        message.success("Add New Successful!");
        createForm.resetFields();
        setRefresh((f) => {
          return f + 1;
        });
      })
      .catch((err) => {
        message.error("Add New Failed");
        console.log("🧨", err);
      });
  };
  const onFinishFailed = (errors) => {
    console.log("🧨", errors);
  };

  //Phương thức Patch: update data trong bảng:
  const onUpdateFinish = (values) => {
    axiosClient
      .patch("/suppliers/" + selectedRecord._id, values)
      .then((response) => {
        message.success("Updated Successfull");
        setRefresh((f) => {
          return f + 1;
        });
        updateForm.resetFields();
        setIsVisibleEditForm(false);
      })
      .catch((err) => {
        message.error("Updated Failed!");
        console.log("🧨", err);
      });
  };
  const onUpdateFinishFailed = (errors) => {
    console.log("🧨", errors);
  };

  const [createForm] = Form.useForm();
  const [updateForm] = Form.useForm();
  return (
    <div style={{ padding: "50px" }}>
      <Form
        form={createForm}
        name="create-form"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="on"
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input supplier name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please input suppliers email!" },
            { type: "email", message: "Input email is invalid!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Phone Number"
          name="phoneNumber"
          rules={[
            { required: true, message: "Please input suppliers phone number!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Address" name="address">
          <Input />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
      <Table dataSource={suppliers} columns={columns} />

      <Modal
        centered
        title="Update Suppliers Info"
        open={isVisibleEditForm}
        onOk={() => {
          updateForm.submit();
        }}
        onCancel={() => {
          setIsVisibleEditForm(false);
        }}
      >
        <Form
          form={updateForm}
          name="update-form"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onUpdateFinish}
          onFinishFailed={onUpdateFinishFailed}
          autoComplete="on"
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input supplier name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input suppliers email!" },
              { type: "email", message: "Input email is invalid!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Phone Number"
            name="phoneNumber"
            rules={[
              {
                required: true,
                message: "Please input suppliers phone number!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Address" name="address">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Suppliers;
