import { Button, Checkbox, Col, DatePicker, Form, Image, Input, Modal, Popconfirm, Row, Select, Space, Tag, TimePicker, Tooltip, Typography, notification } from "antd";
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
import { useNavigate } from "react-router-dom";
import { Schedule } from "../../models/schedule";
import { requestDeleteSchedule, requestGetSchedule, requestUpdateSchedule, scheduleState } from "./schedulesSlide";
import { filmState, requestLoadFilms } from "../films/filmsSlide";

const cx = classNames.bind(styles);

interface DataType {
  key: string;
  nameFilm: string;
  showDate: number;
  showTime: [string];
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
      loadAllSchedules(100, 0, filmId)
    } else {
      loadAllSchedules()
    }
  }, [filmId]);

  useEffect(() => {
    setDatas(schedules?.map(o => convertDataToTable(o)))
  }, [schedules])

  const loadAllSchedules = async (limit?: number, skip?: number, filmId?: string) => {
    try {
      const actionResult = await dispatch(
        requestGetSchedule({ limit: limit || 100, skip: skip || 0, filmId: filmId, isAll: true })
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
        message: "không tải được danh sách lịch",
      });
    }
  };


  useEffect(() => {
    if (valueEdit) {
      const { nSeat, filmId, showDate, startTime, endTime, showTime } = valueEdit;
      form.setFieldsValue({ nSeat, startEndTime: [dayjs(startTime), dayjs(endTime)], showDate: dayjs(showDate),showTime, filmId });
    }
  }, [valueEdit]);

  const convertDataToTable = (value: Schedule) => {
    return {
      key: `${value?.id || Math.random()}`,
      nameFilm: `${value?.filmInfo?.name}`,
      nSeat: value?.nSeat,
      showDate: value?.showDate,
      showTime: value?.showTime,
      value: value,
    };
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setValueEdit(undefined);
    form.resetFields();
  };

  const handleDelete = async (scheduleId: any) => {
    try {
      const data = await dispatch(
        requestDeleteSchedule(scheduleId)
      );
      unwrapResult(data);

      if (filmId) {
        loadAllSchedules(100, 0, filmId)
      } else {
        loadAllSchedules()
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
      const { startEndTime, showTime, nSeat, showDate } = value
      // const startTimeString: string = `${showTime.format("DD/MM/YYYY")} ${startEndTime[0].format("HH:mm")}`
      // const endTimeString: string = `${showTime.format("DD/MM/YYYY")} ${startEndTime[1].format("HH:mm")}`
      // const infoSchedule = {
      //   filmId: value.filmId,
      //   nSeat: nSeat,
      //   showTime: moment(startTimeString, 'DD/MM/YYYY HH:mm').valueOf(),
      //   startTime: moment(startTimeString, 'DD/MM/YYYY HH:mm').valueOf(),
      //   endTime: moment(endTimeString, 'DD/MM/YYYY HH:mm').valueOf()
      // }

      const infoSchedule = {
        filmId: value.filmId,
        nSeat: nSeat,
        showTime: showTime,
        showDate: showDate.valueOf(),
      }

      try {
        const results = await dispatch(
          requestUpdateSchedule({
            id: valueEdit?.id,
            ...valueEdit,
            ...infoSchedule
          })
        );
        const res = unwrapResult(results);
        if(res.status === 0) {
          notification.success({
            message: isEdit ? "Cập nhật thành công" : "Tạo thành công",
            duration: 1.5,
          });
          handleCancel();
        }else if(res.status === -1) {
          notification.error({
            message: `${res.message}` + ", vui lòng chọn lịch chiếu khác",
            duration: 2.5,
          });
        }
       
        if (filmId) {
          loadAllSchedules(100, 0, filmId)
        } else {
          loadAllSchedules()
        }
      } catch (error) {
        notification.error({
          message: "Error",
          duration: 1.5,
        });
      }
    }).catch(err => err)
  };

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
      key: "showDate",
      dataIndex: "showDate",
      align: "center",
      render: (text: number) => (
        <>
          <Tag>
            {moment(text).format("DD/MM/YYYY")}
          </Tag>
        </>
      ),
      sorter: (a, b) => a.showDate - b.showDate,
    },
    {
      title: "Giờ chiếu",
      key: "showTime",
      dataIndex: "showTime",
      align: "center",
      render: (text: any) => <>{text?.map((e: any) => <Tag key={e}>{e}</Tag>)}</>,
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
              handleDelete(text.id);
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
            options={[{ value: 0, label: "--- All ---" }, ...films?.map((data) => ({
              value: data.id,
              label: data.name,
            }))]}
            onChange={(value) => {
              setFilmId(value);
            }}
          />
        </Space>
      </Space>

      <Typography.Title level={3}>Danh sách lịch chiếu: </Typography.Title>

      <Table
        className={cx("course__table")}
        columns={columns}
        dataSource={datas}
        loading={loading}
        pagination={{
          pageSize: 30
        }}
        // onRow={(record, rowIndex) => {
        //   return {
        //     // onClick: (event) => {}, // click row
        //     onMouseEnter: (event) => {}, // mouse enter row
        //   };
        // }}
      />

      <Modal
        title={`${isEdit ? "Chỉnh sửa" : "Tạo"}  Suất chiếu`}
        open={isModalOpen}
        onOk={handleOk}
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
          <Form.Item
            name="filmId"
            label="Phim"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập trường này!",
              },
            ]}>
            <Select
              showSearch
              style={{ width: "100%" }}
              placeholder={"Search to Select Film"}
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
            name="showDate"
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

          {/* <Form.Item
            name="startEndTime"
            label="Giờ bắt đầu - Giờ kết thúc"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập trường này!",
              },
            ]}
          >
            <TimePicker.RangePicker
              format={'HH:mm'}
              style={{ width: '100%' }}
            />
          </Form.Item> */}
          <Form.Item
            name="showTime"
            label="Giờ chiếu"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập trường này!",
              },
            ]}
          >
            <Checkbox.Group 
              options={[
                {
                  label: '09:00',
                  value: '09:00',
                },
                {
                  label: '12:00',
                  value: '12:00',
                },
                {
                  label: '15:00',
                  value: '15:00',
                },
                {
                  label: '18:00',
                  value: '18:00',
                },
              ]}
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
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div >
  );
};

export default Schedules;
