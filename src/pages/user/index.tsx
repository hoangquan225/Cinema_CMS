import { Button, Col, DatePicker, Form, Image, Input, Modal, Popconfirm, Row, Select, Space, Tag, Tooltip, Typography, notification } from "antd";
import { useForm } from "antd/es/form/Form";
import UploadImg from "../../components/UploadImg";
import { useState, useEffect } from "react";
import { Film } from "../../models/film";
import { DeleteOutlined, EditOutlined, EyeOutlined, LockOutlined, SettingOutlined, UnlockOutlined } from "@ant-design/icons";
import Table, { ColumnsType } from "antd/es/table";
import classNames from "classnames/bind";
import styles from "./users.module.scss";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { unwrapResult } from "@reduxjs/toolkit";
import AppConfig from "../../common/config";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { UserInfo } from "../../models/user";
import { requestGetAllUser, requestUpdateUser, userState } from "./usersSlide";

const cx = classNames.bind(styles);

interface DataType {
  key: string;
  name: string;
  avatar: string | undefined;
  email: string;
  status: number | undefined;
  phoneNumber: string | undefined;
  address: string | undefined;
  gender: number | undefined;
  value: UserInfo;
}

export const userStatus = [
  {
    value: 0,
    label: "Active",
  },
  {
    value: 1,
    label: "InActive",
  },
  {
    value: -1,
    label: "DELETED",
  },
];

