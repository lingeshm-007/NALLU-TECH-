-- ==============================================================================
-- NALLU TECH - Production Supabase Database Schema, RLS & Storage Setup
-- ==============================================================================
-- Compatible with all Supabase SQL Editor versions & parser engines.
-- Safe to execute: uses IF NOT EXISTS and ON CONFLICT DO NOTHING (never deletes existing data).
-- ==============================================================================

-- 1. Create Products Table
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

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_available ON public.products(is_available);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);

-- 2. Create Shop Settings Table (for editable address, contact, maps link)
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

-- Seed initial row in shop_settings if not already present
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

-- 4. Products Row Level Security Policies
-- Public visitors: Read-only access to all products
DROP POLICY IF EXISTS "Public read access for products" ON public.products;
CREATE POLICY "Public read access for products"
    ON public.products FOR SELECT
    USING (true);

-- Authenticated Admins: Insert, Update, and Delete products
-- Strictly restricted to verified admin account or user with role 'admin'
DROP POLICY IF EXISTS "Admin insert access for products" ON public.products;
CREATE POLICY "Admin insert access for products"
    ON public.products FOR INSERT
    WITH CHECK (
        auth.role() = 'authenticated' AND (
            LOWER(auth.jwt() ->> 'email') = 'nallutech07@gmail.com'
            OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
            OR (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
        )
    );

DROP POLICY IF EXISTS "Admin update access for products" ON public.products;
CREATE POLICY "Admin update access for products"
    ON public.products FOR UPDATE
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
CREATE POLICY "Admin delete access for products"
    ON public.products FOR DELETE
    USING (
        auth.role() = 'authenticated' AND (
            LOWER(auth.jwt() ->> 'email') = 'nallutech07@gmail.com'
            OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
            OR (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
        )
    );

-- 5. Shop Settings Row Level Security Policies
-- Public visitors: Read-only access to shop details
DROP POLICY IF EXISTS "Public read access for shop settings" ON public.shop_settings;
CREATE POLICY "Public read access for shop settings"
    ON public.shop_settings FOR SELECT
    USING (true);

-- Authenticated Admins: Write access to shop details
DROP POLICY IF EXISTS "Admin write access for shop settings" ON public.shop_settings;
CREATE POLICY "Admin write access for shop settings"
    ON public.shop_settings FOR ALL
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

-- 6. Storage Bucket for Product Images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage RLS: Public read, admin-only upload, update, and delete
DROP POLICY IF EXISTS "Public read access for product images" ON storage.objects;
CREATE POLICY "Public read access for product images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Admin upload access for product images" ON storage.objects;
CREATE POLICY "Admin upload access for product images"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'product-images' AND
        auth.role() = 'authenticated' AND (
            LOWER(auth.jwt() ->> 'email') = 'nallutech07@gmail.com'
            OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
            OR (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
        )
    );

DROP POLICY IF EXISTS "Admin update access for product images" ON storage.objects;
CREATE POLICY "Admin update access for product images"
    ON storage.objects FOR UPDATE
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
CREATE POLICY "Admin delete access for product images"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'product-images' AND
        auth.role() = 'authenticated' AND (
            LOWER(auth.jwt() ->> 'email') = 'nallutech07@gmail.com'
            OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
            OR (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
        )
    );

-- 7. Seed Initial Verified Products (Safe: ON CONFLICT DO NOTHING)
INSERT INTO public.products (name, brand, model_number, category, image_url, price, description, specifications, is_available)
VALUES 
('Amaron PRO DIN65 Car Battery', 'Amaron', 'AAM-PR-0DIN65', 'Car Batteries', '/images/products/car-amaron.jpg', 7499, 'High performance zero-maintenance car battery engineered with patented Silven X alloy technology for extreme heat resistance and long service life.', '[{"key": "Capacity", "value": "65 Ah"}, {"key": "Voltage", "value": "12V"}, {"key": "Warranty", "value": "66 Months (36F + 30P)"}, {"key": "Technology", "value": "Silven X Alloy"}, {"key": "Maintenance", "value": "Zero Maintenance"}]'::jsonb, true),
('Exide Mileage FML0-ML38B20R Car Battery', 'Exide', 'ML38B20R', 'Car Batteries', '/images/products/car-exide.jpg', 4500, 'Robust automotive battery specially formulated with Magic Eye indicator and spill-resistant design for hatchbacks and sedans.', '[{"key": "Capacity", "value": "35 Ah"}, {"key": "Voltage", "value": "12V"}, {"key": "Warranty", "value": "55 Months (30F + 25P)"}, {"key": "Indicator", "value": "Magic Eye"}, {"key": "Fitment", "value": "Petrol Hatchbacks & Compact Sedans"}]'::jsonb, true),
('Exide Xplore 12XL5L-B Two-Wheeler Battery', 'Exide', '12XL5L-B', 'Bike Batteries', '/images/products/superbike-exide.jpg', 1350, 'VRLA maintenance-free motorcycle battery designed with AGM technology to withstand high vibrations and deliver quick self-starts.', '[{"key": "Capacity", "value": "5 Ah"}, {"key": "Voltage", "value": "12V"}, {"key": "Warranty", "value": "48 Months (24F + 24P)"}, {"key": "Type", "value": "VRLA / AGM Sealed"}, {"key": "Self-Start", "value": "Instant Cranking Power"}]'::jsonb, true),
('Amaron Pro Rider AP-BTZ5L Scooty Battery', 'Amaron', 'AP-BTZ5L', 'Scooty Batteries', '/images/products/scooty-amaron.jpg', 1299, 'Maintenance-free battery custom-crafted for modern automatic scooters including Honda Activa, TVS Jupiter, and Suzuki Access.', '[{"key": "Capacity", "value": "5 Ah"}, {"key": "Voltage", "value": "12V"}, {"key": "Warranty", "value": "48 Months"}, {"key": "Leak-Proof", "value": "Factory Activated Sealed VRLA"}, {"key": "Compatible Models", "value": "Activa, Jupiter, Access, Pleasure"}]'::jsonb, true),
('Luminous Red Charge RC 18000 Tubular Battery', 'Luminous', 'RC 18000', 'Inverter Batteries', '/images/products/inverter-battery-luminous.jpg', 14800, 'Tall tubular inverter battery designed with rugged spine construction and balanced alloy composition for extended power outages.', '[{"key": "Capacity", "value": "150 Ah"}, {"key": "Voltage", "value": "12V"}, {"key": "Warranty", "value": "36 Months (18F + 18P)"}, {"key": "Battery Type", "value": "Tall Tubular"}, {"key": "Electrolyte Volume", "value": "High Backup Capacity"}]'::jsonb, true),
('Exide Inva Tubular IT500 Plus 150Ah', 'Exide', 'IT500 Plus', 'Inverter Batteries', '/images/products/inverter-battery-exide.jpg', 16500, 'Premium tall tubular deep-cycle battery built to withstand frequent and prolonged power cuts with high charge acceptance rate.', '[{"key": "Capacity", "value": "150 Ah"}, {"key": "Voltage", "value": "12V"}, {"key": "Warranty", "value": "66 Months (48F + 18P)"}, {"key": "Technology", "value": "Tubular Plate Technology"}, {"key": "Life Expectancy", "value": "Long Deep Cycle Durability"}]'::jsonb, true),
('Exide Powersafe Plus EP 12-12 VRLA UPS Battery', 'Exide Powersafe', 'EP 12-12', 'UPS Batteries', '/images/products/ups-battery.jpg', 2150, 'Sealed lead acid AGM battery for online and offline UPS systems, EPABX, emergency lighting, and critical telecom equipment.', '[{"key": "Capacity", "value": "12 Ah"}, {"key": "Voltage", "value": "12V"}, {"key": "Warranty", "value": "24 Months"}, {"key": "Design", "value": "Sealed VRLA AGM"}, {"key": "Application", "value": "Commercial UPS & Backup"}]'::jsonb, true),
('Exide Jai Kisan / Heavy Duty HD-100 Truck Battery', 'Exide', 'HD-100', 'Truck and Heavy Vehicle Batteries', '/images/products/truck-battery.jpg', NULL, 'Heavy duty commercial vehicle battery built to endure extreme vibrations, heavy cranking current, and challenging transport environments.', '[{"key": "Capacity", "value": "100 Ah"}, {"key": "Voltage", "value": "12V"}, {"key": "Warranty", "value": "36 Months"}, {"key": "Heavy Vibration Proof", "value": "Reinforced Polypropylene Case"}, {"key": "Application", "value": "Trucks, Buses, Tractors, Cranes"}]'::jsonb, true),
('Luminous Solar Tubular Battery LPT12150H 150Ah', 'Luminous Solar', 'LPT12150H', 'Solar Batteries', '/images/products/solar-battery.jpg', 17200, 'Specialised high efficiency C10 rated solar tubular battery designed for cyclical deep discharges in off-grid and hybrid solar installations.', '[{"key": "Capacity", "value": "150 Ah (C10 Rating)"}, {"key": "Voltage", "value": "12V"}, {"key": "Warranty", "value": "60 Months"}, {"key": "Discharge Cycles", "value": "1500+ Cycles at 80% DOD"}, {"key": "Application", "value": "Solar Rooftop & Inverter Backup"}]'::jsonb, true),
('Luminous Zelio+ 1100 Pure Sine Wave Inverter', 'Luminous', 'Zelio+ 1100', 'Inverters', '/images/products/inverter-luminous.jpg', 6850, 'Smart pure sine wave inverter with LED display showing backup time in hours & minutes, battery water level reminder, and bypass switch.', '[{"key": "Capacity / VA", "value": "900 VA"}, {"key": "Rated Output Power", "value": "756 Watts"}, {"key": "Waveform", "value": "Pure Sine Wave"}, {"key": "Warranty", "value": "24 Months"}, {"key": "Display", "value": "Smart LED Display with Remaining Time"}]'::jsonb, true),
('Microtek Luxe 1400 Pure Sine Wave Inverter', 'Microtek', 'Luxe 1400', 'Inverters', '/images/products/inverter-microtek.jpg', 7600, 'Modern aesthetic pure sine wave home UPS featuring micro-controller based intelligent multistage battery charging and overload protection.', '[{"key": "Capacity / VA", "value": "1100 VA"}, {"key": "Rated Output Power", "value": "924 Watts"}, {"key": "Waveform", "value": "Pure Sine Wave"}, {"key": "Warranty", "value": "24 Months"}, {"key": "Technology", "value": "DSP Based Intelli-Pure Sine Wave"}]'::jsonb, true),
('Heavy Duty Modular Dual Battery Trolley / Stand', 'NALLU TECH Essentials', 'NT-TR-02', 'Other Battery Products', '/images/products/battery-trolley.jpg', 1850, 'Sturdy acid-proof composite trolley with castor wheels designed for neat housing of inverter and tubular battery setup with ventilation.', '[{"key": "Material", "value": "Acid Resistant Reinforced Polymer"}, {"key": "Mobility", "value": "5 Heavy Duty Castor Wheels"}, {"key": "Compatibility", "value": "Single / Double Tubular Batteries"}, {"key": "Ventilation", "value": "Rear and Side Air Slits"}]'::jsonb, true)
ON CONFLICT DO NOTHING;
