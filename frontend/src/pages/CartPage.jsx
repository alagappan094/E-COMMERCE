import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CartPage = () => {
  const { cartItems, cartTotal, cartCount, removeFromCart, updateQuantity, clearCart } = useCart();
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  const shippingPrice = cartTotal > 500 ? 0 : cartItems.length > 0 ? 50 : 0;
  const finalTotal = cartTotal + shippingPrice;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-7xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Add some products to get started!</p>
          <Link
            to="/"
            className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Shopping Cart <span className="text-gray-400 text-lg font-normal">({cartCount} items)</span>
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.product} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex gap-4">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                    onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=No+Image'; }}
                  />
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/products/${item.product}`}
                      className="font-medium text-gray-800 hover:text-indigo-600 line-clamp-2 text-sm"
                    >
                      {item.name}
                    </Link>
                    <p className="text-indigo-600 font-bold mt-1">
                      ₹{item.price.toLocaleString('en-IN')}
                    </p>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.product, item.quantity - 1)}
                          className="px-3 py-1 hover:bg-gray-100 text-gray-600 font-medium"
                        >
                          −
                        </button>
                        <span className="px-4 py-1 font-medium border-x border-gray-200 text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="px-3 py-1 hover:bg-gray-100 text-gray-600 font-medium disabled:opacity-40"
                        >
                          +
                        </button>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="font-bold text-gray-900">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.product)}
                          className="text-red-400 hover:text-red-600 transition-colors text-lg"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={clearCart}
              className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1 mt-2"
            >
              🗑️ Clear entire cart
            </button>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartCount} items)</span>
                  <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className={shippingPrice === 0 ? 'text-green-600 font-medium' : ''}>
                    {shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`}
                  </span>
                </div>
                {shippingPrice === 0 && cartTotal > 0 && (
                  <p className="text-xs text-green-600 bg-green-50 px-3 py-1.5 rounded-lg">
                    🎉 You qualify for free shipping!
                  </p>
                )}
                {shippingPrice > 0 && (
                  <p className="text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
                    Add ₹{(500 - cartTotal).toLocaleString('en-IN')} more for free shipping
                  </p>
                )}
                <hr className="border-gray-100" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-indigo-600">₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {userInfo ? (
                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 active:scale-95 transition-all"
                >
                  Proceed to Checkout →
                </button>
              ) : (
                <div className="mt-6 space-y-3">
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all"
                  >
                    Login to Checkout
                  </button>
                  <p className="text-center text-xs text-gray-500">
                    <Link to="/register" className="text-indigo-600 hover:underline">Create an account</Link> to proceed
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
