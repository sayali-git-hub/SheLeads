import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Select,
  Space,
  Tag,
  Input,
  Card,
  Typography,
  Descriptions,
  Image,
  message,
  Badge,
  Steps,
  Popconfirm
} from 'antd';
import {
  EyeOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  RocketOutlined,
  CheckOutlined
} from '@ant-design/icons';
import { getSellerOrders, confirmOrder, updateOrderStatus } from '../../services/sellerApi';
import './OrderManagement.css';

const { Option } = Select;
const { Title, Text } = Typography;

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await getSellerOrders();
      const ordersData = response.data || [];
      
      // Transform orders to match UI expectations
      const transformedOrders = ordersData.map(order => ({
        id: order._id,
        orderId: order.orderId,
        customerName: order.buyerName || order.user?.name || 'N/A',
        customerPhone: order.buyerPhone || 'N/A',
        customerAddress: order.deliveryAddress ? 
          `${order.deliveryAddress.street}, ${order.deliveryAddress.city}, ${order.deliveryAddress.state} - ${order.deliveryAddress.zipCode}` : 'N/A',
        date: new Date(order.orderDate || order.createdAt).toLocaleDateString('en-IN'),
        time: new Date(order.orderDate || order.createdAt).toLocaleTimeString('en-IN'),
        items: order.items.map(item => ({
          id: item.product?._id || item.product,
          name: item.productName || item.product?.name || 'Unknown Product',
          image: item.productImage || (item.product?.images && item.product.images.length > 0 ? item.product.images[0].url : 'https://via.placeholder.com/80'),
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: order.totalAmount || order.totalPrice,
        status: order.status,
        paymentStatus: order.paymentStatus || 'pending'
      }));
      
      setOrders(transformedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      message.error('Failed to fetch orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmOrder = async (orderId) => {
    try {
      setLoading(true);
      await confirmOrder(orderId);
      message.success('Order confirmed! Stock updated.');
      await fetchOrders(); // Refresh orders
    } catch (error) {
      console.error('Error confirming order:', error);
      message.error(error.response?.data?.message || 'Failed to confirm order');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setLoading(true);
      await updateOrderStatus(orderId, newStatus);
      message.success(`Order status updated to ${newStatus}`);
      await fetchOrders(); // Refresh orders
    } catch (error) {
      console.error('Error updating order status:', error);
      message.error(error.response?.data?.message || 'Failed to update order status');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setDetailsModalVisible(true);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'orange',
      confirmed: 'blue',
      processing: 'blue',
      shipped: 'cyan',
      delivered: 'green',
      cancelled: 'red'
    };
    return colors[status] || 'default';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <ClockCircleOutlined />,
      processing: <ShoppingCartOutlined />,
      shipped: <RocketOutlined />,
      delivered: <CheckCircleOutlined />
    };
    return icons[status];
  };

  const getOrderStep = (status) => {
    const steps = {
      pending: 0,
      confirmed: 1,
      processing: 1,
      shipped: 2,
      delivered: 3
    };
    return steps[status] || 0;
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      (order.orderId && order.orderId.toLowerCase().includes(searchText.toLowerCase())) ||
      (order.customerName && order.customerName.toLowerCase().includes(searchText.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'orderId',
      key: 'orderId',
      render: (orderId) => <Text strong>{orderId || 'N/A'}</Text>
    },
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: 'Items',
      dataIndex: 'items',
      key: 'items',
      render: (items) => (
        <Badge count={items.length} showZero color="#FF6B6B">
          <ShoppingCartOutlined style={{ fontSize: '18px' }} />
        </Badge>
      )
    },
    {
      title: 'Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      sorter: (a, b) => a.totalAmount - b.totalAmount,
      render: (amount) => <Text strong>₹{amount.toLocaleString('en-IN')}</Text>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)} icon={getStatusIcon(status)}>
          {status.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <Space>
          {record.status === 'pending' && (
            <Popconfirm
              title="Confirm Order"
              description="This will reduce stock and mark order as confirmed. Continue?"
              onConfirm={() => handleConfirmOrder(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="primary"
                icon={<CheckOutlined />}
                size="small"
                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
              >
                Confirm
              </Button>
            </Popconfirm>
          )}
          <Button
            type="default"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
            size="small"
          >
            View
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div className="order-management">
      <Card className="order-header-card">
        <div className="order-header">
          <Title level={2} className="page-title">Order Management</Title>
          <div className="order-stats">
            <div className="stat-item">
              <Text type="secondary">Total Orders</Text>
              <Title level={4}>{orders.length}</Title>
            </div>
            <div className="stat-item">
              <Text type="secondary">Pending</Text>
              <Title level={4} style={{ color: '#FFA726' }}>
                {orders.filter(o => o.status === 'pending').length}
              </Title>
            </div>
            <div className="stat-item">
              <Text type="secondary">Completed</Text>
              <Title level={4} style={{ color: '#66BB6A' }}>
                {orders.filter(o => o.status === 'delivered').length}
              </Title>
            </div>
          </div>
        </div>

        <div className="order-filters">
          <Input
            placeholder="Search by Order ID or Customer Name..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="search-input"
            size="large"
          />
          <Select
            value={filterStatus}
            onChange={setFilterStatus}
            className="status-filter"
            size="large"
          >
            <Option value="all">All Orders</Option>
            <Option value="pending">Pending</Option>
            <Option value="processing">Processing</Option>
            <Option value="shipped">Shipped</Option>
            <Option value="delivered">Delivered</Option>
          </Select>
        </div>
      </Card>

      <Card className="orders-table-card">
        <Table
          columns={columns}
          dataSource={filteredOrders}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} orders`,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Order Details Modal */}
      <Modal
        title={`Order Details - ${selectedOrder?.id}`}
        open={detailsModalVisible}
        onCancel={() => setDetailsModalVisible(false)}
        footer={null}
        width={800}
        className="order-details-modal"
      >
        {selectedOrder && (
          <div className="order-details">
            {/* Order Status Timeline */}
            <Card className="status-timeline-card" title="Order Status">
              <Steps
                current={getOrderStep(selectedOrder.status)}
                items={[
                  {
                    title: 'Pending',
                    icon: <ClockCircleOutlined />,
                  },
                  {
                    title: 'Processing',
                    icon: <ShoppingCartOutlined />,
                  },
                  {
                    title: 'Shipped',
                    icon: <RocketOutlined />,
                  },
                  {
                    title: 'Delivered',
                    icon: <CheckCircleOutlined />,
                  },
                ]}
              />
            </Card>

            {/* Customer Information */}
            <Card title="Customer Information" className="info-card">
              <Descriptions column={1}>
                <Descriptions.Item label="Name">
                  <Text strong>{selectedOrder.customerName}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Phone">
                  {selectedOrder.customerPhone}
                </Descriptions.Item>
                <Descriptions.Item label="Delivery Address">
                  {selectedOrder.customerAddress}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Order Items */}
            <Card title="Order Items" className="items-card">
              <div className="order-items-list">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="order-item">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={80}
                      height={80}
                      style={{ objectFit: 'cover', borderRadius: '8px' }}
                    />
                    <div className="item-details">
                      <Text strong>{item.name}</Text>
                      <Text type="secondary">Quantity: {item.quantity}</Text>
                      <Text>₹{item.price.toLocaleString('en-IN')} each</Text>
                    </div>
                    <div className="item-total">
                      <Text strong>
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </Text>
                    </div>
                  </div>
                ))}
              </div>
              <div className="order-total">
                <Text strong style={{ fontSize: '16px' }}>Total Amount:</Text>
                <Title level={3} style={{ color: '#FF6B6B', margin: 0 }}>
                  ₹{selectedOrder.totalAmount.toLocaleString('en-IN')}
                </Title>
              </div>
            </Card>

            {/* Order Information */}
            <Card title="Order Information" className="info-card">
              <Descriptions column={2}>
                <Descriptions.Item label="Order Date">
                  {selectedOrder.date}
                </Descriptions.Item>
                <Descriptions.Item label="Order Time">
                  {selectedOrder.time}
                </Descriptions.Item>
                <Descriptions.Item label="Payment Status">
                  <Tag color={selectedOrder.paymentStatus === 'paid' ? 'green' : 'orange'}>
                    {selectedOrder.paymentStatus.toUpperCase()}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Order Status">
                  <Tag color={getStatusColor(selectedOrder.status)} icon={getStatusIcon(selectedOrder.status)}>
                    {selectedOrder.status.toUpperCase()}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Action Buttons */}
            <div className="order-actions">
              {selectedOrder.status === 'pending' && (
                <Popconfirm
                  title="Confirm Order"
                  description="This will reduce stock and mark order as confirmed. Continue?"
                  onConfirm={() => {
                    handleConfirmOrder(selectedOrder.id);
                    setDetailsModalVisible(false);
                  }}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button
                    type="primary"
                    icon={<CheckOutlined />}
                    size="large"
                    style={{ backgroundColor: '#52c41a', borderColor: '#52c41a', marginRight: '10px' }}
                  >
                    Confirm Order
                  </Button>
                </Popconfirm>
              )}
              <Select
                value={selectedOrder.status}
                onChange={(value) => {
                  handleStatusChange(selectedOrder.id, value);
                  setSelectedOrder({ ...selectedOrder, status: value });
                }}
                style={{ width: 200 }}
                size="large"
              >
                <Option value="pending">Pending</Option>
                <Option value="confirmed">Confirmed</Option>
                <Option value="processing">Processing</Option>
                <Option value="shipped">Shipped</Option>
                <Option value="delivered">Delivered</Option>
              </Select>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrderManagement;
