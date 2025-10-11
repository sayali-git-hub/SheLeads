import React, { useState, useEffect } from 'react';
import { Card, List, Badge, Button, Typography, Empty, Tag, Space, Popconfirm, message } from 'antd';
import {
  BellOutlined,
  ShoppingCartOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  CheckOutlined
} from '@ant-design/icons';
import './Notifications.css';

const { Title, Text } = Typography;

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      const mockNotifications = [
        {
          id: 1,
          type: 'order',
          title: 'New Order Received',
          message: 'You have received a new order #ORD-12345',
          time: '2 minutes ago',
          read: false,
          icon: <ShoppingCartOutlined />,
          color: '#4CAF50'
        },
        {
          id: 2,
          type: 'stock',
          title: 'Low Stock Alert',
          message: 'Handmade Cotton Saree is running low in stock (3 units left)',
          time: '1 hour ago',
          read: false,
          icon: <ExclamationCircleOutlined />,
          color: '#FF9800'
        },
        {
          id: 3,
          type: 'order',
          title: 'Order Delivered',
          message: 'Order #ORD-12344 has been successfully delivered',
          time: '3 hours ago',
          read: true,
          icon: <CheckCircleOutlined />,
          color: '#2196F3'
        },
        {
          id: 4,
          type: 'order',
          title: 'New Order Received',
          message: 'You have received a new order #ORD-12346',
          time: '5 hours ago',
          read: true,
          icon: <ShoppingCartOutlined />,
          color: '#4CAF50'
        },
        {
          id: 5,
          type: 'stock',
          title: 'Low Stock Alert',
          message: 'Bamboo Basket Set is running low in stock (2 units left)',
          time: '1 day ago',
          read: true,
          icon: <ExclamationCircleOutlined />,
          color: '#FF9800'
        },
        {
          id: 6,
          type: 'order',
          title: 'Order Shipped',
          message: 'Order #ORD-12343 has been shipped',
          time: '2 days ago',
          read: true,
          icon: <CheckCircleOutlined />,
          color: '#2196F3'
        }
      ];
      setNotifications(mockNotifications);
    } catch (error) {
      message.error('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      // TODO: Replace with actual API call
      setNotifications(notifications.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      ));
      message.success('Notification marked as read');
    } catch (error) {
      message.error('Failed to mark notification as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      // TODO: Replace with actual API call
      setNotifications(notifications.map(notif => ({ ...notif, read: true })));
      message.success('All notifications marked as read');
    } catch (error) {
      message.error('Failed to mark all notifications as read');
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      // TODO: Replace with actual API call
      setNotifications(notifications.filter(notif => notif.id !== notificationId));
      message.success('Notification deleted');
    } catch (error) {
      message.error('Failed to delete notification');
    }
  };

  const handleClearAll = async () => {
    try {
      // TODO: Replace with actual API call
      setNotifications([]);
      message.success('All notifications cleared');
    } catch (error) {
      message.error('Failed to clear notifications');
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="notifications-page">
      <Card className="notifications-header-card">
        <div className="notifications-header">
          <div className="header-left">
            <Title level={2} className="page-title">
              <BellOutlined /> Notifications
            </Title>
            {unreadCount > 0 && (
              <Badge count={unreadCount} className="unread-badge" />
            )}
          </div>
          <Space>
            {unreadCount > 0 && (
              <Button
                type="primary"
                icon={<CheckOutlined />}
                onClick={handleMarkAllAsRead}
              >
                Mark All as Read
              </Button>
            )}
            {notifications.length > 0 && (
              <Popconfirm
                title="Are you sure you want to clear all notifications?"
                onConfirm={handleClearAll}
                okText="Yes"
                cancelText="No"
              >
                <Button danger icon={<DeleteOutlined />}>
                  Clear All
                </Button>
              </Popconfirm>
            )}
          </Space>
        </div>
      </Card>

      <Card className="notifications-list-card">
        {notifications.length === 0 ? (
          <Empty
            description="No notifications yet"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={notifications}
            loading={loading}
            renderItem={(item) => (
              <List.Item
                className={`notification-item ${!item.read ? 'unread' : ''}`}
                actions={[
                  !item.read && (
                    <Button
                      type="link"
                      size="small"
                      onClick={() => handleMarkAsRead(item.id)}
                    >
                      Mark as read
                    </Button>
                  ),
                  <Popconfirm
                    title="Delete this notification?"
                    onConfirm={() => handleDeleteNotification(item.id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button
                      type="link"
                      danger
                      size="small"
                      icon={<DeleteOutlined />}
                    />
                  </Popconfirm>
                ].filter(Boolean)}
              >
                <List.Item.Meta
                  avatar={
                    <div
                      className="notification-icon"
                      style={{ backgroundColor: `${item.color}20` }}
                    >
                      {React.cloneElement(item.icon, { style: { color: item.color, fontSize: '20px' } })}
                    </div>
                  }
                  title={
                    <div className="notification-title">
                      <Text strong>{item.title}</Text>
                      {!item.read && <Badge status="processing" />}
                    </div>
                  }
                  description={
                    <div className="notification-content">
                      <Text>{item.message}</Text>
                      <Text type="secondary" className="notification-time">
                        {item.time}
                      </Text>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Card>
    </div>
  );
};

export default Notifications;
