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
  Steps
} from 'antd';
import {
  EyeOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  RocketOutlined
} from '@ant-design/icons';
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

  // Mock data - Replace with actual API call
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      const mockOrders = [
        {
          id: 'ORD-12345',
          customerName: 'Priya Sharma',
          customerPhone: '+91 98765 43210',
          customerAddress: '123, MG Road, Bangalore, Karnataka - 560001',
          date: '2025-10-08',
          time: '10:30 AM',
          items: [
            {
              id: 1,
              name: 'Handmade Cotton Saree',
              image: 'https://via.placeholder.com/80',
              quantity: 2,
              price: 2500
            },
            {
              id: 2,
              name: 'Bamboo Basket Set',
              image: 'https://via.placeholder.com/80',
              quantity: 1,
              price: 850
            }
          ],
          totalAmount: 5850,
          status: 'pending',
          paymentStatus: 'paid'
        },
        {
          id: 'ORD-12344',
          customerName: 'Anjali Verma',
          customerPhone: '+91 87654 32109',
          customerAddress: '456, Park Street, Kolkata, West Bengal - 700016',
          date: '2025-10-07',
          time: '02:15 PM',
          items: [
            {
              id: 3,
              name: 'Terracotta Pottery',
              image: 'https://via.placeholder.com/80',
              quantity: 3,
              price: 1200
            }
          ],
          totalAmount: 3600,
          status: 'shipped',
          paymentStatus: 'paid'
        },
        {
          id: 'ORD-12343',
          customerName: 'Meera Patel',
          customerPhone: '+91 76543 21098',
          customerAddress: '789, Civil Lines, Ahmedabad, Gujarat - 380001',
          date: '2025-10-06',
          time: '11:45 AM',
          items: [
            {
              id: 1,
              name: 'Handmade Cotton Saree',
              image: 'https://via.placeholder.com/80',
              quantity: 1,
              price: 2500
            }
          ],
          totalAmount: 2500,
          status: 'delivered',
          paymentStatus: 'paid'
        }
      ];
      setOrders(mockOrders);
    } catch (error) {
      message.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // TODO: Replace with actual API call
      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      message.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      message.error('Failed to update order status');
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setDetailsModalVisible(true);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'orange',
      processing: 'blue',
      shipped: 'cyan',
      delivered: 'green'
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
      processing: 1,
      shipped: 2,
      delivered: 3
    };
    return steps[status] || 0;
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchText.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
      render: (id) => <Text strong>{id}</Text>
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
      render: (status, record) => (
        <Select
          value={status}
          onChange={(value) => handleStatusChange(record.id, value)}
          style={{ width: 130 }}
          size="small"
        >
          <Option value="pending">
            <Tag color="orange" icon={getStatusIcon('pending')}>Pending</Tag>
          </Option>
          <Option value="processing">
            <Tag color="blue" icon={getStatusIcon('processing')}>Processing</Tag>
          </Option>
          <Option value="shipped">
            <Tag color="cyan" icon={getStatusIcon('shipped')}>Shipped</Tag>
          </Option>
          <Option value="delivered">
            <Tag color="green" icon={getStatusIcon('delivered')}>Delivered</Tag>
          </Option>
        </Select>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetails(record)}
          size="small"
        >
          View Details
        </Button>
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
