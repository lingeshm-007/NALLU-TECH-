import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProducts } from '../../context/ProductContext';
import { Product, PRODUCT_CATEGORIES } from '../../types';
import { formatINR } from '../../lib/utils';
import { ProductFormModal } from './ProductFormModal';
import { SettingsTab } from './SettingsTab';
import { Toast, ToastMessage } from '../../components/Toast';
import {
  BatteryCharging,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  LogOut,
  ExternalLink,
  Sliders,
  Database,
  Layers,
  Download,
  RotateCcw,
  AlertTriangle,
  Copy,
  Check,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user, logout, isUsingSupabase } = useAuth();
  const { products, deleteProduct, updateProduct, resetToInitialProducts } = useProducts();

  const [activeTab, setActiveTab] = useState<'products' | 'settings' | 'database'>('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [copiedSchema, setCopiedSchema] = useState(false);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.model_number?.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const availableCount = products.filter((p) => p.is_available).length;
  const outOfStockCount = products.length - availableCount;

  // Actions
  const handleOpenAddModal = () => {
    setProductToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setProductToEdit(product);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    const res = await deleteProduct(productToDelete.id);
    if (res.success) {
      addToast('success', `Product "${productToDelete.name}" deleted successfully.`);
      setProductToDelete(null);
    } else {
      addToast('error', res.error || 'Failed to delete product.');
    }
  };

  const handleToggleAvailability = async (product: Product) => {
    const newStatus = !product.is_available;
    const res = await updateProduct(product.id, { is_available: newStatus });
    if (res.success) {
      addToast(
        'info',
        `"${product.name}" marked as ${newStatus ? 'Available' : 'Out of Stock'}.`
      );
    } else {
      addToast('error', res.error || 'Failed to update status.');
    }
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(products, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `nallu-tech-products-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addToast('success', 'Products exported successfully as JSON.');
  };

  const handleCopySchemaSql = () => {
    const sql = `-- NALLU TECH Schema
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    model_number TEXT NOT NULL,
    category TEXT NOT NULL,
    image_url TEXT NOT NULL,
    price NUMERIC NULL,
    description TEXT NOT NULL,
    specifications JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_available BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admin write products" ON public.products FOR ALL USING (auth.role() = 'authenticated');`;
    navigator.clipboard.writeText(sql);
    setCopiedSchema(true);
    addToast('success', 'Supabase SQL schema copied to clipboard.');
    setTimeout(() => setCopiedSchema(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Admin Top Navigation */}
      <header className="sticky top-0 z-30 bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
                <BatteryCharging className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-base text-white tracking-tight">NALLU TECH</span>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block -mt-1">
                  Private Admin Console
                </span>
              </div>
            </div>

            {/* User & Actions */}
            <div className="flex items-center gap-3 text-xs">
              <Link
                to="/"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors"
              >
                <span>View Public Site</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              <div className="hidden md:flex items-center gap-2 pl-3 border-l border-slate-800 text-slate-400">
                <span>Signed in as:</span>
                <strong className="text-slate-200">{user?.email || 'nallutech07@gmail.com'}</strong>
              </div>

              <button
                onClick={() => logout()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-200 font-semibold border border-red-800 transition-colors ml-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Admin Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto border-t border-slate-800 py-2 scrollbar-none">
            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                activeTab === 'products'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Products Management ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Shop Address & Contact</span>
            </button>

            <button
              onClick={() => setActiveTab('database')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                activeTab === 'database'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Database & Deployment</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* TAB 1: PRODUCTS MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-2xs">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                  Total Catalog Items
                </span>
                <span className="text-2xl font-black text-slate-900 mt-1 block">
                  {products.length}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-2xs">
                <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider block">
                  Available in Stock
                </span>
                <span className="text-2xl font-black text-emerald-700 mt-1 block">
                  {availableCount}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-2xs">
                <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider block">
                  Currently Out of Stock
                </span>
                <span className="text-2xl font-black text-amber-700 mt-1 block">
                  {outOfStockCount}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-2xs">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                  Active Categories
                </span>
                <span className="text-2xl font-black text-slate-900 mt-1 block">
                  {PRODUCT_CATEGORIES.length}
                </span>
              </div>
            </div>

            {/* Action Bar & Filters */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex-1 w-full flex flex-col sm:flex-row items-center gap-3">
                {/* Search */}
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-300 text-xs focus:outline-hidden focus:border-emerald-600 text-slate-900"
                  />
                </div>

                {/* Category filter */}
                <div className="w-full sm:w-56">
                  <select
                    aria-label="Filter by Category"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:outline-hidden focus:border-emerald-600 text-slate-800 bg-white"
                  >
                    <option value="All">All Categories ({products.length})</option>
                    {PRODUCT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat} ({products.filter((p) => p.category === cat).length})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
                <button
                  onClick={handleExportJSON}
                  title="Export catalog data as JSON"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Export JSON</span>
                </button>

                <button
                  onClick={handleOpenAddModal}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 shadow-sm transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
                  <thead className="bg-gray-50 text-slate-500 uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="px-4 py-3">Product</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Price</th>
                      <th className="px-4 py-3 text-center">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50/80 transition-colors">
                        {/* Product Info */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-12 h-12 rounded-lg object-cover bg-gray-100 border border-gray-200 shrink-0"
                            />
                            <div className="min-w-0">
                              <span className="font-bold text-slate-900 block truncate max-w-xs sm:max-w-md">
                                {product.name}
                              </span>
                              <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                                <span className="font-semibold text-emerald-700">{product.brand}</span>
                                <span>&bull;</span>
                                <span className="font-mono">Mod: {product.model_number || 'N/A'}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-4 py-3.5 whitespace-nowrap text-slate-600 font-medium">
                          <span className="px-2.5 py-1 rounded-md bg-gray-100 text-slate-800 text-[11px]">
                            {product.category}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="px-4 py-3.5 whitespace-nowrap font-bold text-slate-900">
                          {formatINR(product.price)}
                        </td>

                        {/* Availability Toggle */}
                        <td className="px-4 py-3.5 whitespace-nowrap text-center">
                          <button
                            onClick={() => handleToggleAvailability(product)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                              product.is_available
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                                : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                            }`}
                          >
                            {product.is_available ? (
                              <>
                                <CheckCircle className="w-3 h-3 text-emerald-600" />
                                In Stock
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3 h-3 text-amber-600" />
                                Out of Stock
                              </>
                            )}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3.5 whitespace-nowrap text-right space-x-1.5">
                          <button
                            onClick={() => handleOpenEditModal(product)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                            title="Edit product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setProductToDelete(product)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredProducts.length === 0 && (
                  <div className="p-8 text-center text-slate-500 text-xs">
                    No products match the selected filters or search terms.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SHOP SETTINGS & ADDRESS */}
        {activeTab === 'settings' && (
          <SettingsTab onSaved={(msg) => addToast('success', msg)} />
        )}

        {/* TAB 3: DATABASE & DEPLOYMENT */}
        {activeTab === 'database' && (
          <div className="space-y-6 max-w-4xl">
            {/* Supabase Status Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                    Backend Connection
                  </span>
                  <h3 className="text-xl font-black text-slate-900 mt-2">
                    Supabase Database & Authentication
                  </h3>
                </div>

                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                    isUsingSupabase
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-900'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isUsingSupabase ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                    }`}
                  ></span>
                  {isUsingSupabase ? 'Supabase Connected' : 'Local Persistent Mode'}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {isUsingSupabase
                  ? 'Your website is actively connected to Supabase Postgres. All products, prices, images, and shop settings persist in your cloud database.'
                  : 'Currently operating in browser persistent storage mode. All changes you make (adding products, uploading images, changing prices, updating address) are saved permanently in localStorage. To enable multi-user cloud synchronization, configure your Supabase credentials in .env.'}
              </p>

              {/* Instructions */}
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Quick Supabase Setup Instructions
                </h4>
                <ol className="text-xs text-slate-600 list-decimal pl-5 space-y-1.5 leading-relaxed">
                  <li>
                    Create a free project at <strong>supabase.com</strong>.
                  </li>
                  <li>
                    Go to <strong>SQL Editor</strong> in Supabase and paste the contents of{' '}
                    <code className="text-emerald-700 bg-white px-1.5 py-0.5 rounded border border-gray-200 font-mono">
                      supabase_schema.sql
                    </code>
                    .
                  </li>
                  <li>
                    Go to <strong>Authentication &gt; Users</strong> and click <strong>Add User</strong>{' '}
                    to create your admin account (e.g. <code>nallutech07@gmail.com</code>).
                  </li>
                  <li>
                    Add your Supabase Project URL and Anon Public Key to <code>.env</code>:
                    <div className="mt-1 font-mono text-[11px] bg-slate-900 text-emerald-300 p-2.5 rounded-lg overflow-x-auto">
                      VITE_SUPABASE_URL=https://your-project.supabase.co<br />
                      VITE_SUPABASE_ANON_KEY=your-anon-key
                    </div>
                  </li>
                </ol>

                <div className="pt-2">
                  <button
                    onClick={handleCopySchemaSql}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-800 bg-white border border-gray-300 hover:bg-gray-100 transition-colors"
                  >
                    {copiedSchema ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSchema ? 'Schema Copied!' : 'Copy SQL Schema to Clipboard'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Catalog Reset & Data Maintenance */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 space-y-4">
              <h3 className="text-lg font-bold text-slate-900">
                Catalog Maintenance & Initial Seed
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Need to reset your product catalog to the default realistic seed list (covers all 9 categories
                including Amaron, Exide, Luminous, Microtek)?
              </p>

              <button
                onClick={() => {
                  if (confirm('Are you sure you want to restore the default initial catalog?')) {
                    resetToInitialProducts();
                    addToast('success', 'Product catalog restored to initial default data.');
                  }
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restore Initial Product Catalog</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="fixed inset-0" onClick={() => setProductToDelete(null)}></div>
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 p-6 space-y-4 z-10">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-slate-900">Delete Product?</h3>
              <p className="text-xs text-slate-600">
                Are you sure you want to remove <strong>&ldquo;{productToDelete.name}&rdquo;</strong>? This
                action will permanently delete this product from your website catalog.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-gray-100 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Add/Edit Form Modal */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productToEdit={productToEdit}
        onSaved={(msg) => addToast('success', msg)}
      />

      {/* Floating Toast Notifications */}
      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};
