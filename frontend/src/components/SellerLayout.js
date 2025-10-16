import React, { useState } from 'react';
import { Layout, Menu, Badge, Avatar, Dropdown, Button } from 'antd';
import {
  DashboardOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import './SellerLayout.css';

const { Header, Sider, Content } = Layout;

const SellerLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/seller/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/seller/products',
      icon: <ShoppingOutlined />,
      label: 'Products',
    },
    {
      key: '/seller/orders',
      icon: <ShoppingCartOutlined />,
      label: 'Orders',
    },
    {
      key: '/seller/profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      key: '/seller/notifications',
      icon: <BellOutlined />,
      label: 'Notifications',
      badge: notificationCount,
    },
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'My Profile',
      onClick: () => navigate('/seller/profile'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true,
      onClick: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        localStorage.removeItem('businessName');
        navigate('/login');
      },
    },
  ];

  return (
    <Layout className="seller-layout">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        onBreakpoint={(broken) => {
          if (broken) {
            setCollapsed(true);
          }
        }}
        className="seller-sider"
        width={250}
      >
        <div className="seller-logo">
          <img 
            src="/logo.png" 
            alt="SheLeads" 
            className="logo-image"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <div className="logo-text" style={{ display: 'none' }}>
            {collapsed ? 'SL' : 'SheLeads'}
          </div>
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={handleMenuClick}
          className="seller-menu"
        >
          {menuItems.map((item) => (
            <Menu.Item key={item.key} icon={item.icon}>
              <span>{item.label}</span>
              {item.badge > 0 && !collapsed && (
                <Badge count={item.badge} offset={[10, 0]} />
              )}
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      <Layout className="seller-content-layout">
        <Header className="seller-header">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="trigger-button"
          />
          <div className="header-right">
            <Badge count={notificationCount} offset={[-5, 5]}>
              <Button
                type="text"
                icon={<BellOutlined style={{ fontSize: '20px' }} />}
                onClick={() => navigate('/seller/notifications')}
                className="notification-button"
              />
            </Badge>
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              trigger={['click']}
            >
              <div className="user-profile">
                <Avatar
                  size="large"
                  icon={<UserOutlined />}
                  className="user-avatar"
                />
                {!collapsed && (
                  <div className="user-info">
                    <span className="user-name">Priya Sharma</span>
                    <span className="user-role">Seller</span>
                  </div>
                )}
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content className="seller-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default SellerLayout;
