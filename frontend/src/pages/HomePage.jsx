import { useState, useEffect } from 'react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [keyword, setKeyword] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/products/categories');
        setCategories(data);
      } catch (err) {
        console.error('Failed to load categories');
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {};
        if (keyword) params.keyword = keyword;
        if (selectedCategory) params.category = selectedCategory;
        const { data } = await api.get('/products', { params });
        setProducts(data);
      } catch (err) {
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [keyword, selectedCategory]);

  const handleSearch = (e) => {
    e.preventDefault();
    setKeyword(searchInput);
  };

  const handleClearFilters = () => {
    setKeyword('');
    setSearchInput('');
    setSelectedCategory('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-700 to-indigo-500 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to ShopEase</h1>
          <p className="text-indigo-100 text-lg mb-8">Discover amazing products at unbeatable prices</p>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              type="submit"
              className="bg-white text-indigo-700 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters Row */}
        <div className="flex flex-wrap gap-3 mb-6 items-center">
          <span className="text-sm font-medium text-gray-600">Filter by category:</span>
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              selectedCategory === ''
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-gray-600 border-gray-300 hover:border-indigo-400'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-indigo-400'
              }`}
            >
              {cat}
            </button>
          ))}
          {(keyword || selectedCategory) && (
            <button
              onClick={handleClearFilters}
              className="px-3 py-1.5 text-sm text-red-500 hover:text-red-700 flex items-center gap-1"
            >
              ✕ Clear filters
            </button>
          )}
        </div>

        {/* Results header */}
        {(keyword || selectedCategory) && (
          <div className="mb-4 text-gray-600 text-sm">
            {!loading && (
              <span>
                Showing {products.length} result{products.length !== 1 ? 's' : ''}
                {keyword && <> for <strong>"{keyword}"</strong></>}
                {selectedCategory && <> in <strong>{selectedCategory}</strong></>}
              </span>
            )}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-8 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">⚠️</div>
            <p className="text-red-500 text-lg">{error}</p>
            <button
              onClick={() => setKeyword('')}
              className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Retry
            </button>
          </div>
        )}

        {/* No results */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-500 text-lg">No products found</p>
            <button onClick={handleClearFilters} className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              Clear filters
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
