
import React, { useEffect, useState } from "react";
import './homedasboard.css'
import { useNavigate } from 'react-router-dom';

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
import { Badge, Button, Card, Col, Dropdown, Layout, Menu, Row } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../reduxtoolkit/store";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { fetchNumberData } from "../reduxtoolkit/NumberLeverActions";
import { Area, RingProgress } from "@ant-design/plots";
import { fetchDevicesData } from "../reduxtoolkit/DevicesActions";
import { fetchServiceData } from "../reduxtoolkit/serviceActions";
import type { CalendarMode } from 'antd/es/calendar/generateCalendar';
import type { Dayjs } from 'dayjs';
import { Calendar, theme } from 'antd';
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
const onPanelChange = (value: Dayjs, mode: CalendarMode) => {
  console.log(value.format('YYYY-MM-DD'), mode);
};
const HomeDasboard: React.FC = () => {
  const [userData, setUserData] = useState<any>({});
  const [dangcho, setDangcho] = useState(0);
  const [boqua, setBoqua] = useState(0);
  const [dasudung, SetDasudung] = useState(0);
  const [count, setCount] = useState(0);
  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem("userData") || "{}");
    setUserData(storedUserData);
  }, []);
  const navigate = useNavigate();
  const { data } = useSelector((state: RootState) => state.numberlever);
  const { dataService } = useSelector((state: RootState) => state.service);

  const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useDispatch();
  const dataChart = data || [];
  const { dataDevice } = useSelector((state: RootState) => state.device);

  const countNumber = data.length
  const countDevice = dataDevice.length
  const nhDevice = dataDevice.filter((item) => item.status_hd === "Hoạt động")
  const countNhDeive = nhDevice.length
  const nhdDevice = dataDevice.filter((item) => item.status_hd === "Ngừng hoạt động")
  const countNhdDeive = nhdDevice.length
  const conutService = dataService.length
  const counthdService = dataService.filter((item) => item.status === "Hoạt động")
  const counthdServiceLength = counthdService.length
  const countNhdService = dataService.filter((item) => item.status === "Ngừng hoạt động")
  const countNhdServiceLenght = countNhdService.length
  useEffect(() => {
    dispatch(fetchDevicesData());
  }, [dispatch]);
  useEffect(() => {
    dispatch(fetchServiceData());
  }, [dispatch]);
  useEffect(() => {
    dispatch(fetchNumberData());
  }, [dispatch]);
  useEffect(() => {
    const Count = data.length;
    setCount(Count);
  });
  useEffect(() => {
    const dangcho = data.filter((item) => item.status === "Đang chờ");
    setDangcho(dangcho.length);
  });
  useEffect(() => {
    const dasudung = data.filter((item) => item.status === "Đã sử dụng");
    SetDasudung(dasudung.length);
  });
  useEffect(() => {
    const boqua = data.filter((item) => item.status === "Bỏ qua");
    setBoqua(boqua.length);
  });

  const newData = dataChart.map((item: any) => {
    const date = new Date(item.data);
    const dateString = date.toISOString().slice(0, 100);
    const count = dataChart.filter((d: any) => d.data === item.data).length;
    return { timePeriod: dateString, value: count };
  });

  const sortedData = newData.sort((a, b) => {
    if (a.timePeriod < b.timePeriod) return -1;
    if (a.timePeriod > b.timePeriod) return 1;
    return 0;
  });

  const config = {
    data: sortedData,
    xField: 'timePeriod',
    yField: 'value',
    seriesField: '', // Xóa seriesField để chỉ hiển thị một đường
    xAxis: {
      range: [0, 1],
    },
  };
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'flex',
    alignItems: 'flex',
    marginTop: '-17px'
  };
  const toltalpt = countNhDeive / countDevice;
  const toltalptcc = parseFloat(toltalpt.toFixed(2));
  const configa = {
    height: 70,
    width: 70,
    autoFit: false,
    percent: toltalptcc,
    color: ['#5B8FF9', '#E8EDF3'],
  };

  const ptService = parseFloat((counthdServiceLength / conutService).toFixed(2));

  const configb = {
    height: 70,
    width: 70,
    autoFit: false,
    percent: ptService,
    color: ['#5B8FF9', '#E8EDF3'],
  };
  const ptNumber = parseFloat((dangcho / countNumber).toFixed(2))
  const configc = {
    height: 70,
    width: 70,
    autoFit: false,
    percent: ptNumber,
    color: ['#5B8FF9', '#E8EDF3'],
  };

  const { token } = theme.useToken();

  const wrapperStyle: React.CSSProperties = {
    width: 300,
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
  };
  const handleLogout = () => {
    // Xử lý đăng xuất tại đây (ví dụ: xóa thông tin đăng nhập, đặt lại trạng thái, v.v.)
    // Sau đó, chuyển hướng về trang đăng nhập
    // Ví dụ: xóa thông tin người dùng trong localStorage
    localStorage.removeItem('userData');
    window.location.href = ('/')
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
                    key={item.key} icon={item.icon} className="menu-item" style={item.key === '1' ? { backgroundColor: '#ff7506', color: 'white' } : {}}> {/* Add className="menu-item" */}
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
          <Row>
            <Col span={16} >
              <p className="haderdb">Dashboard</p>
              <br />
              <h1 className="d-flex bdcs ms-5">Biểu đồ cấp số</h1>
              <Row>
                <Col span={4} className="ms-5 ">
                  <Card style={{ width: 186 }}>
                    <p>
                      <svg className="" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <g clip-path="url(#clip0_780_4500)">
                          <path d="M5.25 0C5.44891 0 5.63968 0.0790176 5.78033 0.21967C5.92098 0.360322 6 0.551088 6 0.75V1.5H18V0.75C18 0.551088 18.079 0.360322 18.2197 0.21967C18.3603 0.0790176 18.5511 0 18.75 0C18.9489 0 19.1397 0.0790176 19.2803 0.21967C19.421 0.360322 19.5 0.551088 19.5 0.75V1.5H21C21.7956 1.5 22.5587 1.81607 23.1213 2.37868C23.6839 2.94129 24 3.70435 24 4.5V21C24 21.7956 23.6839 22.5587 23.1213 23.1213C22.5587 23.6839 21.7956 24 21 24H3C2.20435 24 1.44129 23.6839 0.87868 23.1213C0.316071 22.5587 0 21.7956 0 21V4.5C0 3.70435 0.316071 2.94129 0.87868 2.37868C1.44129 1.81607 2.20435 1.5 3 1.5H4.5V0.75C4.5 0.551088 4.57902 0.360322 4.71967 0.21967C4.86032 0.0790176 5.05109 0 5.25 0V0ZM1.5 6V21C1.5 21.3978 1.65804 21.7794 1.93934 22.0607C2.22064 22.342 2.60218 22.5 3 22.5H21C21.3978 22.5 21.7794 22.342 22.0607 22.0607C22.342 21.7794 22.5 21.3978 22.5 21V6H1.5Z" fill="#6493F9" />
                        </g>
                        <defs>
                          <clipPath id="clip0_780_4500">
                            <rect width="24" height="24" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      <span className="span-title text-right ms-1">Số thứ tự đã cấp</span>
                    </p>
                    <span className="span-number">{count}</span>
                  </Card>
                </Col>
                <Col span={4} className="ms-3">
                  <Card style={{ width: 186 }}>
                    <p>
                      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                        <g clip-path="url(#clip0_860_5536)">
                          <path d="M17.031 10.7194C17.1008 10.789 17.1563 10.8718 17.1941 10.9629C17.2319 11.054 17.2513 11.1517 17.2513 11.2504C17.2513 11.349 17.2319 11.4467 17.1941 11.5378C17.1563 11.6289 17.1008 11.7117 17.031 11.7814L12.531 16.2814C12.4613 16.3512 12.3786 16.4066 12.2875 16.4444C12.1963 16.4822 12.0987 16.5017 12 16.5017C11.9014 16.5017 11.8037 16.4822 11.7126 16.4444C11.6214 16.4066 11.5387 16.3512 11.469 16.2814L9.219 14.0314C9.14927 13.9616 9.09396 13.8788 9.05622 13.7877C9.01848 13.6966 8.99905 13.599 8.99905 13.5004C8.99905 13.4017 9.01848 13.3041 9.05622 13.213C9.09396 13.1219 9.14927 13.0391 9.219 12.9694C9.35983 12.8285 9.55084 12.7494 9.75 12.7494C9.84862 12.7494 9.94627 12.7688 10.0374 12.8066C10.1285 12.8443 10.2113 12.8996 10.281 12.9694L12 14.6899L15.969 10.7194C16.0387 10.6495 16.1214 10.5941 16.2126 10.5563C16.3037 10.5185 16.4014 10.499 16.5 10.499C16.5987 10.499 16.6963 10.5185 16.7875 10.5563C16.8786 10.5941 16.9613 10.6495 17.031 10.7194Z" fill="#35C75A" />
                          <path d="M6 0C6.19891 0 6.38968 0.0790176 6.53033 0.21967C6.67098 0.360322 6.75 0.551088 6.75 0.75V1.5H18.75V0.75C18.75 0.551088 18.829 0.360322 18.9697 0.21967C19.1103 0.0790176 19.3011 0 19.5 0C19.6989 0 19.8897 0.0790176 20.0303 0.21967C20.171 0.360322 20.25 0.551088 20.25 0.75V1.5H21.75C22.5456 1.5 23.3087 1.81607 23.8713 2.37868C24.4339 2.94129 24.75 3.70435 24.75 4.5V21C24.75 21.7956 24.4339 22.5587 23.8713 23.1213C23.3087 23.6839 22.5456 24 21.75 24H3.75C2.95435 24 2.19129 23.6839 1.62868 23.1213C1.06607 22.5587 0.75 21.7956 0.75 21V4.5C0.75 3.70435 1.06607 2.94129 1.62868 2.37868C2.19129 1.81607 2.95435 1.5 3.75 1.5H5.25V0.75C5.25 0.551088 5.32902 0.360322 5.46967 0.21967C5.61032 0.0790176 5.80109 0 6 0V0ZM2.25 6V21C2.25 21.3978 2.40804 21.7794 2.68934 22.0607C2.97064 22.342 3.35218 22.5 3.75 22.5H21.75C22.1478 22.5 22.5294 22.342 22.8107 22.0607C23.092 21.7794 23.25 21.3978 23.25 21V6H2.25Z" fill="#35C75A" />
                        </g>
                        <defs>
                          <clipPath id="clip0_860_5536">
                            <rect width="24" height="24" fill="white" transform="translate(0.75)" />
                          </clipPath>
                        </defs>
                      </svg>
                      <span className="span-title text-right ms-1">Số đã sử dụng</span>
                    </p>
                    <span className="span-number">{dasudung}</span>
                  </Card>
                </Col>
                <Col span={4} className="ms-3 ">
                  <Card style={{ width: 186 }}>
                    <p>
                      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                        <path d="M19.2505 8.9625L20.155 8.058C20.2767 7.93778 20.4308 7.85549 20.5984 7.82114C20.766 7.78679 20.94 7.80185 21.0992 7.8645L22.2017 8.304C22.3627 8.36959 22.5007 8.48137 22.5983 8.62525C22.6958 8.76913 22.7486 8.93867 22.75 9.1125V11.1315C22.748 11.3637 22.6539 11.5856 22.4884 11.7485C22.3229 11.9113 22.0995 12.0018 21.8672 12L21.8297 11.9985C14.1077 11.5185 12.55 4.977 12.2552 2.4735C12.2425 2.35915 12.2525 2.24341 12.2845 2.1329C12.3165 2.02239 12.37 1.91927 12.4418 1.82942C12.5137 1.73958 12.6026 1.66477 12.7034 1.60928C12.8042 1.55379 12.9149 1.51869 13.0292 1.506C13.0631 1.50199 13.0972 1.49998 13.1312 1.5H15.0812C15.2552 1.50063 15.4249 1.55323 15.5687 1.65106C15.7125 1.74888 15.8238 1.88746 15.8882 2.049L16.3285 3.1515C16.3932 3.31023 16.4098 3.48452 16.376 3.65259C16.3423 3.82066 16.2597 3.97506 16.1387 4.0965L15.2342 5.001C15.2342 5.001 15.7547 8.526 19.2505 8.9625Z" fill="#FFAC6A" />
                        <path d="M12.25 22.5H10.75V18.75C10.7494 18.1534 10.5122 17.5815 10.0903 17.1597C9.6685 16.7378 9.09655 16.5006 8.5 16.5H5.5C4.90345 16.5006 4.3315 16.7378 3.90967 17.1597C3.48784 17.5815 3.2506 18.1534 3.25 18.75V22.5H1.75V18.75C1.75119 17.7558 2.14666 16.8027 2.84966 16.0997C3.55267 15.3967 4.5058 15.0012 5.5 15H8.5C9.4942 15.0012 10.4473 15.3967 11.1503 16.0997C11.8533 16.8027 12.2488 17.7558 12.25 18.75V22.5Z" fill="#FFAC6A" />
                        <path d="M7 7.5C7.44501 7.5 7.88002 7.63196 8.25004 7.87919C8.62005 8.12643 8.90843 8.47783 9.07873 8.88896C9.24903 9.3001 9.29359 9.7525 9.20677 10.189C9.11995 10.6254 8.90566 11.0263 8.59099 11.341C8.27632 11.6557 7.87541 11.87 7.43896 11.9568C7.0025 12.0436 6.5501 11.999 6.13896 11.8287C5.72783 11.6584 5.37643 11.37 5.1292 11C4.88196 10.63 4.75 10.195 4.75 9.75C4.75 9.15326 4.98705 8.58097 5.40901 8.15901C5.83097 7.73705 6.40326 7.5 7 7.5ZM7 6C6.25832 6 5.5333 6.21993 4.91661 6.63199C4.29993 7.04404 3.81928 7.62971 3.53545 8.31494C3.25162 9.00016 3.17736 9.75416 3.32206 10.4816C3.46675 11.209 3.8239 11.8772 4.34835 12.4017C4.8728 12.9261 5.54098 13.2833 6.26841 13.4279C6.99584 13.5726 7.74984 13.4984 8.43506 13.2145C9.12029 12.9307 9.70596 12.4501 10.118 11.8334C10.5301 11.2167 10.75 10.4917 10.75 9.75C10.75 9.25754 10.653 8.76991 10.4646 8.31494C10.2761 7.85997 9.99987 7.44657 9.65165 7.09835C9.30343 6.75013 8.89004 6.47391 8.43506 6.28545C7.98009 6.097 7.49246 6 7 6Z" fill="#FFAC6A" />
                      </svg>
                      <span className="span-title text-right ms-1">Số đang chờ</span>
                    </p>
                    <span className="span-number">{dangcho}</span>
                  </Card>
                </Col>
                <Col span={4} className="ms-3 ">
                  <Card style={{ width: 186 }}>
                    <p>
                      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                        <path d="M12.26 6.15C12.2819 6.10502 12.3161 6.06711 12.3585 6.04058C12.4009 6.01406 12.45 6 12.5 6C12.5501 6 12.5991 6.01406 12.6415 6.04058C12.684 6.06711 12.7181 6.10502 12.74 6.15L13.691 8.0775C13.7101 8.11649 13.7383 8.15025 13.7733 8.17587C13.8084 8.20148 13.8491 8.21817 13.892 8.2245L16.022 8.5335C16.2395 8.565 16.328 8.8335 16.169 8.988L14.63 10.4895C14.599 10.5198 14.5758 10.5572 14.5624 10.5985C14.5491 10.6398 14.546 10.6838 14.5535 10.7265L14.9165 12.8475C14.9247 12.8965 14.919 12.9468 14.9002 12.9927C14.8813 13.0386 14.85 13.0784 14.8098 13.1075C14.7696 13.1367 14.7221 13.154 14.6726 13.1576C14.6231 13.1613 14.5735 13.151 14.5295 13.128L12.6245 12.126C12.5863 12.106 12.5439 12.0956 12.5008 12.0956C12.4577 12.0956 12.4152 12.106 12.377 12.126L10.472 13.128C10.4281 13.1506 10.3787 13.1605 10.3294 13.1567C10.2801 13.1529 10.2329 13.1355 10.1929 13.1064C10.153 13.0773 10.1219 13.0377 10.1031 12.992C10.0843 12.9463 10.0786 12.8963 10.0865 12.8475L10.4495 10.7265C10.4572 10.6839 10.4543 10.64 10.4413 10.5987C10.4282 10.5575 10.4053 10.52 10.3745 10.4895L8.82952 8.988C8.79413 8.95325 8.76911 8.90934 8.75728 8.86117C8.74545 8.81301 8.74727 8.7625 8.76253 8.71531C8.77779 8.66812 8.8059 8.62612 8.84369 8.59401C8.88149 8.56189 8.92748 8.54094 8.97652 8.5335L11.1065 8.2245C11.1494 8.21817 11.1902 8.20148 11.2252 8.17587C11.2602 8.15025 11.2885 8.11649 11.3075 8.0775L12.26 6.15Z" fill="#F86D6D" />
                        <path d="M3.5 3C3.5 2.20435 3.81607 1.44129 4.37868 0.87868C4.94129 0.316071 5.70435 0 6.5 0L18.5 0C19.2956 0 20.0587 0.316071 20.6213 0.87868C21.1839 1.44129 21.5 2.20435 21.5 3V23.25C21.4999 23.3857 21.4631 23.5188 21.3933 23.6351C21.3236 23.7515 21.2236 23.8468 21.104 23.9108C20.9844 23.9748 20.8497 24.0052 20.7142 23.9988C20.5787 23.9923 20.4474 23.9492 20.3345 23.874L12.5 19.6515L4.6655 23.874C4.55256 23.9492 4.42135 23.9923 4.28584 23.9988C4.15033 24.0052 4.0156 23.9748 3.896 23.9108C3.7764 23.8468 3.67641 23.7515 3.60667 23.6351C3.53694 23.5188 3.50007 23.3857 3.5 23.25V3ZM6.5 1.5C6.10218 1.5 5.72064 1.65804 5.43934 1.93934C5.15804 2.22064 5 2.60218 5 3V21.849L12.0845 18.126C12.2076 18.0441 12.3521 18.0004 12.5 18.0004C12.6479 18.0004 12.7924 18.0441 12.9155 18.126L20 21.849V3C20 2.60218 19.842 2.22064 19.5607 1.93934C19.2794 1.65804 18.8978 1.5 18.5 1.5H6.5Z" fill="#F86D6D" />
                      </svg>
                      <span className="span-title text-right ms-1">Số thứ tự bỏ qua</span>
                    </p>
                    <span className="span-number">{boqua}</span>
                  </Card>
                </Col>
              </Row>
              <Card className="cardDB">
                <Area {...config} className="area" />
              </Card>

            </Col>
            <Col span={8} className="homeright">
              <Row className="mt-4">

                <Col span={15}>
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
                </Col>

                <Col span={4}>
                  <a href="/persoalaccount">
                    <p className="xcdb">xin chào</p>
                    <p className="namedb">{userData.name}</p>
                  </a>
                </Col>
              </Row>
              <p className="tq">Tổng quan</p>

              <Card className="card-right">
                <Row>
                  <Col span={10}>
                    <div style={containerStyle}>
                      <RingProgress {...configa} />
                      <h1 style={{ marginTop: "20px", marginLeft: 5 }}>{countDevice}</h1>

                    </div>
                  </Col>
                  <Col span={10}>
                    <p style={{ marginTop: "-10px", textAlign: "left" }}> <Badge status="warning" /> Đang hoạt động
                      <span className="span-right-db">{" " + countNhDeive}</span></p>
                    <p style={{ marginTop: "-10px", textAlign: "left" }}>   <Badge status="default" /> Nhưng hoạt động
                      <span className="span-right-db">{" " + countNhdDeive}</span></p>



                  </Col>
                </Row>



              </Card>
              <Card className="card-right mt-1">
                <Row>
                  <Col span={10}>
                    <div style={containerStyle}>
                      <RingProgress {...configb} />
                      <h1 style={{ marginTop: "20px", marginLeft: 5 }}>{conutService}</h1>

                    </div>
                  </Col>
                  <Col span={10}>
                    <p style={{ marginTop: "-10px", textAlign: "left" }}> <Badge status="processing" /> Đang hoạt động
                      <span className="span-right-db">{" " + counthdServiceLength}</span></p>
                    <p style={{ marginTop: "-10px", textAlign: "left" }}>   <Badge status="default" /> Nhưng hoạt động
                      <span className="span-right-db">{" " + countNhdServiceLenght}</span></p>



                  </Col>
                </Row>

              </Card>
              <Card className="card-right mt-1">
                <Row>
                  <Col span={10}>
                    <div style={containerStyle}>
                      <RingProgress {...configc} />
                      <h1 style={{ marginTop: "20px", marginLeft: 5 }}>{countNumber}</h1>

                    </div>
                  </Col>
                  <Col span={10} >
                    <p style={{ marginTop: "-20px", textAlign: "left" }}> <Badge status="success" /> Đang chờ
                      <span className="span-right-db">{" " + dangcho}</span></p>
                    <p style={{ marginTop: "-12px", textAlign: "left" }}>   <Badge status="default" /> Đã sử dụng
                      <span className="span-right-db">{" " + dasudung}</span></p>
                    <p style={{ marginTop: "-15px", textAlign: "left" }}>   <Badge color="pink" /> Bỏ qua
                      <span className="span-right-db">{" " + boqua}</span></p>

                  </Col>
                </Row>

              </Card>
              <div style={wrapperStyle} className="calender" >
                <Calendar fullscreen={false} onPanelChange={onPanelChange} />
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

export default HomeDasboard;