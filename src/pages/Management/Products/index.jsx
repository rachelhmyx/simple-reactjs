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
  InputNumber,
  Select,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import numeral from "numeral";

function Products() {
  //Set State:
  const [products, setProducts] = React.useState([]);
  const [refresh, setRefresh] = React.useState(0);
  const [editFormVisible, setEditFormVisible] = React.useState(false);
  const [selectedRecord, setSelectedRecord] = React.useState(null);
  const [categories, setCategories] = React.useState([]);
  const [suppliers, setSuppliers] = React.useState([]);

  //Khai báo Column: Get data
  const columns = [
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: "12%",
      render: (text, record) => {
        return (
          <strong style={{ color: "blue" }}>{record.category.name}</strong>
        );
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "12%",
      render: (text) => {
        return <strong style={{ color: "blue" }}>{text}</strong>;
      },
    },
    {
      title: "Total Price",
      dataIndex: "total",
      key: "total",
      width: "12%",
      render: (text) => {
        return (
          <strong style={{ color: "blueviolet" }}>
            {numeral(text).format("0,0$")}
          </strong>
        );
      },
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      width: "12%",
      render: (text) => {
        return (
          <strong style={{ color: "red" }}>
            {numeral(text).format("0,0")}%
          </strong>
        );
      },
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      width: "12%",
      render: (text) => {
        return (
          <strong style={{ color: "green" }}>
            {numeral(text).format("0,0.00")}
          </strong>
        );
      },
    },
    {
      title: "Supplier",
      dataIndex: "supplier",
      key: "supplier",
      width: "12%",
      render: (text, record) => {
        return (
          <strong style={{ color: "burlywood" }}>{record.supplier.name}</strong>
        );
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
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
                  .delete("/products/" + id)
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
    axiosClient.get("/categories").then((response) => {
      setCategories(response.data);
      //   console.log(response.data);
    });
  }, []); //Chỉ cần lấy một lần thôi nên không cần gắn dependences

  React.useEffect(() => {
    axiosClient.get("/suppliers").then((response) => {
      setSuppliers(response.data);
      //   console.log(response.data);
    });
  }, []); //Chỉ cần lấy một lần thôi nên không cần gắn dependences

  React.useEffect(() => {
    axiosClient.get("/products").then((response) => {
      setProducts(response.data);
      console.log(response.data);
    });
  }, [refresh]); //useEffect(mounting) kiểu dependencies có value: sẽ chạy lại khi refresh thay đổi, gắn thêm component con vào component cha, thêm mới data vào bảng mà ko cần phải load lại trang. Sẽ thực hiện GET lại data.

  const onFinish = (values) => {
    axiosClient
      .post("/products", values)
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
      .patch("/products/" + selectedRecord._id, values)
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
        onFinish={onFinish} //Khi submit đc form thành công
        onFinishFailed={onFinishFailed} //Khi validate bị lỗi, ko submit đc
        autoComplete="off"
      >
        <Form.Item
          label="Category"
          name="categoryId"
          rules={[{ required: true, message: "Please input product name!" }]}
        >
          <Select
            options={
              categories &&
              categories.map((c) => {
                return {
                  value: c._id,
                  label: c.name,
                };
              }) //Dấu && ở đây là check thử categories có null hay không, nếu null thì nó ko thực hiện câu lệnh map đằng sau
            }
          />
        </Form.Item>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input product name!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Price"
          name="price"
          rules={[{ required: true, message: "Please input product price!" }]}
        >
          <InputNumber
            style={{ minWidth: 200 }}
            // formatter={(value) => {
            //   return numeral(value).format("0,0$");
            // }} thầy sẽ nói lại sau
          />
        </Form.Item>

        <Form.Item label="Discount" name="discount">
          <InputNumber style={{ minWidth: 200 }} />
        </Form.Item>

        <Form.Item label="Stock" name="stock">
          <InputNumber style={{ minWidth: 200 }} />
        </Form.Item>

        <Form.Item
          label="Supplier"
          name="supplierId"
          rules={[{ required: true, message: "Please input supplier name!" }]}
        >
          <Select
            options={
              suppliers &&
              suppliers.map((c) => {
                return {
                  value: c._id,
                  label: c.name,
                };
              }) //Dấu && ở đây là check thử suppliers có null hay không, nếu null thì nó ko thực hiện câu lệnh map đằng sau
            }
          />
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
      <Table dataSource={products} columns={columns} />

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
            label="Category"
            name="categoryId"
            rules={[{ required: true, message: "Please input product name!" }]}
          >
            <Select
              options={
                categories &&
                categories.map((c) => {
                  return {
                    value: c._id,
                    label: c.name,
                  };
                }) //Dấu && ở đây là check thử categories có null hay không, nếu null thì nó ko thực hiện câu lệnh map đằng sau
              }
            />
          </Form.Item>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input product name!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: "Please input product price!" }]}
          >
            <InputNumber />
          </Form.Item>

          <Form.Item label="Discount" name="discount">
            <InputNumber />
          </Form.Item>

          <Form.Item label="Stock" name="stock">
            <InputNumber />
          </Form.Item>

          <Form.Item
            label="Supplier"
            name="supplierId"
            rules={[{ required: true, message: "Please input supplier name!" }]}
          >
            <Select
              options={
                suppliers &&
                suppliers.map((c) => {
                  return {
                    value: c._id,
                    label: c.name,
                  };
                }) //Dấu && ở đây là check thử suppliers có null hay không, nếu null thì nó ko thực hiện câu lệnh map đằng sau
              }
            />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Products;
