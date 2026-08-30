import { useState, useEffect } from 'react';
import api from '../../api/axios';

const emptyForm = {
  name: '',
  description: '',
  price: '',
  category: '',
  stock: '',
  imageUrl: '',
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [search, setSearch] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/products');
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAdd = () => {
    setEditProduct(null);
    setFormData(emptyForm);
    setFormError('');
    setShowModal(true);
  };

  const openEdit = (product) => {
    setEditProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      imageUrl: product.imageUrl || '',
    });
    setFormError('');
    setShowModal(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
      };
      if (editProduct) {
        await api.put(`/products/${editProduct._id}`, payload);
      } else {
        await api.post('/products', payload);
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await api.delete(`/products/${productId}`);
      setDeleteConfirm(null);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete product');
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">📦 Product Management</h1>
            <p className="text-gray-500 text-sm mt-1">{products.length} total products</p>
          </div>
          <button
            onClick={openAdd}
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            + Add Product
          </button>
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search products by name or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                <tr>
                  <th className="px-6 py-3 text-left">Product</th>
                  <th className="px-6 py-3 text-left">Category</th>
                  <th className="px-6 py-3 text-left">Price</th>
                  <th className="px-6 py-3 text-left">Stock</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4"><div className="flex gap-3"><div className="w-12 h-12 bg-gray-200 rounded-lg" /><div className="h-4 bg-gray-200 rounded w-32 self-center" /></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20" /></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16" /></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-10" /></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20" /></td>
                    </tr>
                  ))
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                      No products found
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                            onError={(e) => { e.target.src = 'https://placehold.co/50x50?text=?'; }}
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-800 line-clamp-1">{product.name}</p>
                            <p className="text-xs text-gray-400 line-clamp-1">{product.description.substring(0, 50)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full font-medium">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        ₹{product.price.toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-medium ${product.stock < 10 ? 'text-red-500' : 'text-green-600'}`}>
                          {product.stock}
                          {product.stock < 10 && <span className="text-xs ml-1">⚠️</span>}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEdit(product)}
                            className="text-xs px-3 py-1.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(product._id)}
                            className="text-xs px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                {editProduct ? '✏️ Edit Product' : '+ Add Product'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-lg text-sm">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea name="description" value={formData.description} onChange={handleChange} required rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
                  <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0" step="0.01"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
                  <input type="number" name="stock" value={formData.stock} onChange={handleChange} required min="0"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <input type="text" name="category" value={formData.category} onChange={handleChange} required
                  placeholder="Electronics, Clothing, etc."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                {formData.imageUrl && (
                  <img src={formData.imageUrl} alt="Preview" className="mt-2 h-24 w-full object-cover rounded-lg"
                    onError={(e) => { e.target.style.display = 'none'; }} />
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-60 transition-colors font-medium">
                  {saving ? 'Saving...' : editProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <div className="text-center">
              <div className="text-4xl mb-3">🗑️</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Product?</h3>
              <p className="text-gray-500 text-sm mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-2.5 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
                <button onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
