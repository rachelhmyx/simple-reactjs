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

function Categories() {
  //Set useState:
  const [categories, setCategories] = React.useState([]);
  const [refresh, setRefresh] = React.useState(0);
  const [editFormVisible, setEditFormVisible] = React.useState(false);
  const [selectedRecord, setSelectedRecord] = React.useState(null);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "45%",
      render: (text) => {
        return <strong style={{ color: "blue" }}>{text}</strong>;
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: "45%",
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
                //DELETE:
                const id = record._id;
                axiosClient
                  .delete("/categories/" + id)
                  .then((response) => {
                    message.success("Delete Success");
                    setRefresh((f) => {
                      return f + 1;
                    });
                  })
                  .catch((err) => {
                    console.log("🧨", err);
                  });
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
                console.log("Selected record", record);
                setSelectedRecord(record);
                updateForm.setFieldsValue(record);
              }}
            ></Button>
          </Space>
        );
      },
    },
  ];

  //Set useEffect:
  React.useEffect(() => {
    //Phương thức GET: lấy data ra khỏi cơ sở dữ liệu
    axiosClient.get("/categories").then((response) => {
      setCategories(response.data);
      console.log(response.data);
    });
  }, [refresh]);

  //Phương thức POST: thêm thông tin vào bảng:
  const onFinish = (values) => {
    axiosClient
      .post("/categories", values)
      .then((response) => {
        message.success("Add New Successful");
        createForm.getFieldsValue();
        setRefresh((f) => {
          return f + 1;
        });
      })
      .catch((err) => {
        message.error("Add New Failed");
      });
  };
  const onFinishFailed = (errors) => {
    console.log("🧨", errors);
  };

  //Phương thức Patch:
  const onUpdateFinish = (values) => {
    axiosClient
      .patch("/categories/" + selectedRecord._id, values)
      .then((response) => {
        message.success("Updated Successful!");
        updateForm.resetFields();
        setRefresh((f) => f + 1);
        setEditFormVisible(false);
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
        name="create-new-form"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish} //Hành động sẽ xảy ra sau khi submit thông tin, thông tin sẽ đc lưu vào bảng
        onFinishFailed={onFinishFailed} //Hành động xảy ra khi nhập sai
        autoComplete="on"
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input category name!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
      <Table dataSource={categories} columns={columns} />

      <Modal
        centered
        title="Update Categories"
        open={editFormVisible}
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
          autoComplete="on"
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input category name!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Categories;
