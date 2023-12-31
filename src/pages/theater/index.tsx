import { Button, Col, DatePicker, Form, Image, Input, Modal, Popconfirm, Row, Select, Space, Tag, Tooltip, Typography, notification } from "antd";
import { useForm } from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";
import UploadImg from "../../components/UploadImg";
import { useState, useEffect } from "react";
import { Film } from "../../models/film";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import Table, { ColumnsType } from "antd/es/table";
import classNames from "classnames/bind";
import styles from "./theater.module.scss";
import moment from "moment";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { unwrapResult } from "@reduxjs/toolkit";
import AppConfig from "../../common/config";
import dayjs from "dayjs";
import { apiUpdateStateFilm } from "../../api/filmApi";
import { useNavigate } from "react-router-dom";
import { requestDeleteTheater, requestLoadTheaters, requestUpdateTheater, theaterState } from "./theaterSlide";
import { Theater } from "../../models/theater";

const cx = classNames.bind(styles);

interface DataType {
  key: string;
  name: string;
  nRoom: number;
  type: number;
  provinceCode: string;
  location: string;
  value: Theater;
}

const Films = () => {
  const [form] = useForm();
  const dispatch = useAppDispatch();
  const theaterReducer = useAppSelector(theaterState)
  const theaters = theaterReducer.theaters;
  const loading = theaterReducer.loading;
  const navigate = useNavigate()

  const [provinceCode, setProvinceCode] = useState<string>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [datas, setDatas] = useState<DataType[]>([]);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [valueEdit, setValueEdit] = useState<Theater | undefined>();

  const openCreateModal = () => {
    setIsModalOpen(true);
    setValueEdit(undefined);
    setIsEdit(false);
  };

  useEffect(() => {
    if(provinceCode && provinceCode.length) {
      loadTheaters(provinceCode);
    } else {
      loadTheaters();
    }
  }, [provinceCode]);

  const loadTheaters = async (provinceCode?: string) => {
    try {
      const actionResult = await dispatch(
        requestLoadTheaters(provinceCode ? {provinceCode} :{})
      );
      unwrapResult(actionResult);
    } catch (error) {
      notification.error({
        message: "không tải được danh sách rạp chiếu",
      });
    }
  };

  useEffect(() => {
    setDatas(theaters?.map(o => convertDataToTable(o)))
  }, [theaters])

  useEffect(() => {
    if (valueEdit) {
      const { name, nRoom, type, provinceCode, location } = valueEdit;
      form.setFieldsValue({ name, nRoom, type, provinceCode, location });
    }
  }, [valueEdit]);

  const convertDataToTable = (value: Theater) => {
    return {
      key: `${value?.id || Date.now()}`,
      name: value?.name,
      nRoom: value?.nRoom,
      type: value?.type, 
      provinceCode: value?.provinceCode,
      location: value?.location,
      value: value,
    };
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setValueEdit(undefined);
    form.resetFields();
  };

  const handleDelete = async (id: string) => {
    try {
      const data = await dispatch(
        requestDeleteTheater(id)
      );
      unwrapResult(data);
      if(provinceCode && provinceCode.length) {
        loadTheaters(provinceCode);
      } else {
        loadTheaters();
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
      try {
        const data = await dispatch(
          requestUpdateTheater({
            id: valueEdit?.id,
            ...valueEdit,
            ...value
          })
        );
        unwrapResult(data);
        if(provinceCode && provinceCode.length) {
          loadTheaters(provinceCode);
        } else {
          loadTheaters();
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
      title: "Tên",
      dataIndex: "name",
      key: "name",
      align: "center",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Số phòng",
      dataIndex: "nRoom",
      key: "nRoom",
      align: "center",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Type",
      key: "type",
      dataIndex: "type",
      align: "center",
      render: (text: number) => <Tag>{text}</Tag>,
    },
    {
      title: "Tỉnh/Thành Phố",
      key: "provinceCode",
      dataIndex: "provinceCode",
      align: "center",
      render: (text) => <span>{AppConfig.ProvinceCode.map(e => e.code === text && <>{e.name}</>) }</span>,
    },
    {
      title: "Đia chỉ",
      key: "location",
      dataIndex: "location",
      align: "center",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Hành động",
      key: "action",
      dataIndex: "value",
      align: "center",
      render: (text: Theater, record) => (
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
              handleDelete(text.id || '');
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
          <label style={{ marginLeft: "20px" }}>Chọn Tỉnh thành:</label>
          <Select
            showSearch
            style={{ width: 250, marginLeft: "10px" }}
            placeholder={"Search to Select"}
            options={[
              { value: "", label: "--- All ---" },
              { value: "HNI", label: "Hà Nội" },
              { value: "HY", label: "Hưng Yên" },
              { value: "HP", label: "Hải Phòng" },
              { value: "HCM", label: "Hồ Chí Minh" },
              ]}
            onChange={(value) => {
              setProvinceCode(value);
            }}
          />
        </Space>
      </Space>

      <Typography.Title level={3}>Danh sách Rạp chiếu: </Typography.Title>

      <Table
        className={cx("theater__table")}
        columns={columns}
        dataSource={datas}
        loading={loading}
        pagination={{
          pageSize: 10
        }}
      />

      <Modal
        title={`${isEdit ? "Chỉnh sửa" : "Tạo"}  rạp chiếu`}
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
          name="formTheater"
          form={form}
        >
          <Form.Item
            name="name"
            label="Tên rạp chiếu"
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
            name="nRoom"
            label="Số phòng"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập trường này!",
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="type"
            label="Type"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập trường này!",
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="provinceCode"
            label="Mã tỉnh thành"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập trường này!",
              },
            ]}
          >
            <Select
              style={{ width: "100%" }}
              placeholder={"Search to Select Province"}
              options={[
                { value: "HNI", label: "Hà Nội" },
                { value: "HY", label: "Hưng Yên" },
                { value: "HP", label: "Hải Phòng" },
                { value: "HCM", label: "Hồ Chí Minh" },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="location"
            label="Địa chỉ"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập trường này!",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div >
  );
};

export default Films;
