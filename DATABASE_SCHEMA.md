# SheLeads Database Schema Documentation

## Overview
This document describes the complete database schema for the SheLeads e-commerce platform, including the new Seller Dashboard functionality.

---

## Collections

### 1. Users Collection
**Model:** `backend/models/User.js`

```javascript
{
  _id: ObjectId,
  name: String (required, max 50 chars),
  email: String (required, unique, validated),
  password: String (required, hashed, min 6 chars),
  role: String (enum: ['user', 'seller', 'admin'], default: 'user'),
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  profileImage: String (default: ''),
  bio: String (max 500 chars),
  isVerified: Boolean (default: false),
  createdAt: Date (default: Date.now),
  updatedAt: Date (auto)
}
```

**Indexes:**
- `email` (unique)

**Methods:**
- `matchPassword(enteredPassword)` - Compare passwords
- `getSignedJwtToken()` - Generate JWT token

**Hooks:**
- Pre-save: Hash password if modified

---

### 2. Sellers Collection
**Model:** `backend/models/Seller.js`

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User', required, unique),
  businessName: String (required, max 100 chars),
  businessAddress: String (required, max 200 chars),
  bankDetails: {
    accountHolderName: String (required),
    accountNumber: String (required),
    ifscCode: String (required, validated format: XXXX0XXXXXX)
  },
  statistics: {
    totalSales: Number (default: 0),
    totalOrders: Number (default: 0),
    totalProducts: Number (default: 0)
  },
  isApproved: Boolean (default: false),
  isActive: Boolean (default: true),
  createdAt: Date (default: Date.now),
  updatedAt: Date (auto)
}
```

**Indexes:**
- `user` (unique)
- `isApproved, isActive` (compound)

**Relationships:**
- One-to-One with Users (user field)

---

### 3. Products Collection
**Model:** `backend/models/Product.js`

```javascript
{
  _id: ObjectId,
  name: String (required, max 100 chars),
  description: String (required, max 1000 chars),
  price: Number (required, min: 0),
  category: String (required, enum: [
    'clothing', 'accessories', 'handmade', 
    'food', 'home', 'beauty', 'other'
  ]),
  images: [{
    url: String (required),
    altText: String (default: '')
  }],
  seller: ObjectId (ref: 'User', required),
  stock: Number (required, min: 0, default: 0),
  tags: [String],
  ratings: {
    average: Number (default: 0, min: 0, max: 5),
    count: Number (default: 0)
  },
  reviews: [{
    user: ObjectId (ref: 'User', required),
    rating: Number (required, min: 1, max: 5),
    comment: String (max 500 chars),
    createdAt: Date (default: Date.now)
  }],
  isActive: Boolean (default: true),
  featured: Boolean (default: false),
  createdAt: Date (default: Date.now),
  updatedAt: Date (auto)
}
```

**Indexes:**
- `name, description, tags` (text search)
- `category, price` (compound)
- `seller`

**Hooks:**
- Pre-save: Calculate average rating from reviews

**Relationships:**
- Many-to-One with Users (seller field)
- Many-to-Many with Orders (through items)

---

### 4. Orders Collection
**Model:** `backend/models/Order.js`

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User', required),
  items: [{
    product: ObjectId (ref: 'Product', required),
    quantity: Number (required, min: 1),
    price: Number (required, min: 0),
    seller: ObjectId (ref: 'User', required)
  }],
  shippingAddress: {
    street: String (required),
    city: String (required),
    state: String (required),
    zipCode: String (required),
    country: String (required)
  },
  paymentMethod: String (required, enum: [
    'stripe', 'paypal', 'cash_on_delivery'
  ]),
  paymentResult: {
    id: String,
    status: String,
    update_time: String,
    email_address: String
  },
  itemsPrice: Number (required, default: 0.0),
  taxPrice: Number (required, default: 0.0),
  shippingPrice: Number (required, default: 0.0),
  totalPrice: Number (required, default: 0.0),
  status: String (required, enum: [
    'pending', 'processing', 'shipped', 
    'delivered', 'cancelled'
  ], default: 'pending'),
  deliveredAt: Date,
  trackingNumber: String,
  notes: String (max 500 chars),
  createdAt: Date (default: Date.now),
  updatedAt: Date (auto)
}
```

**Indexes:**
- `user, createdAt` (compound, descending on createdAt)
- `items.seller`
- `status`

**Hooks:**
- Pre-save: Calculate itemsPrice and totalPrice

**Relationships:**
- Many-to-One with Users (user field)
- Many-to-Many with Products (through items)
- Many-to-One with Users (seller in items)

---

### 5. Notifications Collection
**Model:** `backend/models/Notification.js`

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User', required),
  type: String (required, enum: [
    'order', 'stock', 'payment', 'system', 'other'
  ]),
  title: String (required, max 100 chars),
  message: String (required, max 500 chars),
  relatedId: ObjectId (refPath: 'relatedModel'),
  relatedModel: String (enum: ['Order', 'Product', 'User']),
  isRead: Boolean (default: false),
  createdAt: Date (default: Date.now),
  updatedAt: Date (auto)
}
```

**Indexes:**
- `user, isRead, createdAt` (compound, descending on createdAt)
- `createdAt` (descending)

**Relationships:**
- Many-to-One with Users (user field)
- Polymorphic relationship (relatedId + relatedModel)

---

## Relationships Diagram

```
Users (1) -------- (1) Sellers
  |                      |
  | (1)                  | (1)
  |                      |
  | (Many)               | (Many)
  |                      |
