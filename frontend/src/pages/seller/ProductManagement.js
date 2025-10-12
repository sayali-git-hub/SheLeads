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
  Card,
  Alert
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined
} from '@ant-design/icons';
import { 
  getSellerProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '../../services/sellerApi';
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
  const [descriptionCount, setDescriptionCount] = useState(0);
  const [productNameCount, setProductNameCount] = useState(0);
  const [submitError, setSubmitError] = useState(null);

  // Mock data - Replace with actual API call
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await getSellerProducts();
      const productsData = response.data || [];
      
      // Transform products for UI
      const transformedProducts = productsData.map(product => ({
        id: product._id,
        name: product.name,
        category: product.category,
        price: product.price,
        stock: product.stock,
        status: product.isActive,
        image: product.images && product.images.length > 0 ? product.images[0].url : 'https://via.placeholder.com/100',
        images: product.images || [],
        description: product.description
      }));
      
      setProducts(transformedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      message.error('Failed to fetch products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    form.resetFields();
    setFileList([]);
    setDescriptionCount(0);
    setProductNameCount(0);
    setSubmitError(null);
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
    setProductNameCount(product.name?.length || 0);
    setDescriptionCount(product.description?.length || 0);
    setSubmitError(null);
    // Set existing images
    if (product.images && product.images.length > 0) {
      setFileList(product.images.map((img, idx) => ({
        uid: `-${idx}`,
        name: `image-${idx}.png`,
        status: 'done',
        url: img,
      })));
    } else if (product.image) {
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
      setLoading(true);
      await deleteProduct(productId);
      setProducts(products.filter(p => p.id !== productId));
      message.success('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      message.error('Failed to delete product');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      setSubmitError(null);
      
      // Validate at least one image is uploaded
      if (fileList.length === 0) {
        setSubmitError('Please upload at least 1 product image');
        setLoading(false);
        return;
      }
      
      // Prepare images array
      const images = fileList.map(file => ({
        url: file.url || file.thumbUrl || 'https://via.placeholder.com/100',
        altText: values.name || 'Product image'
      }));
      
      const productData = {
        name: values.name,
        description: values.description,
        price: values.price,
        category: values.category,
        stock: values.stock,
        images: images,
        isActive: values.status !== undefined ? values.status : true
      };

      if (editingProduct) {
        // Update existing product
        await updateProduct(editingProduct.id, productData);
        message.success('Product updated successfully!');
      } else {
        // Add new product
        await createProduct(productData);
        message.success('Product added successfully!');
      }
      
      setTimeout(async () => {
        setModalVisible(false);
        form.resetFields();
        setFileList([]);
        setDescriptionCount(0);
        setProductNameCount(0);
        await fetchProducts(); // Refresh products list
      }, 2000);
    } catch (error) {
      console.error('Error saving product:', error);
      setSubmitError(error.response?.data?.message || 'Failed to add product. Please try again.');
      message.error('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    setSubmitError(null); // Clear error when images are uploaded
  };

  const beforeUpload = (file) => {
    const isValidType = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
    if (!isValidType) {
      message.error('You can only upload JPG, PNG, or JPEG files!');
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Image must be smaller than 5MB!');
    }
    // Always return false to prevent auto upload and handle manually
    return false;
  };

  const handleRemoveImage = (file) => {
    const newFileList = fileList.filter(item => item.uid !== file.uid);
    setFileList(newFileList);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload Images</div>
      <div style={{ fontSize: '12px', color: '#999', marginTop: 4 }}>(Max 3)</div>
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
          setDescriptionCount(0);
          setProductNameCount(0);
          setSubmitError(null);
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
          {/* Product Images Section */}
          <div className="form-section">
            <h3 className="section-title">A. Product Images</h3>
            <Form.Item
              label={<span>Upload Images (Max 3) <span style={{ color: 'red' }}>*</span></span>}
              validateStatus={submitError && fileList.length === 0 ? 'error' : ''}
              help={submitError && fileList.length === 0 ? submitError : 'Supported formats: JPG, PNG, JPEG. Max file size: 5MB per image'}
            >
              <Upload
                listType="picture-card"
                fileList={fileList}
                onChange={handleUploadChange}
                beforeUpload={beforeUpload}
                onRemove={handleRemoveImage}
                maxCount={3}
                accept=".jpg,.jpeg,.png"
              >
                {fileList.length >= 3 ? null : uploadButton}
              </Upload>
            </Form.Item>
          </div>

          {/* Basic Details Section */}
          <div className="form-section">
            <h3 className="section-title">B. Basic Details</h3>
            
            <Form.Item
              label={<span>Product Name <span style={{ color: 'red' }}>*</span></span>}
              name="name"
              rules={[
                { required: true, message: 'Product name is required' },
                { max: 100, message: 'Product name cannot exceed 100 characters' }
              ]}
            >
              <Input 
                placeholder="Enter product name" 
                size="large"
                maxLength={100}
                onChange={(e) => setProductNameCount(e.target.value.length)}
              />
            </Form.Item>
            <div style={{ textAlign: 'right', marginTop: '-16px', marginBottom: '16px', fontSize: '12px', color: '#999' }}>
              {productNameCount}/100 characters
            </div>

            <Form.Item
              label="Category"
              name="category"
              rules={[{ required: true, message: 'Please select a category' }]}
            >
              <Select placeholder="Select category" size="large">
                <Option value="clothing">Clothing</Option>
                <Option value="handmade">Handicrafts</Option>
                <Option value="food">Food Items</Option>
                <Option value="beauty">Beauty Products</Option>
                <Option value="home">Home Decor</Option>
                <Option value="accessories">Accessories</Option>
                <Option value="other">Other</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label={<span>Description <span style={{ color: 'red' }}>*</span></span>}
              name="description"
              rules={[
                { required: true, message: 'Description is required' },
                { max: 500, message: 'Description cannot exceed 500 characters' }
              ]}
            >
              <TextArea
                rows={4}
                placeholder="Describe your product in detail..."
                maxLength={500}
                onChange={(e) => setDescriptionCount(e.target.value.length)}
              />
            </Form.Item>
            <div style={{ textAlign: 'right', marginTop: '-16px', marginBottom: '16px', fontSize: '12px', color: '#999' }}>
              {descriptionCount}/500 characters
            </div>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Form.Item
                label={<span>Price (₹) <span style={{ color: 'red' }}>*</span></span>}
                name="price"
                rules={[
                  { required: true, message: 'Please enter a valid price' },
                  { type: 'number', min: 1, message: 'Please enter a valid price' }
                ]}
                style={{ flex: 1, minWidth: '200px' }}
              >
                <InputNumber
                  placeholder="0.00"
                  style={{ width: '100%' }}
                  size="large"
                  min={1}
                  step={0.01}
                  precision={2}
                  formatter={value => value ? `₹ ${value}` : ''}
                  parser={value => value.replace(/₹\s?/g, '')}
                />
              </Form.Item>

              <Form.Item
                label={<span>Stock Quantity <span style={{ color: 'red' }}>*</span></span>}
                name="stock"
                rules={[
                  { required: true, message: 'Please enter stock quantity' },
                  { type: 'number', min: 0, message: 'Please enter stock quantity' }
                ]}
                style={{ flex: 1, minWidth: '200px' }}
              >
                <InputNumber
                  placeholder="0"
                  style={{ width: '100%' }}
                  size="large"
                  min={0}
                  precision={0}
                />
              </Form.Item>
            </div>
          </div>

          {/* Product Status Section */}
          <div className="form-section">
            <h3 className="section-title">C. Product Status</h3>
            <Form.Item
              label="Available for Sale"
              name="status"
              valuePropName="checked"
            >
              <Switch
                checkedChildren="Available"
                unCheckedChildren="Unavailable"
              />
            </Form.Item>
          </div>

          {/* Error Message */}
          {submitError && (
            <Alert
              message={submitError}
              type="error"
              showIcon
              style={{ marginBottom: '16px' }}
            />
          )}

          {/* Form Actions */}
          <Form.Item className="form-actions">
            <Space>
              <Button 
                size="large"
                onClick={() => {
                  setModalVisible(false);
                  form.resetFields();
                  setFileList([]);
                  setDescriptionCount(0);
                  setProductNameCount(0);
                  setSubmitError(null);
                }}>
                Cancel
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                size="large"
                disabled={loading}
              >
                {loading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Save Product')}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductManagement;
