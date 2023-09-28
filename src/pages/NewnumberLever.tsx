import React, { useEffect, useState } from "react";
import './homedasboard.css'
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import {
    AppstoreOutlined,
    AreaChartOutlined,
    BuildOutlined,
    CameraOutlined,
    DesktopOutlined,
    LoginOutlined,
    MessageOutlined,
    SearchOutlined,
    SettingOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Avatar, Badge, Button, Card, Col, DatePicker, Dropdown, Form, Image, Input, Layout, Menu, Row, Select, Space, Table } from "antd";
import { Header } from "antd/es/layout/layout";
import Column from "antd/es/table/Column";
import './newnumberlaver.css'
import './numberlever.css'
import { AnyAction, ThunkDispatch, unwrapResult } from "@reduxjs/toolkit";
import { addNewNumber, fetchNumberData } from "../reduxtoolkit/NumberLeverActions";
import { RootState } from "../reduxtoolkit/store";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { fetchServiceData } from './../reduxtoolkit/serviceActions';
import { Option } from "antd/es/mentions";
import style from 'react-syntax-highlighter/dist/esm/styles/hljs/a11y-dark';
import { Modal } from "react-bootstrap";
const { Sider, Content } = Layout;
const { SubMenu } = Menu;


type Menu = {
    key: string;
    icon: React.ReactNode;
    label: React.ReactNode;
    path: string;
    children?: Menu[];
};

function getItem(
    label: React.ReactNode,
    key: string,
    icon: React.ReactNode,
    path: string,
    children?: Menu[]
): Menu {
    return {
        key,
        icon,
        label,
        path,
        children,
    } as Menu;
}

const items: Menu[] = [
    getItem("Dashboard", "1", <AppstoreOutlined />, "/dasboard"),
    getItem("Thiết bị", "2", <DesktopOutlined />, "/device"),
    getItem("Dịch vụ", "3", <MessageOutlined />, "/services"),
    getItem("Cấp số", "4", <BuildOutlined />, "/numbers"),
    getItem("Báo cáo", "5", <AreaChartOutlined />, "/reports"),
    getItem("Cài đặt hệ thống", "6", <SettingOutlined />, "/settings", [
        getItem("Quản lý vai trò", "6.1", <SettingOutlined />, "/roles"),
        getItem("Quản lý tài khoản", "6.2", <SettingOutlined />, "/accounts"),
        getItem("Quản lý người dùng", "6.3", <SettingOutlined />, "/users"),
    ]),
];


const data = [
    {
        id: 1,
        name: "máy tính",
        ipAddress: "192.168.1.1",
        isActive: true,
        isConnected: true,
        service: "Dịch vụ máy tính",
        ct: "Chi tiết",
        cn: "Cập nhật",
    },
    {
        id: 2,
        name: "máy tính",
        ipAddress: "192.168.1.1",
        isActive: true,
        isConnected: true,
        service: "Dịch vụ máy tính",
        ct: "Chi tiết",
    },

    // ...Thêm dữ liệu của các thiết bị khác
];

// const userData = JSON.parse(localStorage.getItem('userData') || '{}');

const handleLogout = () => {
    // Xử lý đăng xuất tại đây (ví dụ: xóa thông tin đăng nhập, đặt lại trạng thái, v.v.)
    // Sau đó, chuyển hướng về trang đăng nhập
    // Ví dụ: xóa thông tin người dùng trong localStorage
    localStorage.removeItem('userData');
    window.location.href = ('/')
};

