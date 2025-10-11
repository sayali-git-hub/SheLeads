# 🔐 Dual Login System Documentation

## Overview
Complete authentication system for SheLeads marketplace with separate login/registration for **Sellers** and **Buyers**.

---

## ✅ What's Been Implemented

### 1. **Dual Login Page** (`/login`)
- Toggle between "Login as Seller" and "Login as Buyer"
- Single form that works for both user types
- Visual indicators for each login type
- Automatic redirect based on user role:
  - **Sellers** → `/seller/dashboard`
  - **Buyers** → `/` (home page)

### 2. **Dual Register Page** (`/register`)
- Toggle between "Register as Seller" and "Register as Buyer"
- **Seller Registration Fields:**
  - Business Name (required)
  - Owner Name (required)
  - Email (required)
  - Phone (required)
  - Password (required, min 6 characters)
  - Confirm Password
  
- **Buyer Registration Fields:**
  - Full Name (required)
  - Email (required)
  - Phone (required)
  - Password (required, min 6 characters)
  - Confirm Password

### 3. **Database Models**

#### User Model (Updated)
```javascript
{
  name: String (required),
  businessName: String (for sellers),
  email: String (required, unique),
  phone: String (required),
  password: String (required, hashed),
  role: String (enum: ['buyer', 'seller', 'admin'], default: 'buyer'),
  // ... other fields
}
```

### 4. **Route Protection**
- **Protected Routes:**
  - `/seller/*` - Only accessible by sellers
  - If not logged in → redirects to `/login`
  - If wrong role → redirects to appropriate dashboard

- **ProtectedRoute Component:**
  - Checks if user is logged in (token exists)
  - Verifies user has correct role
  - Shows error messages
  - Redirects unauthorized users

### 5. **Backend API**

#### Register Endpoint
```
POST /api/auth/register
Body: {
  name: String,
  businessName: String (for sellers),
  email: String,
  phone: String,
  password: String,
  role: 'buyer' | 'seller'
}
Response: {
  success: true,
  data: {
    _id, name, businessName, email, role, phone, token
  }
}
```

#### Login Endpoint
```
POST /api/auth/login
Body: {
  email: String,
  password: String
}
Response: {
  success: true,
  data: {
    _id, name, businessName, email, role, phone, token
  }
}
```

---

## 🚀 How to Use

### For Users

#### **Register as Buyer:**
1. Go to `/register`
2. Click "Register as Buyer"
3. Fill in: Full Name, Email, Phone, Password
4. Click "Register as Buyer"
5. Automatically logged in and redirected to home page

#### **Register as Seller:**
1. Go to `/register`
2. Click "Register as Seller"
3. Fill in: Business Name, Owner Name, Email, Phone, Password
4. Click "Register as Seller"
5. Automatically logged in and redirected to Seller Dashboard

#### **Login:**
1. Go to `/login`
2. Click "Login as Buyer" or "Login as Seller" (just for visual indication)
3. Enter Email and Password
4. System automatically detects role and redirects:
   - Sellers → `/seller/dashboard`
   - Buyers → `/` (home)

---

## 🔒 Security Features

### Authentication
- ✅ JWT token-based authentication
- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ Token stored in localStorage
- ✅ Token sent with every API request

### Authorization
- ✅ Role-based access control
- ✅ Protected routes check user role
- ✅ Automatic redirects for unauthorized access
- ✅ Error messages for access denied

### Validation
- ✅ Email format validation
- ✅ Password minimum length (6 characters)
- ✅ Password confirmation match
- ✅ Required fields validation
- ✅ Unique email check

---

## 📁 Files Created/Modified

### Frontend (3 new files)
```
src/pages/
  ├── DualLogin.js          ← NEW: Dual login page
  └── DualRegister.js       ← NEW: Dual register page

src/components/
  └── ProtectedRoute.js     ← NEW: Route protection component

src/
  └── App.js                ← UPDATED: Routes with protection
```

### Backend (1 modified file)
```
backend/models/
  └── User.js               ← UPDATED: Added businessName, updated roles

backend/routes/
  └── auth.js               ← UPDATED: Support for businessName
```

---

## 🎨 UI Features

### Design
- Clean, modern interface
- Gradient backgrounds (pink to purple)
- Toggle buttons for user type selection
- Visual indicators (colors) for each user type:
  - **Buyers:** Pink theme
  - **Sellers:** Purple theme
- Responsive design (mobile-friendly)
- Loading states with spinners
- Toast notifications for feedback

### User Experience
- Clear labels and placeholders
- Required field indicators (*)
- Password visibility toggle
- Remember me checkbox
- Forgot password link
- Links between login/register pages
- Informative messages for each user type

---

## 🧪 Testing

### Test Buyer Registration
1. Go to `http://localhost:3000/register`
2. Click "Register as Buyer"
3. Fill in:
   - Full Name: "John Doe"
   - Email: "john@example.com"
   - Phone: "+91 98765 43210"
   - Password: "password123"
   - Confirm Password: "password123"
