import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Hero } from '../components/Hero';
import { CategoryCard } from '../components/CategoryCard';
import { ProductCard } from '../components/ProductCard';
import { ProductModal } from '../components/ProductModal';
import { ServicesSection } from '../components/ServicesSection';
import { AboutSection } from '../components/AboutSection';
import { LocationSection } from '../components/LocationSection';
import { useProducts } from '../context/ProductContext';
import { PRODUCT_CATEGORIES, Product } from '../types';
import { ArrowRight, Sparkles, Filter } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { products } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [homeCategoryFilter, setHomeCategoryFilter] = useState<string>('All');

  // Filtered products for home view
  const displayedProducts = (
    homeCategoryFilter === 'All'
      ? products
      : products.filter((p) => p.category === homeCategoryFilter)
  ).slice(0, 8); // Display up to 8 top products

  return (
    <div>
      {/* 1. Hero */}
      <Hero />

      {/* 2. Product Categories Grid */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Product Categories
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
                Power Solutions For Every Need
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl">
                Browse our comprehensive range of high-performance automotive batteries, tubular home
                inverters, and commercial UPS power solutions.
              </p>
            </div>

            <Link
              to="/products"
              className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 hover:text-emerald-800"
            >
              <span>Explore Full Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 9 Category Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PRODUCT_CATEGORIES.map((cat) => {
              const count = products.filter((p) => p.category === cat).length;
              return <CategoryCard key={cat} category={cat} productCount={count} />;
            })}
          </div>
        </div>
      </section>

      {/* 3. Featured / Recent Products Section */}
      <section className="py-16 sm:py-20 bg-gray-50 border-t border-gray-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Featured Inventory</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
                Popular Batteries & Inverters
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-1">
                Authentic, brand-certified models ready for quick doorstep or in-shop fitment.
              </p>
            </div>

            {/* Quick Filter buttons */}
            <div className="mt-5 md:mt-0 flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              <span className="text-xs text-slate-600 font-semibold flex items-center gap-1 shrink-0 mr-1">
                <Filter className="w-3.5 h-3.5" /> Filter:
              </span>
              {['All', 'Car Batteries', 'Bike Batteries', 'Inverter Batteries', 'Inverters'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setHomeCategoryFilter(filter)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    homeCategoryFilter === filter
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'bg-white text-slate-600 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={(p) => setSelectedProduct(p)}
              />
            ))}
          </div>

          {/* View All Products button */}
          <div className="mt-12 text-center">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold text-slate-900 bg-white hover:bg-gray-100 border border-gray-300 shadow-2xs hover:shadow-sm transition-all"
            >
              <span>View All Available Products</span>
              <ArrowRight className="w-4 h-4 text-emerald-600" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Services Section */}
      <ServicesSection />

      {/* 5. About Section */}
      <AboutSection />

      {/* 6. Location & Contact Section */}
      <LocationSection />

      {/* Product Details Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};

