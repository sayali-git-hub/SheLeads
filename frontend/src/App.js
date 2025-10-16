import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import About from './pages/About';
import Cart from './pages/Cart';
import DualLogin from './pages/DualLogin';
import DualRegister from './pages/DualRegister';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import Contact from './pages/Contact';
import ProfilePage from './pages/ProfilePage';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';

// Seller Pages
import SellerDashboard from './pages/seller/SellerDashboard';
import ProductManagement from './pages/seller/ProductManagement';
import OrderManagement from './pages/seller/OrderManagement';
import SellerProfile from './pages/seller/SellerProfile';
import Notifications from './pages/seller/Notifications';

// Components
import RootLayout from './components/layout/RootLayout';
import SellerLayout from './components/SellerLayout';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public/Auth Routes (outside RootLayout) */}
        <Route path="/login" element={<DualLogin />} />
        <Route path="/register" element={<DualRegister />} />

        {/* Customer Routes under RootLayout */}
        <Route element={<RootLayout />}>
          <Route index element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="about" element={<About />} />
          <Route path="cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="orders/:id" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
          <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="contact" element={<Contact />} />
        </Route>

        {/* Seller Routes - Protected */}
        <Route
          path="/seller"
          element={
            <ProtectedRoute allowedRoles={['seller']}>
              <SellerLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<SellerDashboard />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="profile" element={<SellerProfile />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
