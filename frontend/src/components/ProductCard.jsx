import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-sm ${star <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
        >
          ★
        </span>
      ))}
      <span className="text-xs text-gray-500 ml-1">({rating.toFixed(1)})</span>
    </div>
  );
};

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    if (!userInfo) {
      navigate('/login');
      return;
    }
    addToCart(product, 1);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col">
      <Link to={`/products/${product._id}`}>
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover hover:opacity-90 transition-opacity"
          onError={(e) => { e.target.src = 'https://placehold.co/400x300?text=No+Image'; }}
        />
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full w-fit mb-2">
          {product.category}
        </span>

        <Link to={`/products/${product._id}`} className="hover:text-indigo-600 transition-colors">
          <h3 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-2 leading-snug">
            {product.name}
          </h3>
        </Link>

        <StarRating rating={product.rating || 0} />

        <div className="flex items-center justify-between mt-auto pt-3">
          <span className="text-lg font-bold text-gray-900">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          <span className={`text-xs ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </span>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="mt-3 w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium
            hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
