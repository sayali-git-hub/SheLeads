# 🚀 SheLeads Seller Dashboard - Setup Instructions

## Quick Start (3 Steps)

### Step 1: Install Dependencies
Open PowerShell/Terminal and run:

```powershell
# Navigate to project root
cd C:\Users\Arnav\OneDrive\Desktop\SheLeads\SheLeads

# Install frontend dependencies
cd frontend
npm install

# Go back to root
cd ..

# Install backend dependencies (if needed)
cd backend
npm install

# Go back to root
cd ..
```

### Step 2: Start the Servers

**Terminal 1 - Backend:**
```powershell
cd backend
npm start
```
Wait for: `Server running on port 5001`

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm start
```
Wait for: `Compiled successfully!`

### Step 3: Access the Dashboard

1. Browser will open automatically at `http://localhost:3000`
2. Login or register as a seller
3. Navigate to: `http://localhost:3000/seller/dashboard`

**That's it! You're ready to use the Seller Dashboard! 🎉**

---

## Detailed Setup

### Prerequisites

Make sure you have:
- ✅ Node.js (v14 or higher)
- ✅ npm (v6 or higher)
- ✅ MongoDB (running locally or cloud)
- ✅ Git (optional)

Check versions:
```powershell
node --version
npm --version
```

---

## Environment Configuration

### Backend Configuration

Create `.env` file in `backend` directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/sheleads
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sheleads

# JWT
JWT_SECRET=your_super_secret_key_change_this_in_production
JWT_EXPIRE=30d

# Server
PORT=5001
NODE_ENV=development
```

### Frontend Configuration (Optional)

Create `.env` file in `frontend` directory:

```env
REACT_APP_API_URL=http://localhost:5001/api
```

---

## Database Setup

### Option 1: Local MongoDB

1. Install MongoDB Community Edition
2. Start MongoDB service:
   ```powershell
   # Windows
   net start MongoDB
   
   # Mac/Linux
   sudo systemctl start mongod
   ```

3. MongoDB will run on `mongodb://localhost:27017`

### Option 2: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create cluster
4. Get connection string
5. Add to `.env` file

---

## Creating a Test Seller Account

### Method 1: Via Registration

1. Go to `http://localhost:3000/register`
2. Fill in registration form
3. After registration, update user role in database:

```javascript
// In MongoDB Compass or Shell
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "seller" } }
)
```

### Method 2: Direct Database Insert

```javascript
// In MongoDB Compass or Shell
db.users.insertOne({
  name: "Test Seller",
  email: "seller@test.com",
  password: "$2a$10$...", // Use bcrypt to hash "password123"
  role: "seller",
  phone: "+91 98765 43210",
  isVerified: true,
  createdAt: new Date()
})
```

---

## Verification Steps

### 1. Check Backend is Running

Open browser: `http://localhost:5001/api`

Should see:
```json
{
  "success": true,
  "message": "SheLead E-commerce API is running",
  "version": "1.0.0"
}
```

### 2. Check Frontend is Running

Open browser: `http://localhost:3000`

Should see: SheLeads homepage

### 3. Check Seller Dashboard Access

Navigate to: `http://localhost:3000/seller/dashboard`

Should see: Seller Dashboard with statistics

---

## Troubleshooting

### Issue: "Cannot find module 'antd'"

**Solution:**
```powershell
cd frontend
npm install antd chart.js react-chartjs-2
```

### Issue: "MongoDB connection error"

**Solution:**
1. Check MongoDB is running
2. Verify connection string in `.env`
3. Check firewall settings
4. For Atlas: Whitelist your IP address

### Issue: "Port 3000 already in use"

**Solution:**
```powershell
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill
```

### Issue: "Port 5001 already in use"

**Solution:**
```powershell
# Windows
netstat -ano | findstr :5001
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5001 | xargs kill
```

### Issue: "JWT must be provided"

**Solution:**
1. Make sure you're logged in
2. Check localStorage for token
3. Verify JWT_SECRET in backend `.env`

### Issue: "User is not authorized"

**Solution:**
1. Check user role is 'seller' in database
2. Verify token is valid
3. Re-login if needed

---

## File Structure

After setup, your structure should look like:

