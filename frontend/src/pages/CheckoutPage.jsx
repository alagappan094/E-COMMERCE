import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  const shippingPrice = cartTotal > 500 ? 0 : 50;
  const finalTotal = cartTotal + shippingPrice;

  const [shippingAddress, setShippingAddress] = useState({
    fullName: userInfo?.name || '',
    address: '',
    city: '',
    postalCode: '',
    country: 'India',
  });
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const orderItems = cartItems.map((item) => ({
        product: item.product,
        quantity: item.quantity,
      }));

      const { data } = await api.post('/orders', {
        items: orderItems,
        shippingAddress,
        paymentMethod,
      });

      clearCart();
      navigate('/orders', { state: { newOrderId: data._id } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handlePlaceOrder}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Shipping + Payment */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">📦 Shipping Address</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={shippingAddress.fullName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                    <input
                      type="text"
                      name="address"
                      value={shippingAddress.address}
                      onChange={handleChange}
                      required
                      placeholder="123 Main Street, Apt 4B"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      name="city"
                      value={shippingAddress.city}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={shippingAddress.postalCode}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={shippingAddress.country}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">💳 Payment Method</h2>
                <div className="space-y-3">
                  {['Cash on Delivery', 'Credit/Debit Card', 'UPI'].map((method) => (
                    <label key={method} className="flex items-center gap-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:border-indigo-400 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method}
                        checked={paymentMethod === method}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="accent-indigo-600"
                      />
                      <span className="text-sm font-medium text-gray-700">{method}</span>
                      {method === 'Cash on Delivery' && (
                        <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Recommended</span>
                      )}
                    </label>
                  ))}
                </div>
                {paymentMethod !== 'Cash on Delivery' && (
                  <p className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg mt-3">
                    ℹ️ Online payment integration is a demo — order will be placed without actual payment processing.
                  </p>
                )}
              </div>
            </div>

            {/* Right: Order Summary */}
            <div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

                <div className="space-y-3 mb-4">
                  {cartItems.map((item) => (
                    <div key={item.product} className="flex items-center gap-3">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                        onError={(e) => { e.target.src = 'https://placehold.co/50x50?text=?'; }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-700 line-clamp-1">{item.name}</p>
                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-medium">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>

                <hr className="border-gray-100 mb-3" />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className={shippingPrice === 0 ? 'text-green-600 font-medium' : ''}>
                      {shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`}
                    </span>
                  </div>
                  <hr className="border-gray-100" />
                  <div className="flex justify-between font-bold text-base">
                    <span>Total</span>
                    <span className="text-indigo-600">₹{finalTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? '⏳ Placing Order...' : '✓ Place Order'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