4. Click "Register as Buyer"
5. Should redirect to home page

### Test Seller Registration
1. Go to `http://localhost:3000/register`
2. Click "Register as Seller"
3. Fill in:
   - Business Name: "My Shop"
   - Owner Name: "Jane Smith"
   - Email: "jane@example.com"
   - Phone: "+91 98765 43211"
   - Password: "password123"
   - Confirm Password: "password123"
4. Click "Register as Seller"
5. Should redirect to `/seller/dashboard`

### Test Login
1. Go to `http://localhost:3000/login`
2. Enter registered email and password
3. Click "Sign in as Buyer" or "Sign in as Seller"
4. Should redirect based on actual user role (not button clicked)

### Test Route Protection
1. **Without login:**
   - Try to access `/seller/dashboard`
   - Should redirect to `/login` with error message

2. **As Buyer:**
   - Login as buyer
   - Try to access `/seller/dashboard`
   - Should show error and redirect to home

3. **As Seller:**
   - Login as seller
   - Access `/seller/dashboard`
   - Should work normally

---

## 🔧 Configuration

### Environment Variables
No additional environment variables needed. Uses existing:
```env
REACT_APP_API_URL=http://localhost:5001/api  # Frontend
JWT_SECRET=your_secret_key                    # Backend
JWT_EXPIRE=30d                                # Backend
```

### LocalStorage Keys
```javascript
localStorage.setItem('token', token);           // JWT token
localStorage.setItem('userRole', role);         // 'buyer' or 'seller'
localStorage.setItem('userName', name);         // User's name
localStorage.setItem('businessName', name);     // Seller's business name
```

---

## 📊 User Roles

### Buyer
- **Access:** Home, Products, Cart, Checkout
- **Cannot Access:** Seller Dashboard, Seller routes
- **Default role** for new registrations

### Seller
- **Access:** Seller Dashboard, Products Management, Orders, Profile
- **Cannot Access:** (Currently no restrictions on buyer pages)
- **Must register** with business name

### Admin
- **Access:** Everything (seller + buyer pages)
- **Created manually** in database

---

## 🚨 Error Handling

### Registration Errors
- ✅ Email already exists
- ✅ Passwords don't match
- ✅ Password too short
- ✅ Missing required fields
- ✅ Invalid email format

### Login Errors
- ✅ Invalid credentials
- ✅ User not found
- ✅ Network errors

### Authorization Errors
- ✅ Not logged in
- ✅ Wrong role for route
- ✅ Token expired/invalid

---

## 🔄 User Flow

### Buyer Journey
```
Register → Login → Browse Products → Add to Cart → Checkout → Order Placed
```

### Seller Journey
```
Register → Login → Seller Dashboard → Add Products → Manage Orders → View Analytics
```

---

## 💡 Key Features

### Free Authentication
- ✅ No third-party services required
- ✅ Complete control over user data
- ✅ No API limits or costs
- ✅ Custom implementation

### Dual System
- ✅ Single codebase for both user types
- ✅ Shared authentication logic
- ✅ Role-based differentiation
- ✅ Easy to extend

### Security
- ✅ Password hashing
- ✅ JWT tokens
- ✅ Protected routes
- ✅ Role verification

---

## 🎯 Next Steps

### Enhancements
1. **Email Verification:** Send verification email after registration
2. **Password Reset:** Implement forgot password functionality
3. **Social Login:** Add Google/Facebook login
4. **Two-Factor Authentication:** Add 2FA for sellers
5. **Session Management:** Add logout from all devices
6. **Profile Pictures:** Allow users to upload avatars

### Additional Features
1. **Buyer Dashboard:** Create dashboard for buyers to track orders
2. **Wishlist:** Allow buyers to save favorite products
3. **Reviews:** Let buyers review products and sellers
4. **Messaging:** Enable chat between buyers and sellers

---

## 📝 API Examples

### Register as Seller
```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "businessName": "Jane's Crafts",
    "email": "jane@example.com",
    "phone": "+91 98765 43210",
    "password": "password123",
    "role": "seller"
  }'
```

### Register as Buyer
```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91 98765 43211",
    "password": "password123",
    "role": "buyer"
  }'
```

### Login
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "password123"
  }'
```

---

## ✅ Summary

**What You Have:**
- ✅ Complete dual login/register system
- ✅ Role-based authentication
- ✅ Protected routes
- ✅ Beautiful UI with toggle buttons
- ✅ Automatic redirects based on role
- ✅ Secure password handling
- ✅ JWT token authentication
- ✅ Error handling and validation
- ✅ Mobile responsive design
- ✅ Toast notifications

**Ready to Use:**
- Just start your servers and test!
- No additional setup required
- All routes are protected
- Both user types fully functional

---

**Last Updated:** October 11, 2025  
**Version:** 1.0.0  
**Status:** Production Ready ✅
