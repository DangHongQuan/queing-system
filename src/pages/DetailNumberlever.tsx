import React, { useEffect, useState } from "react";
import './homedasboard.css'
import { useNavigate, useParams } from 'react-router-dom';
import './detaildevice.css'
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
import { Button, Card, Col, Dropdown, Layout, Menu, Row } from "antd";
import { Header } from "antd/es/layout/layout";
import { RootState } from "../reduxtoolkit/store";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { fetchNumberData } from "../reduxtoolkit/NumberLeverActions";
import { format } from "date-fns";


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


const DetailNumberLever: React.FC = () => {
    const [userData, setUserData] = useState<any>({});
    useEffect(() => {
        const storedUserData = JSON.parse(localStorage.getItem("userData") || "{}");
        setUserData(storedUserData);
    }, []);
  const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useDispatch();

    useEffect(() => {
        dispatch(fetchNumberData());
      }, [dispatch]);
    const { id_cs } = useParams<{ id_cs: string }>();
    const data = useSelector((state: RootState) => state.numberlever.data);

    // Tìm kiếm dữ liệu dựa trên id từ URL Params
    const selectedData = data.find(item => item.id_cs == id_cs);
    const handleLogout = () => {
        // Xử lý đăng xuất tại đây (ví dụ: xóa thông tin đăng nhập, đặt lại trạng thái, v.v.)
        // Sau đó, chuyển hướng về trang đăng nhập
        // Ví dụ: xóa thông tin người dùng trong localStorage
        localStorage.removeItem('userData');
        window.location.href=('/')
      };
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

                <Content>
                    <Header className="hdaccount">
                        <Row >
                            <Col span={10}>
                                <p className="hederpc mx-2">Thiết bị &gt; 
                                 <a href="/numbers" className=" dstbadd ms-2"> Danh sách cấp số  &gt;</a>
                                  <a href="/" className="dstb ms-2"> Chi tiết</a></p>
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
                    <p className="dstbhome">Quản lý cấp số</p>
                    <Card className="card">
                        <p className="thongTindichvu">Thông tin cấp số</p>
                        <Row>
                            <Col span={12}>
                                <p className="text-dtDevice">  Họ tên: {selectedData?.name_kh}</p>
                            </Col>
                            <Col span={12}>
                                <p className="text-dtDevice">  Nguồn cấp: {selectedData?.powersupply}</p>
                            </Col>
                            <Col span={12}>
                                <p className="text-dtDevice">  Tên Dịch vụ:  {selectedData?.name_dv}</p>
                            </Col>
                            <Col span={12}>
                                <p className="text-dtDevice">  Trạng thái:  {selectedData?.status}</p>
                            </Col>
                            <Col span={12}>
                                <p className="text-dtDevice"> Số thứ tự:  {selectedData?.id_cs}</p>
                            </Col>
                            <Col span={12}>
                                <p className="text-dtDevice"> Thời gian cấp:  {selectedData?.data}  </p>
                            </Col>
                            <Col span={12}>
                                <p className="text-dtDevice"> Hạn sử dụng:  {selectedData?.data}  </p>
                            </Col>
                          
                        </Row>
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

export default DetailNumberLever;