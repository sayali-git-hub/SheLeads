import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, message, Typography, Space, Divider, Avatar } from 'antd';
import { UserOutlined, ShopOutlined, PhoneOutlined, MailOutlined, HomeOutlined, BankOutlined, SaveOutlined } from '@ant-design/icons';
import './SellerProfile.css';

const { Title, Text } = Typography;

const SellerProfile = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      // TODO: Replace with actual API call
      const mockData = {
        businessName: 'Priya\'s Handicrafts',
        ownerName: 'Priya Sharma',
        contactNumber: '+91 98765 43210',
        email: 'priya.sharma@example.com',
        businessAddress: '123, MG Road, Bangalore, Karnataka - 560001',
        bankAccountNumber: '1234567890123456',
        ifscCode: 'SBIN0001234',
        accountHolderName: 'Priya Sharma'
      };
      setProfileData(mockData);
      form.setFieldsValue(mockData);
    } catch (error) {
      message.error('Failed to fetch profile data');
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      console.log('Profile data to update:', values);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProfileData(values);
      message.success('Profile updated successfully!');
    } catch (error) {
      message.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="seller-profile">
      <Card className="profile-header-card">
        <div className="profile-header">
          <div className="profile-avatar-section">
            <Avatar size={80} icon={<UserOutlined />} className="profile-avatar" />
            <div>
              <Title level={3} className="profile-name">{profileData?.ownerName || 'Seller Name'}</Title>
              <Text type="secondary">{profileData?.businessName || 'Business Name'}</Text>
            </div>
          </div>
        </div>
      </Card>

      <Card className="profile-form-card" title="Edit Profile Information">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={profileData}
          className="profile-form"
        >
          {/* Business Information Section */}
          <div className="form-section">
            <Title level={4} className="section-title">
              <ShopOutlined /> Business Information
            </Title>
            <Divider />

            <Form.Item
              label="Business Name"
              name="businessName"
              rules={[
                { required: true, message: 'Please enter your business name' },
                { min: 3, message: 'Business name must be at least 3 characters' }
              ]}
            >
              <Input
                prefix={<ShopOutlined />}
                placeholder="Enter your business name"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Owner Name"
              name="ownerName"
              rules={[
                { required: true, message: 'Please enter owner name' },
                { min: 2, message: 'Owner name must be at least 2 characters' }
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Enter owner name"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Business Address"
              name="businessAddress"
              rules={[
                { required: true, message: 'Please enter your business address' },
                { min: 10, message: 'Please enter a complete address' }
              ]}
            >
              <Input.TextArea
                rows={3}
                placeholder="Enter complete business address with pincode"
                showCount
                maxLength={200}
              />
            </Form.Item>
          </div>

          {/* Contact Information Section */}
          <div className="form-section">
            <Title level={4} className="section-title">
              <PhoneOutlined /> Contact Information
            </Title>
            <Divider />

            <Form.Item
              label="Contact Number"
              name="contactNumber"
              rules={[
                { required: true, message: 'Please enter your contact number' },
                { pattern: /^[+]?[0-9]{10,15}$/, message: 'Please enter a valid phone number' }
              ]}
            >
              <Input
                prefix={<PhoneOutlined />}
                placeholder="+91 XXXXX XXXXX"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Email Address"
              name="email"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email address' }
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="your.email@example.com"
                size="large"
              />
            </Form.Item>
          </div>

          {/* Bank Details Section */}
          <div className="form-section">
            <Title level={4} className="section-title">
              <BankOutlined /> Bank Account Details
            </Title>
            <Text type="secondary" className="section-subtitle">
              Your earnings will be transferred to this account
            </Text>
            <Divider />

            <Form.Item
              label="Account Holder Name"
              name="accountHolderName"
              rules={[
                { required: true, message: 'Please enter account holder name' },
                { min: 2, message: 'Name must be at least 2 characters' }
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Enter account holder name"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Bank Account Number"
              name="bankAccountNumber"
              rules={[
                { required: true, message: 'Please enter your bank account number' },
                { pattern: /^[0-9]{9,18}$/, message: 'Please enter a valid account number' }
              ]}
            >
              <Input
                prefix={<BankOutlined />}
                placeholder="Enter bank account number"
                size="large"
                maxLength={18}
              />
            </Form.Item>

            <Form.Item
              label="IFSC Code"
              name="ifscCode"
              rules={[
                { required: true, message: 'Please enter IFSC code' },
                { pattern: /^[A-Z]{4}0[A-Z0-9]{6}$/, message: 'Please enter a valid IFSC code' }
              ]}
            >
              <Input
                prefix={<BankOutlined />}
                placeholder="Enter IFSC code (e.g., SBIN0001234)"
                size="large"
                maxLength={11}
                style={{ textTransform: 'uppercase' }}
              />
            </Form.Item>
          </div>

          {/* Submit Button */}
          <Form.Item className="form-actions">
            <Space size="middle">
              <Button
                type="default"
                size="large"
                onClick={() => form.resetFields()}
              >
                Reset
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                icon={<SaveOutlined />}
                loading={loading}
                className="save-button"
              >
                Save Changes
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      {/* Help Card */}
      <Card className="help-card">
        <Title level={5}>Need Help?</Title>
        <Text>
          If you need assistance updating your profile or have questions about your account,
          please contact our support team at <Text strong>support@sheleads.com</Text> or call{' '}
          <Text strong>1800-XXX-XXXX</Text>
        </Text>
      </Card>
    </div>
  );
};

export default SellerProfile;
