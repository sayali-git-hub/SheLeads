import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Table, Spin, Typography, Progress, message } from 'antd';
import { 
  ShoppingCartOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  ExclamationCircleOutlined,
  PlusOutlined,
  ShoppingOutlined
} from '@ant-design/icons';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { useNavigate } from 'react-router-dom';
import { getDashboardStats } from '../../services/sellerApi';
import './SellerDashboard.css';

const { Title, Text } = Typography;

const SellerDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await getDashboardStats();
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        message.error('Failed to load dashboard data');
        // Set default empty data
        setDashboardData({
          totalSales: 0,
          pendingOrders: 0,
          completedOrders: 0,
          lowStockItems: 0,
          salesData: {
            labels: [],
            values: []
          },
          topSellingProducts: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const salesChartData = {
    labels: dashboardData?.salesData?.labels || [],
    datasets: [
      {
        label: 'Daily Sales (₹)',
        data: dashboardData?.salesData?.values || [],
        fill: false,
        backgroundColor: '#FF6B6B',
        borderColor: '#FF6B6B',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '₹' + value.toLocaleString('en-IN');
          }
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="seller-dashboard">
      <div className="dashboard-header">
        <Title level={2} className="dashboard-title">Seller Dashboard</Title>
        <div className="quick-actions">
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => navigate('/seller/products')}
            className="action-button"
          >
            Add Product
          </Button>
          <Button 
            icon={<ShoppingOutlined />} 
            onClick={() => navigate('/seller/orders')}
            className="action-button"
          >
            View Orders
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} className="stats-row">
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <div className="stat-content">
              <div className="stat-icon" style={{ backgroundColor: '#FFE3E3' }}>
                <ShoppingCartOutlined style={{ color: '#FF6B6B', fontSize: '24px' }} />
              </div>
              <div className="stat-details">
                <Text className="stat-label">Total Sales</Text>
                <Title level={3} className="stat-value">
                  ₹{dashboardData?.totalSales?.toLocaleString('en-IN') || '0'}
                </Title>
                <Text className="stat-change positive">+12% from last month</Text>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <div className="stat-content">
              <div className="stat-icon" style={{ backgroundColor: '#FFF3E0' }}>
                <ClockCircleOutlined style={{ color: '#FFA726', fontSize: '24px' }} />
              </div>
              <div className="stat-details">
                <Text className="stat-label">Pending Orders</Text>
                <Title level={3} className="stat-value">{dashboardData?.pendingOrders || 0}</Title>
                <Text className="stat-change">5 new today</Text>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <div className="stat-content">
              <div className="stat-icon" style={{ backgroundColor: '#E8F5E9' }}>
                <CheckCircleOutlined style={{ color: '#66BB6A', fontSize: '24px' }} />
              </div>
              <div className="stat-details">
                <Text className="stat-label">Completed Orders</Text>
                <Title level={3} className="stat-value">{dashboardData?.completedOrders || 0}</Title>
                <Text className="stat-change positive">+8% from last month</Text>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <div className="stat-content">
              <div className="stat-icon" style={{ backgroundColor: '#F3E5F5' }}>
                <ExclamationCircleOutlined style={{ color: '#AB47BC', fontSize: '24px' }} />
              </div>
              <div className="stat-details">
                <Text className="stat-label">Low Stock Alerts</Text>
                <Title level={3} className="stat-value">{dashboardData?.lowStockItems || 0}</Title>
                <Text className="stat-change negative">Requires attention</Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Charts and Tables Row */}
      <Row gutter={[16, 16]} className="charts-row">
        <Col xs={24} lg={16}>
          <Card title="Sales Overview (Last 30 Days)" className="chart-card">
            <div style={{ height: '300px' }}>
              <Line data={salesChartData} options={chartOptions} />
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card 
            title="Top Selling Products" 
            className="top-products-card"
            extra={<Button type="link" onClick={() => navigate('/seller/products')}>View All</Button>}
          >
            <div className="top-products-list">
              {dashboardData?.topSellingProducts?.map((product, index) => (
                <div key={product.id} className="top-product-item">
                  <div className="product-info">
                    <Text strong className="product-name">{product.name}</Text>
                    <Text className="product-sales">{product.sales} sold</Text>
                  </div>
                  <Progress 
                    percent={(product.sales / 50) * 100} 
                    showInfo={false} 
                    strokeColor="#FF6B6B" 
                    className="sales-progress"
                  />
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Recent Activity */}
      <Card 
        title="Recent Activity" 
        className="recent-activity"
        extra={<Button type="link" onClick={() => navigate('/seller/notifications')}>View All</Button>}
      >
        <div className="activity-item">
          <div className="activity-icon">
            <ShoppingCartOutlined style={{ color: '#4CAF50' }} />
          </div>
          <div className="activity-details">
            <Text>New order #ORD-12345 received</Text>
            <Text type="secondary">2 minutes ago</Text>
          </div>
        </div>
        <div className="activity-item">
          <div className="activity-icon">
            <ExclamationCircleOutlined style={{ color: '#FF9800' }} />
          </div>
          <div className="activity-details">
            <Text>Low stock alert: Handmade Cotton Saree (3 left)</Text>
            <Text type="secondary">1 hour ago</Text>
          </div>
        </div>
        <div className="activity-item">
          <div className="activity-icon">
            <CheckCircleOutlined style={{ color: '#2196F3' }} />
          </div>
          <div className="activity-details">
            <Text>Order #ORD-12344 marked as delivered</Text>
            <Text type="secondary">3 hours ago</Text>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SellerDashboard;