```
SheLeads/
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   ├── Seller.js          ← NEW
│   │   └── Notification.js    ← NEW
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── orders.js
│   │   └── seller.js          ← NEW
│   ├── .env
│   ├── index.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   ├── SellerLayout.js      ← NEW
│   │   │   └── SellerLayout.css     ← NEW
│   │   ├── pages/
│   │   │   ├── seller/              ← NEW FOLDER
│   │   │   │   ├── SellerDashboard.js
│   │   │   │   ├── SellerDashboard.css
│   │   │   │   ├── ProductManagement.js
│   │   │   │   ├── ProductManagement.css
│   │   │   │   ├── OrderManagement.js
│   │   │   │   ├── OrderManagement.css
│   │   │   │   ├── SellerProfile.js
│   │   │   │   ├── SellerProfile.css
│   │   │   │   ├── Notifications.js
│   │   │   │   └── Notifications.css
│   │   │   ├── Home.js
│   │   │   ├── Products.js
│   │   │   └── ...
│   │   ├── services/
│   │   │   └── sellerApi.js         ← NEW
│   │   ├── App.js                   ← UPDATED
│   │   └── index.js
│   ├── .env
│   └── package.json                 ← UPDATED
│
├── SELLER_DASHBOARD_README.md       ← NEW
├── SELLER_QUICKSTART.md             ← NEW
├── DATABASE_SCHEMA.md               ← NEW
├── IMPLEMENTATION_SUMMARY.md        ← NEW
├── TESTING_CHECKLIST.md             ← NEW
└── SETUP_INSTRUCTIONS.md            ← NEW (this file)
```

---

## Testing Your Setup

### 1. Test Backend APIs

Use Postman or curl:

```bash
# Get dashboard stats (requires authentication)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5001/api/seller/dashboard

# Get products
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5001/api/seller/products
```

### 2. Test Frontend Pages

Visit each page:
- ✅ `http://localhost:3000/seller/dashboard`
- ✅ `http://localhost:3000/seller/products`
- ✅ `http://localhost:3000/seller/orders`
- ✅ `http://localhost:3000/seller/profile`
- ✅ `http://localhost:3000/seller/notifications`

### 3. Test Features

Follow the **TESTING_CHECKLIST.md** for comprehensive testing.

---

## Next Steps

### 1. Customize
- Update colors in CSS files
- Add your logo
- Modify text and labels

### 2. Add Real Data
- Replace mock data with API calls
- Connect to your database
- Add real products and orders

### 3. Deploy
- Build frontend: `npm run build`
- Deploy backend to Heroku/AWS
- Deploy frontend to Netlify/Vercel
- Configure production environment variables

---

## Additional Resources

### Documentation
- **SELLER_DASHBOARD_README.md** - Complete feature documentation
- **SELLER_QUICKSTART.md** - Quick start guide
- **DATABASE_SCHEMA.md** - Database structure
- **IMPLEMENTATION_SUMMARY.md** - What was built
- **TESTING_CHECKLIST.md** - Testing guide

### Technologies Used
- **Frontend:** React, Ant Design, Chart.js
- **Backend:** Node.js, Express, MongoDB
- **Authentication:** JWT
- **Styling:** CSS3

### Support
- Check documentation files
- Review code comments
- Check console for errors
- Verify API endpoints

---

## Quick Commands Reference

```powershell
# Install dependencies
cd frontend && npm install
cd backend && npm install

# Start backend
cd backend && npm start

# Start frontend
cd frontend && npm start

# Build frontend for production
cd frontend && npm run build

# Run tests (if configured)
cd frontend && npm test
cd backend && npm test
```

---

## Success Indicators

You'll know setup is successful when:
- ✅ No errors in terminal
- ✅ Backend responds at port 5001
- ✅ Frontend loads at port 3000
- ✅ Can login as seller
- ✅ Dashboard displays statistics
- ✅ All pages accessible
- ✅ No console errors

---

## 🎉 You're All Set!

Your Seller Dashboard is now ready to use!

**Need Help?**
- Check troubleshooting section above
- Review documentation files
- Check code comments
- Verify environment variables

**Everything Working?**
Start exploring the features and customizing for your needs!

---

**Last Updated:** October 11, 2025
**Version:** 1.0.0
