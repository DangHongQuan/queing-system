import React, { useEffect, useState } from "react";
import { Form, Input, Button, Col, Row, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { checkActionCode, confirmPasswordReset, getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from "../Firebase/Firebase";


import "../Css/Logincss.css";
import { useLocation, useNavigate } from "react-router-dom";

const ResetPassword: React.FC = () => {
const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const oobCode = searchParams.get('oobCode');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyActionCode = async () => {
      try {
        const auth = getAuth();
        await checkActionCode(auth, oobCode??"");
      } catch (error) {
        setError('Mã hành động không hợp lệ hoặc đã hết hạn.');
        
      }
    };

    verifyActionCode();
  }, [oobCode]);

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu mới và xác nhận mật khẩu không khớp.');
      return;
    }

    try {
      const auth = getAuth();
      await confirmPasswordReset(auth, oobCode??"", newPassword);
      message.success('Đổi mật khẩu thành công!');
      navigate('/')
    } catch (error) {
      setError('Đã xảy ra lỗi khi đổi mật khẩu.');
    }
  };
  

  return (
    <Row align="middle" className="layout ">
      <Col className="layoytlog" span={9} style={{ height: '100%', width: '100%' }}>
        <form onSubmit={handleChangePassword} className="mt-10">
          <Form.Item>
            <img src="/img/Logoalta.png" alt="" />
          </Form.Item>
          <h5>Đặt lại mật khẩu mới</h5>
          <label className="labletk">Mật Khẩu</label>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
           
          >
            <Input.Password
              className="input"
              placeholder="Password"
              type="password" id="newPassword" value={newPassword} onChange={handleNewPasswordChange} required 
            
            />
          </Form.Item>
          <label className="labletk">Nhập lại mật khẩu</label>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
           
          >
            <Input.Password
              className="input"
              placeholder="Password"
              type="password" id="confirmPassword" value={confirmPassword} onChange={handleConfirmPasswordChange} required
            />
          </Form.Item>
          <Button className="btlogin" htmlType="submit">
            Xác nhận
          </Button>
        </form>
      </Col>
      <Col className="bg-home" span={14} style={{ height: '100%', width: '100%' }}>
        <img src="/img/Frame.png" width={848} alt="Logo" />
      </Col>
    </Row>
  );
};

export default ResetPassword;




