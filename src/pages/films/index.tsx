import { Button, Col, Form, Input, Modal, Row, Select, Typography } from "antd";
import { useForm } from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";
import UploadImg from "../../components/UploadImg";
import { useState } from "react";
import { apiGetAllFilm } from "../../api/filmApi";

const Films = () => {
  const [form] = useForm();
  const [dataUpload, setDataupload] = useState<string | null>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState();
  const openCreateModal = () => {
    setIsModalOpen(true);
    // setValueEdit(undefined);
    // setIsEdit(false);
  };

  const onTest = async () => {
    try {
      console.log("onTest");

      const res = await apiGetAllFilm();
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  // const columns: ColumnsType<DataType> = [
  //   {
  //     title: "STT",
  //     key: "stt",
  //     align: "center",
  //     render: (text, record, index) => index + 1,
  //   },
  //   {
  //     title: "Ảnh",
  //     dataIndex: "avatar",
  //     key: "avatar",
  //     align: "center",
  //     render: (text) => (
  //       <Image
  //         src={text}
  //         width={150}
  //         preview={false}
  //         style={{
  //           maxHeight: "80px",
  //           overflow: "hidden",
  //         }}
  //       />
  //     ),
  //   },
  //   {
  //     title: "Tên danh mục",
  //     dataIndex: "name",
  //     key: "name",
  //     align: "center",
  //     render: (text) => <span>{text}</span>,
  //   },
  //   {
  //     title: "Đường dẫn",
  //     dataIndex: "slug",
  //     key: "slug",
  //     align: "center",
  //     render: (text) => <span>{text}</span>,
  //   },
  //   {
  //     title: "Trạng thái",
  //     key: "status",
  //     dataIndex: "status",
  //     align: "center",
  //     render: (text: number) => (
  //       <>
  //         <Tag color={text === TTCSconfig.STATUS_PUBLIC ? "green" : "red"}>
  //           {STATUSES.find((o) => o.value === text)?.label}
  //         </Tag>
  //       </>
  //     ),
  //   },
  //   {
  //     title: "Hành động",
  //     key: "action",
  //     dataIndex: "value",
  //     align: "center",
  //     render: (text: Category, record) => (
  //       <Space size="middle">
  //         <Tooltip placement="top" title="Chỉnh sửa">
  //           <Button
  //             onClick={() => {
  //               setIsModalOpen(true);
  //               setValueEdit(text);
  //               setIsEdit(true);
  //             }}
  //           >
  //             <EditOutlined />
  //           </Button>
  //         </Tooltip>
  //         {statusCategory !== TTCSconfig.STATUS_DELETED && (
  //           <Popconfirm
  //             placement="topRight"
  //             title="Bạn có chắc bạn muốn xóa mục này không?"
  //             onConfirm={() => {
  //               handleDelete(text);
  //             }}
  //             okText="Yes"
  //             cancelText="No"
  //           >
  //             <Tooltip placement="top" title="Xóa">
  //               <Button>
  //                 <DeleteOutlined />
  //               </Button>
  //             </Tooltip>
  //           </Popconfirm>
  //         )}
  //       </Space>
  //     ),
  //   },
  // ];

  return (
    <div>
      <Button type="primary" onClick={openCreateModal}>
        Thêm mới
      </Button>

      <Button type="primary" onClick={onTest}>
        Thêm mới
      </Button>

      <Typography.Title level={3}>Danh sách danh mục: </Typography.Title>

      <Modal
        // title={`${isEdit ? "Chỉnh sửa" : "Tạo"}  khóa học`}
        open={isModalOpen}
        // onOk={handleOk}
        onCancel={handleCancel}
        // okText={`${isEdit ? "Cập nhật" : "Tạo"}`}
        cancelText="Hủy"
        width="90%"
        style={{ top: 20, height: "90vh" }}
        maskClosable={false}
      >
        <Form
          layout="vertical"
          name="register"
          initialValues={{
            status: 1,
          }}
          form={form}
        >
          <Row gutter={{ xl: 48, md: 16, xs: 0 }}>
            <Col
              xl={16}
              md={16}
              xs={24}
              style={{ borderRight: "0.1px solid #ccc" }}
            >
              <Form.Item label="Mô tả">
                {/* <TinymceEditor
                  id="descriptionCourse"
                  key="descriptionCourse"
                  editorRef={descRef}
                  value={valueEdit?.des ?? ""}
                  heightEditor="400px"
                /> */}
              </Form.Item>

              <Form.Item label="Mô tả ngắn" name="shortDes">
                <TextArea
                  autoSize={{
                    minRows: 5,
                    maxRows: 10,
                  }}
                  placeholder="Nhập mô tả ngắn..."
                  style={{ minWidth: "100%" }}
                  showCount
                  maxLength={300}
                />
              </Form.Item>
            </Col>
            <Col xl={8} md={8} xs={24}>
              <Form.Item label={<h3>{"Ảnh khóa học"}</h3>} name="avatar">
                <UploadImg
                  //   defaultUrl={valueEdit?.avatar}
                  onChangeUrl={(value) => setDataupload(value)}
                />
              </Form.Item>

              <Form.Item
                name="courseName"
                label="Tên khóa học"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập trường này!",
                  },
                ]}
              >
                <Input
                  onChange={(e) => {
                    // form.setFieldsValue({ slug: convertSlug(e.target.value) });
                  }}
                />
              </Form.Item>

              <Form.Item
                name="slug"
                label="Đường dẫn"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập trường này!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="idCategory"
                label="Danh mục cha"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập trường này!",
                  },
                ]}
              >
                {/* <Select
                  options={categorys?.map((data) => ({
                    value: data.id,
                    label: data.name,
                  }))}
                  onChange={(value) => {
                    setIdCategorysModal(value);
                  }}
                  listHeight={128}
                /> */}
              </Form.Item>

              <Form.Item
                name="idTag"
                label="Tag"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập trường này!",
                  },
                ]}
              >
                {/* <Select
                  options={dataTagsModal?.map((data) => ({
                    value: data.id,
                    label: data.name,
                  }))}
                /> */}
              </Form.Item>

              <Form.Item name="status" label="Trạng thái">
                {/* <Select options={STATUSES} /> */}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default Films;
