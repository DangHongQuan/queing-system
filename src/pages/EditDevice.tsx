import React, { useEffect, useState } from "react";
// import './homedasboard.css'
import { Badge, Card, Form, Pagination, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
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
import Column from "antd/es/table/Column";
import { ThunkDispatch } from "redux-thunk";
import { RootState } from "../reduxtoolkit/store";
import { AnyAction } from "redux";
import { useDispatch, useSelector } from "react-redux";
import { fetchDevicesData, updateDevicesData } from "../reduxtoolkit/DevicesActions";
import { Option } from "antd/es/mentions";
import { collection, doc, updateDoc } from "@firebase/firestore";
import { firestore } from "../Firebase/Firebase";
import { addNewstory } from "../reduxtoolkit/StoryAction";
import { unwrapResult } from "@reduxjs/toolkit";
import axios from "axios";


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



const EditDevice: React.FC = () => {
  const navigate = useNavigate();
  const [ipAddress, setIpAddress] = useState<string | null>(null);

  useEffect(() => {
    const getIPAddress = async () => {

      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      const ip = data.ip;
      setIpAddress(ip);

    };

    getIPAddress();
  }, []);
  const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useDispatch();
  const { id } = useParams<{ id: string }>();
  const data = useSelector((state: RootState) => state.device.dataDevice);
  const [startDate, setStartDate] = useState(new Date().toISOString());
  const selectedData = data.find((item) => item.id === id);
  if (!selectedData) {
    return <div>Loading...</div>;
  }

  const handleDeviceChanges = async (values: any) => {
    try {
      const updatedData = {
        ...selectedData,
        ...values,
      };
      const serviceDocRef = doc(collection(firestore, 'devices'), selectedData.id);
      await updateDoc(serviceDocRef, updatedData);
      dispatch(updateDevicesData(updatedData));
      alert("Cập nhật thành công");
      navigate("/device");
      const newValues = {
        name: userData.email,
        date: startDate,
        ip: ipAddress,

        operations: 'Cập nhật thông tin thiết bị ' + selectedData.id_dc,
      };
      await dispatch(addNewstory(newValues));
    } catch (error) {
      alert('Lỗi khi cập nhật: ' + error.message);
    }
  };


  const handleLogout = () => {
    // Xử lý đăng xuất tại đây (ví dụ: xóa thông tin đăng nhập, đặt lại trạng thái, v.v.)
    // Sau đó, chuyển hướng về trang đăng nhập
    // Ví dụ: xóa thông tin người dùng trong localStorage
    localStorage.removeItem('userData');
    window.location.href = ('/')
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
                  <a href="/device" className="dstbadd ms-2"> Danh sách thiết bị  &gt; </a>
                  <a href="/" className="dstb ms-2"> Cập nhật thiết bị</a></p>
              </Col>
              <Col span={11}   >
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
          <p className="dstbhome " style={{ marginLeft: "120px" }}>Quản lý thiết bị</p>




          <Row className="mt-5 ms-5">
            <Form onFinish={handleDeviceChanges} initialValues={selectedData}>
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
                    <Form.Item name="ip">
                      <Input className="inputadd" readOnly />

                    </Form.Item>


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
                            {data.map(item => (
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
              <Row className="justify-content-center mt-3" style={{ marginLeft: "200px" }}>
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

export default EditDevice;