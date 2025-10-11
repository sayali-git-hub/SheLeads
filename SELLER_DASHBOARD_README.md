# SheLeads Seller Dashboard Documentation

## Overview
Complete Seller Dashboard system for SheLeads e-commerce platform, enabling sellers to manage their products, orders, profile, and view analytics.

## Features Implemented

### 1. Seller Dashboard (Main Landing Page)
**Location:** `frontend/src/pages/seller/SellerDashboard.js`

**Features:**
- **Statistics Cards:**
  - Total Sales Amount (₹)
  - Pending Orders Count
  - Completed Orders Count
  - Low Stock Alerts Count
- **Sales Chart:** Interactive line chart showing last 30 days sales data
- **Top Selling Products:** List of top 3 products with sales progress bars
- **Recent Activity:** Timeline of recent events (orders, stock alerts)
- **Quick Actions:** Buttons to add products and view orders

**API Endpoint:** `GET /api/seller/dashboard`

---

### 2. Product Management Page
**Location:** `frontend/src/pages/seller/ProductManagement.js`

**Features:**
- **Product Listing Table:**
  - Columns: Image, Product Name, Category, Price, Stock, Status, Actions
  - Sortable columns
  - Filter by category
  - Search functionality
  - Pagination
- **Add/Edit Product Modal:**
  - Multiple image upload (up to 5 images)
  - Product name
  - Category dropdown (Clothing, Home Decor, Accessories, etc.)
  - Description (textarea with character count)
  - Price (₹) with Indian number formatting
  - Stock quantity
  - Available/Unavailable toggle
- **Delete Product:** Confirmation popup before deletion
- **Form Validation:** All fields validated with error messages

**API Endpoints:**
- `GET /api/seller/products` - Get all products
- `POST /api/seller/products` - Create new product
- `PUT /api/seller/products/:id` - Update product
- `DELETE /api/seller/products/:id` - Delete product

---

### 3. Order Management Page
**Location:** `frontend/src/pages/seller/OrderManagement.js`

**Features:**
- **Orders Table:**
  - Columns: Order ID, Customer Name, Date, Items Count, Amount, Status, Actions
  - Filter by status (All/Pending/Processing/Shipped/Delivered)
  - Search by Order ID or Customer Name
  - Sortable columns
- **Order Status Management:**
  - Dropdown to change status: Pending → Processing → Shipped → Delivered
  - Real-time status updates
- **Order Details Modal:**
  - Order status timeline (visual progress)
  - Customer information (name, phone, address)
  - Items ordered with images and quantities
  - Total amount calculation
  - Payment status
  - Order date and time
- **Statistics:** Total orders, pending count, completed count

**API Endpoints:**
- `GET /api/seller/orders` - Get all orders for seller
- `PUT /api/seller/orders/:id/status` - Update order status

---

### 4. Seller Profile Page
**Location:** `frontend/src/pages/seller/SellerProfile.js`

**Features:**
- **Business Information Section:**
  - Business Name
  - Owner Name
  - Business Address (textarea)
- **Contact Information Section:**
  - Contact Number (with validation)
  - Email Address (with validation)
- **Bank Account Details Section:**
  - Account Holder Name
  - Bank Account Number (9-18 digits)
  - IFSC Code (format validation)
- **Form Validation:** All fields validated with proper error messages
- **Success/Error Messages:** Toast notifications after actions
- **Reset Button:** Reset form to original values

**API Endpoints:**
- `GET /api/seller/profile` - Get seller profile
- `PUT /api/seller/profile` - Update seller profile

---

### 5. Notifications Section
**Location:** `frontend/src/pages/seller/Notifications.js`

**Features:**
- **Notification List:**
  - Icon-based notification types (order, stock, system)
  - Title and message
  - Timestamp (relative time)
  - Read/Unread status indicator
- **Actions:**
  - Mark individual notification as read
  - Mark all as read
  - Delete individual notification
  - Clear all notifications
- **Unread Count Badge:** Shows number of unread notifications
- **Empty State:** Friendly message when no notifications

**API Endpoints:**
- `GET /api/seller/notifications` - Get all notifications
- `PUT /api/seller/notifications/:id/read` - Mark as read
- `PUT /api/seller/notifications/read-all` - Mark all as read
- `DELETE /api/seller/notifications/:id` - Delete notification
- `DELETE /api/seller/notifications` - Clear all notifications

---

### 6. Seller Layout (Navigation)
**Location:** `frontend/src/components/SellerLayout.js`

**Features:**
- **Sidebar Navigation:**
  - Dashboard
  - Products
  - Orders
  - Profile
  - Notifications (with badge)
- **Header:**
  - Menu toggle button (for mobile)
  - Notification bell icon with badge
  - User profile dropdown
- **Responsive Design:** Collapsible sidebar for mobile devices
- **User Menu:**
  - My Profile
  - Settings
  - Logout

---

## Database Models

### Seller Model
**Location:** `backend/models/Seller.js`

```javascript
{
  user: ObjectId (ref: User),
  businessName: String,
  businessAddress: String,
  bankDetails: {
    accountHolderName: String,
    accountNumber: String,
    ifscCode: String
  },
  statistics: {
    totalSales: Number,
    totalOrders: Number,
    totalProducts: Number
  },
  isApproved: Boolean,
  isActive: Boolean,
  createdAt: Date
}
```

### Notification Model
**Location:** `backend/models/Notification.js`

```javascript
{
  user: ObjectId (ref: User),
  type: String (enum: order, stock, payment, system, other),
  title: String,
  message: String,
  relatedId: ObjectId,
  relatedModel: String,
  isRead: Boolean,
  createdAt: Date
}
```

