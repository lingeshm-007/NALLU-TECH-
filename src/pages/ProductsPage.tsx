import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { Product, PRODUCT_CATEGORIES, ProductCategory } from '../types';
import { ProductCard } from '../components/ProductCard';
import { ProductModal } from '../components/ProductModal';
import { Search, Filter, RotateCcw, PackageSearch } from 'lucide-react';

export const ProductsPage: React.FC = () => {
  const { products, isLoading } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'name'>('default');

  // Sync category filter from URL params if present
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat && PRODUCT_CATEGORIES.includes(cat as ProductCategory)) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  // Extract unique brands for brand filter
  const brandList = useMemo(() => {
    const brands = new Set<string>();
    products.forEach((p) => {
      if (p.brand && p.brand.trim()) brands.add(p.brand.trim());
    });
    return Array.from(brands).sort();
  }, [products]);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Brand filter
    if (selectedBrand !== 'All') {
      result = result.filter((p) => p.brand.toLowerCase() === selectedBrand.toLowerCase());
    }

    // Availability filter
    if (onlyAvailable) {
      result = result.filter((p) => p.is_available);
    }

    // Search query filter
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((p) => {
        const inName = p.name.toLowerCase().includes(q);
        const inBrand = p.brand.toLowerCase().includes(q);
        const inModel = p.model_number?.toLowerCase().includes(q);
        const inDesc = p.description.toLowerCase().includes(q);
        const inSpecs = p.specifications?.some(
          (s) => s.key.toLowerCase().includes(q) || s.value.toLowerCase().includes(q)
        );
        return inName || inBrand || inModel || inDesc || inSpecs;
      });
    }

    // Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => (a.price || 9999999) - (b.price || 9999999));
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [products, selectedCategory, selectedBrand, onlyAvailable, searchQuery, sortBy]);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    if (category === 'All') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category });
    }
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedBrand('All');
    setOnlyAvailable(false);
    setSearchQuery('');
    setSortBy('default');
    setSearchParams({});
  };

  const hasActiveFilters =
    selectedCategory !== 'All' ||
    selectedBrand !== 'All' ||
    onlyAvailable ||
    searchQuery.trim().length > 0 ||
    sortBy !== 'default';

  return (
    <div className="py-10 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title & Breadcrumb header */}
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Catalog & Inventory
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2">
            Batteries, Inverters & Power Solutions
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-3xl">
            Explore authentic products across 9 specialized categories. Every battery is tested, brand-genuine,
            and comes with complete manufacturer warranty.
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-2xs mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4">
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by battery name, brand, model number, capacity (e.g., Amaron, 150Ah)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-hidden focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-slate-900"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-700"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Brand Filter */}
            <div className="md:col-span-3">
              <select
                aria-label="Filter by Brand"
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-hidden focus:border-emerald-600 text-slate-800 bg-white"
              >
                <option value="All">All Brands</option>
                {brandList.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="md:col-span-3">
              <select
                aria-label="Sort Products"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-hidden focus:border-emerald-600 text-slate-800 bg-white"
              >
                <option value="default">Sort by: Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Product Name (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="text-xs font-semibold text-slate-600 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-emerald-600" />
              Category:
            </span>

            <button
              onClick={() => handleCategorySelect('All')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === 'All'
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'bg-gray-100 text-slate-700 hover:bg-gray-200'
              }`}
            >
              All Categories
            </button>

            {PRODUCT_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-700 text-white shadow-2xs'
                    : 'bg-gray-100 text-slate-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Bottom Bar: Availability toggle & reset */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
            <label className="inline-flex items-center gap-2 cursor-pointer font-medium text-slate-700 select-none">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300"
              />
              <span>Show Available / In-Stock Products Only</span>
            </label>

            <div className="flex items-center gap-4">
              <span className="text-slate-500">
                Showing <strong>{filteredProducts.length}</strong> of <strong>{products.length}</strong> products
              </span>

              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-semibold"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset All Filters</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        {isLoading ? (
          <div className="py-24 text-center">
            <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm font-medium text-slate-600">Loading products catalog...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={(p) => setSelectedProduct(p)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 max-w-lg mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 text-slate-400 flex items-center justify-center mx-auto">
              <PackageSearch className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">No matching products found</h3>
              <p className="text-xs text-slate-500 mt-1">
                We couldn't find any products matching your current search or category filters.
              </p>
            </div>
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Filters & Show All</span>
            </button>
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};
