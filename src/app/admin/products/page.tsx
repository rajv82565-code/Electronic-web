'use client';
import { useEffect, useState } from 'react';
import { Package, Plus, Edit, Trash2, Search, Star, X, Check, AlertTriangle, Shield } from 'lucide-react';
import { formatPrice, getDiscountedPrice } from '@/components/ProductCard';
import toast from 'react-hot-toast';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<any>(null);
  const [form, setForm] = useState({
    name: '',
    brand: '',
    category_id: '',
    price: '',
    discount: '0',
    description: '',
    stock: '',
    featured: false,
    warranty_period_months: '12',
    specifications: '{}',
  });

  const fetchProducts = () => {
    setLoading(true);
    fetch(`/api/admin/products${search ? `?search=${search}` : ''}`)
      .then(r => r.json())
      .then(d => {
        setProducts(d.products || []);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(d => setCategories(d.categories || []));
    fetchProducts();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const openModal = (product?: any) => {
    if (product) {
      setEditProduct(product);
      setForm({
        name: product.name,
        brand: product.brand,
        category_id: product.category_id?.toString() || '',
        price: product.price?.toString() || '',
        discount: product.discount?.toString() || '0',
        description: product.description || '',
        stock: product.stock?.toString() || '0',
        featured: product.featured === 1,
        warranty_period_months: product.warranty_period_months?.toString() || '12',
        specifications: product.specifications || '{}',
      });
    } else {
      setEditProduct(null);
      setForm({
        name: '',
        brand: '',
        category_id: '',
        price: '',
        discount: '0',
        description: '',
        stock: '',
        featured: false,
        warranty_period_months: '12',
        specifications: '{}',
      });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    const payload = {
      ...form,
      price: parseFloat(form.price),
      discount: parseFloat(form.discount),
      stock: parseInt(form.stock),
      category_id: parseInt(form.category_id),
      warranty_period_months: parseInt(form.warranty_period_months),
      featured: form.featured ? 1 : 0,
    };
    const url = editProduct
      ? `/api/admin/products/${editProduct.product_id}`
      : '/api/admin/products';
    const method = editProduct ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      toast.success(editProduct ? 'Product updated!' : 'Product added!');
      setShowModal(false);
      fetchProducts();
    } else {
      const d = await res.json();
      toast.error(d.error || 'Failed to save product');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this hardware product?')) return;
    const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Product deleted from inventory');
      fetchProducts();
    } else {
      toast.error('Failed to delete');
    }
  };

  const up = (k: keyof typeof form) => (e: React.ChangeEvent<any>) =>
    setForm(f => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  return (
    <div className="p-6 sm:p-8 space-y-6 bg-[#F8FAFC] min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Package className="w-6 h-6 text-blue-600" /> Hardware Inventory Table
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage product specs, pricing, active stock counts, and warranty period coverage.
          </p>
        </div>

        <button
          onClick={() => openModal()}
          className="btn-primary text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add New Hardware
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
        <div className="relative max-w-md">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by product name, brand, category..."
            className="input pl-9 text-xs py-2"
          />
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-5">Hardware Item</th>
                <th className="py-3 px-5">Category</th>
                <th className="py-3 px-5 text-right">Price</th>
                <th className="py-3 px-5 text-right">Stock Level</th>
                <th className="py-3 px-5 text-center">Warranty</th>
                <th className="py-3 px-5 text-center">Featured</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    Loading inventory catalog...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    No hardware products found.
                  </td>
                </tr>
              ) : (
                products.map(p => {
                  const imgs = (() => {
                    try {
                      return typeof p.images === 'string' ? JSON.parse(p.images) : p.images || [];
                    } catch {
                      return [];
                    }
                  })();

                  const isLowStock = p.stock <= 5 && p.stock > 0;
                  const isOutOfStock = p.stock === 0;

                  return (
                    <tr key={p.product_id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 p-1 flex items-center justify-center flex-shrink-0">
                            {imgs[0] ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={imgs[0]}
                                alt={p.name}
                                className="w-full h-full object-contain mix-blend-multiply"
                              />
                            ) : (
                              <span>📱</span>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 leading-tight">{p.name}</p>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                              {p.brand}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-5 text-slate-600 font-medium">
                        {p.category_name || 'General'}
                      </td>

                      <td className="py-3.5 px-5 text-right">
                        <span className="font-bold text-slate-900 font-sans">
                          {formatPrice(getDiscountedPrice(p.price, p.discount))}
                        </span>
                        {p.discount > 0 && (
                          <span className="block text-[10px] text-red-600 font-semibold">
                            -{p.discount}%
                          </span>
                        )}
                      </td>

                      {/* Stock Level with Amber Alert Badge */}
                      <td className="py-3.5 px-5 text-right">
                        {isOutOfStock ? (
                          <span className="bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded text-[11px] font-bold">
                            Out of Stock
                          </span>
                        ) : isLowStock ? (
                          <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded text-[11px] font-bold inline-flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            Only {p.stock} left!
                          </span>
                        ) : (
                          <span className="font-bold text-slate-800 text-xs">
                            {p.stock} in stock
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-5 text-center">
                        <span className="text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded text-[11px] font-medium inline-flex items-center gap-1">
                          <Shield className="w-3 h-3 text-teal-600" />
                          {p.warranty_period_months || 12}M
                        </span>
                      </td>

                      <td className="py-3.5 px-5 text-center">
                        {p.featured === 1 ? (
                          <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-xs inline-flex items-center justify-center">
                            ✓
                          </span>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>

                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openModal(p)}
                            className="p-1.5 bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-lg transition-colors cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(p.product_id)}
                            className="p-1.5 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900">
                {editProduct ? 'Edit Hardware Product' : 'Add New Hardware Product'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="label">Product Name *</label>
                  <input
                    value={form.name}
                    onChange={up('name')}
                    className="input"
                    placeholder="e.g. Samsung Galaxy S25 Ultra"
                  />
                </div>
                <div>
                  <label className="label">Brand *</label>
                  <input
                    value={form.brand}
                    onChange={up('brand')}
                    className="input"
                    placeholder="Samsung"
                  />
                </div>
                <div>
                  <label className="label">Category *</label>
                  <select
                    value={form.category_id}
                    onChange={up('category_id')}
                    className="input cursor-pointer"
                  >
                    <option value="">Select category</option>
                    {categories.map((c: any) => (
                      <option key={c.category_id} value={c.category_id}>
                        {c.category_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Price (₹) *</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={up('price')}
                    className="input font-sans"
                    placeholder="124999"
                  />
                </div>
                <div>
                  <label className="label">Discount (%)</label>
                  <input
                    type="number"
                    value={form.discount}
                    onChange={up('discount')}
                    className="input font-sans"
                    placeholder="8"
                  />
                </div>
                <div>
                  <label className="label">Stock Units in Warehouse *</label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={up('stock')}
                    className="input font-sans"
                    placeholder="15"
                  />
                </div>
                <div>
                  <label className="label">Warranty Coverage (Months) *</label>
                  <select
                    value={form.warranty_period_months}
                    onChange={up('warranty_period_months')}
                    className="input cursor-pointer"
                  >
                    <option value="6">6 Months</option>
                    <option value="12">1 Year (12 Months)</option>
                    <option value="24">2 Years (24 Months)</option>
                    <option value="36">3 Years (36 Months)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="label">Hardware Description</label>
                <textarea
                  value={form.description}
                  onChange={up('description')}
                  rows={3}
                  className="input resize-none"
                  placeholder="Comprehensive description of product specifications, processor, camera..."
                />
              </div>

              <div>
                <label className="label">Specifications JSON</label>
                <textarea
                  value={form.specifications}
                  onChange={up('specifications')}
                  rows={3}
                  className="input font-mono text-[11px] resize-none"
                  placeholder='{"Display": "6.9 QHD+ 120Hz", "Processor": "Snapdragon 8 Elite"}'
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featuredCheck"
                  checked={form.featured}
                  onChange={up('featured')}
                  className="text-blue-600 focus:ring-blue-500 rounded"
                />
                <label htmlFor="featuredCheck" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Feature in Home Page Trending Grid
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="btn-secondary text-xs font-semibold py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="btn-primary text-xs font-semibold py-2 px-6 rounded-lg"
              >
                {editProduct ? 'Save Changes' : 'Create Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
