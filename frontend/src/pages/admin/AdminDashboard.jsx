import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const StatCard = ({ title, value, icon, color }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
      </div>
      <div className="text-3xl">{icon}</div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          api.get('/orders'),
          api.get('/products'),
        ]);
        const orders = ordersRes.data;
        const products = productsRes.data;

        const totalRevenue = orders
          .filter((o) => o.status !== 'Cancelled')
          .reduce((sum, o) => sum + o.totalPrice, 0);

        setStats({
          totalOrders: orders.length,
          totalRevenue,
          totalProducts: products.length,
          pendingOrders: orders.filter((o) => o.status === 'Pending').length,
          lowStock: products.filter((p) => p.stock < 10).length,
        });

        setRecentOrders(orders.slice(0, 5));
      } catch (err) {
        console.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin text-4xl">⏳</div>
      </div>
    );
  }

  const statusColors = {
    Pending: 'bg-yellow-100 text-yellow-700',
    Processing: 'bg-blue-100 text-blue-700',
    Shipped: 'bg-purple-100 text-purple-700',
    Delivered: 'bg-green-100 text-green-700',
    Cancelled: 'bg-red-100 text-red-700',
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">🔧 Admin Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your store</p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/admin/products"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              📦 Manage Products
            </Link>
            <Link
              to="/admin/orders"
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:border-indigo-400 transition-colors"
            >
              🧾 Manage Orders
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <StatCard title="Total Orders" value={stats.totalOrders} icon="🧾" color="text-indigo-600" />
            <StatCard title="Revenue" value={`₹${(stats.totalRevenue / 1000).toFixed(1)}k`} icon="💰" color="text-green-600" />
            <StatCard title="Products" value={stats.totalProducts} icon="📦" color="text-blue-600" />
            <StatCard title="Pending Orders" value={stats.pendingOrders} icon="🕐" color="text-yellow-600" />
            <StatCard title="Low Stock" value={stats.lowStock} icon="⚠️" color="text-red-600" />
          </div>
        )}

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Recent Orders</h2>
            <Link to="/admin/orders" className="text-indigo-600 text-sm hover:underline">View all →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                <tr>
                  <th className="px-6 py-3 text-left">Order ID</th>
                  <th className="px-6 py-3 text-left">Customer</th>
                  <th className="px-6 py-3 text-left">Amount</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">
                      #{order._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {order.user?.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      ₹{order.totalPrice.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {recentOrders.length === 0 && (
              <p className="text-center text-gray-400 py-8">No orders yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
