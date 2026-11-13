-- ==============================================================================
-- NALLU TECH - Supabase Database Schema & Storage Setup
-- ==============================================================================

-- 1. Create Products Table
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Shop Settings Table (for editable address, contact, etc.)
CREATE TABLE IF NOT EXISTS public.shop_settings (
    id INT PRIMARY KEY DEFAULT 1,
    shop_name TEXT NOT NULL DEFAULT 'NALLU TECH',
    tagline TEXT NOT NULL DEFAULT 'Trusted Battery Solutions',
    experience TEXT NOT NULL DEFAULT '15+ Years of Experience',
    phone TEXT NOT NULL DEFAULT '+91 8248949759',
    whatsapp TEXT NOT NULL DEFAULT '918248949759',
    maps_url TEXT NOT NULL DEFAULT 'https://www.google.com/maps/place/Nallu+Tech,/@11.5416413,79.1292909,488m/data=!3m1!1e3!4m6!3m5!1s0x3bab4721f742a30b:0xe674301feac43ab4!8m2!3d11.541912!4d79.1315204!16s%2Fg%2F11c7pc27g7?entry=ttu',
    address TEXT DEFAULT '',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed initial row in shop_settings
INSERT INTO public.shop_settings (id, shop_name, tagline, experience, phone, whatsapp, maps_url, address)
VALUES (
    1,
    'NALLU TECH',
    'Trusted Battery Solutions',
    '15+ Years of Experience',
    '+91 8248949759',
    '918248949759',
    'https://www.google.com/maps/place/Nallu+Tech,/@11.5416413,79.1292909,488m/data=!3m1!1e3!4m6!3m5!1s0x3bab4721f742a30b:0xe674301feac43ab4!8m2!3d11.541912!4d79.1315204!16s%2Fg%2F11c7pc27g7?entry=ttu',
    ''
) ON CONFLICT (id) DO NOTHING;

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shop_settings ENABLE ROW LEVEL SECURITY;

-- 4. Products RLS Policies
-- Allow anyone to view products
CREATE POLICY "Public read access for products"
    ON public.products FOR SELECT
    USING (true);

-- Allow authenticated admin users to manage products
CREATE POLICY "Admin insert access for products"
    ON public.products FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin update access for products"
    ON public.products FOR UPDATE
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin delete access for products"
    ON public.products FOR DELETE
    USING (auth.role() = 'authenticated');

-- 5. Shop Settings RLS Policies
-- Allow anyone to read shop settings
CREATE POLICY "Public read access for shop settings"
    ON public.shop_settings FOR SELECT
    USING (true);

-- Allow authenticated admin users to modify shop settings
CREATE POLICY "Admin write access for shop settings"
    ON public.shop_settings FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- 6. Storage Bucket for Product Images
-- Note: You can create a public storage bucket named 'product-images' in Supabase Storage dashboard,
-- or run the following if storage schema permits:
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage RLS: Public read, authenticated upload
CREATE POLICY "Public read access for product images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can upload product images"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete product images"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

