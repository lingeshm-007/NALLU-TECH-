import React, { useEffect } from 'react';
import { Product } from '../types';
import { formatINR, getWhatsAppUrl, PHONE_NUMBER } from '../lib/utils';
import { X, MessageCircle, Phone, Check, XCircle, Tag, ShieldAlert } from 'lucide-react';
import { useProducts } from '../context/ProductContext';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const { shopSettings } = useProducts();
  const [imageError, setImageError] = React.useState(false);

  useEffect(() => {
    setImageError(false);
  }, [product]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (product) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [product, onClose]);

  if (!product) return null;

  const fallbackImage = '/images/products/car-amaron.jpg';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      {/* Backdrop click to close */}
      <div className="fixed inset-0" onClick={onClose}></div>

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-10 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/70">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>{product.category}</span>
            <span>&bull;</span>
            <span className="text-emerald-700 font-bold">{product.brand}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-gray-200/80 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Image */}
            <div className="md:col-span-5">
              <div className="h-56 rounded-xl overflow-hidden bg-slate-100 border border-gray-200 flex items-center justify-center">
                <img
                  src={imageError || !product.image_url ? fallbackImage : product.image_url}
                  alt={product.name}
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Status & Model info under image */}
              <div className="mt-3 space-y-2">
                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold w-full justify-center ${
                    product.is_available
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}
                >
                  {product.is_available ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>In Stock & Ready for Fitment</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-amber-600" />
                      <span>Currently Out of Stock / On Order</span>
                    </>
                  )}
                </div>

                <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-200 text-center">
                  <span className="text-[10px] uppercase font-semibold text-slate-600 block">
                    Manufacturer Model No.
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-900">
                    {product.model_number || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Product Meta & Specs */}
            <div className="md:col-span-7 space-y-4">
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight leading-snug">
                  {product.name}
                </h2>

                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-xs font-semibold text-slate-600 uppercase">Price:</span>
                  <span
                    className={`text-2xl font-black ${
                      product.price !== null && product.price !== undefined
                        ? 'text-emerald-700'
                        : 'text-slate-800 text-lg'
                    }`}
                  >
                    {formatINR(product.price)}
                  </span>
                  {product.price && (
                    <span className="text-[11px] text-slate-600">(Inclusive of all taxes)</span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="text-sm text-slate-600 leading-relaxed bg-gray-50/70 p-3.5 rounded-xl border border-gray-100">
                {product.description}
              </div>

              {/* Specifications Table */}
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-emerald-600" />
                  Technical Specifications
                </h3>

                {product.specifications && product.specifications.length > 0 ? (
                  <div className="rounded-xl border border-gray-200 overflow-hidden divide-y divide-gray-100 text-xs">
                    {product.specifications.map((spec, idx) => (
                      <div key={idx} className="grid grid-cols-2 p-2.5 bg-white odd:bg-gray-50/50">
                        <span className="font-semibold text-slate-700">{spec.key}</span>
                        <span className="text-slate-900 font-mono text-right sm:text-left">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-600 italic">
                    Specifications available upon direct shop enquiry.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer CTAs */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600 font-medium">
            <ShieldAlert className="w-3.5 h-3.5 text-emerald-600" />
            <span>NALLU TECH Genuine Warranty Guarantee</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <a
              href={`tel:${shopSettings.phone || PHONE_NUMBER}`}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-800 bg-white border border-gray-300 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>Call Shop</span>
            </a>

            <a
              href={getWhatsAppUrl(product.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-sm transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Enquire via WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

