import React, { useEffect, useState } from 'react';
import { Dropdown, Menu } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { fetchNumberData } from '../reduxtoolkit/NumberLeverActions';
import { RootState } from '../reduxtoolkit/store';

const CustomDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useDispatch();

  useEffect(() => {
    dispatch(fetchNumberData());
  }, [dispatch]);

  const { data } = useSelector((state: RootState) => state.numberlever);

  const handleDropdownClick = () => {
    setIsOpen(!isOpen);
  };

  const handleMenuClick = (e: any) => {
    // Xử lý sự kiện khi một mục được chọn trong dropdown menu
    console.log('Clicked menu item:', e);
  };

  const menu = (
    <Menu onClick={handleMenuClick} style={{ maxHeight: '200px', width: '400px', overflowY: 'auto' }}>
      <Menu.Item>Thông báo</Menu.Item>
      {data.map((item: any) => (
        <Menu.Item key={item.id_cs}>{item.name_kh}</Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Dropdown
      overlay={menu}
      visible={isOpen}
      onVisibleChange={setIsOpen}
      overlayClassName="custom-dropdown"
      placement="topLeft"
    >
      <img src="/img/icon/notification.png" className="me-2 iconaccount" onClick={handleDropdownClick} />
    </Dropdown>
  );
};

export default CustomDropdown;
