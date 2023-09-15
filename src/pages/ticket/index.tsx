import { Button, Col, DatePicker, Form, Image, Input, Modal, Popconfirm, Row, Select, Space, Tag, TimePicker, Tooltip, Typography, notification } from "antd";
import { useForm } from "antd/es/form/Form";
import { useState, useEffect } from "react";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import Table, { ColumnsType } from "antd/es/table";
import classNames from "classnames/bind";
import styles from "./ticket.module.scss";
import moment from "moment";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { unwrapResult } from "@reduxjs/toolkit";
import { filmState, requestLoadFilms } from "../films/filmsSlide";
import { requestDeleteTicket, requestGetTicket, setTickets, ticketState } from "./ticketSlice";
import { Ticket } from "../../models/ticket";

const cx = classNames.bind(styles);

interface DataType {
  key: string;
  filmName: string;
  userName: string;
  showTime: string;
  seat: number[];
  value: Ticket;
  price: number;
}

const Schedules = () => {
  const [form] = useForm();
  const dispatch = useAppDispatch();

  const ticketReducer = useAppSelector(ticketState)
  const tickets = ticketReducer.tickets;
  const total = ticketReducer.total;
  const loading = ticketReducer.loading;

  const filmReducer = useAppSelector(filmState)
  const films = filmReducer.films;
  const [filmId, setFilmId] = useState<string>();
  const [filterDate, setFilterDate] = useState<any>();
  
  const [datas, setDatas] = useState<DataType[]>([]);
  // const [isEdit, setIsEdit] = useState<boolean>(false);
  // const [valueEdit, setValueEdit] = useState<Schedule | undefined>();

  // const openCreateModal = () => {
  //   setIsModalOpen(true);
  //   setValueEdit(undefined);
  //   setIsEdit(false);
  // };

  useEffect(() => {
    if(filterDate) {
     const dateFilter = tickets.filter((e: Ticket) => moment(e.scheduleInfo?.showDate).format("DD/MM/YYYY") === filterDate.format("DD/MM/YYYY"))
     dispatch(setTickets(dateFilter))
    }else{
      if (filmId) {
        loadAllTicket(undefined, undefined, filmId)
      } else {
        loadAllTicket()
      }
    }
  }, [filterDate]);
  
  useEffect(() => {
    loadAllFilms();
  }, []);

  useEffect(() => {
    setFilterDate(null)
    if (filmId) {
      loadAllTicket(undefined, undefined, filmId)
    } else {
      loadAllTicket()
    }
  }, [filmId]);

  useEffect(() => {
    setDatas(tickets?.map(o => convertDataToTable(o)))
  }, [tickets])

  const loadAllTicket = async (limit?: number, skip?: number, filmId?: string, scheduleId?: string) => {
    try {
      const actionResult = await dispatch(
        requestGetTicket({ limit, skip, filmId, scheduleId })
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
        message: "không tải được danh sách vé",
      });
    }
  };

  // useEffect(() => {
  //   if (valueEdit) {
  //     const { nSeat, filmId, showTime, startTime, endTime } = valueEdit;
  //     form.setFieldsValue({ nSeat, startEndTime: [dayjs(startTime), dayjs(endTime)], showTime: dayjs(showTime), filmId });
  //   }
  // }, [valueEdit]);

  const convertDataToTable = (value: Ticket) => {
    return {
      key: `${value?.id || Date.now()}`,
      filmName: `${value?.filmInfo?.name}`,
      userName: `${value?.userInfo?.name}`,
      seat: value?.seat,
      showTime: `${moment(value?.scheduleInfo?.showDate).format("DD/MM/YYYY")} | ${value.showTime}`,
      price: value?.price,
      value: value,
    };
  };

  // const handleCancel = () => {
  //   setIsModalOpen(false);
  //   setValueEdit(undefined);
  //   form.resetFields();
  // };

  const handleDelete = async (ticketId: any) => {
    try {
      const data = await dispatch(
        requestDeleteTicket(ticketId)
      );
      unwrapResult(data);
      if (filmId) {
        loadAllTicket(undefined, undefined, filmId);
      } else {
        loadAllTicket();
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

  // const handleOk = () => {
  //   form.validateFields().then(async (value) => {
  //     const { startEndTime, showTime, nSeat } = value
  //     const startTimeString: string = `${showTime.format("DD/MM/YYYY")} ${startEndTime[0].format("HH:mm")}`
  //     const endTimeString: string = `${showTime.format("DD/MM/YYYY")} ${startEndTime[1].format("HH:mm")}`
  //     const infoSchedule = {
  //       filmId: value.filmId,
  //       nSeat: nSeat,
  //       showTime: moment(startTimeString, 'DD/MM/YYYY HH:mm').valueOf(),
  //       startTime: moment(startTimeString, 'DD/MM/YYYY HH:mm').valueOf(),
  //       endTime: moment(endTimeString, 'DD/MM/YYYY HH:mm').valueOf()
  //     }
  //     try {
  //       const results = await dispatch(
  //         requestUpdateSchedule({
  //           id: valueEdit?.id,
  //           ...valueEdit,
  //           ...infoSchedule
  //         })
  //       );
  //       const res = unwrapResult(results);
  //       if(res.status === 0) {
  //         notification.success({
  //           message: isEdit ? "Cập nhật thành công" : "Tạo thành công",
  //           duration: 1.5,
  //         });
  //         handleCancel();
  //       }else if(res.status === -1) {
  //         notification.error({
  //           message: `${res.message}` + ", vui lòng chọn lịch chiếu khác",
  //           duration: 2.5,
  //         });
  //       }
       
  //       if (filmId) {
  //         loadAllSchedules(100, 0, filmId)
  //       } else {
  //         loadAllSchedules()
  //       }
  //     } catch (error) {
  //       notification.error({
  //         message: "Error",
  //         duration: 1.5,
  //       });
  //     }
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
      dataIndex: "filmName",
      key: "filmName",
      align: "center",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Khách hàng",
      dataIndex: "userName",
      key: "userName",
      align: "center",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Thời gian chiếu",
      key: "showTime",
      dataIndex: "showTime",
      align: "center",
      render: (text: number) => (
        <>
          <Tag>
            {text}
          </Tag>
        </>
      )
    },
    {
      title: "Ghế ngồi",
      dataIndex: "seat",
      key: "seat",
      align: "center",
      render: (text) => <>{text?.map((e: any) => <Tag key={e}>{e}</Tag>)}</>,
    },
    {
      title: "Thành tiền",
      key: "price",
      dataIndex: "price",
      align: "center",
      render: (text: number) => (
        <span>{text}</span>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      dataIndex: "value",
      align: "center",
      render: (text: Ticket, record) => (
        <Space size="middle">
          <Tooltip placement="top" title="Chỉnh sửa">
            <Button
              onClick={() => {
                // setIsModalOpen(true);
                // setValueEdit(text);
                // setIsEdit(true);
              }}
            >
              <EditOutlined />
            </Button>
          </Tooltip>
          <Popconfirm
            placement="top"
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
        {/* <Button type="primary" onClick={openCreateModal}>
          Thêm mới
        </Button> */}

        <Space size="small">
          <label style={{ marginLeft: "20px" }}>Chọn Phim:</label>
          <Select
            showSearch
            style={{ width: 250, marginLeft: "10px", textAlign: 'center' }}
            placeholder={"Search to Select"}
            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
            optionFilterProp="children"
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
            }
            options={[{ value: 0, label: "------ All ------" }, ...films?.map((data) => ({
              value: data.id,
              label: data.name,
            }))]}
            onChange={(value) => {
              setFilmId(value);
            }}
          />
        </Space>
        <Space size="small">
          <label style={{ marginLeft: "20px" }}>Chọn Ngày:</label>
          <DatePicker format="DD/MM/YYYY" value={filterDate} onChange={(e) => setFilterDate(e)}/>
        </Space>
      </Space>

      <Typography.Title level={3}>Danh sách vé: </Typography.Title>

      <Table
        className={cx("course__table")}
        columns={columns}
        dataSource={datas}
        loading={loading}
        pagination={{
          pageSize: 30
        }}
      />

      {/* <Modal
        title={`${isEdit ? "Chỉnh sửa" : "Tạo"}  Phim`}
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
            name="showTime"
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
            <TimePicker.RangePicker
              format={'HH:mm'}
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
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal> */}
    </div >
  );
};

export default Schedules;
