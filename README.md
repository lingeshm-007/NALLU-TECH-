# NALLU TECH 🔋 | Business Website & Cloud Product Management System

> **"Powering Every Journey, Every Home."**  
> **15+ Years of Experience &bull; Trusted Battery Solutions**

A modern, responsive, high-performance business website and cloud-backed administration portal built for **NALLU TECH**, a premier battery, UPS, and inverter enterprise. The application features a fast public-facing storefront and a private, secure Admin Console for managing products, categories, pricing, specifications, and shop settings backed by **Supabase PostgreSQL & Cloud Storage**.

---

## 🌟 Key Features

### Public Website
- **Hero & Brand Highlights:** Showcases 15+ years of verified industry experience, genuine warranty guarantees, and immediate contact shortcuts.
- **9 Specialized Product Categories:**
  1. Car Batteries
  2. Bike Batteries
  3. Scooty Batteries
  4. Inverter Batteries
  5. UPS Batteries
  6. Truck and Heavy Vehicle Batteries
  7. Solar Batteries
  8. Inverters
  9. Other Battery Products
- **Dynamic Search & Filtering:** Filter by Category, Brand (Amaron, Exide, Luminous, Microtek), and availability status; search by model number, capacity, or specifications; sort by price (₹ INR) or name.
- **Neat Product Cards & Modals:** Displays brand, model number, category, detailed specifications table, availability status, and formatted Indian Rupee (`₹`) pricing (or "Price on Enquiry").
- **WhatsApp Integration:** Direct WhatsApp button with pre-filled enquiry message (`Hello NALLU TECH, I would like to enquire about [Product Name]`).
- **Direct Phone Dialler:** One-click phone calling to `+91 8248949759`.
- **Verified Shop Location & Directions:** Exact Google Maps location link (`11.541912, 79.1315204`) with embedded interactive map and "Get Directions" navigation.
- **10 Core Services:** Highlighting battery sales, replacement, testing, jump-start assistance, inverter PCB service, UPS diagnostics, and cable fitment.
- **Dynamic Shop Address:** Displays shop address dynamically from admin settings.

### Private Admin Dashboard (`/admin`)
- **Secure Authentication:** Protected route powered by Supabase Authentication (`supabase.auth.signInWithPassword`, `signOut`, `getSession`, and session persistence via `onAuthStateChange`).
- **Role-Based Row Level Security (RLS):** Database policies restrict create, update, and delete actions exclusively to verified administrators. Public visitors have read-only access.
- **Product Management (CRUD):**
  - Add new products with image upload, brand, model number, specifications, category, and price.
  - Edit existing products with immediate cloud synchronization.
  - Delete products with confirmation modal.
  - Quick toggle for product availability ("In Stock" vs "Out of Stock").
- **Shop Address & Settings Management:** Edit the physical shop address, phone number, WhatsApp contact, and Google Maps URL directly from the dashboard.
- **Product Image Storage (`product-images` bucket):** Automatic client-side canvas compression before uploading directly to Supabase Cloud Storage.
- **Zero Misleading Fallback:** Clean connection diagnostics with explicit badges and notifications; cloud changes are never silently spoofed in localStorage when offline.
- **Data Export:** Export catalog to JSON anytime.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS, PostCSS, Lucide Icons
- **Routing:** React Router DOM (v6) with SPA redirects for Render/Netlify
- **Backend & Cloud Database:** Supabase (PostgreSQL, Row Level Security, Storage, Authentication)
- **Formatting:** Indian Rupee (`₹` INR) currency localization

---

## 🚀 Getting Started Locally

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Local Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Open `.env` and fill in your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```
> **SECURITY NOTICE:** Only provide the `anon` public key in frontend applications. **Never** include or expose your `service_role` secret key!

### 4. Start Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 5. Build for Production
```bash
npm run build
```
The optimized production bundle will be built in the `dist/` directory.

---

## 🗄️ Supabase Cloud Backend Setup

To connect your Supabase project for real-time cloud data storage:

### Step 1: Create Your Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and create a free project (e.g. `NALLU-TECH`) in region **India (Mumbai)**.
2. In Project Settings &rarr; **API**, copy your **Project URL** and **`anon` `public` key**.
3. Place them into your `.env` file or hosting provider's environment variables.

### Step 2: Run Database Schema & Storage Setup
1. In your Supabase Dashboard, click **SQL Editor** (`>_`) in the left sidebar.
2. Click **New Query**.
3. Open `supabase_schema.sql` from this repository, copy the full script, paste it into the SQL Editor, and click **RUN**.
   *This automatically creates:*
   - `public.products` table with UUID primary keys and JSONB specifications
   - `public.shop_settings` table with verified NALLU TECH contact info
   - Automatic `updated_at` triggers for both tables
   - Performance indexes on `category`, `is_available`, and `created_at`
   - `public.is_admin()` security definer function
   - Strict Row Level Security (RLS) policies allowing public read, but restricting insert/update/delete to authorized admins
   - `product-images` storage bucket with public read and admin write permissions
   - Pre-seeds 12 verified initial products with real photography (`ON CONFLICT DO NOTHING`)

### Step 3: Create Admin User & Authorize Role
1. In Supabase Dashboard, navigate to **Authentication &rarr; Users**.
2. Click **Add User** &rarr; **Create User**.
3. Enter:
   - **User Email:** `nallutech07@gmail.com`
   - **Password:** *[Your strong chosen admin password]*
   - Turn **Auto Confirm User?** to **ON**.
4. In the SQL Editor, run this one-time query to grant explicit admin role permissions:
   ```sql
   UPDATE auth.users
   SET raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}'::jsonb
   WHERE email = 'nallutech07@gmail.com';
   ```

Now you can sign in securely at `/admin/login`.

---

## 🌐 Deploying to Render

This project is fully configured for zero-configuration static site deployment on **Render**:

1. Push this repository to your GitHub account (`https://github.com/lingeshm-007/NALLU-TECH-`).
2. Log in to [render.com](https://render.com) and select **New + &rarr; Static Site**.
3. Connect your repository `NALLU-TECH-`.
4. Configure Build & Publish Settings:
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
5. In the **Environment Variables** section, add:
   - `VITE_SUPABASE_URL`: Your Supabase project URL (`https://<project-ref>.supabase.co`)
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon public key
6. Client-Side Routing: `public/_redirects` is already included (`/* /index.html 200`) so all React Router links (`/products`, `/services`, `/admin`, etc.) work without 404 errors on page refresh.
7. Click **Create Static Site**.

---

## 📍 Business Details Quick Reference

| Item | Details |
| :--- | :--- |
| **Business Name** | NALLU TECH |
| **Experience** | 15+ Years of Experience |
| **Brand Message** | Trusted Battery Solutions |
| **Direct Phone** | [+91 8248949759](tel:+918248949759) |
| **WhatsApp Contact** | [+91 8248949759](https://wa.me/918248949759) |
| **Shop Coordinates** | `11.541912, 79.1315204` |
| **Google Maps Link** | [View NALLU TECH on Google Maps](https://www.google.com/maps/place/Nallu+Tech,/@11.5416413,79.1292909,488m/data=!3m1!1e3!4m6!3m5!1s0x3bab4721f742a30b:0xe674301feac43ab4!8m2!3d11.541912!4d79.1315204!16s%2Fg%2F11c7pc27g7?entry=ttu) |
| **Address Field** | Configurable directly via Admin Dashboard &rarr; Shop Address & Contact |

---

## 📄 License
Commercial License &copy; NALLU TECH. All rights reserved.
