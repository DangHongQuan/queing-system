import React, { useEffect, useState } from "react";
// import './homedasboard.css'
// import  useFetchServiceData  from '../redux/serviceActions';

import { Badge, Card, DatePicker, Dropdown, Pagination, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import './dasbordefault.css'
import './service.css'
import './detaildevice.css'
import { Link, Route, useNavigate, Routes, useParams } from 'react-router-dom';
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
import { query } from "express";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { RootState } from "../reduxtoolkit/store";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { fetchServiceData } from "../reduxtoolkit/serviceActions";
import style from "react-syntax-highlighter/dist/esm/styles/hljs/a11y-dark";
import './detailservice.css'
import { format } from "date-fns";
import { fetchNumberData } from "../reduxtoolkit/NumberLeverActions";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { useDispatch } from "react-redux/es/exports";
import { Option } from "antd/es/mentions";

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

const data = [
    {
        id_sv: "KIO_01",
        name: "Kiosk",
        describe: "Hoạt động",
        isActive: true,
        ct: "Chi tiết",
        cn: "Cập nhật",
    },
    {
        id_sv: "KIO_01",
        name: "Kiosk",
        describe: "Hoạt động",
        isActive: true,
        ct: "Chi tiết",
        cn: "Cập nhật",
    },

];




const DetailServiceeee: React.FC = () => {


    const navigate = useNavigate();
    const [searchText, setSearchText] = useState('');
    const [searchStatusTt, setsearchStatusTt] = useState('');

    const [isOpen, setIsOpen] = useState(false);

    const [selectedDate, setSelectedDate] = useState(null);
    const { id_sv } = useParams<{ id_sv: string }>();
    const dataService = useSelector((state: RootState) => state.service.dataService);
    const data = useSelector((state: RootState) => state.numberlever.data);
    const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useDispatch();
    useEffect(() => {
        dispatch(fetchNumberData());
    }, [dispatch]);

    const handleSearch = () => {

        const filtered = data.filter((item) => {
            const itemDate = new Date(item.data);
            const startDate = selectedDate && selectedDate[0] ? new Date(selectedDate[0]) : null;
            const endDate = selectedDate && selectedDate[1] ? new Date(selectedDate[1]) : null;
            if (startDate && endDate) {
                startDate.setHours(0, 0, 0, 0);
                endDate.setHours(23, 59, 59, 999);
            }

            return (
                item.name_dv &&
                item.id_cs.toString().includes(searchText) &&
                (!selectedDate || (startDate && endDate && itemDate >= startDate && itemDate <= endDate))
            );
        });

        return filtered;
    };


    const handleChangeSearchText = e => {
        setSearchText(e.target.value);
    };

    const handleChangesearchStatusTt = value => {
        setsearchStatusTt(value);
    };


    const handleDateChange = (dates) => {
        setSelectedDate(dates);
    };
    // Kiểm tra xem dữ liệu đã được lấy thành công hay chưa
    const selectedData = dataService.find(item => item.id_sv === id_sv);
    if (!selectedData) {
        return <div>Loading...</div>; // Hoặc thông báo lỗi nếu cần
    }

    const handleLogout = () => {
        // Xử lý đăng xuất tại đây (ví dụ: xóa thông tin đăng nhập, đặt lại trạng thái, v.v.)
        // Sau đó, chuyển hướng về trang đăng nhập
        // Ví dụ: xóa thông tin người dùng trong localStorage
        localStorage.removeItem('userData');
        window.location.href=('/')
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
                                <p className="hederpc mx-2">Dịch vụ &gt;  <a href="/services" className="dstbadd ms-2"> Danh sách dịch vụ  &gt;</a> <a href="/" className="dsdv ms-2"> Chi tiết</a></p>
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
                    <p className="dstbhome">Quảng lý dịch vụ</p>
                    <Row>
                        <Col span={7} className="ms-3">
                            <Card>
                                <h1 className="tbdv">Thông tin dịch vụ</h1>
                                <p className="mdv d-flex"> Mã dịch vụ: {selectedData.id_sv}  </p>
                                <p className="mdv d-flex">Tên dịch vụ: {selectedData.name}  </p>
                                <p className="mdv d-flex"> Mô tả:  {selectedData.describe} </p>
                                <h1 className="tbdv">Quy tắt cấp số</h1>
                                <span className="d-flex"> {selectedData.numberlever}</span>
                            </Card>
                        </Col>
                        <Col span={13} className="ms-3">
                            <Card>
                          <Row>
                            <Col span={8}>
                            <label className="tthd ">Tình trạng</label>
                            <Select
                                className=" d-flex ms-3"
                                placeholder="Tìm trạng"
                                value={searchStatusTt}
                                onChange={handleChangesearchStatusTt}
                                style={{ width: 180, marginBottom: 16 }}
                            >
                                <Option value="">Tất cả</Option>
                                <Option value="Đang chờ">Đang chờ</Option>
                                <Option value="Hết hạn">Hết hạn</Option>
                            </Select>
                            </Col>
                            <Col span={8}>
                       
                            <label className="ctg  " > Chọn thời gian</label>
                            <Space.Compact block>
                            <DatePicker.RangePicker style={{ width: '90%' }} onChange={handleDateChange} />


                            </Space.Compact>
                   
                            </Col>
                            <Col span={8}>
                            <label className="tukhoa">Từ khóa</label>
                                <Input.Search
                                    placeholder="Tìm kiếm..."
                                    value={searchText}
                                    onChange={handleChangeSearchText}
                                    onSearch={handleSearch}
                                    style={{ marginBottom: 16 }}
                                />
                            </Col>
                          </Row>
                                <Table dataSource={handleSearch()} bordered pagination={{ pageSize: 5 }} rowClassName={(record, index) => (index % 2 === 0 ? 'table-row-even' : 'table-row-odd')} >
                                    <Column
                                        title={<span className="table-title">STT</span>}
                                        dataIndex="id_cs"
                                        key="id_cs"
                                        render={(text: string) => <span>{text}</span>}
                                    />


                                    <Column
                                        title={<span className="table-title">Trạng thái</span>}
                                        dataIndex="status"
                                        key="status"
                                        render={(text: string) => <span>{text}</span>}
                                    />




                                </Table>

                            </Card>
                        </Col>
                        <Col span={3} >

                            <div className="cnsc">
                                <a onClick={() => navigate(`/editService/${selectedData.id_sv}`)}>
                                    <img src="/img/icon/Edit Square.png" /> <br /><span>Cập Nhật</span></a>

                            </div>
                            <div className="cnsc1">
                                <a href="/services">
                                    <img src="/img/Edit Square.png" /> <br /><span style={{ color: "black" }}> Quay lại    </span></a>

                            </div>


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

export default DetailServiceeee;


