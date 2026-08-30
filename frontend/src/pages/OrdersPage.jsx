import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api/axios';

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Processing: 'bg-blue-100 text-blue-700',
  Shipped: 'bg-purple-100 text-purple-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
};

const statusIcons = {
  Pending: '🕐',
  Processing: '⚙️',
  Shipped: '🚚',
  Delivered: '✅',
  Cancelled: '❌',
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(null);
  const location = useLocation();
  const newOrderId = location.state?.newOrderId;

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/orders/my');
      setOrders(data);
      if (newOrderId) {
        setExpandedOrder(newOrderId);
      }
    } catch (err) {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancel = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    setCancelLoading(orderId);
    try {
      await api.put(`/orders/${orderId}/cancel`);
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancelLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl">⏳</div>
          <p className="text-gray-500 mt-3">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">📦 My Orders</h1>

        {newOrderId && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            🎉 <strong>Order placed successfully!</strong> We'll start processing it shortly.
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No orders yet</h2>
            <p className="text-gray-500">Your order history will appear here after checkout.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Order Header */}
                <div
                  className="p-5 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs text-gray-400 font-mono mb-1">Order #{order._id.slice(-8).toUpperCase()}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric', month: 'long', day: 'numeric'
                        })}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[order.status]}`}>
                        {statusIcons[order.status]} {order.status}
                      </span>
                      <span className="font-bold text-indigo-600">₹{order.totalPrice.toLocaleString('en-IN')}</span>
                      <span className="text-gray-400 text-sm">{expandedOrder === order._id ? '▲' : '▼'}</span>
                    </div>
                  </div>

                  {/* Items preview */}
                  <div className="flex gap-2 mt-3">
                    {order.items.slice(0, 4).map((item, i) => (
                      <img
                        key={i}
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg border border-gray-100"
                        onError={(e) => { e.target.src = 'https://placehold.co/50x50?text=?'; }}
                      />
                    ))}
                    {order.items.length > 4 && (
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-500 font-medium">
                        +{order.items.length - 4}
                      </div>
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedOrder === order._id && (
                  <div className="border-t border-gray-100 px-5 py-4 bg-gray-50">
                    {/* Items List */}
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Items Ordered</h3>
                    <div className="space-y-2 mb-4">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-14 h-14 object-cover rounded-lg"
                            onError={(e) => { e.target.src = 'https://placehold.co/60x60?text=?'; }}
                          />
                          <div className="flex-1">
                            <p className="text-sm text-gray-800 font-medium">{item.name}</p>
                            <p className="text-xs text-gray-500">Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}</p>
                          </div>
                          <span className="font-medium text-sm">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                    </div>

                    <hr className="border-gray-200 mb-4" />

                    <div className="grid sm:grid-cols-2 gap-4">
                      {/* Shipping Address */}
                      <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">📍 Shipping To</h3>
                        <div className="text-sm text-gray-600 space-y-0.5">
                          <p className="font-medium">{order.shippingAddress.fullName}</p>
                          <p>{order.shippingAddress.address}</p>
                          <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                          <p>{order.shippingAddress.country}</p>
                        </div>
                      </div>

                      {/* Price Breakdown */}
                      <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">💰 Price Details</h3>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div className="flex justify-between">
                            <span>Items</span>
                            <span>₹{order.itemsPrice.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Shipping</span>
                            <span>{order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice}`}</span>
                          </div>
                          <div className="flex justify-between font-bold text-gray-800">
                            <span>Total</span>
                            <span>₹{order.totalPrice.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Payment</span>
                            <span>{order.paymentMethod}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status Timeline */}
                    <div className="mt-4">
                      <h3 className="text-sm font-semibold text-gray-700 mb-3">Order Status</h3>
                      <div className="flex items-center gap-1">
                        {['Pending', 'Processing', 'Shipped', 'Delivered'].map((step, i) => {
                          const steps = ['Pending', 'Processing', 'Shipped', 'Delivered'];
                          const currentIdx = steps.indexOf(order.status);
                          const stepIdx = steps.indexOf(step);
                          const isDone = currentIdx >= stepIdx && order.status !== 'Cancelled';
                          const isCurrent = stepIdx === currentIdx;
                          return (
                            <div key={step} className="flex items-center flex-1">
                              <div className="flex flex-col items-center">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                                  ${isDone ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                                  {isDone ? '✓' : i + 1}
                                </div>
                                <span className={`text-xs mt-1 ${isCurrent ? 'text-indigo-600 font-semibold' : 'text-gray-400'}`}>
                                  {step}
                                </span>
                              </div>
                              {i < 3 && (
                                <div className={`flex-1 h-0.5 mx-1 ${isDone && currentIdx > stepIdx ? 'bg-indigo-600' : 'bg-gray-200'}`} />
                              )}
                            </div>
                          );
                        })}
                      </div>
                      {order.status === 'Cancelled' && (
                        <p className="text-red-500 text-sm mt-2 font-medium">❌ This order has been cancelled</p>
                      )}
                    </div>

                    {/* Cancel Button */}
                    {['Pending', 'Processing'].includes(order.status) && (
                      <button
                        onClick={() => handleCancel(order._id)}
                        disabled={cancelLoading === order._id}
                        className="mt-4 px-4 py-2 text-sm text-red-500 border border-red-300 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-60"
                      >
                        {cancelLoading === order._id ? 'Cancelling...' : '✕ Cancel Order'}
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
