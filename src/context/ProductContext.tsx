import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Product, ShopSettings } from '../types';
import { INITIAL_PRODUCTS } from '../data/initialProducts';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { PHONE_NUMBER, WHATSAPP_NUMBER, GOOGLE_MAPS_URL } from '../lib/utils';

interface ProductContextType {
  products: Product[];
  isLoading: boolean;
  shopSettings: ShopSettings;
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
  address: '', // Kept empty or editable as per requirement: "Do not invent a street address. Provide an editable address field in the admin dashboard."
};

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [shopSettings, setShopSettings] = useState<ShopSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize settings from localStorage or DB
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
      } catch {
        // Fall through to local
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

  // Load products
  const refreshProducts = useCallback(async () => {
    setIsLoading(true);

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
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
          localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(formatted));
          setIsLoading(false);
          return;
        }
      } catch (err) {
        console.error('Error fetching products from Supabase:', err);
      }
    }

    // Fallback to local storage or initial seed
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
        // fallback
      }
    }

    // Default seed
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
    const newId = 'prod-' + Date.now();
    const newProduct: Product = {
      ...productData,
      id: newId,
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('products')
          .insert([
            {
              name: newProduct.name,
              brand: newProduct.brand,
              model_number: newProduct.model_number,
              category: newProduct.category,
              image_url: newProduct.image_url,
              price: newProduct.price,
              description: newProduct.description,
              specifications: newProduct.specifications,
              is_available: newProduct.is_available,
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
          price: data.price,
          description: data.description,
          specifications: data.specifications || [],
          is_available: data.is_available,
          created_at: data.created_at,
        };

        setProducts((prev) => [inserted, ...prev]);
        return { success: true };
      } catch (err: unknown) {
        return { success: false, error: err instanceof Error ? err.message : 'Unknown database error' };
      }
    }

    // Local mode
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
      } catch (err: unknown) {
        return { success: false, error: err instanceof Error ? err.message : 'Unknown error during update' };
      }
    }

    setProducts((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, ...updates, updated_at: new Date().toISOString() } : p));
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
      } catch (err: unknown) {
        return { success: false, error: err instanceof Error ? err.message : 'Unknown error during deletion' };
      }
    }

    setProducts((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(updated));
      return updated;
    });
    return { success: true };
  };

  // Update Shop Settings (Address, etc.)
  const updateShopSettings = async (
    newSettings: Partial<ShopSettings>
  ): Promise<{ success: boolean; error?: string }> => {
    const updated = { ...shopSettings, ...newSettings };

    if (isSupabaseConfigured && supabase) {
      try {
        // Upsert row with ID 1
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
      } catch (err: unknown) {
        return { success: false, error: err instanceof Error ? err.message : 'Failed to update shop settings' };
      }
    }

    setShopSettings(updated);
    localStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify(updated));
    return { success: true };
  };

  // Upload Product Image
  const uploadProductImage = async (file: File): Promise<{ url?: string; error?: string }> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage.from('product-images').upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

        if (uploadError) {
          console.warn('Storage upload error, falling back to base64:', uploadError.message);
        } else {
          const { data: publicData } = supabase.storage.from('product-images').getPublicUrl(filePath);
          if (publicData?.publicUrl) {
            return { url: publicData.publicUrl };
          }
        }
      } catch (err) {
        console.warn('Supabase storage error:', err);
      }
    }

    // Local / Browser base64 fallback with client-side canvas compression for high reliability
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 800;

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
            const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
            resolve({ url: dataUrl });
          } else {
            resolve({ url: e.target?.result as string });
          }
        };
        img.onerror = () => resolve({ error: 'Failed to process image file.' });
        img.src = e.target?.result as string;
      };
      reader.onerror = () => resolve({ error: 'Failed to read file.' });
      reader.readAsDataURL(file);
    });
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

