# 🧪 Seller Dashboard Testing Checklist

## Pre-Testing Setup

### ✅ Installation
- [ ] Run `npm install` in frontend directory
- [ ] Run `npm install` in backend directory (if needed)
- [ ] Verify all dependencies installed successfully
- [ ] Check for any installation errors

### ✅ Configuration
- [ ] Backend `.env` file exists with correct values
- [ ] Frontend `.env` file exists (optional)
- [ ] MongoDB connection string is correct
- [ ] JWT_SECRET is set

### ✅ Database
- [ ] MongoDB is running
- [ ] Database connection successful
- [ ] At least one user with role='seller' exists

### ✅ Servers
- [ ] Backend server starts without errors (port 5001)
- [ ] Frontend server starts without errors (port 3000)
- [ ] No console errors on startup

---

## 1. Dashboard Page Testing

### Access
- [ ] Navigate to `/seller/dashboard`
- [ ] Page loads without errors
- [ ] All components render correctly

### Statistics Cards
- [ ] Total Sales card displays
- [ ] Pending Orders card displays
- [ ] Completed Orders card displays
- [ ] Low Stock Alerts card displays
- [ ] Numbers are formatted correctly (₹ symbol)
- [ ] Cards are responsive on mobile

### Sales Chart
- [ ] Chart renders correctly
- [ ] Chart shows 30 days of data
- [ ] Y-axis shows ₹ symbol
- [ ] Chart is responsive
- [ ] Hover shows tooltips

### Top Products
- [ ] Top 3 products list displays
- [ ] Product names show correctly
- [ ] Sales numbers display
- [ ] Progress bars render
- [ ] "View All" link works

### Recent Activity
- [ ] Activity feed displays
- [ ] Icons show correctly
- [ ] Timestamps display
- [ ] "View All" link works

### Quick Actions
- [ ] "Add Product" button works
- [ ] "View Orders" button works
- [ ] Buttons navigate to correct pages

---

## 2. Product Management Testing

### Page Access
- [ ] Navigate to `/seller/products`
- [ ] Page loads without errors
- [ ] Product table displays

### Product Table
- [ ] All columns display (Image, Name, Category, Price, Stock, Status, Actions)
- [ ] Product images load
- [ ] Prices show ₹ symbol
- [ ] Stock shows correct tags (red for 0, orange for <10, green for >=10)
- [ ] Status tags show correctly
- [ ] Pagination works
- [ ] Table is responsive on mobile

### Search & Filter
- [ ] Search box works
- [ ] Search by product name works
- [ ] Search by category works
- [ ] Status filter dropdown works
- [ ] Filter by "All Products" works
- [ ] Filter by "Available" works
- [ ] Filter by "Unavailable" works

### Add Product
- [ ] Click "Add New Product" button
- [ ] Modal opens
- [ ] All form fields display
- [ ] Image upload works
- [ ] Can upload multiple images (up to 5)
- [ ] Product name field works
- [ ] Category dropdown works
- [ ] Description textarea works
- [ ] Character count shows
- [ ] Price field works
- [ ] Price shows ₹ formatting
- [ ] Stock field works
- [ ] Available/Unavailable toggle works
- [ ] Form validation works (try submitting empty form)
- [ ] Error messages display correctly
- [ ] Submit creates product
- [ ] Success message shows
- [ ] Modal closes
- [ ] Product appears in table

### Edit Product
- [ ] Click "Edit" button on a product
- [ ] Modal opens with pre-filled data
- [ ] All fields show existing values
- [ ] Can modify all fields
- [ ] Submit updates product
- [ ] Success message shows
- [ ] Changes reflect in table