const Films = () => {
  const [form] = useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate()

  const userReducer = useAppSelector(userState)
  const users = userReducer.users;
  const loading = userReducer.loading;

  const [dataUpload, setDataupload] = useState<string | null>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [datas, setDatas] = useState<DataType[]>([]);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [valueEdit, setValueEdit] = useState<UserInfo | undefined>();

  const openCreateModal = () => {
    setIsModalOpen(true);
    setValueEdit(undefined);
    setIsEdit(false);
  };

  useEffect(() => {
    loadAllUsers()
  }, []);

  useEffect(() => {
    setDatas(users?.map(o => convertDataToTable(o)))
  }, [users])

  useEffect(() => {
    if (valueEdit) {
      const { name, avatar, email, status, phoneNumber, address, gender } = valueEdit;
      form.setFieldsValue({ name, avatar, email, status, phoneNumber, address, gender });
    }
  }, [valueEdit]);

  // const handleUpdateStateFilm = async () => {
  //   try {
  //     await apiUpdateStateFilm()
  //   } catch (error) {
  //     notification.error({
  //       message: "cập nhật không thành công",
  //       duration: 1.5,
  //     });
  //   }
  // }

  const convertDataToTable = (value: UserInfo) => {
    return {
      key: `${value?.id || Math.random()}`,
      name: value?.name,
      avatar: value?.avatar || "https://play-lh.googleusercontent.com/9N7f8PWb1zlDqOR4mepkNFkRt5SlrjFoLsg5jYtVhvq9LeQneLKyHg9eEx4BSgyl7F4",
      email: value?.email,
      status: value?.status,
      phoneNumber: value?.phoneNumber,
      address: value?.address,
      gender: value?.gender,
      value: value,
    };
  };

  const loadAllUsers = async () => {
    try {
      const actionResult = await dispatch(
        requestGetAllUser()
      );
      unwrapResult(actionResult);
    } catch (error) {
      notification.error({
        message: "không tải được danh sách User",
      });
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setValueEdit(undefined);
    setDataupload(null)
    form.resetFields();
  };

  const handleUpdateStatusUser = async (userId: any, status: number) => {
    try {
      const data = await dispatch(
        requestUpdateUser({
          userId,
          status
        })
      );
      unwrapResult(data);
      loadAllUsers();
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
    // form.validateFields().then(async (value) => {
    //   const {  } = value

    //   const userInfo = {
    //     ...value,
    //   }

    //   try {
    //     const data = await dispatch(
    //       requestUpdateUser({
    //         id: valueEdit?.id,
    //         ...valueEdit,
    //         ...userInfo
    //       })
    //     );
    //     unwrapResult(data);
        
    //     loadAllUsers();

    //     notification.success({
    //       message: "Cập nhật thành công",
    //       duration: 1.5,
    //     });
    //   } catch (error) {
    //     notification.error({
    //       message: "cập nhật không được",
    //       duration: 1.5,
    //     });
    //   }
    //   handleCancel();
    // }).catch(err => err)
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
      dataIndex: "avatar",
      key: "avatar",
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
      title: "Gmail",
      dataIndex: "email",
      key: "email",
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
          <Tag color={text === 0 ? "green" : "red"}>
            {userStatus.find((o) => o.value === text)?.label}
          </Tag>
        </>
      ),
    },
    {
      title: "Địa chỉ",
      key: "address",
      dataIndex: "address",
      align: "center",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Giới tính",
      key: "gender",
      dataIndex: "gender",
      align: "center",
      render: (text: number) => (
        <>
          {text === 1 ? <>Nam</> : text === 2? <>Nữ</> : <>Khác</>}
        </>
      ),
    },
    {
      title: "Số điện thoại",
      key: "phoneNumber",
      dataIndex: "phoneNumber",
      align: "center",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Hành động",
      key: "action",
      dataIndex: "value",
      align: "center",
      render: (text: UserInfo, record) => (
        <Space size="middle" direction="vertical">
          <Space size="middle">
            <Tooltip placement="top" title="Chỉnh sửa">
              <Button
                onClick={() => {
                  setIsModalOpen(true);
                  setValueEdit(text);
                  setIsEdit(true);
                }}
              >
                <EyeOutlined />
              </Button>
            </Tooltip>
            <Popconfirm
              placement="topRight"
              title="Bạn có chắc bạn muốn xóa mục này không?"
              onConfirm={() => {
                // handleDelete(text);
                handleUpdateStatusUser(text.id, -1);
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

          <Space size="middle">
            <Popconfirm
              placement="topRight"
              title="Bạn có chắc bạn muốn MỞ KHÓA tài khoản này không?"
              onConfirm={() => {
                handleUpdateStatusUser(text.id, 0);
              }}
              okText="Yes"
              cancelText="No"
            >
              <Tooltip placement="top" title="Mở">
                <Button>
                  <UnlockOutlined />
                </Button>
              </Tooltip>
            </Popconfirm>
          
            <Popconfirm
              placement="topRight"
              title="Bạn có chắc bạn muốn KHÓA tài khoản này?"
              onConfirm={() => {
                handleUpdateStatusUser(text.id, 1);
              }}
              okText="Yes"
              cancelText="No"
            >
              <Tooltip placement="top" title="Khóa">
                <Button>
                  <LockOutlined />
                </Button>
              </Tooltip>
            </Popconfirm>
          </Space>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Space size="large">
        <Space size="small">
          <label style={{ marginLeft: "20px" }}>Chọn trạng thái:</label>
          <Select
            placeholder={"Bộ lọc"}
            style={{ width: 150, marginLeft: "10px" }}
            defaultValue={-2}
            options={[{
              value: -2,
              label: "Tất Cả",
            }, ...userStatus]}
            onChange={(value) => {
              // setUserStatus(value);
            }}
          />
        </Space>
      </Space>

      <Typography.Title level={3}>Danh Người dùng: </Typography.Title>

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
        title={`${isEdit ? "Cập nhật tráng thái" : "Tạo"}  User`}
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
                <Image
                  width={200}
                  src={`${valueEdit?.avatar}` || `${dataUpload}`}
                  fallback="https://play-lh.googleusercontent.com/9N7f8PWb1zlDqOR4mepkNFkRt5SlrjFoLsg5jYtVhvq9LeQneLKyHg9eEx4BSgyl7F4"
                />
              </Form.Item>

              <Form.Item
                name="name"
                label="Tên"
              >
                <Input disabled/>
              </Form.Item>
              <Form.Item
                name="email"
                label="email"
              >
                <Input disabled/>
              </Form.Item>

              <Form.Item name="status" label="Trạng thái">
                <Select options={userStatus} disabled/>
              </Form.Item>
            </Col>

            <Col xl={12} md={12} xs={24}>
              <Form.Item
                name="phoneNumber"
                label="phoneNumber"
              >
                <Input disabled/>
              </Form.Item>
              <Form.Item
                name="address"
                label="address"
              >
                <Input disabled/>
              </Form.Item>

              <Form.Item
                name="gender"
                label="Giới tính"
              >
                <Select options={[
                   { value: 1, label: 'Nam'},
                   { value: 2, label: 'Nữ' },
                   { value: 3, label: 'Khác'},
                  ]} 
                  disabled
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
