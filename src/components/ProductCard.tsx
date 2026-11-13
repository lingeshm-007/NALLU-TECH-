import React, { useState } from 'react';
import { Product } from '../types';
import { formatINR, getWhatsAppUrl } from '../lib/utils';
import { MessageCircle, Check, XCircle, Info, Tag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelectProduct?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelectProduct }) => {
  const [imageError, setImageError] = useState(false);

  // Fallback image
  const fallbackImage = '/images/products/car-amaron.jpg';

  return (
    <div className="flex flex-col bg-white rounded-xl border border-gray-200/90 shadow-2xs hover:shadow-md hover:border-emerald-500/50 transition-all duration-200 overflow-hidden group">
      {/* Product Image & Badges Container with Fixed Uniform Height */}
      <div
        className="relative h-52 w-full bg-slate-100 border-b border-gray-100 flex items-center justify-center overflow-hidden cursor-pointer select-none"
        onClick={() => onSelectProduct?.(product)}
      >
        <img
          src={imageError || !product.image_url ? fallbackImage : product.image_url}
          alt={product.name}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-white/95 text-slate-800 shadow-xs backdrop-blur-xs border border-gray-200/80">
            <Tag className="w-3 h-3 text-emerald-600" />
            {product.brand}
          </span>

          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold shadow-xs ${
              product.is_available
                ? 'bg-emerald-600 text-white'
                : 'bg-amber-600 text-white'
            }`}
          >
            {product.is_available ? (
              <>
                <Check className="w-3 h-3" />
                Available
              </>
            ) : (
              <>
                <XCircle className="w-3 h-3" />
                Out of Stock
              </>
            )}
          </span>
        </div>

        {/* Category Badge on Bottom */}
        <div className="absolute bottom-2 left-2.5 pointer-events-none">
          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-900/80 text-white backdrop-blur-xs">
            {product.category}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Model Number */}
          <p className="text-[11px] font-mono font-medium text-slate-500 uppercase tracking-wider">
            Model: {product.model_number || 'Standard'}
          </p>

          {/* Product Title */}
          <h3
            onClick={() => onSelectProduct?.(product)}
            className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 cursor-pointer mt-1"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-slate-600 line-clamp-2 mt-1.5 leading-relaxed">
            {product.description}
          </p>

          {/* Compact Highlights (first 2 specs) */}
          {product.specifications && product.specifications.length > 0 && (
            <div className="mt-3 pt-2.5 border-t border-gray-100 flex flex-wrap gap-1.5">
              {product.specifications.slice(0, 2).map((spec, i) => (
                <span
                  key={i}
                  className="inline-block px-2 py-0.5 bg-gray-50 text-[11px] text-slate-600 rounded border border-gray-200/80"
                >
                  <strong className="text-slate-800">{spec.key}:</strong> {spec.value}
                </span>
              ))}
              {product.specifications.length > 2 && (
                <button
                  type="button"
                  onClick={() => onSelectProduct?.(product)}
                  className="text-[11px] text-emerald-700 font-semibold hover:underline px-1"
                >
                  +{product.specifications.length - 2} more
                </button>
              )}
            </div>
          )}
        </div>

        {/* Price & Action Row */}
        <div className="pt-3 border-t border-gray-100">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-[11px] text-slate-500 block">Price</span>
              <span
                className={`text-lg font-black tracking-tight ${
                  product.price !== null && product.price !== undefined
                    ? 'text-slate-900'
                    : 'text-emerald-700 text-sm font-bold'
                }`}
              >
                {formatINR(product.price)}
              </span>
            </div>

            <button
              type="button"
              onClick={() => onSelectProduct?.(product)}
              className="text-xs text-slate-600 hover:text-emerald-700 font-medium inline-flex items-center gap-1 transition-colors"
            >
              <Info className="w-3.5 h-3.5 text-emerald-600" />
              <span>Details</span>
            </button>
          </div>

          {/* WhatsApp Enquiry Button with Product Name */}
          <a
            href={getWhatsAppUrl(product.name)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 transition-colors shadow-2xs"
          >
            <MessageCircle className="w-4 h-4 shrink-0" />
            <span>Enquire on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
