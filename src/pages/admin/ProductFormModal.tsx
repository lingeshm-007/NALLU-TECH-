import React, { useState, useEffect, useRef } from 'react';
import { Product, ProductCategory, PRODUCT_CATEGORIES, ProductSpecification } from '../../types';
import { useProducts } from '../../context/ProductContext';
import { X, Upload, Plus, Trash2, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
  onSaved: (message: string) => void;
}

// Helpers for image URL validation & extraction
const cleanImageUrl = (raw: string): string => {
  const trimmed = raw.trim();
  if (!trimmed) return '';

  try {
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      const urlObj = new URL(trimmed);

      // Check Google Image search redirect (imgres?imgurl=...)
      const imgurl = urlObj.searchParams.get('imgurl');
      if (imgurl) {
        return decodeURIComponent(imgurl);
      }

      // Check Google search redirect (url?q=... or url?url=...)
      const q = urlObj.searchParams.get('q');
      if (q && (q.startsWith('http://') || q.startsWith('https://'))) {
        return decodeURIComponent(q);
      }

      const u = urlObj.searchParams.get('url');
      if (u && (u.startsWith('http://') || u.startsWith('https://'))) {
        return decodeURIComponent(u);
      }
    }
  } catch {
    // fallback
  }

  return trimmed;
};