const NewnumberLever: React.FC = () => {
    const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useDispatch();
    const [startDate, setStartDate] = useState(new Date().toISOString());
    const { dataService } = useSelector((state: RootState) => state.service);

    const [endDate, setEndDate] = useState(
        new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString()
    );

    const { data } = useSelector((state: RootState) => state.numberlever);
    const [maxId_cs, setMaxId_cs] = useState(0);
    const [isMaxIdLoaded, setIsMaxIdLoaded] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        dispatch(fetchNumberData());
    }, [dispatch]);

    useEffect(() => {
        if (data.length > 0) {
            const maxId_cs = data.reduce((maxId, item) => {
                const currentId = parseInt(item.id_cs, 10);
                return currentId > maxId ? currentId : maxId;
            }, 0);
            setTimeout(() => {
                setMaxId_cs(maxId_cs + 1);
                setIsMaxIdLoaded(true);
            }, 50); // Hiển thị giá trị sau 5 giây
        }
    }, [data]);

    const handleAddNewNumber = async (values: any) => {
        values.id_cs = maxId_cs;
        const actionResult = await dispatch(addNewNumber(values));
        const newServiceData = unwrapResult(actionResult);

        setIsModalVisible(true); // Mở popup khi thêm mới thành công
    };
    const navigate = useNavigate();
    const handleModalOk = () => {
        setIsModalVisible(false); // Đóng popup
        navigate("/numbers")
    };

    const handleModalCancel = () => {
        setIsModalVisible(false); // Đóng popup
    };




    const [userData, setUserData] = useState<any>({});
    useEffect(() => {
        const storedUserData = JSON.parse(localStorage.getItem("userData") || "{}");
        setUserData(storedUserData);
    }, []);

    useEffect(() => {
        dispatch(fetchServiceData());
    }, [dispatch]);
    const [isOpen, setIsOpen] = useState(false);
  
    const handleDropdownClick = () => {
      setIsOpen(!isOpen);
    };
    const menu = (
      <Menu style={{ maxHeight: '200px', width: '400px', overflowY: 'auto' }}>
        <Menu.Item className="tb-dr">Thông báo</Menu.Item>
        {data.map((item: any) => (
          <Menu.Item key={item.id_cs}>
            <span className="nd">Người dùng:   {item.name_kh}</span> <br />
            <span className="tgns">Thời gian nhận số: {format(new Date(item.data), "HH:mm 'ngày' dd/MM/yyyy")}</span>
          </Menu.Item>
        ))}
      </Menu>
    );
    return (
        <>
            <Layout style={{ minHeight: "100vh" }}>
                <Sider theme="light" className="sidebar">
                    <div style={{ width: 200 }}>
                        <img src="/img/Logoalta.png" className="mb-5" style={{ width: 100 }} />
                        <Menu defaultSelectedKeys={["1"]} defaultOpenKeys={["sub1"]} mode="vertical" theme="light" className="abc">
                            {items.map((item) =>
                                item.children ? (
                                    <SubMenu key={item.key} icon={item.icon} title={item.label}>
                                        {item.children.map((child) => (
                                            <Menu.Item key={child.key} className="menu-item"> {/* Add className="menu-item" */}
                                                <Link to={child.path}>{child.label}</Link>
                                            </Menu.Item>
                                        ))}
                                    </SubMenu>
                                ) : (
                                    <Menu.Item
                                        key={item.key} icon={item.icon} className="menu-item" style={item.key === '4' ? { backgroundColor: '#ff7506', color: 'white' } : {}}> {/* Add className="menu-item" */}
                                        <Link to={item.path}>{item.label}</Link>
                                    </Menu.Item>
                                )
                            )}

                        </Menu>
                    </div>
                    <Button className="btn-dangxuat" icon={<LoginOutlined style={{ color: "#ff7506" }} />}>
                        <span onClick={handleLogout} className="btn-text__logout">Đăng xuất</span>

                    </Button>
                </Sider>

                <Content className="bg">
                    <Header className="hdaccount">
                        <Row >
                            <Col span={10}>
                                <p className="hederpc mx-2">Cấp số &gt;
                                    <a href="/numbers" className="dstbadd ms-2"> Danh sách cấp số &gt;</a>
                                    <a href="/addNumberLever" className="dstbadd dstb ms-2"> Cấp số mới</a>
                                </p>

                            </Col>
                            <Col span={11}>
                                <div className="hederpaccount text-end">
                                <Dropdown
                                        overlay={menu}
                                        visible={isOpen}
                                        onVisibleChange={setIsOpen}
                                        overlayClassName="custom-dropdown"
                                        placement="topLeft"
                                    >
                                        <img src="/img/icon/notification.png" className="me-2 iconaccount" onClick={handleDropdownClick} />
                                    </Dropdown>
                                    <img src={userData.imageURL} alt="" className="imgaccount" />
                                </div>

                            </Col>
                            <Col span={3}>
                                <p className="xc">xin chào</p>
                                <p className="name">{userData.name}</p>
                            </Col>
                        </Row>
                    </Header>


                    <p className="dstbhome">Quản lý cấp số</p>


                    <Card className="card">
                        <div className=" justify-content-center  mt-5">
                            <p className="csm">Cấp số mới</p>
                            <Form onFinish={handleAddNewNumber}>
                                <p className="dvkh">Tên khách hàng</p>
                                <Form.Item name="name_kh" className="tkh_addNumber" >
                                    <Input style={{ height: 44 }} />
                                </Form.Item>
                                <p className="dvkh mt-3">Dịch vụ khách hàng</p>
                                <br />
                                <Form.Item name="name_dv">
                                    <select

                                        className="slectTop slv ms-4" >
                                        <option></option>
                                        {dataService.map((item) => (

                                            <option key={item.name} value={item.name}>
                                                {item.name}
                                            </option>

                                        ))}
                                    </select>
                                </Form.Item>

                                <Form.Item label="Ngày bắt đầu" name="data" hidden initialValue={startDate}>
                                    <Input type="datetime-local" disabled />
                                </Form.Item>
                                <Form.Item label="Ngày kết thúc" name="data_hsd" hidden initialValue={endDate}>
                                    <Input type="datetime-local" disabled />
                                </Form.Item>
                                <Form.Item label="status" initialValue="Đang chờ" name="status" hidden>
                                    <Input readOnly />
                                </Form.Item>
                                <Form.Item label="powersupply" initialValue="Hệ thống" hidden name="powersupply">
                                    <Input readOnly />
                                </Form.Item>
                                <Form.Item>
                                    <Row className="justify-content-center mt-3 row-nb ">
                                        <Col span={10} className="text-end col-hb">
                                            <button className="hb">
                                                Hủy bỏ
                                            </button>
                                        </Col>
                                        <Col span={12} className="d-flex ms-5">
                                            <button type="submit" className="btn-ttb">
                                                in số
                                            </button>
                                        </Col>
                                    </Row>
                                </Form.Item>
                            </Form>

                            <Modal show={isModalVisible} onHide={handleModalCancel}>

                                <Modal.Body>
                                    <p className="stt">Số thứ tự được cấp</p>

                                    <p className="maxid">{maxId_cs}</p>

                                    <div className="bg-modal">
                                        <p className="tgc">Thời gian cấp: {format(new Date(startDate), "HH:mm:ss 'ngày' dd/MM/yyyy")}</p>
                                        <p className="tgc" style={{ marginTop: "-30px" }}>Hạn sử dụng: {format(new Date(endDate), "HH:mm:ss 'ngày' dd/MM/yyyy")}</p>
                                    </div>
                                </Modal.Body>



                            </Modal>

                        </div>
                    </Card>
                    <Routes >
                        {items.map((item) => (
                            <Route key={item.key} path={item.path}>
                                {item.label}
                            </Route>
                        ))}
                    </Routes>
                </Content>
            </Layout>
        </>
    )
};

export default NewnumberLever;
