import { Button, Col, DatePicker, Form, Image, Input, Modal, Popconfirm, Row, Select, Space, Tag, TimePicker, Tooltip, Typography, notification } from "antd";
import { useForm } from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";
import UploadImg from "../../components/UploadImg";
import { useState, useEffect } from "react";
import { Film } from "../../models/film";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import Table, { ColumnsType } from "antd/es/table";
import classNames from "classnames/bind";
import styles from "./schedules.module.scss";
import moment from "moment";  
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { unwrapResult } from "@reduxjs/toolkit";
import AppConfig from "../../common/config";
import dayjs from "dayjs";
import { apiUpdateStateFilm } from "../../api/filmApi";
import { useNavigate } from "react-router-dom";
import { Schedule } from "../../models/schedule";
import { requestGetSchedule, scheduleState } from "./schedulesSlide";
import { filmState, requestLoadFilms } from "../films/filmsSlide";
import LocaleProvider from "antd/es/locale";
import locale from 'antd/locale/vi_VN';

const cx = classNames.bind(styles);

interface DataType {
  key: string;
  nameFilm: string;
  startTime: number;
  endTime: number;
  nSeat: number;
  value: Schedule;
}

const Schedules = () => {
  const [form] = useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate()

  const scheduleReducer = useAppSelector(scheduleState)
  const schedules = scheduleReducer.schedules;
  const total = scheduleReducer.total;
  const loading = scheduleReducer.loading;
  const filmReducer = useAppSelector(filmState)
  const films = filmReducer.films;

  const [filmId, setFilmId] = useState<string>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [datas, setDatas] = useState<DataType[]>([]);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [valueEdit, setValueEdit] = useState<Schedule | undefined>();

  const { RangePicker } = DatePicker;

  const openCreateModal = () => {
    setIsModalOpen(true);
    setValueEdit(undefined);
    setIsEdit(false);
  };

  useEffect(() => {
    loadAllFilms();
  }, []);
  
  useEffect(() => {
    if (filmId) {
      loadAllSchedules(100,0,filmId)
    }else {
      loadAllSchedules()
    }
  }, [filmId]);

  useEffect(() => {
    setDatas(schedules?.map(o => convertDataToTable(o)))
  }, [schedules])

  const loadAllSchedules = async (limit?: number, skip?: number, filmId?: string) => {
    try {
      const actionResult = await dispatch(
        requestGetSchedule({ limit: limit || 100, skip: skip || 0, filmId: filmId })
      );
      unwrapResult(actionResult);
    } catch (error) {
      notification.error({
        message: "không tải được danh sách lịch chiếu",
      });
    }
  };

  const loadAllFilms = async () => {
    try {
      const actionResult = await dispatch(
        requestLoadFilms({})
      );
      unwrapResult(actionResult);
    } catch (error) {
      notification.error({
        message: "không tải được danh sách phim",
      });
    }
  };


  // useEffect(() => {
  //   if (valueEdit) {
  //     const { name, description, videoUrl, thumbnail, category, director, actor, startTime, endTime, language, status, runningTime, schedule } = valueEdit;
  //     form.setFieldsValue({ name, description, startEndTime: [dayjs(startTime), dayjs(endTime)], videoUrl, thumbnail, category: category, director: director.join(","), actor: actor.join(","), language, status, runningTime, schedule });

  //     const convertedSchedule = schedule?.map((time, index) => ({
  //       time: Number(time),
  //       index
  //     }));
  //     setSche(convertedSchedule || []);
  //   }
  // }, [valueEdit]);

  const convertDataToTable = (value: Schedule) => {
    return {
      key: `${value?.id || Math.random()}`,
      nameFilm: `${value?.filmInfo?.name}`,
      nSeat: value?.nSeat,
      startTime: value?.startTime,
      endTime: value?.endTime,
      value: value,
    };
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setValueEdit(undefined);
    form.resetFields();
  };

  // const handleDelete = async (value: Film) => {
  //   try {
  //     const data = await dispatch(
  //       requestUpdateFilm({
  //         ...value,
  //         status: AppConfig.STATUS_DELETED,
  //       })
  //     );
  //     unwrapResult(data);
  //     // dispatch(
  //     //   requestLoadFilms({})
  //     // );
  //     if (statusFilm !== -2) {
  //       loadAllFilms(100, 0, statusFilm);
  //     } else {
  //       loadAllFilms();
  //     }
  //     notification.success({
  //       message: "Xoá thành công",
  //       duration: 1.5,
  //     });
  //   } catch (error) {
  //     notification.error({
  //       message: "cập nhật không được",
  //       duration: 1.5,
  //     });
  //   }
  // };

  // const handleOk = () => {
  //   form.validateFields().then(async (value) => {
  //     const { startEndTime, actor, director, category, thumbnail } = value

  //     const infoFilm = {
  //       ...value,
  //       startTime: startEndTime[0].valueOf(),
  //       endTime: startEndTime[1].valueOf(),
  //       actor: actor.split(","),
  //       director: director.split(","),
  //       category: Array.isArray(category) ? category : category.split(","),
  //       thumbnail: thumbnail || dataUpload
  //     }

  //     try {
  //       const data = await dispatch(
  //         requestUpdateFilm({
  //           id: valueEdit?.id,
  //           ...valueEdit,
  //           ...infoFilm
  //         })
  //       );
  //       unwrapResult(data);

  //       await apiUpdateStateFilm()
  //       if (statusFilm !== -2) {
  //         loadAllFilms(100, 0, statusFilm);
  //       } else {
  //         loadAllFilms();
  //       }

  //       notification.success({
  //         message: "Cập nhật thành công",
  //         duration: 1.5,
  //       });
  //     } catch (error) {
  //       notification.error({
  //         message: "cập nhật không được",
  //         duration: 1.5,
  //       });
  //     }
  //     handleCancel();
  //   }).catch(err => err)
  // };

  const columns: ColumnsType<DataType> = [
    {
      title: "STT",
      key: "stt",
      align: "center",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Tên Phim",
      dataIndex: "nameFilm",
      key: "nameFilm",
      align: "center",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Ngày chiếu",
      key: "startTime",
      dataIndex: "startTime",
      align: "center",
      render: (text: number) => (
        <>
          <Tag>
            {moment(text).format("DD/MM/YYYY")}
          </Tag>
        </>
      ),
      sorter: (a, b) => a.startTime - b.startTime,
    },
    {
      title: "Giờ bắt đầu",
      key: "startTime",
      dataIndex: "startTime",
      align: "center",
      render: (text: number) => (
        <>
          <Tag>
            {moment(text).format("hh:mm A")}
          </Tag>
        </>
      ),
    },
    {
      title: "Giờ kết thúc",
      key: "endTime",
      dataIndex: "endTime",
      align: "center",
      render: (text: number) => (
        <>
          <Tag>
            {moment(text).format("hh:mm A")}
          </Tag>
        </>
      ),
    },
    {
      title: "Số lượng vé",
      dataIndex: "nSeat",
      key: "nSeat",
      align: "center",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Hành động",
      key: "action",
      dataIndex: "value",
      align: "center",
      render: (text: Schedule, record) => (
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
              // handleDelete(text);
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
          <label style={{ marginLeft: "20px" }}>Chọn Phim:</label>
         
          <Select
            showSearch
            style={{ width: 250, marginLeft: "10px" }}
            placeholder={"Search to Select"}
            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
            optionFilterProp="children"
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
            }
            options={[ {value: 0, label: "--- All ---"},...films?.map((data) => ({
              value: data.id,
              label: data.name,
            }))]} 
            onChange={(value) => {
              setFilmId(value);
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
          pageSize: 30
        }}
      />

      <Modal
        title={`${isEdit ? "Chỉnh sửa" : "Tạo"}  Phim`}
        open={isModalOpen}
        // onOk={handleOk}
        onCancel={handleCancel}
        okText={`${isEdit ? "Cập nhật" : "Tạo"}`}
        cancelText="Hủy"
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
          <Form.Item name="filmId" label="Trạng thái">
            <Select
              showSearch
              style={{ width: "100%" }}
              placeholder={"Search to Select"}
              filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
              optionFilterProp="children"
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
              }
              options={films?.map((data) => ({
                value: data.id,
                label: data.name,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="startTime"
            label="Ngày chiều"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập trường này!",
              },
            ]}

          >
            <DatePicker 
              style={{ width: "100%" }}
              format="DD-MM-YYYY" 
            />
          </Form.Item>

          <Form.Item
            name="startEndTime"
            label="Giờ bắt đầu - Giờ kết thúc"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập trường này!",
              },
            ]}
          >
            {/* <LocaleProvider locale={locale}> */}
              <TimePicker.RangePicker
                format={'hh:mm'}
                showSecond={false}
                style={{ width: '100%' }}
              />
            {/* </LocaleProvider> */}
          </Form.Item>

          <Form.Item
            name="startEndTime"
            label="Giờ bắt đầu - Giờ kết thúc"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập trường này!",
              },
            ]}
          >
            <TimePicker  
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="nSeat"
            label="Số ghế (số vé)"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập trường này!",
              },
            ]}

          >
            <Input type="number"/>
          </Form.Item>
        </Form>
      </Modal>
    </div >
  );
};

export default Schedules;
