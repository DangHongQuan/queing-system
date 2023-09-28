import React, { useEffect, useState } from "react";
// import './homedasboard.css'
import { Badge, Card, Dropdown, Pagination, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import './dasbordefault.css'
import './device.css'
import { Link, Route, Routes, useNavigate } from "react-router-dom";
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
import { fetchDevicesData } from "../reduxtoolkit/DevicesActions";
import { Option } from "antd/es/mentions";
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
interface DataType {
  key: string;
  name: string;
  age: number;
  tel: string;
  phone: number;
  address: string;
}


const DeviceApp: React.FC = () => {
  const navigate = useNavigate();
  const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useDispatch();
  const { dataDevice } = useSelector((state: RootState) => state.device);

  useEffect(() => {
    dispatch(fetchDevicesData());
  }, [dispatch]);

  const [searchText, setSearchText] = useState('');
  const [searchStatus_hd, setSearchStatus_hd] = useState('');
  const [searchStatus_kn, setSearchStatus_kn] = useState('');


  const handleSearch = () => {
    const filtered = dataDevice.filter(item =>
      item.name.toLowerCase().includes(searchText.toLowerCase()) &&


      (searchStatus_hd === '' || item.status_hd.toLowerCase() === searchStatus_hd.toLowerCase()) &&
      (searchStatus_kn === '' || item.status_kn.toLowerCase() === searchStatus_kn.toLowerCase())
    );
    return filtered;
  };

  const handleChangeSearchText = e => {
    setSearchText(e.target.value);
  };

  const handleChangeSearchStatus_hd = value => {
    setSearchStatus_hd(value);
  };
  const handleChangeSearchStatus_kn = value => {
    setSearchStatus_kn(value);
  };
  const handleLogout = () => {
    // Xử lý đăng xuất tại đây (ví dụ: xóa thông tin đăng nhập, đặt lại trạng thái, v.v.)
    // Sau đó, chuyển hướng về trang đăng nhập
    // Ví dụ: xóa thông tin người dùng trong localStorage
    localStorage.removeItem('userData');
    window.location.href = ('/')
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
                <p className="hederpc mx-2">Thiết bị &gt;  <a href="/device" className="dstb ms-2"> Danh sách thiết bị</a></p>
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
                <p className="xc">xin chào</p>
                <a href="/persoalaccount">

                  <p className="name">{userData.name}</p>
                </a>

              </Col>
            </Row>
          </Header>
          <p className="dstbhome">Danh sách thiết bị</p>

          <Row className="custom-ms">
            <Col span={5}>
              <label className="tthd ">Trạng thái hoạt động</label>
              <Select
                className="slectTop d-flex ms-3"
                placeholder="Tìm kiếm theo trạng thái hoạt động"
                value={searchStatus_hd}
                onChange={handleChangeSearchStatus_hd}
                style={{ width: 200, marginBottom: 16 }}
              >
                <Option value="">Tất cả</Option>
                <Option value="Hoạt động">Hoạt động</Option>
                <Option value="Ngừng hoạt động">Ngừng hoạt động</Option>
              </Select>

            </Col>
            <Col span={10}>
              <label className="ttkn">Trạng thái kết nối</label>
              <Select
                className="slectTop d-flex ms-3"
                placeholder="Tìm kiếm theo trạng thái kết nối"
                value={searchStatus_kn}
                onChange={handleChangeSearchStatus_kn}
                style={{ width: 200, marginBottom: 16 }}
              >
                <Option value="">Tất cả</Option>
                <Option value="Kết nối">Kết nối</Option>
                <Option value="Mất kết nối">Mất kết nối</Option>
              </Select>

            </Col>
            <Col span={5} className="custom-tk">
              <label className="tk">Từ khóa</label>
              <Input.Search
                placeholder="Tìm kiếm..."
                value={searchText}
                onChange={handleChangeSearchText}
                onSearch={handleSearch}
                style={{ marginBottom: 16 }}
              />

            </Col>
          </Row>



          <Row className="mt-5 ms-5">
            <Col span={20}>
              <Table
                dataSource={handleSearch()}
                bordered
                pagination={{ pageSize: 5 }}
                rowClassName={(record, index) => (index % 2 === 0 ? 'table-row-even' : 'table-row-odd')}
              >
                <Table.Column
                  title={<span className="table-title">Mã thiết bị</span>}
                  dataIndex="id_dc"
                  key="id_dc"
                  render={(text: string) => <span>{text}</span>}
                />
                <Table.Column
                  title={<span className="table-title">Tên thiết bị</span>}
                  dataIndex="name"
                  key="name"
                  render={(text: string) => <span>{text}</span>}
                />
                <Table.Column
                  title={<span className="table-title">Địa chỉ IP</span>}
                  dataIndex="ip"
                  key="ip"
                  render={(text: string) => <span>{text}</span>}
                />
                <Table.Column
                  title={<span className="table-title">Trạng thái hoạt động</span>}
                  dataIndex="status_hd"
                  key="status_hd"
                  render={(text: string) => <span>{text}</span>}
                />
                <Table.Column
                  title={<span className="table-title">Trạng thái kết nối</span>}
                  dataIndex="status_kn"
                  key="status_kn"
                  render={(text: string) => <span>{text}</span>}
                />
                <Table.Column
                  title={<span className="table-title">Dịch vụ sử dụng</span>}
                  dataIndex="servie_dc"
                  key="servie_dc"
                  render={(text: string) => <span>{text}</span>}
                />
                <Table.Column
                  title="Chi tiết"
                  dataIndex="ct"
                  key="ct"
                  render={(text: string, record: any) => (
                    <a className="link-a" onClick={() => navigate(`/detailDevice/${record.id}`)}>Chi tiết</a>
                  )}
                />
                <Table.Column
                  title="Cập Nhật"
                  dataIndex="cn"
                  key="cn"
                  render={(text: string, record: any) => (
                    <a className="link-a" onClick={() => navigate(`/editDevice/${record.id}`)}>Cập Nhật</a>
                  )}
                />
              </Table>
            </Col>
            <Col span={3} className="ms-1">
              <Link to={"/addDevice"}>
                <Card className="bgaDvice">
                  <img src="/img/icon/add-square.png" alt="" />
                  <p>Thêm thiết bị</p>
                </Card>
              </Link>
            </Col>
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

export default DeviceApp;