import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

const Navbar = () => {
  const { userInfo, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="bg-indigo-700 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
            <span className="text-2xl">🛍️</span>
            <span>ShopEase</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="hover:text-indigo-200 transition-colors">Home</Link>

            {userInfo?.role === 'admin' && (
              <Link to="/admin" className="hover:text-indigo-200 transition-colors font-medium">
                🔧 Admin
              </Link>
            )}

            <Link to="/cart" className="relative hover:text-indigo-200 transition-colors">
              🛒 Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {userInfo ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <span className="text-lg">👤</span>
                  <span className="text-sm font-medium">{userInfo.name.split(' ')[0]}</span>
                  <span className="text-xs">▾</span>
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-xl overflow-hidden z-50">
                    <Link
                      to="/orders"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-3 hover:bg-gray-50 text-sm border-b"
                    >
                      📦 My Orders
                    </Link>
                    {userInfo.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setMenuOpen(false)}
                        className="block px-4 py-3 hover:bg-gray-50 text-sm border-b"
                      >
                        🔧 Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-3 hover:bg-red-50 text-sm text-red-600"
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="hover:text-indigo-200 transition-colors text-sm">Login</Link>
                <Link
                  to="/register"
                  className="bg-white text-indigo-700 px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-indigo-50 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-indigo-600 py-3 space-y-2">
            <Link to="/" onClick={() => setMenuOpen(false)} className="block px-3 py-2 hover:bg-indigo-600 rounded">Home</Link>
            <Link to="/cart" onClick={() => setMenuOpen(false)} className="block px-3 py-2 hover:bg-indigo-600 rounded">
              🛒 Cart {cartCount > 0 && <span className="bg-red-500 text-xs px-1.5 py-0.5 rounded-full ml-1">{cartCount}</span>}
            </Link>
            {userInfo ? (
              <>
                <Link to="/orders" onClick={() => setMenuOpen(false)} className="block px-3 py-2 hover:bg-indigo-600 rounded">📦 My Orders</Link>
                {userInfo.role === 'admin' && (
                  <Link to="/admin" onClick={() => setMenuOpen(false)} className="block px-3 py-2 hover:bg-indigo-600 rounded">🔧 Admin</Link>
                )}
                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 hover:bg-indigo-600 rounded text-red-300">🚪 Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-3 py-2 hover:bg-indigo-600 rounded">Login</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="block px-3 py-2 hover:bg-indigo-600 rounded">Register</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
