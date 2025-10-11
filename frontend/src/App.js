import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import DualLogin from './pages/DualLogin';
import DualRegister from './pages/DualRegister';
import ProductDetails from './pages/ProductDetails';
import Checkout from './pages/Checkout';

// Seller Pages
import SellerDashboard from './pages/seller/SellerDashboard';
import ProductManagement from './pages/seller/ProductManagement';
import OrderManagement from './pages/seller/OrderManagement';
import SellerProfile from './pages/seller/SellerProfile';
import Notifications from './pages/seller/Notifications';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import SellerLayout from './components/SellerLayout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Customer Routes */}
        <Route path="/" element={
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Home />
            </main>
            <Footer />
            <ToastContainer position="bottom-right" />
          </div>
        } />
        <Route path="/products" element={
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Products />
            </main>
            <Footer />
            <ToastContainer position="bottom-right" />
          </div>
        } />
        <Route path="/products/:id" element={
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <ProductDetails />
            </main>
            <Footer />
            <ToastContainer position="bottom-right" />
          </div>
        } />
        <Route path="/cart" element={
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Cart />
            </main>
            <Footer />
            <ToastContainer position="bottom-right" />
          </div>
        } />
        <Route path="/login" element={
          <>
            <DualLogin />
            <ToastContainer position="bottom-right" />
          </>
        } />
        <Route path="/register" element={
          <>
            <DualRegister />
            <ToastContainer position="bottom-right" />
          </>
        } />
        <Route path="/checkout" element={
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Checkout />
            </main>
            <Footer />
            <ToastContainer position="bottom-right" />
          </div>
        } />

        {/* Seller Routes - Protected */}
        <Route path="/seller" element={
          <ProtectedRoute allowedRoles={['seller', 'admin']}>
            <SellerLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<SellerDashboard />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="profile" element={<SellerProfile />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>
      </Routes>
      <ToastContainer position="bottom-right" />
    </Router>
  );
}

export default App;
