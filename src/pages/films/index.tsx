import { Button, Col, Form, Image, Input, Modal, Popconfirm, Row, Select, Space, Tag, Tooltip, Typography, notification } from "antd";
import { useForm } from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";
import UploadImg from "../../components/UploadImg";
import { useState, useEffect } from "react";
import { apiGetAllFilm } from "../../api/filmApi";
import { Film } from "../../models/film";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import Table, { ColumnsType } from "antd/es/table";
import classNames from "classnames/bind";
import styles from "./films.module.scss";
import moment from "moment";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { filmState, requestLoadFilms, requestLoadFilmsByStatus } from "./filmsSlide";
import { unwrapResult } from "@reduxjs/toolkit";

const cx = classNames.bind(styles);

interface DataType {
  key: string;
  name: string;
  thumbnail: string;
  director: string[];
  status: number;
  startTime: number;
  endTime: number;
  value: Film;
}

export const FilmsStatus = [
  {
    value: 1,
    label: "GOING_ON",
  },
  {
    value: 2,
    label: "COMING",
  },
  {
    value: 3,
    label: "FINISH",
  },
];

const Films = () => {
  const [form] = useForm();
  const dispatch = useAppDispatch();
  const filmReducer = useAppSelector(filmState)
  const films = filmReducer.films;
  const loading = filmReducer.loading;
  
  const [dataUpload, setDataupload] = useState<string | null>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [datas, setDatas] = useState<DataType[]>([]);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [valueEdit, setValueEdit] = useState<Film | undefined>();
  const [statusFilm, setStatusFilm] = useState<number>(-2);

  const openCreateModal = () => {
    setIsModalOpen(true);
    setValueEdit(undefined);
    setIsEdit(false);
  };

  useEffect(() => {
    setDatas(films?.map(o => convertDataToTable(o)))
  }, [films])
  console.log(films);

  const convertDataToTable = (value: Film) => {
    return {
      key: `${value?.id || Math.random()}`,
      name: value?.name,
      thumbnail: value?.thumbnail,
      director: value?.director,
      status: value?.status,
      startTime: value?.startTime,
      endTime: value?.endTime,
      value: value,
    };
  };

  useEffect(() => {
    if (statusFilm !== -2) {
      loadFilmsByStatus(statusFilm);
    } else {
      loadAllFilms();
    }
  }, [statusFilm]);

  const loadAllFilms = async () => {
    try {
      const actionResult = await dispatch(
        requestLoadFilms({limit: 100, skip:0})
      );
      unwrapResult(actionResult);
    } catch (error) {
      notification.error({
        message: "không tải được danh sách phim",
      });
    }
  };
  
  const loadFilmsByStatus = async (status: number) => {
    try {
      const actionResult = await dispatch(
        requestLoadFilmsByStatus({
          status
        })
      );
      unwrapResult(actionResult);
    } catch (error) {
      notification.error({
        message: "không tải được danh sach danh mục",
      });
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleDelete = async (value: Film) => {
    try {
      // const data = await dispatch(
      //   requestUpdateCategorys({
      //     ...value,
      //     status: TTCSconfig.STATUS_DELETED,
      //   })
      // );
      // unwrapResult(data);
      // dispatch(
      //   requestLoadCategorys({
      //     status: statusCategory,
      //   })
      // );
      notification.success({
        message: "Xoá thành công",
        duration: 1.5,
      });
    } catch (error) {
      notification.error({
        message: "cập nhật không được",
        duration: 1.5,
      });
    }
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "STT",
      key: "stt",
      align: "center",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Ảnh",
      dataIndex: "thumbnail",
      key: "thumbnail",
      align: "center",
      render: (text) => (
        <Image
          src={text}
          width={150}
          preview={false}
          style={{
            width: "50%",
            overflow: "hidden",
          }}
        />
      ),
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      align: "center",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Đạo diễn",
      dataIndex: "director",
      key: "director",
      align: "center",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Trạng thái",
      key: "status",
      dataIndex: "status",
      align: "center",
      render: (text: number) => (
        <>
          <Tag color={text === 1 ? "green" : text === 2 ? "yellow" : "red"}>
            {FilmsStatus.find((o) => o.value === text)?.label}
          </Tag>
        </>
      ),
    },
    {
      title: "Ngày chiếu",
      key: "startTime",
      dataIndex: "startTime",
      align: "center",
      render: (text: number) => (
        <>
          <Tag>
            {moment(text).format("MMM Do YYYY")}
          </Tag>
        </>
      ),
    },
    {
      title: "Ngày kết thúc",
      key: "endTime",
      dataIndex: "endTime",
      align: "center",
      render: (text: number) => (
        <>
          <Tag>
            {moment(text).format("MMM Do YYYY")}
          </Tag>
        </>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      dataIndex: "value",
      align: "center",
      render: (text: Film, record) => (
        <Space size="middle">
          <Tooltip placement="top" title="Chỉnh sửa">
            <Button
              onClick={() => {
                setIsModalOpen(true);
                setValueEdit(text);
                setIsEdit(true);
              }}
            >
              <EditOutlined />
            </Button>
          </Tooltip>
          <Popconfirm
            placement="topRight"
            title="Bạn có chắc bạn muốn xóa mục này không?"
            onConfirm={() => {
              handleDelete(text);
            }}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip placement="top" title="Xóa">
              <Button>
                <DeleteOutlined />
              </Button>
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={openCreateModal}>
        Thêm mới
      </Button>

      <Typography.Title level={3}>Danh sách phim: </Typography.Title>

      <Table
        className={cx("course__table")}
        columns={columns}
        dataSource={datas}
        loading={loading} 
        pagination={{
          pageSize: 10
        }}
        // onRow={(record, rowIndex) => {
        //   return {
        //     onDoubleClick: (event) => {
        //       navigate(`chi-tiet-khoa-hoc/${record.value.id}`)
        //     },
        //   };
        // }}
      />  

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
