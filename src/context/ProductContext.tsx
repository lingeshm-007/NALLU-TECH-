import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Product, ShopSettings } from '../types';
import { INITIAL_PRODUCTS } from '../data/initialProducts';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { PHONE_NUMBER, WHATSAPP_NUMBER, GOOGLE_MAPS_URL } from '../lib/utils';

interface ProductContextType {
  products: Product[];
  isLoading: boolean;
  shopSettings: ShopSettings;
  isUsingSupabase: boolean;
  supabaseError: string | null;
  addProduct: (productData: Omit<Product, 'id' | 'created_at'>) => Promise<{ success: boolean; error?: string }>;
  updateProduct: (id: string, productData: Partial<Product>) => Promise<{ success: boolean; error?: string }>;
  deleteProduct: (id: string) => Promise<{ success: boolean; error?: string }>;
  updateShopSettings: (newSettings: Partial<ShopSettings>) => Promise<{ success: boolean; error?: string }>;
  uploadProductImage: (file: File) => Promise<{ url?: string; error?: string }>;
  resetToInitialProducts: () => void;
  refreshProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const LOCAL_PRODUCTS_KEY = 'nallu_tech_products_v4';
const LOCAL_SETTINGS_KEY = 'nallu_tech_shop_settings_v1';

const DEFAULT_SETTINGS: ShopSettings = {
  shop_name: 'NALLU TECH',
  tagline: 'Trusted Battery Solutions',
  experience: '15+ Years of Experience',
  phone: PHONE_NUMBER,
  whatsapp: WHATSAPP_NUMBER,
  maps_url: GOOGLE_MAPS_URL,
  address: '',
};

// Client-side canvas compression utility to reduce file size before uploading
const compressImageToBlob = (file: File, maxDim = 1000): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
              else reject(new Error('Canvas blob conversion failed.'));
            },
            'image/jpeg',
            0.85
          );
        } else {
          resolve(file);
        }
      };
      img.onerror = () => reject(new Error('Failed to process image file.'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file from disk.'));
    reader.readAsDataURL(file);
  });
};

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [shopSettings, setShopSettings] = useState<ShopSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [supabaseError, setSupabaseError] = useState<string | null>(null);

  // Initialize settings from Supabase or localStorage
  const loadSettings = useCallback(async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('shop_settings').select('*').limit(1).single();
        if (data && !error) {
          setShopSettings({
            shop_name: data.shop_name || DEFAULT_SETTINGS.shop_name,
            tagline: data.tagline || DEFAULT_SETTINGS.tagline,
            experience: data.experience || DEFAULT_SETTINGS.experience,
            phone: data.phone || DEFAULT_SETTINGS.phone,
            whatsapp: data.whatsapp || DEFAULT_SETTINGS.whatsapp,
            maps_url: data.maps_url || DEFAULT_SETTINGS.maps_url,
            address: data.address || '',
          });
          return;
        }
      } catch (err) {
        console.warn('Could not fetch shop settings from Supabase:', err);
      }
    }

    const saved = localStorage.getItem(LOCAL_SETTINGS_KEY);
    if (saved) {
      try {
        setShopSettings(JSON.parse(saved));
      } catch {
        setShopSettings(DEFAULT_SETTINGS);
      }
    } else {
      setShopSettings(DEFAULT_SETTINGS);
    }
  }, []);

  // Fetch products from Supabase or local storage
  const refreshProducts = useCallback(async () => {
    setIsLoading(true);

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Supabase error fetching products:', error.message);
          setSupabaseError(error.message);
        } else if (data) {
          setSupabaseError(null);
          const formatted: Product[] = data.map((item) => ({
            id: item.id,
            name: item.name,
            brand: item.brand,
            model_number: item.model_number,
            category: item.category,
            image_url: item.image_url,
            price: item.price !== null && item.price !== undefined ? Number(item.price) : null,
            description: item.description,
            specifications: Array.isArray(item.specifications) ? item.specifications : [],
            is_available: Boolean(item.is_available),
            created_at: item.created_at,
          }));
          setProducts(formatted);
          setIsLoading(false);
          return;
        }
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : 'Unknown database error';
        console.error('Supabase exception fetching products:', errMsg);
        setSupabaseError(errMsg);
      }
    }

    // Local persistent mode fallback when Supabase is not configured or offline
    const local = localStorage.getItem(LOCAL_PRODUCTS_KEY);
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed);
          setIsLoading(false);
          return;
        }
      } catch {
        // Fall back to seed
      }
    }

    // Default initial verified products
    setProducts(INITIAL_PRODUCTS);
    localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadSettings();
    refreshProducts();
  }, [loadSettings, refreshProducts]);

  // Add Product
  const addProduct = async (
    productData: Omit<Product, 'id' | 'created_at'>
  ): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('products')
          .insert([
            {
              name: productData.name,
              brand: productData.brand,
              model_number: productData.model_number,
              category: productData.category,
              image_url: productData.image_url,
              price: productData.price,
              description: productData.description,
              specifications: productData.specifications,
              is_available: productData.is_available,
            },
          ])
          .select()
          .single();

        if (error) {
          return { success: false, error: error.message };
        }

        const inserted: Product = {
          id: data.id,
          name: data.name,
          brand: data.brand,
          model_number: data.model_number,
          category: data.category,
          image_url: data.image_url,
          price: data.price !== null ? Number(data.price) : null,
          description: data.description,
          specifications: data.specifications || [],
          is_available: data.is_available,
          created_at: data.created_at,
        };

        setProducts((prev) => [inserted, ...prev]);
        return { success: true };
      } catch (err: unknown) {
        return {
          success: false,
          error: err instanceof Error ? err.message : 'Database insertion error',
        };
      }
    }

    // Local Persistent Mode
    const newProduct: Product = {
      ...productData,
      id: 'prod-' + Date.now(),
      created_at: new Date().toISOString(),
    };

    setProducts((prev) => {
      const updated = [newProduct, ...prev];
      localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(updated));
      return updated;
    });
    return { success: true };
  };

  // Update Product
  const updateProduct = async (
    id: string,
    updates: Partial<Product>
  ): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const payload: Record<string, unknown> = {};
        if (updates.name !== undefined) payload.name = updates.name;
        if (updates.brand !== undefined) payload.brand = updates.brand;
        if (updates.model_number !== undefined) payload.model_number = updates.model_number;
        if (updates.category !== undefined) payload.category = updates.category;
        if (updates.image_url !== undefined) payload.image_url = updates.image_url;
        if (updates.price !== undefined) payload.price = updates.price;
        if (updates.description !== undefined) payload.description = updates.description;
        if (updates.specifications !== undefined) payload.specifications = updates.specifications;
        if (updates.is_available !== undefined) payload.is_available = updates.is_available;

        const { error } = await supabase.from('products').update(payload).eq('id', id);

        if (error) {
          return { success: false, error: error.message };
        }

        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
        );
        return { success: true };
      } catch (err: unknown) {
        return {
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error during update',
        };
      }
    }

    // Local Persistent Mode
    setProducts((prev) => {
      const updated = prev.map((p) =>
        p.id === id ? { ...p, ...updates, updated_at: new Date().toISOString() } : p
      );
      localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(updated));
      return updated;
    });
    return { success: true };
  };

  // Delete Product
  const deleteProduct = async (id: string): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) {
          return { success: false, error: error.message };
        }

        setProducts((prev) => prev.filter((p) => p.id !== id));
        return { success: true };
      } catch (err: unknown) {
        return {
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error during deletion',
        };
      }
    }

    // Local Persistent Mode
    setProducts((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(updated));
      return updated;
    });
    return { success: true };
  };

  // Update Shop Settings (Address, Phone, Maps Link)
  const updateShopSettings = async (
    newSettings: Partial<ShopSettings>
  ): Promise<{ success: boolean; error?: string }> => {
    const updated = { ...shopSettings, ...newSettings };

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('shop_settings').upsert({
          id: 1,
          shop_name: updated.shop_name,
          tagline: updated.tagline,
          experience: updated.experience,
          phone: updated.phone,
          whatsapp: updated.whatsapp,
          maps_url: updated.maps_url,
          address: updated.address,
        });

        if (error) {
          return { success: false, error: error.message };
        }

        setShopSettings(updated);
        return { success: true };
      } catch (err: unknown) {
        return {
          success: false,
          error: err instanceof Error ? err.message : 'Failed to update shop settings',
        };
      }
    }

    // Local Persistent Mode
    setShopSettings(updated);
    localStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify(updated));
    return { success: true };
  };

  // Upload Product Image with canvas compression & Supabase Storage
  const uploadProductImage = async (file: File): Promise<{ url?: string; error?: string }> => {
    try {
      // 1. Client-side compression
      const compressedBlob = await compressImageToBlob(file, 1000);

      // 2. Upload to Supabase Storage if configured
      if (isSupabaseConfigured && supabase) {
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.jpg`;
        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, compressedBlob, {
            contentType: 'image/jpeg',
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          return {
            error: `Supabase Storage upload failed: ${uploadError.message}. Ensure the 'product-images' bucket exists and RLS allows admin uploads.`,
          };
        }

        const { data: publicData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        if (!publicData?.publicUrl) {
          return { error: 'Failed to retrieve public URL from Supabase Storage.' };
        }

        return { url: publicData.publicUrl };
      }

      // 3. Fallback for Local Mode (Supabase not configured)
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve({ url: reader.result as string });
        reader.onerror = () => resolve({ error: 'Failed to read compressed file.' });
        reader.readAsDataURL(compressedBlob);
      });
    } catch (err: unknown) {
      return {
        error: err instanceof Error ? err.message : 'Failed to process and upload image.',
      };
    }
  };

  const resetToInitialProducts = () => {
    setProducts(INITIAL_PRODUCTS);
    localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        isLoading,
        shopSettings,
        isUsingSupabase: isSupabaseConfigured,
        supabaseError,
        addProduct,
        updateProduct,
        deleteProduct,
        updateShopSettings,
        uploadProductImage,
        resetToInitialProducts,
        refreshProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
