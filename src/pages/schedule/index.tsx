import { Button, Col, DatePicker, Form, Image, Input, Modal, Popconfirm, Row, Select, Space, Tag, Tooltip, Typography, notification } from "antd";
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

const Schedules = () => {
  const [form] = useForm();
  const dispatch = useAppDispatch();
  // const filmReducer = useAppSelector(filmState)
  // const films = filmReducer.films;
  // const loading = filmReducer.loading;
  const navigate = useNavigate()

  // const [dataUpload, setDataupload] = useState<string | null>();
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [datas, setDatas] = useState<DataType[]>([]);
  // const [isEdit, setIsEdit] = useState<boolean>(false);
  // const [valueEdit, setValueEdit] = useState<Film | undefined>();


  // const [sche, setSche] = useState<{
  //   index: number,
  //   time: number
  // }[]>([])

  // const { RangePicker } = DatePicker;

  // const openCreateModal = () => {
  //   setIsModalOpen(true);
  //   setValueEdit(undefined);
  //   setIsEdit(false);
  // };

  // useEffect(() => {
  //   setDatas(films?.map(o => convertDataToTable(o)))
  // }, [films])

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


  // useEffect(() => {
  //   handleUpdateStateFilm()
  // }, [films]);

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

  // const convertDataToTable = (value: Film) => {
  //   return {
  //     key: `${value?.id || Math.random()}`,
  //     name: value?.name,
  //     thumbnail: value?.thumbnail,
  //     director: value?.director,
  //     status: value?.status,
  //     startTime: value?.startTime,
  //     endTime: value?.endTime,
  //     value: value,
  //   };
  // };

  // useEffect(() => {
  //   if (statusFilm !== -2) {
  //     loadAllFilms(100, 0, statusFilm);
  //   } else {
  //     loadAllFilms();
  //   }
  // }, [statusFilm]);

  // const loadAllFilms = async (limit?: number, skip?: number, status?: number) => {
  //   try {
  //     const actionResult = await dispatch(
  //       requestLoadFilms({ limit: limit || 100, skip, status: status || undefined })
  //     );
  //     unwrapResult(actionResult);
  //   } catch (error) {
  //     notification.error({
  //       message: "không tải được danh sách phim",
  //     });
  //   }
  // };

  // const handleCancel = () => {
  //   setIsModalOpen(false);
  //   setValueEdit(undefined);
  //   setDataupload(null)
  //   form.resetFields();
  // };

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

  // const columns: ColumnsType<DataType> = [
  //   {
  //     title: "STT",
  //     key: "stt",
  //     align: "center",
  //     render: (text, record, index) => index + 1,
  //   },
  //   {
  //     title: "Ảnh",
  //     dataIndex: "thumbnail",
  //     key: "thumbnail",
  //     align: "center",
  //     render: (text) => (
  //       <Image
  //         src={text}
  //         width={150}
  //         preview={false}
  //         style={{
  //           width: "50%",
  //           overflow: "hidden",
  //         }}
  //       />
  //     ),
  //   },
  //   {
  //     title: "Tên",
  //     dataIndex: "name",
  //     key: "name",
  //     align: "center",
  //     render: (text) => <span>{text}</span>,
  //   },
  //   {
  //     title: "Đạo diễn",
  //     dataIndex: "director",
  //     key: "director",
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
  //         <Tag color={text === 1 ? "green" : text === 2 ? "yellow" : "red"}>
  //           {FilmsStatus.find((o) => o.value === text)?.label}
  //         </Tag>
  //       </>
  //     ),
  //   },
  //   {
  //     title: "Ngày chiếu",
  //     key: "startTime",
  //     dataIndex: "startTime",
  //     align: "center",
  //     render: (text: number) => (
  //       <>
  //         <Tag>
  //           {moment(text).format("Do MMM YYYY")}
  //         </Tag>
  //       </>
  //     ),
  //   },
  //   {
  //     title: "Ngày kết thúc",
  //     key: "endTime",
  //     dataIndex: "endTime",
  //     align: "center",
  //     render: (text: number) => (
  //       <>
  //         <Tag>
  //           {moment(text).format("Do MMM YYYY")}
  //         </Tag>
  //       </>
  //     ),
  //   },
  //   {
  //     title: "Hành động",
  //     key: "action",
  //     dataIndex: "value",
  //     align: "center",
  //     render: (text: Film, record) => (
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
  //         <Popconfirm
  //           placement="topRight"
  //           title="Bạn có chắc bạn muốn xóa mục này không?"
  //           onConfirm={() => {
  //             handleDelete(text);
  //           }}
  //           okText="Yes"
  //           cancelText="No"
  //         >
  //           <Tooltip placement="top" title="Xóa">
  //             <Button>
  //               <DeleteOutlined />
  //             </Button>
  //           </Tooltip>
  //         </Popconfirm>
  //       </Space>
  //     ),
  //   },
  // ];

  return (
    <div>
      
    </div >
  );
};

export default Schedules;
