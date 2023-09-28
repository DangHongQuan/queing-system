import React, { useEffect, useState } from "react";
import { Badge, Card, DatePicker, Dropdown, Pagination, Table, Tooltip } from 'antd';
import './dasbordefault.css'
import './service.css'
import { Link, Route, useNavigate, Routes } from 'react-router-dom';
import {
    AppstoreOutlined,
    AreaChartOutlined,
    BuildOutlined,
    DesktopOutlined,
    LoginOutlined,
    MessageOutlined,
    SettingOutlined,
} from "@ant-design/icons";
import { saveAs } from 'file-saver';

import { Button, Col, Input, Layout, Menu, Row, Select, Space } from "antd";
import { Header } from "antd/es/layout/layout";
import Column from "antd/es/table/Column";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../reduxtoolkit/store";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { format } from "date-fns";
import { fetchNumberData } from "../reduxtoolkit/NumberLeverActions";
import { write, utils as XLSXUtils, writeFile } from 'xlsx';

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


const DownloadButton = ({ handleDownload }) => (
    <Button onClick={handleDownload}>Tải về</Button>
  );
 
function convertTableToExcelData(tableData) {
    const worksheet = XLSXUtils.json_to_sheet(tableData);
    const workbook = XLSXUtils.book_new();
    XLSXUtils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const excelBuffer = write(workbook, { bookType: 'xlsx', type: 'array' });
    const excelData = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    return excelData;
  }

const Report: React.FC = () => {
    const handleDownload = () => {
        const tableData = data;
        const excelData = convertTableToExcelData(tableData);
        saveAs(excelData, 'data.xlsx');
      };
    const [userData, setUserData] = useState<any>({});
    useEffect(() => {
        const storedUserData = JSON.parse(localStorage.getItem("userData") || "{}");
        setUserData(storedUserData);
    }, []);

    const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useDispatch();

    const handleLogout = () => {
        // Xử lý đăng xuất tại đây (ví dụ: xóa thông tin đăng nhập, đặt lại trạng thái, v.v.)
        // Sau đó, chuyển hướng về trang đăng nhập
        // Ví dụ: xóa thông tin người dùng trong localStorage
        localStorage.removeItem('userData');
        window.location.href=('/')
      };
    useEffect(() => {
        dispatch(fetchNumberData());
    }, [dispatch]);


    const [selectedDate, setSelectedDate] = useState(null);


    const navigate = useNavigate();
    const { data } = useSelector((state: RootState) => state.numberlever);

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
                (!selectedDate || (startDate && endDate && itemDate >= startDate && itemDate <= endDate))
            );
        });
        return filtered;
    };
    const handleDateChange = (dates) => {
        setSelectedDate(dates);
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
                                    <Menu.Item key={item.key} icon={item.icon} className="menu-item" style={item.key === '5' ? { backgroundColor: '#ff7506', color: 'white' } : {}}> {/* Add className="menu-item" */}
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
                                <p className="hederpc mx-2">Báo cáo &gt;  <a href="/reports" className="dsdv ms-2"> Lập báo cáo</a></p>
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
                    <p className="dstbhome">Danh sách dịch vụ</p>

                    <Row className="custom-ms">

                        <Col span={10} className=" ms-3">
                            <label className="tthd " > Chọn thời gian</label>
                            <Space.Compact block>
                                <DatePicker.RangePicker style={{ width: '90%' }} onChange={handleDateChange} />


                            </Space.Compact>
                        </Col>

                    </Row>



                    <Row className="mt-5 ms-5">
                        <Col span={20}>
                                <Table dataSource={handleSearch()} bordered pagination={{ pageSize: 5 }} rowClassName={(record, index) => (index % 2 === 0 ? 'table-row-even' : 'table-row-odd')} >
                                    <Column
                                        dataIndex="id_cs"
                                        key="id_cs"
                                        title="STT"
                                        
                                        
                                        render={(text: string) => <span>{text}</span>}
                                    />

                                    <Column
                                        title={<span className="table-title">Tên dịch vụ</span>}
                                        dataIndex="name_dv"
                                        key="name_dv"
                                        render={(text: string) => <span>{text}</span>}
                                    />


                                    <Column
                                        title={<span className="table-title">Thời gian cấp</span>}
                                        dataIndex="data"
                                        key="data"
                                        render={(text: string) => <span>{format(new Date(text), "HH:mm:ss ' ' dd/MM/yyyy")}</span>}
                                    />

                                    <Column
                                        title={<span className="table-title">Trạng thái</span>}
                                        dataIndex="status"
                                        key="status"
                                        render={(text: string) => <span>{text}</span>}
                                    />
                                    <Column
                                        title={<span className="table-title">Nguồn cấp</span>}
                                        dataIndex="powersupply"
                                        key="powersupply"
                                        render={(text: string) => <span>{text}</span>}
                                    />



                                </Table>
                        </Col>
                        <Col span={3} className="ms-1">
                        <a onClick={handleDownload}>
                                <Card className="bgaDvice">
                                    <img src="/img/icon/document-download.png" alt="" />
                                    <br />
                                    <span>Tải về</span>
                                </Card>
                                </a>
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

export default Report;


