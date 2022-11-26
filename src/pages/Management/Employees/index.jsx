import React from "react";
import { axiosClient } from "../../../libraries/axiosClient";
import {
  Table,
  Button,
  Form,
  Input,
  message,
  Popconfirm,
  Modal,
  Space,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import moment from "moment";

function Employees() {
  //Set State:
  const [employees, setEmployees] = React.useState([]);
  const [refresh, setRefresh] = React.useState(0);
  const [editFormVisible, setEditFormVisible] = React.useState(false);
  const [selectedRecord, setSelectedRecord] = React.useState(null);

  //Khai báo Column: Get data
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
      render: (text) => {
        return <em>{text}</em>;
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "18%",
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
              onConfirm={() => {
                //Delete:
                const id = record._id;
                axiosClient
                  .delete("/employees/" + id)
                  .then((response) => {
                    message.success("Delete Successful!");
                    setRefresh((f) => {
                      return f + 1;
                    });
                  })
                  .catch((err) => {
                    message.error("Delete Failed!");
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
                setEditFormVisible(true);
                console.log("Selected Record", record);
                setSelectedRecord(record);
                updateForm.setFieldsValue(record);
              }}
            ></Button>
          </Space>
        );
      },
    },
  ];

  React.useEffect(() => {
    axiosClient.get("/employees").then((response) => {
      setEmployees(response.data);
      console.log(response.data);
    });
  }, [refresh]); //useEffect(mounting) kiểu dependencies có value: sẽ chạy lại khi refresh thay đổi, gắn thêm component con vào component cha, thêm mới data vào bảng mà ko cần phải load lại trang. Sẽ thực hiện GET lại data.

  const onFinish = (values) => {
    axiosClient
      .post("/employees", values)
      .then((response) => {
        message.success("Add New Successful!");
        createForm.resetFields();
        setRefresh((f) => {
          return f + 1;
        });
      })
      .catch((err) => {
        message.error("Add New Failed!");
        console.log(err);
      });
  };

  const onFinishFailed = (errors) => {
    console.log("🧨", errors);
  };

  const onUpdateFinish = (values) => {
    axiosClient
      .patch("/employees/" + selectedRecord._id, values)
      .then((response) => {
        message.success("Updated Successful!");
        updateForm.resetFields();
        setRefresh((f) => f + 1);
        setEditFormVisible(false);
      })
      .catch((err) => {
        message.error("Updated Failed!");
        console.log("🧨",err);
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
        name="create-new-form"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish} //Khi submit đc form thành công
        onFinishFailed={onFinishFailed} //Khi validate bị lỗi, ko submit đc
        autoComplete="off"
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
          label="Birthday"
          name="birthday"
          rules={[{ type: "date", message: "Input birthday is invalid!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Address"
          name="address"
          rules={[{ required: true, message: "Please input your address!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          hasFeedback
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please input your email!" },
            { type: "email", message: "Input email is invalid!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
      <Table dataSource={employees} columns={columns} />

      <Modal
        centered
        open={editFormVisible}
        title="Update Data"
        onOk={() => {
          updateForm.submit();
        }}
        onCancel={() => {
          setEditFormVisible(false);
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
          autoComplete="off"
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
            label="Birthday"
            name="birthday"
            rules={[{ type: "date", message: "Input birthday is invalid!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: "Please input your address!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            hasFeedback
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Input email is invalid!" },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Employees;
