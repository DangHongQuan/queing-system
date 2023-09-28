import React, { useEffect, useState } from "react";
import './homedasboard.css'
import './account.css'
import { Link, Route, Routes } from "react-router-dom";
import {
  AppstoreOutlined,
  AreaChartOutlined,
  BuildOutlined,
  CameraOutlined,
  DesktopOutlined,
  LoginOutlined,
  MessageOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Card, Col, Dropdown, Form, Image, Input, Layout, Menu, Row } from "antd";
import { Header } from "antd/es/layout/layout";
import { fetchNumberData } from "../reduxtoolkit/NumberLeverActions";
import { RootState } from "../reduxtoolkit/store";
import { useDispatch, useSelector } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
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

// const userData = JSON.parse(localStorage.getItem('userData') || '{}');

const handleLogout = () => {
  // Xử lý đăng xuất tại đây (ví dụ: xóa thông tin đăng nhập, đặt lại trạng thái, v.v.)
  // Sau đó, chuyển hướng về trang đăng nhập
  // Ví dụ: xóa thông tin người dùng trong localStorage
  localStorage.removeItem('userData');
  window.location.href = ('/')
};

const PersoalAccount: React.FC = () => {
  const [userData, setUserData] = useState<any>({});
  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem("userData") || "{}");
    setUserData(storedUserData);
  }, []);
  const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useDispatch();

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
                  <Menu.Item
                    key={item.key} icon={item.icon} className="menu-item" style={item.key === '0' ? { backgroundColor: '#ff7506', color: 'white' } : {}}> {/* Add className="menu-item" */}
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
                <p className="hederp">Thông tin cá nhân</p>
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
          {/* <Card className="card center">
          <h1>aaaaaaa</h1>
        </Card> */}
          <Card className="card center mt-5">
            <div className="row">
              <div className="col-4">
                <div className="row text-center">
                  <div className="col-12" style={{ position: "relative" }}>
                    <Avatar src={userData.imageURL} className="imgaccounthome" size={170} />
                    <div
                      style={{
                        position: "absolute",
                        bottom: "20px",
                        right: "90px",
                        transform: "translate(50%, 50%)",
                      }}
                    >
                      <Button
                        style={{ background: "#FF7506", color: "white" }}
                        shape="circle"
                        icon={
                          <CameraOutlined className="d-flex align-items-center fs-5" />
                        }
                      />
                    </div>
                  </div>
                  <div className="col mt-4">
                    <p>{userData.name}</p>
                  </div>
                </div>
              </div>
              <div className="col-8 mt-5">
                <Form disabled>
                  <div className="row">
                    <div className="col-6">
                      <label htmlFor="" className="">
                        Tên tài khoản
                      </label>
                      <Form.Item className="">
                        <input className="vauePe" value={userData.name} />
                      </Form.Item>
                    </div>
                    <div className="col-6">
                      <label htmlFor="" className="">
                        Tên đăng nhập
                      </label>
                      <Form.Item className="">
                        <input className="vauePe" value={userData.email} />
                      </Form.Item>
                    </div>
                    <div className="col-6">
                      <label htmlFor="" className="">
                        Số điện thoại
                      </label>
                      <Form.Item className="">
                        <input className="vauePe" value={userData.phone} />

                      </Form.Item>
                    </div>
                    <div className="col-6">
                      <label htmlFor="" className="">
                        Mật khẩu
                      </label>
                      <Form.Item className="">
                        <input className="vauePe" value={userData.password} />

                      </Form.Item>
                    </div>
                    <div className="col-6">
                      <label htmlFor="" className="">
                        Email:
                      </label>
                      <Form.Item className="">
                        <input className="vauePe" value={userData.email} />

                      </Form.Item>
                    </div>
                    <div className="col-6">
                      <label htmlFor="" className="">
                        Vai trò:
                      </label>
                      <Form.Item className="">
                        <input className="vauePe" value={userData.role} />

                      </Form.Item>
                    </div>
                  </div>
                </Form>
              </div>
              <div className="col-4"></div>
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

export default PersoalAccount;
