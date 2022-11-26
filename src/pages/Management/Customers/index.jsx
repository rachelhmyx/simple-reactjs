import React from "react";
import { axiosClient } from "../../../libraries/axiosClient";
import {
  Table,
  Form,
  Input,
  Button,
  message,
  Space,
  Popconfirm,
  Modal,
} from "antd";
import moment from "moment";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

function Customers() {
  //Set State: lưu trữ data của component và sự thay đổi trạng thái của data.
  const [customers, setCustomers] = React.useState([]);
  const [refresh, setRefresh] = React.useState(0); //Dùng để refresh lại data trong bảng
  const [isVisibleEditForm, setIsVisibleEditForm] = React.useState(false);
  const [selectedRecord, setSelectRecord] = React.useState(null);

  const columns = [
    {
      title: "Fullname",
      dataIndex: "fullName",
      key: "fullName",
      width: "18%",
      render: (text) => {
        return <strong style={{ color: "blue" }}>{text}</strong>;
      },
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: "18%",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "18%",
    },
    {
      title: "Birthday",
      dataIndex: "birthday",
      key: "birthday",
      width: "18%",
      render: (text) => {
        return <span>{moment(text).format("DD/MM/yyyy")}</span>;
      },
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      width: "18%",
    },
    {
      title: "",
      key: "action",
      width: "5%",
      render: (text, record) => {
        return (
          <Space>
            <Popconfirm
              title="Are you sure to delete this row?"
              onConfirm={() => {
                //Delete data:
                const id = record._id;
                axiosClient
                  .delete("/customers/" + id)
                  .then((response) => {
                    message.success("Deleted Successful!");
                    setRefresh((f) => {
                      return f + 1;
                    });
                  })
                  .catch((err) => {
                    message.error("Deleted Failed");
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
                console.log("Selected Record", record);
                setSelectRecord(record);
                updateForm.setFieldsValue(record);
              }}
            ></Button>
          </Space>
        );
      },
    },
  ];

  //Set useEffect: lấy data từ database, gắn component. Phương thức GET:
  React.useEffect(() => {
    axiosClient
      .get("/customers")
      .then((response) => {
        console.log(response.data);
        setCustomers(response.data);
      })
      .catch((err) => {
        console.log("🧨", err);
      });
  }, [refresh]);

  //Phương thức Post: thêm data vào bảng:
  const onFinish = (values) => {
    axiosClient
      .post("/customers", values)
      .then((response) => {
        setRefresh((f) => {
          return f + 1;
        });
        message.success("Add New Successful");
        createForm.resetFields();
      })
      .catch((err) => {
        console.log("🧨", err);
      });
  };
  const onFinishFailed = (errors) => {
    console.log("🧨", errors);
  };

  //Phương thức Patch:
  const onUpdateFinish = (values) => {
    axiosClient
      .patch("/customers/" + selectedRecord._id, values)
      .then((response) => {
        message.success("Updated Successful");
        updateForm.resetFields();
        setRefresh((f) => {
          return f + 1;
        });
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
          label="Firstname"
          name="firstName"
          rules={[{ required: true, message: "Please input your firstname!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Lastname"
          name="lastName"
          rules={[{ required: true, message: "Please input your lastname!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Phone Number"
          name="phoneNumber"
          rules={[
            { required: true, message: "Please input your phone number!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please input your email!" },
            { type: "email", message: "Input email is invalid!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Birthday"
          name="birthday"
          rules={[{ type: "date", message: "Input birthday is invalid!" }]}
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
      <Table dataSource={customers} columns={columns} />

      <Modal
        centered
        title="Update Customer Info"
        open={isVisibleEditForm}
        onOk={() => {
          updateForm.submit();
        }}
        onCancel={() => {
          setIsVisibleEditForm(false);
        }}
        okText="Save"
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
            label="Firstname"
            name="firstName"
            rules={[
              { required: true, message: "Please input your firstname!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Lastname"
            name="lastName"
            rules={[{ required: true, message: "Please input your lastname!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phoneNumber"
            rules={[
              { required: true, message: "Please input your phone number!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Input email is invalid!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Birthday"
            name="birthday"
            rules={[{ type: "date", message: "Input birthday is invalid!" }]}
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

export default Customers;
