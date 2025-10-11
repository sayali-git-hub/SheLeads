import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  InputNumber, 
  Select, 
  Upload, 
  Switch, 
  Space, 
  message, 
  Popconfirm,
  Image,
  Tag,
  Typography,
  Card
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined,
  UploadOutlined,
  PictureOutlined
} from '@ant-design/icons';
import './ProductManagement.css';

const { TextArea } = Input;
const { Option } = Select;
const { Title } = Typography;

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data - Replace with actual API call
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      const mockProducts = [
        {
          id: 1,
          name: 'Handmade Cotton Saree',
          category: 'Clothing',
          price: 2500,
          stock: 15,
          status: true,
          image: 'https://via.placeholder.com/100',
          description: 'Beautiful handwoven cotton saree'
        },
        {
          id: 2,
          name: 'Bamboo Basket Set',
          category: 'Home Decor',
          price: 850,
          stock: 5,
          status: true,
          image: 'https://via.placeholder.com/100',
          description: 'Eco-friendly bamboo baskets'
        },
        {
          id: 3,
          name: 'Terracotta Pottery',
          category: 'Home Decor',
          price: 1200,
          stock: 0,
          status: false,
          image: 'https://via.placeholder.com/100',
          description: 'Handcrafted terracotta pots'
        },
      ];
      setProducts(mockProducts);
    } catch (error) {
      message.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    form.resetFields();
    setFileList([]);
    setModalVisible(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    form.setFieldsValue({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      description: product.description,
      status: product.status,
    });
    // Set existing images
    if (product.image) {
      setFileList([{
        uid: '-1',
        name: 'image.png',
        status: 'done',
        url: product.image,
      }]);
    }
    setModalVisible(true);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      // TODO: Replace with actual API call
      setProducts(products.filter(p => p.id !== productId));
      message.success('Product deleted successfully');
    } catch (error) {
      message.error('Failed to delete product');
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      
      // TODO: Replace with actual API call
      const productData = {
        ...values,
        image: fileList[0]?.url || 'https://via.placeholder.com/100',
        id: editingProduct ? editingProduct.id : Date.now(),
      };

      if (editingProduct) {
        // Update existing product
        setProducts(products.map(p => 
          p.id === editingProduct.id ? productData : p
        ));
        message.success('Product updated successfully');
      } else {
        // Add new product
        setProducts([...products, productData]);
        message.success('Product added successfully');
      }

      setModalVisible(false);
      form.resetFields();
      setFileList([]);
    } catch (error) {
      message.error('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  // Filter products based on search and status
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'available' && product.status) ||
                         (filterStatus === 'unavailable' && !product.status);
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      width: 100,
      render: (image) => (
        <Image
          src={image}
          alt="Product"
          width={60}
          height={60}
          style={{ objectFit: 'cover', borderRadius: '8px' }}
          fallback="https://via.placeholder.com/60"
        />
      ),
    },
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      filters: [
        { text: 'Clothing', value: 'Clothing' },
        { text: 'Home Decor', value: 'Home Decor' },
        { text: 'Accessories', value: 'Accessories' },
        { text: 'Handicrafts', value: 'Handicrafts' },
      ],
      onFilter: (value, record) => record.category === value,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      sorter: (a, b) => a.price - b.price,
      render: (price) => `₹${price.toLocaleString('en-IN')}`,
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      sorter: (a, b) => a.stock - b.stock,
      render: (stock) => (
        <Tag color={stock === 0 ? 'red' : stock < 10 ? 'orange' : 'green'}>
          {stock} {stock === 1 ? 'unit' : 'units'}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status ? 'success' : 'default'}>
          {status ? 'Available' : 'Unavailable'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEditProduct(record)}
            size="small"
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this product?"
            onConfirm={() => handleDeleteProduct(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="product-management">
      <Card className="product-header-card">
        <div className="product-header">
          <Title level={2} className="page-title">Product Management</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddProduct}
            size="large"
            className="add-product-btn"
          >
            Add New Product
          </Button>
        </div>

        <div className="product-filters">
          <Input
            placeholder="Search products by name or category..."
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
            <Option value="all">All Products</Option>
            <Option value="available">Available</Option>
            <Option value="unavailable">Unavailable</Option>
          </Select>
        </div>
      </Card>

      <Card className="products-table-card">
        <Table
          columns={columns}
          dataSource={filteredProducts}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} products`,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      <Modal
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setFileList([]);
        }}
        footer={null}
        width={700}
        className="product-modal"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ status: true }}
        >
          <Form.Item
            label="Product Images"
            name="images"
            extra="Upload up to 5 images. First image will be the main product image."
          >
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={handleUploadChange}
              beforeUpload={() => false}
              maxCount={5}
            >
              {fileList.length >= 5 ? null : uploadButton}
            </Upload>
          </Form.Item>

          <Form.Item
            label="Product Name"
            name="name"
            rules={[
              { required: true, message: 'Please enter product name' },
              { min: 3, message: 'Product name must be at least 3 characters' }
            ]}
          >
            <Input placeholder="Enter product name" size="large" />
          </Form.Item>

          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: 'Please select a category' }]}
          >
            <Select placeholder="Select category" size="large">
              <Option value="Clothing">Clothing</Option>
              <Option value="Home Decor">Home Decor</Option>
              <Option value="Accessories">Accessories</Option>
              <Option value="Handicrafts">Handicrafts</Option>
              <Option value="Jewelry">Jewelry</Option>
              <Option value="Food Products">Food Products</Option>
              <Option value="Beauty Products">Beauty Products</Option>
              <Option value="Others">Others</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[
              { required: true, message: 'Please enter product description' },
              { min: 10, message: 'Description must be at least 10 characters' }
            ]}
          >
            <TextArea
              rows={4}
              placeholder="Describe your product in detail..."
              showCount
              maxLength={500}
            />
          </Form.Item>

          <Space style={{ width: '100%' }} size="large">
            <Form.Item
              label="Price (₹)"
              name="price"
              rules={[
                { required: true, message: 'Please enter price' },
                { type: 'number', min: 1, message: 'Price must be greater than 0' }
              ]}
              style={{ flex: 1, minWidth: '200px' }}
            >
              <InputNumber
                placeholder="0"
                style={{ width: '100%' }}
                size="large"
                formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/₹\s?|(,*)/g, '')}
              />
            </Form.Item>

            <Form.Item
              label="Stock Quantity"
              name="stock"
              rules={[
                { required: true, message: 'Please enter stock quantity' },
                { type: 'number', min: 0, message: 'Stock cannot be negative' }
              ]}
              style={{ flex: 1, minWidth: '200px' }}
            >
              <InputNumber
                placeholder="0"
                style={{ width: '100%' }}
                size="large"
                min={0}
              />
            </Form.Item>
          </Space>

          <Form.Item
            label="Product Status"
            name="status"
            valuePropName="checked"
          >
            <Switch
              checkedChildren="Available"
              unCheckedChildren="Unavailable"
            />
          </Form.Item>

          <Form.Item className="form-actions">
            <Space>
              <Button onClick={() => {
                setModalVisible(false);
                form.resetFields();
                setFileList([]);
              }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingProduct ? 'Update Product' : 'Add Product'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductManagement;
