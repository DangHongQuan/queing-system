import React, { useEffect, useState } from "react";
import { Card, Dropdown, Form } from 'antd';
import './dasbordefault.css'
import './adddevice.css'
import { Link, Route, Routes } from "react-router-dom";
import {
    AppstoreOutlined,
    AreaChartOutlined,
    BuildOutlined,
    DesktopOutlined,
    LoginOutlined,
    MessageOutlined,

    SettingOutlined,
} from "@ant-design/icons";
import { RootState } from "../reduxtoolkit/store";
import { fetchServiceData } from "../reduxtoolkit/serviceActions";
import { Button, Col, Input, Layout, Menu, Row, Select, Space } from "antd";
import { Header } from "antd/es/layout/layout";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { useDispatch, useSelector } from "react-redux";
import { addNewDevices } from "../reduxtoolkit/DevicesActions";
import { unwrapResult } from "@reduxjs/toolkit";
import { fetchNumberData } from "../reduxtoolkit/NumberLeverActions";
import { format } from "date-fns";

const userData = JSON.parse(localStorage.getItem('userData') || '{}');
const { Option } = Select;

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



const AddDevice: React.FC = () => {
    const [ipAddress, setIPAddress] = useState('');
    const [startDate, setStartDate] = useState(new Date().toISOString());

    useEffect(() => {
        const fetchIPAddress = async () => {

            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            setIPAddress(data.ip);

        };

        fetchIPAddress();
    }, []);

    const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useDispatch();
    const { dataService } = useSelector((state: RootState) => state.service);


    useEffect(() => {
        dispatch(fetchServiceData());

    }, [dispatch]);



    const handleLogout = () => {
        // Xử lý đăng xuất tại đây (ví dụ: xóa thông tin đăng nhập, đặt lại trạng thái, v.v.)
        // Sau đó, chuyển hướng về trang đăng nhập
        // Ví dụ: xóa thông tin người dùng trong localStorage
        localStorage.removeItem('userData');
        window.location.href = ('/')
    };

    const handleAddNewService = async (values: any) => {

        const actionResult = await dispatch(addNewDevices(values));
        const newServiceData = unwrapResult(actionResult);

        alert('Thêm mới thành công:');
    };

    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchNumberData());
    }, [dispatch]);

    const { data } = useSelector((state: RootState) => state.numberlever);

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
                                    <Menu.Item key={item.key} icon={item.icon} className="menu-item" style={item.key === '2' ? { backgroundColor: '#ff7506', color: 'white' } : {}}> {/* Add className="menu-item" */}
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
                <Content>
                    <Header className="hdaccount">
                        <Row >
                            <Col span={10}>
                                <p className="hederpc mx-2">Thiết bị &gt;
                                    <a href="/device" className="dstbadd ms-2"> Danh sách thiết bị &gt;</a>
                                    <a href="/addDevice" className="dstbadd dstb ms-2"> Thêm thiết bị</a>
                                </p>
                            </Col>
                            <Col span={11}   >
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
                            <Col span={3} >
                                <a href="/persoalaccount">
                                    <p className="xc">xin chào</p>
                                    <p className="name">{userData.name}</p>
                                </a>

                            </Col>
                        </Row>
                    </Header>
                    <p className="qltb">Quảng lý thiết bị</p>

                    <Form onFinish={handleAddNewService} >
                        <Card className="card">
                            <p className="tttb">Thông tin thiết bị</p>
                            <Row>
                                <Col span={11} className="mx-2">
                                    <h1 className="lbadd">Mã thiết bị: <i className="kytu"> &#42;</i></h1>
                                    <Form.Item name="id_dc" >
                                        <Input className="inputadd" />
                                    </Form.Item>
                                    {/* <Input placeholder="Nhập mã thiết bị" className="inputadd" /> */}
                                </Col>
                                <Col span={11} className="ms-4">
                                    <h1 className="lbadd">Loại thiết bị: <i className="kytu"> &#42;</i></h1>
                                    <Form.Item name="type"  >
                                        <Select placeholder="Chọn loại thiêt bị"  >
                                            <option value="DC_03">DC_03</option>

                                        </Select>
                                    </Form.Item>

                                </Col>
                            </Row>
                            <Row>
                                <Col span={11} className="mx-2">
                                    <h1 className="lbadd">Tên thiết bị: <i className="kytu"> &#42;</i></h1>
                                    {/* <Input placeholder="Nhập mã thiết bị" className="inputadd" /> */}
                                    <Form.Item name="name">
                                        <Input className="inputadd" />
                                    </Form.Item>
                                </Col>
                                <Col span={11} className="ms-4">
                                    <h1 className="lbadd">Tên đăng nhập: <i className="kytu"> &#42;</i></h1>
                                    <Form.Item name="username" >
                                        <Input className="inputadd" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={11} className="mx-2">
                                    <h1 className="lbadd">Địa chỉ ip: <i className="kytu"> &#42;</i></h1>

                                    <Input className="inputadd" value={ipAddress} readOnly />


                                </Col>
                                <Col span={11} className="ms-4">
                                    <h1 className="lbadd">Mật khẩu: <i className="kytu"> &#42;</i></h1>
                                    <Form.Item name="password"  >
                                        <Input className="inputadd" />
                                    </Form.Item>
                                    <Form.Item name="status_hd" hidden initialValue="Hoạt động">
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name="status_kn" hidden initialValue="Kết nối">
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={23} className="mx-2">
                                    <h1 className="lbadd">Dịch vụ sử dụng: <i className="kytu"> &#42;</i></h1>

                                    <div className="site-space-compact-wrapper">
                                        <Space.Compact block>
                                            <Form.Item name="servie_dc" style={{ width: '99%' }}>

                                                <Select
                                                    allowClear
                                                    mode="multiple"
                                                    style={{ width: '99%' }}
                                                >
                                                    {dataService.map(item => (
                                                        <Option key={item.name} value={item.name + " "}>
                                                            {item.name}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>

                                        </Space.Compact>

                                    </div>
                                </Col>

                            </Row>


                        </Card>
                        <Row className="justify-content-center mt-3" style={{ marginLeft: "30px" }}>
                            <Col span={10} className="text-end col-hb">
                                <button className="btn-adddvice">
                                    Hủy bỏ
                                </button>
                            </Col>
                            <Col span={12} className="d-flex ms-5">
                                <button className="btn-ttb">
                                    Thêm thiết bị
                                </button>
                            </Col>
                        </Row>

                    </Form>

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

export default AddDevice;