const isGoogleSearchUrl = (url: string): boolean => {
  try {
    if (!url.startsWith('http://') && !url.startsWith('https://')) return false;
    const parsed = new URL(url);
    return parsed.hostname.includes('google.') && (parsed.pathname.includes('/search') || parsed.pathname === '/');
  } catch {
    return false;
  }
};

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  productToEdit,
  onSaved,
}) => {
  const { addProduct, updateProduct, uploadProductImage } = useProducts();

  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [modelNumber, setModelNumber] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Car Batteries');
  const [price, setPrice] = useState<string>('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [isAvailable, setIsAvailable] = useState<boolean>(true);
  const [specifications, setSpecifications] = useState<ProductSpecification[]>([
    { key: 'Capacity', value: '' },
    { key: 'Voltage', value: '12V' },
    { key: 'Warranty', value: '' },
  ]);

  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageTab, setImageTab] = useState<'upload' | 'url'>('upload');
  const [imageLoadError, setImageLoadError] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Initialize form when opening or changing productToEdit
  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setBrand(productToEdit.brand);
      setModelNumber(productToEdit.model_number);
      setCategory(productToEdit.category);
      setPrice(productToEdit.price !== null && productToEdit.price !== undefined ? String(productToEdit.price) : '');
      setImageUrl(productToEdit.image_url);
      setDescription(productToEdit.description);
      setIsAvailable(productToEdit.is_available);
      setSpecifications(
        productToEdit.specifications && productToEdit.specifications.length > 0
          ? productToEdit.specifications
          : [{ key: 'Capacity', value: '' }, { key: 'Warranty', value: '' }]
      );
    } else {
      // Default reset for new product
      setName('');
      setBrand('');
      setModelNumber('');
      setCategory('Car Batteries');
      setPrice('');
      setImageUrl('');
      setDescription('');
      setIsAvailable(true);
      setSpecifications([
        { key: 'Capacity', value: '' },
        { key: 'Voltage', value: '12V' },
        { key: 'Warranty', value: '' },
      ]);
    }
    setError(null);
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  // Handle Specification row additions and removals
  const handleAddSpecRow = () => {
    setSpecifications([...specifications, { key: '', value: '' }]);
  };

  const handleRemoveSpecRow = (index: number) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  const handleSpecChange = (index: number, field: 'key' | 'value', value: string) => {
    const updated = [...specifications];
    updated[index][field] = value;
    setSpecifications(updated);
  };

  // Handle Image File Upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPEG, PNG, WebP).');
      return;
    }

    setUploadingImage(true);
    setError(null);

    const result = await uploadProductImage(file);
    setUploadingImage(false);

    if (result.url) {
      setImageUrl(result.url);
      setImageLoadError(false);
    } else {
      setError(result.error || 'Failed to process product image.');
    }
  };

  // Handle image URL changes with auto-extraction of direct image URLs
  const handleImageUrlChange = (val: string) => {
    const cleaned = cleanImageUrl(val);
    setImageUrl(cleaned);
    setImageLoadError(false);
  };

  // Handle direct paste of image from clipboard (Cmd+V / Ctrl+V)
  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) {
            e.preventDefault();
            setUploadingImage(true);
            setError(null);
            setImageLoadError(false);
            const result = await uploadProductImage(file);
            setUploadingImage(false);
            if (result.url) {
              setImageUrl(result.url);
              setImageTab('upload');
            }
            return;
          }
        }
      }
    }
  };

  // Handle Drag and Drop
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setUploadingImage(true);
      setError(null);
      setImageLoadError(false);
      const result = await uploadProductImage(file);
      setUploadingImage(false);
      if (result.url) {
        setImageUrl(result.url);
        setImageTab('upload');
      }
    }
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!name.trim()) {
      setError('Product Name is required.');
      return;
    }
    if (!brand.trim()) {
      setError('Brand name is required.');
      return;
    }
    if (!category) {
      setError('Please select a valid product category.');
      return;
    }

    // Clean specifications (remove completely blank rows)
    const cleanedSpecs = specifications.filter((s) => s.key.trim().length > 0 || s.value.trim().length > 0);

    const parsedPrice = price.trim() !== '' ? Number(price.trim()) : null;

    setIsSubmitting(true);

    const payload = {
      name: name.trim(),
      brand: brand.trim(),
      model_number: modelNumber.trim() || 'Standard',
      category,
      image_url:
        imageUrl.trim() ||
        '/images/products/car-amaron.jpg',
      price: parsedPrice !== null && !isNaN(parsedPrice) ? parsedPrice : null,
      description: description.trim() || 'High performance reliable battery solution from NALLU TECH.',
      specifications: cleanedSpecs,
      is_available: isAvailable,
    };

    if (productToEdit) {
      const res = await updateProduct(productToEdit.id, payload);
      setIsSubmitting(false);
      if (res.success) {
        onSaved(`Product "${payload.name}" updated successfully.`);
        onClose();
      } else {
        setError(res.error || 'Failed to update product.');
      }
    } else {
      const res = await addProduct(payload);
      setIsSubmitting(false);
      if (res.success) {
        onSaved(`Product "${payload.name}" added successfully.`);
        onClose();
      } else {
        setError(res.error || 'Failed to create product.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div className="fixed inset-0" onClick={onClose}></div>

      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-gray-200 z-10 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/80">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {productToEdit ? 'Edit Product' : 'Add New Product'}
            </h2>
            <p className="text-xs text-slate-500">
              {productToEdit
                ? `Update specifications, price, or availability for ${productToEdit.name}`
                : 'Enter details to publish a new battery or inverter to the public website.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-gray-200/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} onPaste={handlePaste} className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-800">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              1. Basic Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Amaron PRO DIN65 Car Battery"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-hidden focus:border-emerald-600 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Brand *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Amaron, Exide, Luminous"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-hidden focus:border-emerald-600 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Model Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. AAM-PR-0DIN65"
                  value={modelNumber}
                  onChange={(e) => setModelNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-hidden focus:border-emerald-600 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ProductCategory)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-hidden focus:border-emerald-600 text-slate-800 bg-white"
                >
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Price in INR (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  placeholder="Leave blank for 'Price on Enquiry'"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-hidden focus:border-emerald-600 text-slate-900"
                />
                <span className="text-[11px] text-slate-500 mt-0.5 block">
                  Leave blank or 0 to display &ldquo;Price on Enquiry&rdquo;
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Product Image */}
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                2. Product Image
              </h3>
              <div className="flex items-center gap-1 text-xs">
                <button
                  type="button"
                  onClick={() => setImageTab('upload')}
                  className={`px-2.5 py-1 rounded-md font-semibold ${
                    imageTab === 'upload' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-gray-100'
                  }`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setImageTab('url')}
                  className={`px-2.5 py-1 rounded-md font-semibold ${
                    imageTab === 'url' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-gray-100'
                  }`}
                >
                  Image URL
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start gap-4">
              {/* Image Preview Box with Drag & Drop & Status */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                className={`w-28 h-28 rounded-xl bg-gray-100 border-2 overflow-hidden flex flex-col items-center justify-center shrink-0 transition-all ${
                  isDragOver ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/20' : 'border-gray-200'
                }`}
              >
                {imageUrl && !imageLoadError ? (
                  <img
                    src={imageUrl}
                    alt="Preview"
                    onError={() => setImageLoadError(true)}
                    className="w-full h-full object-cover"
                  />
                ) : imageLoadError ? (
                  <div className="flex flex-col items-center justify-center text-center p-2 text-rose-500">
                    <AlertCircle className="w-6 h-6 mb-1" />
                    <span className="text-[10px] font-bold leading-tight">Image Error</span>
                    <span className="text-[9px] text-slate-500 mt-0.5">Invalid URL</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center text-slate-400 p-2">
                    <ImageIcon className="w-7 h-7 mb-0.5 text-slate-300" />
                    <span className="text-[10px] font-medium text-slate-400">No Image</span>
                  </div>
                )}
              </div>

              {/* Upload Input or URL field */}
              <div className="flex-1 w-full space-y-2">
                {imageTab === 'upload' ? (
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      disabled={uploadingImage}
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 hover:border-emerald-500 rounded-xl text-xs font-semibold text-slate-700 bg-gray-50/50 hover:bg-emerald-50/30 transition-colors"
                    >
                      {uploadingImage ? (
                        <>
                          <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                          <span>Processing & Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 text-emerald-600" />
                          <span>Choose image file from computer (JPG, PNG, WebP)</span>
                        </>
                      )}
                    </button>
                    <span className="text-[11px] text-slate-500 block mt-1">
                      💡 Tip: You can also drag & drop an image or paste (<kbd className="px-1 py-0.5 bg-gray-100 rounded text-[10px] border">Cmd+V</kbd>) directly!
                    </span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="https://example.com/battery.jpg (or right-click image & choose 'Copy Image Address')"
                      value={imageUrl}
                      onChange={(e) => handleImageUrlChange(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-hidden text-slate-900 ${
                        imageLoadError || isGoogleSearchUrl(imageUrl)
                          ? 'border-amber-400 focus:border-amber-500 ring-2 ring-amber-400/10'
                          : 'border-gray-300 focus:border-emerald-600'
                      }`}
                    />

                    {/* Google Search Page Warning Box */}
                    {isGoogleSearchUrl(imageUrl) && (
                      <div className="p-3 rounded-xl bg-amber-50/90 border border-amber-200 text-xs text-amber-950 space-y-1.5 animate-fadeIn">
                        <div className="flex items-center gap-1.5 font-bold text-amber-900 text-[12px]">
                          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>Google Search webpage link detected</span>
                        </div>
                        <p className="text-[11px] text-amber-800 leading-relaxed">
                          The URL pasted is a Google Search webpage, not an actual image file.
                        </p>
                        <div className="text-[11px] bg-white/90 p-2.5 rounded-lg border border-amber-200 text-slate-800 space-y-1">
                          <p className="font-semibold text-slate-900">How to get the actual image link:</p>
                          <ol className="list-decimal list-inside space-y-0.5 text-slate-600">
                            <li>Right-click (or tap and hold on mobile) on the picture in Google.</li>
                            <li>Click <strong>&ldquo;Copy Image Address&rdquo;</strong> (or &ldquo;Copy Image Link&rdquo;).</li>
                            <li>Paste that link here!</li>
                          </ol>
                        </div>
                        <p className="text-[11px] text-emerald-800 font-semibold pt-0.5">
                          💡 Or in Google, right-click &rarr; <strong>&ldquo;Copy Image&rdquo;</strong>, then simply press <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded font-mono text-[10px]">Cmd + V</kbd> or <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded font-mono text-[10px]">Ctrl + V</kbd> on this screen!
                        </p>
                      </div>
                    )}

                    {/* Image Loading Error Alert (non-google) */}
                    {imageLoadError && !isGoogleSearchUrl(imageUrl) && imageUrl.trim().length > 0 && (
                      <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-1 animate-fadeIn">
                        <div className="flex items-center gap-1.5 font-bold text-rose-800 text-[12px]">
                          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                          <span>Could not load image from this URL</span>
                        </div>
                        <p className="text-[11px] text-rose-700 leading-relaxed">
                          Please ensure this URL points directly to an image file (ending in <code>.jpg</code>, <code>.png</code>, or <code>.webp</code>). Or right-click the image and choose <strong>&ldquo;Copy Image Address&rdquo;</strong>.
                        </p>
                      </div>
                    )}

                    <span className="text-[11px] text-slate-500 block">
                      Must be a direct image URL (e.g. ending in <code>.jpg</code>, <code>.png</code>, or <code>.webp</code>).
                    </span>
                  </div>
                )}

                {/* Instant Preset Catalog Image Buttons */}
                <div className="pt-2 border-t border-gray-100">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                    Or pick a verified catalog image preset:
                  </span>
                  <div className="flex flex-wrap gap-1.5 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setImageUrl('/images/products/car-amaron.jpg');
                        setImageLoadError(false);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-gray-200 text-slate-700 font-medium transition-colors"
                    >
                      🚗 Car Battery
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setImageUrl('/images/products/superbike-exide.jpg');
                        setImageLoadError(false);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-gray-200 text-slate-700 font-medium transition-colors"
                    >
                      🏍️ Superbike Battery
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setImageUrl('/images/products/scooty-amaron.jpg');
                        setImageLoadError(false);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-gray-200 text-slate-700 font-medium transition-colors"
                    >
                      🛵 Scooty Battery
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setImageUrl('/images/products/inverter-battery-luminous.jpg');
                        setImageLoadError(false);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-gray-200 text-slate-700 font-medium transition-colors"
                    >
                      ⚡ Inverter Battery
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setImageUrl('/images/products/inverter-luminous.jpg');
                        setImageLoadError(false);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-gray-200 text-slate-700 font-medium transition-colors"
                    >
                      🔌 Sine Wave Inverter
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setImageUrl('/images/products/truck-battery.jpg');
                        setImageLoadError(false);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-gray-200 text-slate-700 font-medium transition-colors"
                    >
                      🚛 Heavy Truck Battery
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setImageUrl('/images/products/solar-battery.jpg');
                        setImageLoadError(false);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-gray-200 text-slate-700 font-medium transition-colors"
                    >
                      ☀️ Solar Battery
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setImageUrl('/images/products/battery-trolley.jpg');
                        setImageLoadError(false);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-gray-200 text-slate-700 font-medium transition-colors"
                    >
                      🛒 Battery Stand / Trolley
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Description */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              3. Description
            </h3>
            <textarea
              rows={3}
              placeholder="Describe the battery application, alloy formulation, or special features..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-hidden focus:border-emerald-600 text-slate-900"
            ></textarea>
          </div>

          {/* Section 4: Technical Specifications */}
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  4. Technical Specifications
                </h3>
                <p className="text-[11px] text-slate-500">
                  Add custom specification rows (e.g., Capacity, Voltage, Warranty, Terminal Type)
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddSpecRow}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Row</span>
              </button>
            </div>

            <div className="space-y-2">
              {specifications.map((spec, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Spec Name (e.g. Capacity)"
                    value={spec.key}
                    onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-xs focus:outline-hidden focus:border-emerald-600 text-slate-900"
                  />
                  <input
                    type="text"
                    placeholder="Value (e.g. 65 Ah)"
                    value={spec.value}
                    onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-xs focus:outline-hidden focus:border-emerald-600 text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSpecRow(index)}
                    aria-label="Remove specification row"
                    className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-gray-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Availability Status */}
          <div className="pt-2 border-t border-gray-100">
            <label className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-200 bg-gray-50/60 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
              />
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  Product Availability Status
                </span>
                <span className="text-[11px] text-slate-500 block">
                  {isAvailable
                    ? 'Marked as "Available / In Stock" on the public website.'
                    : 'Marked as "Out of Stock / Unavailable".'}
                </span>
              </div>
            </label>
          </div>

          {/* Submit & Cancel Buttons */}
          <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-gray-300 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 transition-colors shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving Product...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>{productToEdit ? 'Save Changes' : 'Create Product'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

