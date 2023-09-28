import React, { useEffect, useState } from "react";
import "./homedasboard.css";
import "./newroles.css";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { firestore } from '../Firebase/Firebase';
import { collection, getDocs, query, updateDoc, where } from '@firebase/firestore';
import { useParams } from 'react-router-dom';
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
import {
    Avatar,
    Badge,
    Button,
    Card,
    Checkbox,
    Col,
    DatePicker,
    Dropdown,
    Form,
    Image,
    Input,
    Layout,
    Menu,
    Row,
    Select,
    Space,
    Table,
} from "antd";
import { Header } from "antd/es/layout/layout";
import Column from "antd/es/table/Column";
import "./newnumberlaver.css";
import "./numberlever.css";
import { AnyAction, ThunkDispatch, unwrapResult } from "@reduxjs/toolkit";
import {
    addNewNumber,
    fetchNumberData,
} from "../reduxtoolkit/NumberLeverActions";
import { RootState } from "../reduxtoolkit/store";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { fetchServiceData } from "./../reduxtoolkit/serviceActions";
import { Option } from "antd/es/mentions";
import style from "react-syntax-highlighter/dist/esm/styles/hljs/a11y-dark";
import { Modal } from "react-bootstrap";
import TextArea from "antd/es/input/TextArea";
import { addNewroles, updaterolesData } from "../reduxtoolkit/RolesActions";
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

// const userData = JSON.parse(localStorage.getItem('userData') || '{}');

const handleLogout = () => {
    localStorage.removeItem("userData");
    window.location.href = "/";
};

