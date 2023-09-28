import React, { useEffect, useState } from "react";
// import './homedasboard.css'
import { Badge, Card, Checkbox, DatePicker, Dropdown, Form, Pagination, Table, Tag } from 'antd';
import './dasbordefault.css'
import './addservice.css'
import { Link, Route, Routes, useNavigate, useParams } from "react-router-dom";
import {
    AppstoreOutlined,
    AreaChartOutlined,
    BuildOutlined,
    DesktopOutlined,
    LoginOutlined,
    MessageOutlined,
    SearchOutlined,
    SettingOutlined,
} from "@ant-design/icons";
import { Button, Col, Input, Layout, Menu, Row, Select, Space } from "antd";
import { Header } from "antd/es/layout/layout";
import Column from "antd/es/table/Column";
import TextArea from "antd/es/input/TextArea";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { RootState } from "../reduxtoolkit/store";
import { useDispatch, useSelector } from "react-redux";
import { addNewService, updateServiceData } from "../reduxtoolkit/serviceActions";
import { unwrapResult } from "@reduxjs/toolkit";
import { collection, getDocs, query, updateDoc, where } from "@firebase/firestore";
import { firestore } from "../Firebase/Firebase";
import { addNewstory } from "../reduxtoolkit/StoryAction";
import { fetchNumberData } from "../reduxtoolkit/NumberLeverActions";
import { format } from "date-fns";


const { Sider, Content } = Layout;
const { SubMenu } = Menu;

// Lấy thông tin người dùng từ localStorage
const userData = JSON.parse(localStorage.getItem('userData') || '{}');

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

// In the fifth row, other columns are merged into first column
// by setting it's colSpan to be 0


const EditServiceeee: React.FC = () => {
    const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useDispatch();
    const { id_sv } = useParams<{ id_sv: string }>();
    const [startDate, setStartDate] = useState(new Date().toISOString());
    const dataService = useSelector((state: RootState) => state.service.dataService);
    const [ipAddress, setIpAddress] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const { data } = useSelector((state: RootState) => state.numberlever);

    useEffect(() => {
        dispatch(fetchNumberData());
    }, [dispatch]);
    useEffect(() => {
        const getIPAddress = async () => {

            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            const ip = data.ip;
            setIpAddress(ip);

        };

        getIPAddress();
    }, []);
    const navigate = useNavigate();
    // Kiểm tra xem dữ liệu đã được lấy thành công hay chưa
    const selectedData = dataService.find((item) => item.id_sv === id_sv);
    if (!selectedData) {
        return <div>Loading...</div>; // Hoặc thông báo lỗi nếu cần
    }

    const handleSaveChanges = async (values: any) => {
        const updatedData = {
            ...selectedData,
            ...values,
        };
        const serviceQuery = query(collection(firestore, 'service'), where('id_sv', '==', selectedData.id_sv));
        const serviceDocs = await getDocs(serviceQuery);
        const serviceDocRef = serviceDocs.docs[0].ref;

        await updateDoc(serviceDocRef, updatedData);

        // Gửi action updateServiceData với dữ liệu cập nhật
        dispatch(updateServiceData(updatedData));
        alert("Cập nhật thành công")
        navigate("/services")
        const newValues = {
            name: userData.email,
            date: startDate,
            ip: ipAddress,

            operations: 'Cập nhật thông tin dịch vụ ' + selectedData.id_sv,
        };

        await dispatch(addNewstory(newValues));
    };
    const handleLogout = () => {
        // Xử lý đăng xuất tại đây (ví dụ: xóa thông tin đăng nhập, đặt lại trạng thái, v.v.)
        // Sau đó, chuyển hướng về trang đăng nhập
        // Ví dụ: xóa thông tin người dùng trong localStorage
        localStorage.removeItem('userData');
        window.location.href = ('/')
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
                                    <Menu.Item key={item.key} icon={item.icon} className="menu-item" style={item.key === '3' ? { backgroundColor: '#ff7506', color: 'white' } : {}}> {/* Add className="menu-item" */}
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
                                <p className="hederpc mx-2">Dịch vụ &gt;
                                    <a href="/services" className=" dsdvadd ms-2"> Danh sách dịch vụ &gt;  </a>

                                    <a href="" className="dsdv ms-2"> Cập nhật</a>
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
                    <p className="qldv">Quản lý dịch vụ</p>
                    <Form onFinish={handleSaveChanges} initialValues={selectedData}>
                        <Card className="card">
                            <p className="thongTindichvu">Thông tin dịch vụ</p>
                            <Row>
                                <Col span={11}>
                                    <Row>
                                        <Col span={24}>
                                            <label className="lbaddSe" > Mã dịch vụ: <i className="kytu"> &#42;</i></label>
                                            <Form.Item name="id_sv" >
                                                <Input />
                                            </Form.Item>
                                        </Col>
                                        <Col span={24}>
                                            <label className="lbaddSe custom-lbadd" > Tên dịch vụ: <i className="kytu"> &#42;</i></label>
                                            <Form.Item name="name" >
                                                <Input />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={11} className="ms-4">

                                    <label className="lbaddSe" >Mô tả: </label>
                                    <Form.Item name="describe" >
                                        <TextArea rows={5} />
                                    </Form.Item>


                                </Col>
                            </Row>
                            <p className="qtcs mt-4"> Quy tắt cấp số</p>
                            <Row>
                                <Form.Item name="numberlever">
                                    <Checkbox.Group style={{ display: 'flex', flexDirection: 'column' }}>
                                        <Checkbox value="Tăng tự động">Tăng tự động từ:
                                            <Tag className="ms-1 tagcheck">0001</Tag>
                                            đến
                                            <Tag className="ms-1"> 999</Tag></Checkbox>
                                        <Checkbox value="Frefix">Frefix:
                                            <Tag className="ms-7 tagcheck">0001</Tag></Checkbox>
                                        <Checkbox value="Surfix">Surfix:
                                            <Tag className="ms-7 tagcheck">0001</Tag></Checkbox>
                                        <Checkbox value="Rest mỗi ngày">Rest mỗi ngày</Checkbox>
                                    </Checkbox.Group>
                                </Form.Item>
                                <Form.Item name="status" hidden initialValue="hoạt động">
                                    <Input />
                                </Form.Item>
                            </Row>
                            <p className="mt-5 abs"> <i className="kytu"> &#42;</i> là trường thông tin bắt buộc</p>
                        </Card>
                        <Row className="justify-content-center mt-3">
                            <Col span={10} className="text-end col-hb">
                                <button className="btn-adddvice">
                                    Hủy bỏ
                                </button>
                            </Col>
                            <Col span={12} className="d-flex ms-5">
                                <button type="submit" className="btn-ttb">
                                    Thêm dịch vụ
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

export default EditServiceeee;