import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProducts } from '../../context/ProductContext';
import { Product, PRODUCT_CATEGORIES } from '../../types';
import { formatINR } from '../../lib/utils';
import { supabaseUrl } from '../../lib/supabase';
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
  ShieldCheck,
  Cloud,
  HardDrive,
  Info,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user, logout, isUsingSupabase } = useAuth();
  const { products, deleteProduct, updateProduct, resetToInitialProducts, supabaseError } = useProducts();

  const [activeTab, setActiveTab] = useState<'products' | 'settings' | 'database'>('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Toasts & Copy States
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [copiedRoleSql, setCopiedRoleSql] = useState(false);

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
    const sql = `-- NALLU TECH Production PostgreSQL Schema
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    model_number TEXT NOT NULL DEFAULT '',
    category TEXT NOT NULL,
    image_url TEXT NOT NULL,
    price NUMERIC NULL,
    description TEXT NOT NULL DEFAULT '',
    specifications JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_available BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_available ON public.products(is_available);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);

CREATE TABLE IF NOT EXISTS public.shop_settings (
    id INT PRIMARY KEY DEFAULT 1,
    shop_name TEXT NOT NULL DEFAULT 'NALLU TECH',
    tagline TEXT NOT NULL DEFAULT 'Trusted Battery Solutions',
    experience TEXT NOT NULL DEFAULT '15+ Years of Experience',
    phone TEXT NOT NULL DEFAULT '+91 8248949759',
    whatsapp TEXT NOT NULL DEFAULT '918248949759',
    maps_url TEXT NOT NULL DEFAULT 'https://www.google.com/maps/place/Nallu+Tech,/@11.5416413,79.1292909,488m/data=!3m1!1e3!4m6!3m5!1s0x3bab4721f742a30b:0xe674301feac43ab4!8m2!3d11.541912!4d79.1315204!16s%2Fg%2F11c7pc27g7?entry=ttu',
    address TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

INSERT INTO public.shop_settings (id, shop_name) VALUES (1, 'NALLU TECH') ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shop_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access for products" ON public.products;
CREATE POLICY "Public read access for products" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin insert access for products" ON public.products;
CREATE POLICY "Admin insert access for products" ON public.products FOR INSERT
WITH CHECK (
    auth.role() = 'authenticated' AND (
        LOWER(auth.jwt() ->> 'email') = 'nallutech07@gmail.com'
        OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
        OR (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
    )
);

DROP POLICY IF EXISTS "Admin update access for products" ON public.products;
CREATE POLICY "Admin update access for products" ON public.products FOR UPDATE
USING (
    auth.role() = 'authenticated' AND (
        LOWER(auth.jwt() ->> 'email') = 'nallutech07@gmail.com'
        OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
        OR (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
    )
)
WITH CHECK (
    auth.role() = 'authenticated' AND (
        LOWER(auth.jwt() ->> 'email') = 'nallutech07@gmail.com'
        OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
        OR (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
    )
);

DROP POLICY IF EXISTS "Admin delete access for products" ON public.products;
CREATE POLICY "Admin delete access for products" ON public.products FOR DELETE
USING (
    auth.role() = 'authenticated' AND (
        LOWER(auth.jwt() ->> 'email') = 'nallutech07@gmail.com'
        OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
        OR (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
    )
);

DROP POLICY IF EXISTS "Public read access for shop settings" ON public.shop_settings;
CREATE POLICY "Public read access for shop settings" ON public.shop_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin write access for shop settings" ON public.shop_settings;
CREATE POLICY "Admin write access for shop settings" ON public.shop_settings FOR ALL
USING (
    auth.role() = 'authenticated' AND (
        LOWER(auth.jwt() ->> 'email') = 'nallutech07@gmail.com'
        OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
        OR (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
    )
)
WITH CHECK (
    auth.role() = 'authenticated' AND (
        LOWER(auth.jwt() ->> 'email') = 'nallutech07@gmail.com'
        OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
        OR (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
    )
);

INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true) ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public read access for product images" ON storage.objects;
CREATE POLICY "Public read access for product images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Admin upload access for product images" ON storage.objects;
CREATE POLICY "Admin upload access for product images" ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'product-images' AND
    auth.role() = 'authenticated' AND (
        LOWER(auth.jwt() ->> 'email') = 'nallutech07@gmail.com'
        OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
        OR (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
    )
);

DROP POLICY IF EXISTS "Admin update access for product images" ON storage.objects;
CREATE POLICY "Admin update access for product images" ON storage.objects FOR UPDATE
USING (
    bucket_id = 'product-images' AND
    auth.role() = 'authenticated' AND (
        LOWER(auth.jwt() ->> 'email') = 'nallutech07@gmail.com'
        OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
        OR (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
    )
)
WITH CHECK (
    bucket_id = 'product-images' AND
    auth.role() = 'authenticated' AND (
        LOWER(auth.jwt() ->> 'email') = 'nallutech07@gmail.com'
        OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
        OR (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
    )
);

DROP POLICY IF EXISTS "Admin delete access for product images" ON storage.objects;
CREATE POLICY "Admin delete access for product images" ON storage.objects FOR DELETE
USING (
    bucket_id = 'product-images' AND
    auth.role() = 'authenticated' AND (
        LOWER(auth.jwt() ->> 'email') = 'nallutech07@gmail.com'
        OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
        OR (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
    )
);`;
    navigator.clipboard.writeText(sql);
    setCopiedSchema(true);
    addToast('success', 'Production SQL schema copied to clipboard.');
    setTimeout(() => setCopiedSchema(false), 3000);
  };

  const handleCopyRoleSql = () => {
    const sql = `UPDATE auth.users SET raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}'::jsonb WHERE email = 'nallutech07@gmail.com';`;
    navigator.clipboard.writeText(sql);
    setCopiedRoleSql(true);
    addToast('success', 'Admin role authorization SQL copied to clipboard.');
    setTimeout(() => setCopiedRoleSql(false), 3000);
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
              {/* Cloud Connection Badge */}
              <div className="hidden lg:flex items-center">
                {isUsingSupabase ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                    <Cloud className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Supabase Cloud Mode</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-amber-950 text-amber-300 border border-amber-800">
                    <HardDrive className="w-3.5 h-3.5 text-amber-400" />
                    <span>Local Mode (Unconfigured)</span>
                  </span>
                )}
              </div>

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
                <span>Signed in:</span>
                <strong className="text-slate-200">{user?.email || 'Admin'}</strong>
              </div>

              <button
                onClick={() => logout()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-200 font-semibold border border-red-800 transition-colors ml-2 cursor-pointer"
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
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
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
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
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
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
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
            {/* Supabase Error Alert if present */}
            {supabaseError && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3 text-xs text-red-900 shadow-2xs">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold block">Supabase Connection / Query Notice</span>
                  <p className="leading-relaxed">
                    {supabaseError}. If tables have not been created yet, please visit the{' '}
                    <strong>Database & Deployment</strong> tab and run <code>supabase_schema.sql</code> in your
                    Supabase SQL Editor.
                  </p>
                </div>
              </div>
            )}

            {/* Local Storage Mode Notice if Supabase is unconfigured */}
            {!isUsingSupabase && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-900 shadow-2xs">
                <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold block">Local Demonstration Mode Active</span>
                  <p className="leading-relaxed">
                    Your local <code>.env</code> file does not have <code>VITE_SUPABASE_URL</code> and{' '}
                    <code>VITE_SUPABASE_ANON_KEY</code> configured. All catalog additions, edits, and deletions
                    are currently saved inside this browser&apos;s localStorage only. To persist data in your
                    Supabase PostgreSQL database and upload to persistent cloud storage, configure credentials in{' '}
                    <code>.env</code>.
                  </p>
                </div>
              </div>
            )}

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
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Export JSON</span>
                </button>

                <button
                  onClick={handleOpenAddModal}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 shadow-xs transition-all cursor-pointer"
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
                                <span className="font-mono">Mod: {product.model_number || 'Standard'}</span>
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
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
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
                            className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                            title="Edit product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setProductToDelete(product)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
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
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                    Backend Status & Diagnostics
                  </span>
                  <h3 className="text-xl font-black text-slate-900 mt-2">
                    Supabase PostgreSQL & Cloud Storage
                  </h3>
                </div>

                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold self-start sm:self-auto ${
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
                  {isUsingSupabase ? 'Supabase Cloud Connected' : 'Local Demonstration Mode'}
                </span>
              </div>

              {/* Status Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    VITE_SUPABASE_URL
                  </span>
                  <span className="text-xs font-mono font-semibold text-slate-800 block truncate">
                    {supabaseUrl ? `${supabaseUrl.slice(0, 24)}...` : 'Not Configured (Empty)'}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Security Authorization (RLS)
                  </span>
                  <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Admin Email / Role Restrictive
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {isUsingSupabase
                  ? 'Your application is connected to Supabase PostgreSQL. All product updates, price changes, and uploaded photos persist directly in the cloud database.'
                  : 'Currently operating in browser localStorage mode. When you configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your local .env, the application automatically switches to cloud mode.'}
              </p>

              {/* Instructions */}
              <div className="p-5 rounded-xl bg-gray-50 border border-gray-200 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Step-by-Step Supabase Setup
                </h4>
                <ol className="text-xs text-slate-600 list-decimal pl-5 space-y-2 leading-relaxed">
                  <li>
                    Open your Supabase project dashboard at <strong>https://supabase.com</strong>.
                  </li>
                  <li>
                    Navigate to <strong>SQL Editor</strong> in the left sidebar, click <strong>New Query</strong>, and paste the full database schema.
                  </li>
                  <li>
                    Navigate to <strong>Authentication &gt; Users</strong>, click <strong>Add User</strong>, and invite or create your admin email (e.g. <code>nallutech07@gmail.com</code>).
                  </li>
                  <li>
                    Run the Admin Role Authorization query below to grant explicit admin privileges to that account.
                  </li>
                  <li>
                    Copy your Project URL and anon key into <code>.env</code>.
                  </li>
                </ol>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={handleCopySchemaSql}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-800 bg-white border border-gray-300 hover:bg-gray-100 transition-colors shadow-2xs cursor-pointer"
                  >
                    {copiedSchema ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSchema ? 'Schema Copied!' : 'Copy SQL Schema (supabase_schema.sql)'}</span>
                  </button>

                  <button
                    onClick={handleCopyRoleSql}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors shadow-2xs cursor-pointer"
                  >
                    {copiedRoleSql ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                    <span>{copiedRoleSql ? 'Role SQL Copied!' : 'Copy Admin Authorization SQL'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Catalog Maintenance & Initial Seed */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 space-y-4">
              <h3 className="text-lg font-bold text-slate-900">
                Catalog Maintenance & Local Data Reset
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Reset your local catalog to the verified product catalog (covers 9 categories including
                Amaron, Exide, Luminous, and Microtek). Note: Cloud products in Supabase are never deleted by this action.
              </p>

              <button
                onClick={() => {
                  if (confirm('Are you sure you want to restore the default initial catalog locally?')) {
                    resetToInitialProducts();
                    addToast('success', 'Local product catalog restored to initial verified data.');
                  }
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restore Default Catalog</span>
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
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-gray-100 hover:bg-gray-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 cursor-pointer"
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