### Product Model (Extended)
**Location:** `backend/models/Product.js`
- Already exists with seller reference
- Fields: name, description, price, category, images, seller, stock, ratings, reviews, isActive

### Order Model (Extended)
**Location:** `backend/models/Order.js`
- Already exists with seller reference in items
- Fields: user, items (with seller), shippingAddress, paymentMethod, status, totalPrice

---

## Installation & Setup

### 1. Install Dependencies

**Frontend:**
```bash
cd frontend
npm install
```

**New Dependencies Added:**
- `antd@^5.11.0` - UI component library
- `chart.js@^4.4.0` - Chart library
- `react-chartjs-2@^5.2.0` - React wrapper for Chart.js

**Backend:**
```bash
cd backend
npm install
```
(No new dependencies required - all existing)

### 2. Environment Variables
Ensure your `.env` file has:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
PORT=5001
```

### 3. Run the Application

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm start
```

---

## Routing Configuration

### Frontend Routes
**Location:** `frontend/src/App.js`

```javascript
// Seller Routes (Protected)
/seller/dashboard          - Seller Dashboard
/seller/products           - Product Management
/seller/orders             - Order Management
/seller/profile            - Seller Profile
/seller/notifications      - Notifications
```

### Backend API Routes
**Location:** `backend/routes/seller.js`

```javascript
GET    /api/seller/dashboard                    - Get dashboard stats
GET    /api/seller/profile                      - Get seller profile
PUT    /api/seller/profile                      - Update seller profile
GET    /api/seller/products                     - Get all products
POST   /api/seller/products                     - Create product
PUT    /api/seller/products/:id                 - Update product
DELETE /api/seller/products/:id                 - Delete product
GET    /api/seller/orders                       - Get all orders
PUT    /api/seller/orders/:id/status            - Update order status
GET    /api/seller/notifications                - Get notifications
PUT    /api/seller/notifications/:id/read       - Mark as read
PUT    /api/seller/notifications/read-all       - Mark all as read
DELETE /api/seller/notifications/:id            - Delete notification
DELETE /api/seller/notifications                - Clear all notifications
```

---

## Design System

### Color Scheme
- **Primary:** #FF6B6B (Warm red/pink - empowering)
- **Success:** #66BB6A (Green)
- **Warning:** #FFA726 (Orange)
- **Info:** #2196F3 (Blue)
- **Background:** #f5f7fa (Light gray)
- **Text Primary:** #2d3436 (Dark gray)
- **Text Secondary:** #636e72 (Medium gray)

### Typography
- **Headings:** System fonts, bold
- **Body:** System fonts, regular
- **Font Sizes:** 12px - 24px

### Components
- **Cards:** Rounded corners (12px), subtle shadows
- **Buttons:** Large (44px height), clear labels, icons
- **Forms:** Large inputs, clear validation messages
- **Tables:** Sortable, filterable, paginated
- **Modals:** Centered, responsive

---

## Mobile Responsiveness

All pages are fully responsive with:
- **Desktop (>992px):** Full sidebar, multi-column layouts
- **Tablet (768px-992px):** Collapsed sidebar, adjusted layouts
- **Mobile (<768px):** Hidden sidebar (toggle), single column, stacked elements

---

## Security Features

1. **Authentication:** JWT-based authentication required for all seller routes
2. **Authorization:** Role-based access control (seller/admin only)
3. **Ownership Verification:** Sellers can only modify their own products/orders
4. **Input Validation:** All forms validated on frontend and backend
5. **SQL Injection Prevention:** MongoDB with Mongoose (parameterized queries)
6. **XSS Prevention:** React automatically escapes content

---

## Testing the Application

### 1. Create a Seller Account
- Register with role: 'seller'
- Or update existing user role to 'seller' in database

### 2. Access Seller Dashboard
- Navigate to: `http://localhost:3000/seller/dashboard`
- Login with seller credentials

### 3. Test Features
- **Dashboard:** View statistics and charts
- **Products:** Add, edit, delete products
- **Orders:** View orders, update status
- **Profile:** Update business and bank details
- **Notifications:** View and manage notifications

---

## Future Enhancements

1. **Analytics:**
   - Revenue trends
   - Customer demographics
   - Product performance metrics

2. **Inventory Management:**
   - Bulk upload products (CSV)
   - Stock alerts automation
   - Reorder suggestions

3. **Communication:**
   - Chat with customers
   - Email notifications
   - SMS alerts

4. **Reports:**
   - Sales reports (PDF/Excel)
   - Tax reports
   - Inventory reports

5. **Multi-language Support:**
   - Hindi, Tamil, Telugu, etc.

6. **Payment Integration:**
   - Direct bank transfers
   - Payment tracking
   - Invoice generation

---

## Troubleshooting

### Issue: Seller routes not working
**Solution:** Ensure user role is set to 'seller' in database

### Issue: Charts not displaying
**Solution:** Run `npm install chart.js react-chartjs-2`

### Issue: Ant Design styles not loading
**Solution:** Ensure `antd` is installed and imported properly

### Issue: API calls failing
**Solution:** Check backend is running on port 5001 and CORS is enabled

---

## Support

For issues or questions:
- Email: support@sheleads.com
- Documentation: [Link to docs]
- GitHub Issues: [Link to repo]

---

## License
MIT License - SheLeads Team

---

## Contributors
- Frontend: React, Ant Design, Chart.js
- Backend: Node.js, Express, MongoDB
- Authentication: JWT
- Styling: CSS3, Responsive Design

---

**Last Updated:** October 11, 2025
**Version:** 1.0.0
