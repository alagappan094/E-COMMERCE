import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Pages
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Routes>
              {/* Public */}
              <Route path="/" element={<HomePage />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/cart" element={<CartPage />} />

              {/* Protected (logged-in users) */}
              <Route path="/checkout" element={
                <ProtectedRoute><CheckoutPage /></ProtectedRoute>
              } />
              <Route path="/orders" element={
                <ProtectedRoute><OrdersPage /></ProtectedRoute>
              } />

              {/* Admin only */}
              <Route path="/admin" element={
                <AdminRoute><AdminDashboard /></AdminRoute>
              } />
              <Route path="/admin/products" element={
                <AdminRoute><AdminProducts /></AdminRoute>
              } />
              <Route path="/admin/orders" element={
                <AdminRoute><AdminOrders /></AdminRoute>
              } />

              {/* 404 */}
              <Route path="*" element={
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-7xl mb-4">🔍</div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">404 - Page Not Found</h1>
                    <p className="text-gray-500 mb-6">The page you're looking for doesn't exist.</p>
                    <a href="/" className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700">
                      Go Home
                    </a>
                  </div>
                </div>
              } />
            </Routes>
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
