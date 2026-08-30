import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const StarRating = ({ rating }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <span key={star} className={`text-xl ${star <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
    ))}
    <span className="text-gray-500 ml-2">{rating.toFixed(1)}</span>
  </div>
);

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { userInfo } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Product not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!userInfo) {
      navigate('/login');
      return;
    }
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin text-4xl">⏳</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <p className="text-red-500">{error}</p>
          <button onClick={() => navigate('/')} className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="text-indigo-600 hover:text-indigo-800 mb-6 flex items-center gap-2 text-sm"
        >
          ← Back
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Image */}
            <div className="bg-gray-50">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-80 md:h-full object-cover"
                onError={(e) => { e.target.src = 'https://placehold.co/600x400?text=No+Image'; }}
              />
            </div>

            {/* Details */}
            <div className="p-8 flex flex-col">
              <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full w-fit mb-3">
                {product.category}
              </span>

              <h1 className="text-2xl font-bold text-gray-900 mb-3">{product.name}</h1>

              <StarRating rating={product.rating || 0} />
              <p className="text-gray-400 text-sm mt-1 mb-4">{product.numReviews} reviews</p>

              <p className="text-gray-600 text-sm leading-relaxed mb-6">{product.description}</p>

              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-bold text-gray-900">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
              </div>

              <div className={`text-sm font-medium mb-6 ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                {product.stock > 0 ? `✓ In Stock (${product.stock} available)` : '✗ Out of Stock'}
              </div>

              {product.stock > 0 && (
                <div className="flex items-center gap-4 mb-6">
                  <label className="text-sm font-medium text-gray-600">Quantity:</label>
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3 py-2 hover:bg-gray-100 text-lg font-medium"
                    >
                      −
                    </button>
                    <span className="px-4 py-2 font-medium border-x border-gray-300">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                      className="px-3 py-2 hover:bg-gray-100 text-lg font-medium"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-auto">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-all active:scale-95 ${
                    added
                      ? 'bg-green-500 text-white'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed'
                  }`}
                >
                  {added ? '✓ Added to Cart!' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
                <button
                  onClick={() => { handleAddToCart(); navigate('/cart'); }}
                  disabled={product.stock === 0}
                  className="flex-1 py-3 rounded-xl font-semibold border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