### Delete Product
- [ ] Click "Delete" button
- [ ] Confirmation popup shows
- [ ] Cancel works (doesn't delete)
- [ ] Confirm deletes product
- [ ] Success message shows
- [ ] Product removed from table

### Sorting
- [ ] Click column headers to sort
- [ ] Name column sorts alphabetically
- [ ] Price column sorts numerically
- [ ] Stock column sorts numerically

---

## 3. Order Management Testing

### Page Access
- [ ] Navigate to `/seller/orders`
- [ ] Page loads without errors
- [ ] Orders table displays

### Statistics
- [ ] Total Orders count displays
- [ ] Pending count displays
- [ ] Completed count displays
- [ ] Numbers are correct

### Orders Table
- [ ] All columns display (Order ID, Customer, Date, Items, Amount, Status, Actions)
- [ ] Order IDs display correctly
- [ ] Customer names show
- [ ] Dates are formatted
- [ ] Items count badge shows
- [ ] Amounts show ₹ symbol
- [ ] Status dropdowns work
- [ ] Table is responsive

### Search & Filter
- [ ] Search box works
- [ ] Search by Order ID works
- [ ] Search by Customer Name works
- [ ] Status filter dropdown works
- [ ] Filter by "All Orders" works
- [ ] Filter by "Pending" works
- [ ] Filter by "Processing" works
- [ ] Filter by "Shipped" works
- [ ] Filter by "Delivered" works

### Order Status Update
- [ ] Click status dropdown
- [ ] All status options show
- [ ] Select new status
- [ ] Status updates immediately
- [ ] Success message shows
- [ ] Table reflects change

### View Order Details
- [ ] Click "View Details" button
- [ ] Modal opens
- [ ] Order ID shows in title
- [ ] Status timeline displays
- [ ] Current status highlighted
- [ ] Customer information section shows
- [ ] Customer name displays
- [ ] Phone number displays
- [ ] Delivery address displays
- [ ] Order items section shows
- [ ] Item images load
- [ ] Item names display
- [ ] Quantities show
- [ ] Prices show with ₹
- [ ] Item totals calculate correctly
- [ ] Total amount displays
- [ ] Order information section shows
- [ ] Order date displays
- [ ] Order time displays
- [ ] Payment status shows
- [ ] Order status shows
- [ ] Status dropdown in modal works
- [ ] Can update status from modal
- [ ] Modal is responsive

---

## 4. Seller Profile Testing

### Page Access
- [ ] Navigate to `/seller/profile`
- [ ] Page loads without errors
- [ ] Profile form displays

### Profile Header
- [ ] Avatar displays
- [ ] Seller name shows
- [ ] Business name shows

### Business Information Section
- [ ] Section title displays
- [ ] Business name field shows
- [ ] Owner name field shows
- [ ] Business address field shows
- [ ] All fields are editable

### Contact Information Section
- [ ] Section title displays
- [ ] Contact number field shows
- [ ] Email field shows
- [ ] All fields are editable

### Bank Details Section
- [ ] Section title displays
- [ ] Account holder name field shows
- [ ] Account number field shows
- [ ] IFSC code field shows
- [ ] All fields are editable

### Form Validation
- [ ] Try submitting empty form
- [ ] Error messages show for required fields
- [ ] Email validation works (try invalid email)
- [ ] Phone validation works (try invalid phone)
- [ ] Account number validation works (try letters)
- [ ] IFSC code validation works (try invalid format)
- [ ] Error messages are clear

### Save Profile
- [ ] Fill all fields correctly
- [ ] Click "Save Changes"
- [ ] Loading state shows
- [ ] Success message displays
- [ ] Form updates with new values

### Reset Form
- [ ] Make changes to form
- [ ] Click "Reset" button
- [ ] Form resets to original values

### Help Card
- [ ] Help card displays at bottom
- [ ] Support email shows
- [ ] Support phone shows

---

## 5. Notifications Testing

### Page Access
- [ ] Navigate to `/seller/notifications`
- [ ] Page loads without errors
- [ ] Notifications list displays

### Header
- [ ] Page title shows
- [ ] Unread count badge displays (if unread notifications exist)
- [ ] "Mark All as Read" button shows (if unread exist)
- [ ] "Clear All" button shows (if notifications exist)

### Notifications List
- [ ] All notifications display
- [ ] Icons show correctly (different for each type)
- [ ] Titles display
- [ ] Messages display
- [ ] Timestamps show (relative time)
- [ ] Unread notifications highlighted
- [ ] Read notifications not highlighted
- [ ] List is scrollable

### Mark as Read
- [ ] Click "Mark as read" on unread notification
- [ ] Notification marked as read
- [ ] Highlighting removed
- [ ] Success message shows
- [ ] Unread count updates

### Mark All as Read
- [ ] Click "Mark All as Read" button
- [ ] All notifications marked as read
- [ ] Success message shows
- [ ] Unread count becomes 0
- [ ] Button disappears

### Delete Notification
- [ ] Click delete icon
- [ ] Confirmation popup shows
- [ ] Cancel works (doesn't delete)
- [ ] Confirm deletes notification
- [ ] Success message shows
- [ ] Notification removed from list

### Clear All
- [ ] Click "Clear All" button
- [ ] Confirmation popup shows
- [ ] Cancel works (doesn't clear)
- [ ] Confirm clears all
- [ ] Success message shows
- [ ] Empty state displays

### Empty State
- [ ] When no notifications
- [ ] Empty state message shows
- [ ] Empty state icon shows

---

## 6. Navigation & Layout Testing

### Sidebar
- [ ] Sidebar displays on left
- [ ] Logo/brand shows at top
- [ ] All menu items display
- [ ] Dashboard menu item
- [ ] Products menu item
- [ ] Orders menu item
- [ ] Profile menu item
- [ ] Notifications menu item (with badge if unread)
- [ ] Active page highlighted
- [ ] Menu items clickable
- [ ] Navigation works

### Header
- [ ] Header displays at top
- [ ] Menu toggle button shows
- [ ] Notification bell icon shows
- [ ] Notification badge shows (if unread)
- [ ] User avatar shows
- [ ] User name shows
- [ ] User role shows

### User Dropdown
- [ ] Click user avatar
- [ ] Dropdown menu opens
- [ ] "My Profile" option shows
- [ ] "Settings" option shows
- [ ] "Logout" option shows
- [ ] Clicking "My Profile" navigates to profile
- [ ] Clicking "Logout" logs out user

### Mobile Responsiveness
- [ ] Resize browser to mobile size (<768px)
- [ ] Sidebar collapses
- [ ] Menu toggle button works
- [ ] Sidebar opens/closes on toggle
- [ ] All pages responsive
- [ ] Tables scroll horizontally
- [ ] Forms stack vertically
- [ ] Buttons full width
- [ ] Touch targets large enough

---

## 7. API Integration Testing

### Dashboard API
- [ ] Open browser DevTools
- [ ] Navigate to dashboard
- [ ] Check Network tab
- [ ] GET /api/seller/dashboard called
- [ ] Response status 200
- [ ] Response contains correct data
- [ ] No console errors

### Products API
- [ ] GET /api/seller/products works
- [ ] POST /api/seller/products works (add product)
- [ ] PUT /api/seller/products/:id works (edit product)
- [ ] DELETE /api/seller/products/:id works (delete product)
- [ ] All responses have correct status codes
- [ ] Error handling works (try invalid data)

### Orders API
- [ ] GET /api/seller/orders works
- [ ] PUT /api/seller/orders/:id/status works
- [ ] Response data correct
- [ ] No console errors

### Profile API
- [ ] GET /api/seller/profile works
- [ ] PUT /api/seller/profile works
- [ ] Response data correct
- [ ] No console errors

### Notifications API
- [ ] GET /api/seller/notifications works
- [ ] PUT /api/seller/notifications/:id/read works
- [ ] PUT /api/seller/notifications/read-all works
- [ ] DELETE /api/seller/notifications/:id works
- [ ] DELETE /api/seller/notifications works
- [ ] All responses correct

---

## 8. Error Handling Testing

### Network Errors
- [ ] Stop backend server
- [ ] Try any action
- [ ] Error message displays
- [ ] User-friendly message shown
- [ ] No app crash

### Authentication Errors
- [ ] Remove token from localStorage
- [ ] Try accessing seller pages
- [ ] Redirected to login
- [ ] No console errors

### Validation Errors
- [ ] Try submitting invalid forms
- [ ] Error messages display
- [ ] Fields highlighted
- [ ] Messages are clear

### 404 Errors
- [ ] Navigate to non-existent route
- [ ] 404 page shows (or handled gracefully)

---

## 9. Performance Testing

### Load Times
- [ ] Dashboard loads in <2 seconds
- [ ] Product page loads in <2 seconds
- [ ] Orders page loads in <2 seconds
- [ ] Profile page loads in <2 seconds
- [ ] Notifications load in <2 seconds

### Interactions
- [ ] Button clicks respond immediately
- [ ] Form submissions show loading state
- [ ] No lag when typing
- [ ] Smooth scrolling
- [ ] Smooth animations

### Large Data
- [ ] Test with 100+ products
- [ ] Pagination works
- [ ] No performance issues
- [ ] Test with 100+ orders
- [ ] Table performs well

---

## 10. Browser Compatibility

### Chrome
- [ ] All features work
- [ ] No console errors
- [ ] Styling correct

### Firefox
- [ ] All features work
- [ ] No console errors
- [ ] Styling correct

### Safari
- [ ] All features work
- [ ] No console errors
- [ ] Styling correct

### Edge
- [ ] All features work
- [ ] No console errors
- [ ] Styling correct

---

## 11. Security Testing

### Authentication
- [ ] Cannot access seller pages without login
- [ ] Token required for API calls
- [ ] Invalid token rejected

### Authorization
- [ ] Non-sellers cannot access seller pages
- [ ] Sellers can only see their own data
- [ ] Cannot modify other sellers' products

### Input Sanitization
- [ ] Try XSS attacks (script tags)
- [ ] Input sanitized
- [ ] No script execution

---

## 12. Accessibility Testing

### Keyboard Navigation
- [ ] Can navigate with Tab key
- [ ] Can submit forms with Enter
- [ ] Can close modals with Escape
- [ ] Focus indicators visible

### Screen Reader
- [ ] Labels properly associated
- [ ] Alt text on images
- [ ] ARIA labels where needed

### Color Contrast
- [ ] Text readable
- [ ] Sufficient contrast
- [ ] Color not sole indicator

---

## Final Checklist

### Documentation
- [ ] README files reviewed
- [ ] Quick start guide works
- [ ] Database schema documented
- [ ] API endpoints documented

### Code Quality
- [ ] No console.log statements in production
- [ ] No commented-out code
- [ ] Code formatted consistently
- [ ] No lint errors

### Deployment Ready
- [ ] Environment variables documented
- [ ] Dependencies listed
- [ ] Build process works
- [ ] No hardcoded values

---

## 🎉 Testing Complete!

If all items are checked, your Seller Dashboard is ready for production! 🚀

**Found Issues?**
- Document the issue
- Note steps to reproduce
- Check console for errors
- Review relevant code
- Fix and re-test

**Everything Working?**
Congratulations! Your Seller Dashboard is fully functional and ready to use!