const EditRoles: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { data } = useSelector((state: RootState) => state.numberlever);
    const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useDispatch();

    const navigate = useNavigate();
    const [userData, setUserData] = useState<any>({});
    useEffect(() => {
        const storedUserData = JSON.parse(localStorage.getItem("userData") || "{}");
        setUserData(storedUserData);
    }, []);
    useEffect(() => {
        dispatch(fetchNumberData());
    }, [dispatch]);
    const { name } = useParams<{ name: string }>();
    const dataService = useSelector((state: RootState) => state.roles.dataroles);

    // Kiểm tra xem dữ liệu đã được lấy thành công hay chưa
    const selectedData = dataService.find((item) => item.name === name);
    if (!selectedData) {
        return <div>Loading...</div>; // Hoặc thông báo lỗi nếu cần
    }
    
    const handleSaveChanges = async (values: any) => {
        const updatedData = {
            ...selectedData,
            ...values,
        };
        const serviceQuery = query(collection(firestore, 'roles'), where('name', '==', selectedData.name));
        const serviceDocs = await getDocs(serviceQuery);
        const serviceDocRef = serviceDocs.docs[0].ref;

        await updateDoc(serviceDocRef, updatedData);

        // Gửi action updateServiceData với dữ liệu cập nhật
        dispatch(updaterolesData(updatedData));
        window.location.href = "/roles"
    };

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
                        <img
                            src="/img/Logoalta.png"
                            className="mb-5"
                            style={{ width: 100 }}
                        />
                        <Menu
                            defaultSelectedKeys={["1"]}
                            defaultOpenKeys={["sub1"]}
                            mode="vertical"
                            theme="light"
                            className="abc"
                        >
                            {items.map((item) =>
                                item.children ? (
                                    <SubMenu key={item.key} icon={item.icon} title={item.label}>
                                        {item.children.map((child) => (
                                            <Menu.Item key={child.key} className="menu-item">
                                                {" "}
                                                {/* Add className="menu-item" */}
                                                <Link to={child.path}>{child.label}</Link>
                                            </Menu.Item>
                                        ))}
                                    </SubMenu>
                                ) : (
                                    <Menu.Item
                                        key={item.key}
                                        icon={item.icon}
                                        className="menu-item"
                                        style={
                                            item.key === "0"
                                                ? { backgroundColor: "#ff7506", color: "white" }
                                                : {}
                                        }
                                    >
                                        {" "}
                                        {/* Add className="menu-item" */}
                                        <Link to={item.path}>{item.label}</Link>
                                    </Menu.Item>
                                )
                            )}
                        </Menu>
                    </div>
                    <Button
                        className="btn-dangxuat"
                        icon={<LoginOutlined style={{ color: "#ff7506" }} />}
                    >
                        <span onClick={handleLogout} className="btn-text__logout">
                            Đăng xuất
                        </span>
                    </Button>
                </Sider>

                <Content className="bg">
                    <Header className="hdaccount">
                        <Row>
                            <Col span={10}>
                                <p className="hederpc mx-2">
                                    Cài đặc hệ thống&gt;
                                    <a href="/roles" className="dstbadd ms-2">
                                        {" "}
                                        Quản lý vai trò &gt;
                                    </a>
                                    <a href="/" className="dstbadd dstb ms-2">
                                        {" "}
                                        Cập nhật vai trò
                                    </a>
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

                    <p className="dstbhome">Danh sách vai trò</p>
                    <Form onFinish={handleSaveChanges} initialValues={selectedData}>
                        <Card className="card">
                            <p className="h3 d-flex ttvt"> Thông tin vai trò</p>
                            <Row>
                                <Col span={10} >

                                    <label className="d-flex"> Tên vai trò</label>
                                    <Form.Item name="name" rules={[{ required: true }]}>
                                        <Input />
                                    </Form.Item>
                                    <label className="d-flex"> Mô tả</label>
                                    <Form.Item name="describe" rules={[{ required: true }]}>
                                        <TextArea rows={3} />
                                    </Form.Item>

                                </Col>
                                <Col span={10} className="ms-5 pqcn-hd">
                                    <p className="d-flex">Phân quyền chức năng  <i className="kytu"> &#42;</i></p>
                                    <div className="br-addrole">
                                        <label className="d-flex ms-3"> Nhóm chức năng A</label>
                                        <Form.Item name="function_a">
                                            <Checkbox.Group className=" ms-3"
                                                style={{ display: "flex", flexDirection: "column" }}
                                            >
                                                <Checkbox value="Chức năng a">Chức năng a</Checkbox>
                                                <Checkbox value="Chức năng b">Chức năng b</Checkbox>
                                                <Checkbox value="Chức năng c">Chức năng c</Checkbox>
                                                <Checkbox value="Chức năng d">Chức năng d</Checkbox>
                                            </Checkbox.Group>
                                        </Form.Item>
                                        <label className="d-flex ms-3"> Nhóm chức năng B</label>
                                        <Form.Item name="function_b">
                                            <Checkbox.Group className=" ms-3"
                                                style={{ display: "flex", flexDirection: "column" }}
                                            >

                                                <Checkbox name="a" value="Chức năng 1">
                                                    Chức năng a
                                                </Checkbox>
                                                <Checkbox name="a" value="Chức năng 2">
                                                    Chức năng b
                                                </Checkbox>
                                                <Checkbox name="a" value="Chức năng 3">
                                                    Chức năng c
                                                </Checkbox>
                                                <Checkbox name="a" value="Chức năng 4">
                                                    Chức năng d
                                                </Checkbox>
                                            </Checkbox.Group>

                                        </Form.Item>
                                    </div>
                                </Col>

                            </Row>

                        </Card>
                        <Row className="justify-content-center mt-3">
                            <Col span={10} className="text-end col-hb">
                                <button className="btn-adddvice" onClick={() => navigate(-1)}>
                                    Hủy bỏ
                                </button>
                            </Col>
                            <Col span={12} className="d-flex ms-5">
                                <button type="submit" className="btn-ttb">
                                    Cập nhật
                                </button>
                            </Col>
                        </Row>
                    </Form>
                    <Routes>
                        {items.map((item) => (
                            <Route key={item.key} path={item.path}>
                                {item.label}
                            </Route>
                        ))}
                    </Routes>
                </Content>
            </Layout>
        </>
    );
};

export default EditRoles;
