import React, { useEffect, useState } from "react";
// import './homedasboard.css'
import { Badge, Card, Form, Pagination, Table } from 'antd';
import './dasbordefault.css'
import './device.css'
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
import { ThunkDispatch } from "redux-thunk";
import { RootState } from "../reduxtoolkit/store";
import { AnyAction } from "redux";
import { useDispatch, useSelector } from "react-redux";
import { collection, doc, getDocs, query, updateDoc, where } from "@firebase/firestore";
import { app, firestore } from "../Firebase/Firebase";
import { updateUsersData } from "../reduxtoolkit/UserAction";
import { fetchrolesData } from "../reduxtoolkit/RolesActions";
import { User, getAuth, updatePassword } from "firebase/auth";

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
interface DataType {
    key: string;
    name: string;
    age: number;
    tel: string;
    phone: number;
    address: string;
}


const UpdateUsert: React.FC = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState<any>({});
    useEffect(() => {
        const storedUserData = JSON.parse(localStorage.getItem("userData") || "{}");
        setUserData(storedUserData);
    }, []);
    const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useDispatch();
    const { email } = useParams<{ email: string }>();
    const { dataroles } = useSelector((state: RootState) => state.roles);
    const data = useSelector((state: RootState) => state.user.data);
    useEffect(() => {
        dispatch(fetchrolesData());
    }, [dispatch]);
    const selectedData = data.find((item) => item.email === email);
    if (!selectedData) {
        return <div>Loading...</div>;
    }
    const handleSaveChanges = async (values: any) => {
        const updatedData = {
            ...selectedData,
            ...values,
        };
        const serviceQuery = query(collection(firestore, 'users'), where('email', '==', selectedData.email));
        const serviceDocs = await getDocs(serviceQuery);
        const serviceDocRef = serviceDocs.docs[0].ref;
        await updateDoc(serviceDocRef, updatedData);
        dispatch(updateUsersData(updatedData));

       


        window.location.href = "/accounts"

    };
    const handleLogout = () => {
        // Xử lý đăng xuất tại đây (ví dụ: xóa thông tin đăng nhập, đặt lại trạng thái, v.v.)
        // Sau đó, chuyển hướng về trang đăng nhập
        // Ví dụ: xóa thông tin người dùng trong localStorage
        localStorage.removeItem('userData');
        window.location.href=('/')
      };
      
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
                                    <Menu.Item key={item.key} icon={item.icon} className="menu-item" style={item.key === '' ? { backgroundColor: '#ff7506', color: 'white' } : {}}> {/* Add className="menu-item" */}
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
                            <Col span={13}>
                                <p className="hederpc mx-2">Cài đặt hệ thống &gt;
                                    <a href="/accounts" className="dstbadd ms-2"> Quản lý tài khoản  &gt; </a>
                                    <a href="/" className="dstb ms-2"> Cập nhật tài khoản </a></p>
                            </Col>
                            <Col span={8}   >
                                <div className="hederpaccount text-end">
                                    <img src="/img/icon/notification.png" className="me-2 iconaccount" />
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
                    <p className="dstbhome " style={{ marginLeft: "120px" }}>Quản lý tài khoản</p>




                    <Row className="mt-5 ms-5">
                        <Form onFinish={handleSaveChanges} initialValues={selectedData}>
                            <Card className="card">
                                <p className="tttb">Thông tin tài khoản</p>
                                <Row>
                                    <Col span={11} className="mx-2">
                                        <h1 className="lbadd">Họ tên: <i className="kytu"> &#42;</i></h1>
                                        <Form.Item name="name" >
                                            <Input className="inputadd" />
                                        </Form.Item>
                                        {/* <Input placeholder="Nhập mã thiết bị" className="inputadd" /> */}
                                    </Col>
                                    <Col span={11} className="ms-4">
                                        <h1 className="lbadd">Tên đăng nhập: <i className="kytu"> &#42;</i></h1>
                                        <Form.Item name="email" >
                                            <Input className="inputadd" disabled />
                                        </Form.Item>

                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={11} className="mx-2">
                                        <h1 className="lbadd">Số điện thoại: <i className="kytu"> &#42;</i></h1>
                                        {/* <Input placeholder="Nhập mã thiết bị" className="inputadd" /> */}
                                        <Form.Item name="phone">
                                            <Input className="inputadd" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={11} className="ms-4">
                                        <h1 className="lbadd">Mật khẩu: <i className="kytu"> &#42;</i></h1>
                                        <Form.Item name="password"  >
                                            <Input className="inputadd" disabled />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={11} className="mx-2">
                                        <h1 className="lbadd">Email: <i className="kytu"> &#42;</i></h1>
                                        <Form.Item name="email">
                                            <Input className="inputadd" readOnly disabled />

                                        </Form.Item>


                                    </Col>
                                    <Col span={11} className="ms-4">
                                        <h1 className="lbadd">Mật khẩu: <i className="kytu"> &#42;</i></h1>
                                        <Form.Item name="password"  >
                                            <Input className="inputadd" disabled />
                                        </Form.Item>

                                    </Col>

                                </Row>
                                <Row>
                                    <Col span={11} className="mx-2">
                                        <h1 className="lbadd">Vai trò: <i className="kytu"> &#42;</i></h1>
                                        <Form.Item name="role">
                                            {/* <Input className="inputadd" readOnly  /> */}
                                            <select

                                                className=" inputadd" style={{ width: 465 }}>
                                                <option></option>
                                                {dataroles.map((item) => (

                                                    <option key={item.name} value={item.name}>
                                                        {item.name}
                                                    </option>

                                                ))}
                                            </select>

                                        </Form.Item>


                                    </Col>
                                    <Col span={11} className="ms-4">
                                        <h1 className="lbadd">Tình trạng: <i className="kytu"> &#42;</i></h1>
                                        <Form.Item name="status"  >
                                            <select

                                                className=" inputadd" style={{ width: 465 }}>
                                                <option></option>
                                                <option value="Hoạt động">Hoạt động</option>
                                                <option value="Ngưng hoạt động">Ngưng hoạt động</option>
                                            </select>
                                        </Form.Item>

                                    </Col>

                                </Row>



                            </Card>
                            <Row className="justify-content-center mt-3" style={{ marginLeft: "200px" }}>
                                <Col span={10} className="text-end col-hb">
                                    <button className="btn-adddvice" onClick={() => navigate(-1)}>
                                        Hủy bỏ
                                    </button>
                                </Col>
                                <Col span={12} className="d-flex ms-5">
                                    <button className="btn-ttb">
                                        Cập nhật
                                    </button>
                                </Col>
                            </Row>

                        </Form>
                    </Row>
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

export default UpdateUsert;