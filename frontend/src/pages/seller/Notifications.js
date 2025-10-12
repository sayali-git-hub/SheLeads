import React, { useState, useEffect } from 'react';
import { Card, List, Badge, Button, Typography, Empty, Tag, Space, Popconfirm, message } from 'antd';
import {
  BellOutlined,
  ShoppingCartOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  CheckOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { 
  getNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  deleteNotification,
  clearAllNotifications
} from '../../services/sellerApi';
import './Notifications.css';

const { Title, Text } = Typography;

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const getNotificationIcon = (type) => {
    const icons = {
      new_order: <ShoppingCartOutlined />,
      order: <CheckCircleOutlined />,
      order_confirmed: <CheckCircleOutlined />,
      stock: <ExclamationCircleOutlined />,
      payment: <InfoCircleOutlined />,
      system: <BellOutlined />,
      other: <InfoCircleOutlined />
    };
    return icons[type] || <InfoCircleOutlined />;
  };

  const getNotificationColor = (type) => {
    const colors = {
      new_order: '#4CAF50',
      order: '#2196F3',
      order_confirmed: '#4CAF50',
      stock: '#FF9800',
      payment: '#9C27B0',
      system: '#607D8B',
      other: '#607D8B'
    };
    return colors[type] || '#607D8B';
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return date.toLocaleDateString('en-IN');
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await getNotifications();
      const notificationsData = response.data || [];
      
      // Transform notifications for UI
      const transformedNotifications = notificationsData.map(notif => ({
        id: notif._id,
        type: notif.type,
        title: notif.title,
        message: notif.message,
        time: getTimeAgo(notif.createdAt),
        read: notif.isRead,
        icon: getNotificationIcon(notif.type),
        color: getNotificationColor(notif.type),
        relatedId: notif.relatedId
      }));
      
      setNotifications(transformedNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      message.error('Failed to fetch notifications');
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications(notifications.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      ));
      message.success('Notification marked as read');
    } catch (error) {
      console.error('Error marking notification as read:', error);
      message.error('Failed to mark notification as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications(notifications.map(notif => ({ ...notif, read: true })));
      message.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      message.error('Failed to mark all notifications as read');
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await deleteNotification(notificationId);
      setNotifications(notifications.filter(notif => notif.id !== notificationId));
      message.success('Notification deleted');
    } catch (error) {
      console.error('Error deleting notification:', error);
      message.error('Failed to delete notification');
    }
  };

  const handleClearAll = async () => {
    try {
      await clearAllNotifications();
      setNotifications([]);
      message.success('All notifications cleared');
    } catch (error) {
      console.error('Error clearing notifications:', error);
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
