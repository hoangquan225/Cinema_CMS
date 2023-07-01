import { Button, Col, DatePicker, Form, Image, Input, Modal, Popconfirm, Row, Select, Space, Tag, Tooltip, Typography, notification } from "antd";
import { useForm } from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";
import UploadImg from "../../components/UploadImg";
import { useState, useEffect } from "react";
import { Film } from "../../models/film";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import Table, { ColumnsType } from "antd/es/table";
import classNames from "classnames/bind";
import styles from "./films.module.scss";
import moment from "moment";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { filmState, requestLoadFilms, requestUpdateFilm } from "./filmsSlide";
import { unwrapResult } from "@reduxjs/toolkit";
import AppConfig from "../../common/config";
import dayjs from "dayjs";

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
  {
    value: -1,
    label: "DELETED",
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

  const [sche, setSche] = useState<{
    index: number,
    time: number
  }[]>([])

  const { RangePicker } = DatePicker;

  const openCreateModal = () => {
    setIsModalOpen(true);
    setValueEdit(undefined);
    setIsEdit(false);
  };

  useEffect(() => {
    setDatas(films?.map(o => convertDataToTable(o)))
  }, [films])

  useEffect(() => {
    if (valueEdit) {
      const { name, description, videoUrl, thumbnail, category, director, actor, language, status, runningTime, schedule } = valueEdit;
      form.setFieldsValue({ name, description, videoUrl, thumbnail, category: category.join(","), director: director.join(","), actor: actor.join(","), language, status, runningTime, schedule });

      const convertedSchedule = schedule?.map((time, index) => ({
        time: Number(time),
        index
      }));
      setSche(convertedSchedule || []);
    }
  }, [valueEdit]);


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
      loadAllFilms(100, 0, statusFilm);
    } else {
      loadAllFilms();
    }
  }, [statusFilm]);

  const loadAllFilms = async (limit?: number, skip?: number, status?: number) => {
    try {
      const actionResult = await dispatch(
        requestLoadFilms({ limit: limit || 100, skip, status: status || undefined })
      );
      unwrapResult(actionResult);
    } catch (error) {
      notification.error({
        message: "không tải được danh sách phim",
      });
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setValueEdit(undefined);
    setDataupload(null)
    form.resetFields();
  };

  const handleDelete = async (value: Film) => {
    try {
      const data = await dispatch(
        requestUpdateFilm({
          ...value,
          status: AppConfig.STATUS_DELETED,
        })
      );
      unwrapResult(data);
      // dispatch(
      //   requestLoadFilms({})
      // );
      if (statusFilm !== -2) {
        loadAllFilms(100, 0, statusFilm);
      } else {
        loadAllFilms();
      }
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

  const handleOk = () => {
    form.validateFields().then(async (value) => {
      const { startEndTime, actor, director, category, thumbnail } = value

      const infoFilm = {
        ...value,
        startTime: startEndTime[0].valueOf(),
        endTime: startEndTime[1].valueOf(),
        actor: actor.split(","),
        director: director.split(","),
        category: category.split(","),
        thumbnail: thumbnail || dataUpload
      }
      console.log({
        id: valueEdit?.id,
        ...valueEdit,
        ...infoFilm
      });

      try {
        const data = await dispatch(
          requestUpdateFilm({
            id: valueEdit?.id,
            ...valueEdit,
            ...infoFilm
          })
        );
        unwrapResult(data);
        if (statusFilm !== -2) {
          loadAllFilms(100, 0, statusFilm);
        } else {
          loadAllFilms();
        }
        notification.success({
          message: "Cập nhật thành công",
          duration: 1.5,
        });
      } catch (error) {
        notification.error({
          message: "cập nhật không được",
          duration: 1.5,
        });
      }
      handleCancel();
    });
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
      <Space size="large">
        <Button type="primary" onClick={openCreateModal}>
          Thêm mới
        </Button>

        <Space size="small">
          <label style={{ marginLeft: "20px" }}>Chọn trạng thái:</label>
          <Select
            placeholder={"Bộ lọc"}
            style={{ width: 150, marginLeft: "10px" }}
            defaultValue={-2}
            options={[{
              value: -2,
              label: "Tất Cả",
            }, ...FilmsStatus]}
            onChange={(value) => {
              setStatusFilm(value);
            }}
          />
        </Space>
      </Space>

      <Typography.Title level={3}>Danh sách phim: </Typography.Title>

      <Table
        className={cx("course__table")}
        columns={columns}
        dataSource={datas}
        loading={loading}
        pagination={{
          pageSize: 10
        }}
      />

      <Modal
        title={`${isEdit ? "Chỉnh sửa" : "Tạo"}  Phim`}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={`${isEdit ? "Cập nhật" : "Tạo"}`}
        cancelText="Hủy"
        width="90%"
        style={{ top: 20, height: "80vh" }}
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
              xl={12}
              md={12}
              xs={24}
              style={{ borderRight: "0.1px solid #ccc" }}
            >
              <Form.Item label={<h3>{"Ảnh phim"}</h3>}>
                <UploadImg
                  defaultUrl={valueEdit?.thumbnail || dataUpload}
                  onChangeUrl={(value) => {
                    setDataupload(value)
                    form.setFieldsValue({ thumbnail: value })
                  }}
                />
              </Form.Item>
              <Form.Item
                label="Ảnh(URL)"
                name="thumbnail">
                <Input
                  onChange={(e) => setDataupload(e.target.value)} />
              </Form.Item>

              <Form.Item
                name="name"
                label="Tên phim"
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
                name="videoUrl"
                label="Movie Trailer (URL)"
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
                name="language"
                label="Ngôn ngữ"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập trường này!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item name="status" label="Trạng thái">
                <Select options={FilmsStatus} />
              </Form.Item>
            </Col>
            <Col xl={12} md={12} xs={24}>
              <Form.Item
                name="director"
                label="Đạo diễn"
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
                name="actor"
                label="Diễn viên"
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
                name="category"
                label="Thể loại"
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
                name="runningTime"
                label="Thời lượng (phút)"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập trường này!",
                  },
                  {
                    pattern: /^\d+$/,
                    message: "Vui lòng chỉ nhập số phút!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="startEndTime"
                label="Bắt đầu - Kết thúc"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập trường này!",
                  },
                ]}

              >
                <RangePicker
                  defaultValue={[dayjs(valueEdit?.startTime || undefined), dayjs(valueEdit?.endTime || undefined)]}
                />

              </Form.Item>

              {/* <Form.Item
                name="schedule"
                label="Lịch chiếu"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập trường này!",
                  },
                ]}
              >
                <DatePicker
                  format="YYYY-MM-DD HH:mm"
                  showTime={{ defaultValue: dayjs('00:00:00', 'HH:mm') }}
                />
                <Button>+</Button>
              </Form.Item> */}

              {/* <Typography.Text >
                Lịch chiếu
              </Typography.Text>
              {sche.map((data, index) =>
                {
                  console.log(data);
                  
                  return (<Form.Item
                    name={`schedule-${index + 1}`}
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập trường này!",
                      },
                    ]}
                  >
                    <DatePicker
                      format="YYYY-MM-DD HH:mm"
                      defaultValue={dayjs(data.time, "YYYY-MM-DD HH:mm")}
                      showTime={{ defaultValue: dayjs(data.time, "HH:mm") }}
                    />
                  </Form.Item>)
                }
              )} */}

              <Form.Item><Button onClick={() => {
                setSche([...sche, {
                  index: sche.length,
                  time: 0
                }])
              }}>thêm lịch</Button></Form.Item>
            </Col>
          </Row>
          <Row>
            <Col
              xl={24}
              md={24}
              xs={24}
            >
              <Form.Item label="Mô tả" name="description">
                <TextArea
                  autoSize={{
                    minRows: 5,
                    maxRows: 10,
                  }}
                  placeholder="Nhập mô tả ..."
                  style={{ minWidth: "100%" }}
                  showCount
                  maxLength={300}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div >
  );
};

export default Films;