Orders                Products
  |                      |
  |                      |
  +------- (Many) -------+
           (items)

Users (1) -------- (Many) Notifications

Products (1) ------ (Many) Reviews (embedded)
```

---

## Data Flow Examples

### 1. Creating a New Product
```javascript
// Step 1: Seller creates product
POST /api/seller/products
{
  name: "Handmade Saree",
  description: "Beautiful cotton saree",
  price: 2500,
  category: "clothing",
  stock: 10,
  images: [{ url: "...", altText: "..." }]
}

// Step 2: Product saved with seller reference
Product {
  _id: "prod123",
  name: "Handmade Saree",
  seller: "user456", // seller's user ID
  ...
}

// Step 3: Update seller statistics
Seller.statistics.totalProducts += 1
```

### 2. Processing an Order
```javascript
// Step 1: Customer places order
POST /api/orders
{
  items: [
    { product: "prod123", quantity: 2, price: 2500 }
  ],
  shippingAddress: { ... }
}

// Step 2: Order created with seller reference in items
Order {
  _id: "ord789",
  user: "customer123",
  items: [{
    product: "prod123",
    seller: "user456", // seller's user ID
    quantity: 2,
    price: 2500
  }],
  status: "pending"
}

// Step 3: Create notification for seller
Notification {
  user: "user456", // seller
  type: "order",
  title: "New Order Received",
  message: "Order #ord789 received",
  relatedId: "ord789",
  relatedModel: "Order"
}

// Step 4: Update product stock
Product.stock -= 2

// Step 5: Update seller statistics
Seller.statistics.totalOrders += 1
Seller.statistics.totalSales += 5000
```

### 3. Updating Order Status
```javascript
// Step 1: Seller updates order status
PUT /api/seller/orders/ord789/status
{ status: "shipped" }

// Step 2: Order status updated
Order.status = "shipped"

// Step 3: Create notification for customer
Notification {
  user: "customer123",
  type: "order",
  title: "Order Shipped",
  message: "Your order has been shipped",
  relatedId: "ord789",
  relatedModel: "Order"
}
```

---

## Query Examples

### Get Seller Dashboard Statistics
```javascript
// Total sales
const orders = await Order.find({ 'items.seller': sellerId });
const totalSales = orders.reduce((sum, order) => {
  const sellerItems = order.items.filter(
    item => item.seller.toString() === sellerId
  );
  return sum + sellerItems.reduce(
    (itemSum, item) => itemSum + (item.price * item.quantity), 0
  );
}, 0);

// Pending orders
const pendingOrders = orders.filter(
  order => order.status === 'pending' || order.status === 'processing'
).length;

// Low stock products
const lowStockProducts = await Product.find({
  seller: sellerId,
  stock: { $lt: 10, $gt: 0 }
}).countDocuments();
```

### Get Top Selling Products
```javascript
// Aggregate sales by product
const productSales = {};
orders.forEach(order => {
  order.items.forEach(item => {
    if (item.seller.toString() === sellerId) {
      const productId = item.product.toString();
      productSales[productId] = (productSales[productId] || 0) + item.quantity;
    }
  });
});

// Sort and get top 3
const topProducts = Object.entries(productSales)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 3);
```

### Get Seller's Orders
```javascript
const orders = await Order.find({ 'items.seller': sellerId })
  .populate('user', 'name email phone')
  .populate('items.product', 'name images')
  .sort({ createdAt: -1 });

// Filter items to only show seller's products
const filteredOrders = orders.map(order => {
  const orderObj = order.toObject();
  orderObj.items = orderObj.items.filter(
    item => item.seller.toString() === sellerId
  );
  return orderObj;
});
```

---

## Validation Rules

### User
- Email: Valid email format, unique
- Password: Min 6 characters, hashed
- Role: Must be 'user', 'seller', or 'admin'

### Seller
- IFSC Code: Format XXXX0XXXXXX (4 letters, 0, 6 alphanumeric)
- Account Number: 9-18 digits
- Business Name: Max 100 characters

### Product
- Price: Must be >= 0
- Stock: Must be >= 0
- Category: Must be one of predefined categories
- Images: At least 1 image required

### Order
- Quantity: Must be >= 1
- Status: Must be one of predefined statuses
- Payment Method: Must be one of predefined methods

### Notification
- Type: Must be one of predefined types
- Title: Max 100 characters
- Message: Max 500 characters

---

## Security Considerations

1. **Password Hashing:** All passwords hashed with bcrypt (10 salt rounds)
2. **JWT Tokens:** Secure token-based authentication
3. **Role-Based Access:** Sellers can only access their own data
4. **Input Validation:** All inputs validated on backend
5. **Indexes:** Proper indexes for performance and security
6. **Sensitive Data:** Bank details stored securely (consider encryption)

---

## Performance Optimization

1. **Indexes:** All frequently queried fields indexed
2. **Pagination:** Implement pagination for large datasets
3. **Caching:** Consider Redis for frequently accessed data
4. **Aggregation:** Use MongoDB aggregation for complex queries
5. **Lean Queries:** Use `.lean()` for read-only operations

---

## Backup & Maintenance

1. **Regular Backups:** Daily automated backups
2. **Data Retention:** Keep deleted records for 90 days
3. **Cleanup Jobs:** Remove old notifications (> 30 days)
4. **Index Maintenance:** Rebuild indexes monthly
5. **Monitoring:** Track query performance and slow queries

---

**Last Updated:** October 11, 2025
**Version:** 1.0.0
