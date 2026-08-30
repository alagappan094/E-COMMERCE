import { useState, useEffect } from 'react';
import api from '../../api/axios';

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Processing: 'bg-blue-100 text-blue-700',
  Shipped: 'bg-purple-100 text-purple-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
};

const ALL_STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [updatingStatus, setUpdatingStatus] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/orders');
      setOrders(data);
    } catch (err) {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingStatus(orderId);
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const filteredOrders = statusFilter === 'All'
    ? orders
    : orders.filter((o) => o.status === statusFilter);

  const statusCounts = ALL_STATUSES.reduce((acc, s) => {
    acc[s] = orders.filter((o) => o.status === s).length;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">🧾 Order Management</h1>
            <p className="text-gray-500 text-sm mt-1">{orders.length} total orders</p>
          </div>
          <button
            onClick={fetchOrders}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:border-indigo-400 text-gray-600 transition-colors"
          >
            🔄 Refresh
          </button>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setStatusFilter('All')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              statusFilter === 'All'
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-gray-600 border-gray-300 hover:border-indigo-400'
            }`}
          >
            All ({orders.length})
          </button>
          {ALL_STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                statusFilter === s
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-indigo-400'
              }`}
            >
              {s} ({statusCounts[s]})
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                <tr>
                  <th className="px-6 py-3 text-left">Order</th>
                  <th className="px-6 py-3 text-left">Customer</th>
                  <th className="px-6 py-3 text-left">Items</th>
                  <th className="px-6 py-3 text-left">Total</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      {[...Array(7)].map((_, j) => (
                        <td key={j} className="px-6 py-4">
                          <div className="h-4 bg-gray-200 rounded w-20" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <>
                      <tr
                        key={order._id}
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                      >
                        <td className="px-6 py-4 text-sm font-mono text-gray-600">
                          #{order._id.slice(-8).toUpperCase()}
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-gray-800">{order.user?.name || 'Unknown'}</p>
                          <p className="text-xs text-gray-400">{order.user?.email || ''}</p>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-gray-900">
                          ₹{order.totalPrice.toLocaleString('en-IN')}
                        </td>
                        <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[order.status]}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString('en-IN')}
                        </td>
                        <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                            disabled={updatingStatus === order._id || order.status === 'Cancelled'}
                            className="text-xs border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50 bg-white"
                          >
                            {ALL_STATUSES.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                          {updatingStatus === order._id && (
                            <span className="ml-2 text-xs text-gray-400">Saving...</span>
                          )}
                        </td>
                      </tr>

                      {/* Expanded Row */}
                      {expandedOrder === order._id && (
                        <tr key={`${order._id}-expanded`}>
                          <td colSpan={7} className="px-6 py-4 bg-indigo-50 border-b border-indigo-100">
                            <div className="grid sm:grid-cols-2 gap-6">
                              {/* Items */}
                              <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-2">Items</h4>
                                <div className="space-y-2">
                                  {order.items.map((item, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                      <img src={item.imageUrl} alt={item.name} className="w-10 h-10 object-cover rounded-lg"
                                        onError={(e) => { e.target.src = 'https://placehold.co/40x40?text=?'; }} />
                                      <div className="flex-1">
                                        <p className="text-xs text-gray-700 font-medium">{item.name}</p>
                                        <p className="text-xs text-gray-400">Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              {/* Address */}
                              <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-2">Shipping Address</h4>
                                <div className="text-sm text-gray-600 space-y-0.5">
                                  <p className="font-medium">{order.shippingAddress.fullName}</p>
                                  <p>{order.shippingAddress.address}</p>
                                  <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                                  <p>{order.shippingAddress.country}</p>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">Payment: {order.paymentMethod}</p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
