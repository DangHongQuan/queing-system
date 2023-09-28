
import React, { useState } from "react";
import { Form, Input, Button, Col, Row, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, firestore, loginUser } from "../Firebase/Firebase";
import { collection, query, where, getDocs } from 'firebase/firestore';
import "../Css/Logincss.css";
import { useNavigate } from "react-router-dom";


const Login: React.FC = () => {
 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userData, setUserData] = useState<any | null>(null); // State để lưu trữ thông tin người dùng
  const history = useNavigate();

  
  const handleLogin = async () => {
    try {
      const user = await loginUser(email, password);
      if (user) {
        setUserData(user); // Cập nhật state userData với thông tin người dùng
        localStorage.setItem('userData', JSON.stringify(user)); // Lưu thông tin người dùng vào localStorage
        history('/persoalaccount'); // Chuyển hướng đến trang hiển thị thông tin người dùng
      }
    } catch (error) {
      message.error('Đăng nhập không thành công. Vui lòng kiểm tra lại email và mật khẩu.');
    }
  };
  return (
    <Row align="middle" className="layout">
    <Col className="layoytlog" span={10} style={{ height: '100%', width: '100%' }}>
        <Form  className="mt-5" onClick={handleLogin}>
          <Form.Item>
            <img src="/img/Logoalta.png" alt="" />
          </Form.Item>
          <label className="labletk">Tên đăng nhập*</label>
          <Form.Item name="email" rules={[{ required: true, message: 'Vui lòng nhập email!' }]}>
            <Input
              className="input"
              prefix={<UserOutlined />}
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Item>
          <label className="lablemk">Mật khẩu *</label>
          <Form.Item name="password" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}>
            <Input.Password
              className="input"
              prefix={<LockOutlined />}
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>
          <a className="qmklogin" href="/forgorpassword">Quên mật khẩu?</a>
          <Form.Item>
            <Button className="btlogin" htmlType="submit">
              Đăng Nhập
            </Button>
          </Form.Item>
        </Form>
      </Col>
      <Col className="bg-home" span={11} style={{ height: '100%', width: '100%' }}>
        <img src="/img/bgh.jpg" width={840} alt="Logo" />
      </Col>
    </Row>
  );
};

export default Login;




