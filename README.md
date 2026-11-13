# NALLU TECH 🔋 | Business Website & Product Management System

> **"Powering Every Journey, Every Home."**  
> **15+ Years of Experience &bull; Trusted Battery Solutions**

A modern, responsive, high-performance business website built for **NALLU TECH**, a premier battery, UPS, and inverter shop. The application features a fast public-facing storefront and a private, secure Admin Dashboard for managing products, categories, pricing, specifications, and shop settings without code modifications.

---

## 🌟 Key Features

### Public Website
- **Hero & Brand Highlights:** Showcases 15+ years of experience, core brand values, genuine product guarantees, and quick action buttons.
- **9 Specialised Product Categories:**
  1. Car Batteries
  2. Bike Batteries
  3. Scooty Batteries
  4. Inverter Batteries
  5. UPS Batteries
  6. Truck and Heavy Vehicle Batteries
  7. Solar Batteries
  8. Inverters
  9. Other Battery Products
- **Dynamic Search & Filtering:** Filter by Category, Brand (Amaron, Exide, Luminous, etc.), and in-stock availability; search by model number, capacity, or specifications; sort by price (₹) or name.
- **Neat Product Cards & Modals:** Displays brand, model number, category, detailed specifications table, availability status, and formatted Indian Rupee (`₹`) pricing (or "Price on Enquiry").
- **WhatsApp Integration:** Direct WhatsApp button with pre-filled enquiry message (`Hello NALLU TECH, I would like to enquire about [Product Name]`).
- **Direct Phone Dialler:** One-click phone calling to `+91 8248949759`.
- **Verified Shop Location & Directions:** Exact Google Maps location link (`11.541912, 79.1315204`) with embedded interactive map and "Get Directions" trigger.
- **10 Core Services:** Highlighting battery sales, replacement, repair, jump-start assistance, inverter PCB service, UPS diagnostics, and cable fitment.
- **Editable Shop Address:** Displays shop address dynamically from admin settings.

### Private Admin Dashboard (`/admin`)
- **Secure Authentication:** Protected route requiring admin login.
- **Product Management (CRUD):**
  - Add new products with image upload, brand, model number, specifications, category, and price.
  - Edit existing products in real-time.
  - Delete products with confirmation modal.
  - Quick toggle for product availability ("In Stock" vs "Out of Stock").
- **Shop Address & Settings Management:** Edit the physical shop address, phone number, WhatsApp contact, and Google Maps URL directly from the dashboard.
- **Image Upload:** Supports local compressed image upload and Supabase cloud storage.
- **Hybrid Persistence:** Connects seamlessly with Supabase Postgres DB & Storage, with automatic local persistent storage fallback so testing works out of the box.
- **Data Export & Restoration:** Export catalog to JSON and one-click restore initial seed inventory.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS, PostCSS, Lucide Icons
- **Routing:** React Router DOM (v6)
- **Backend & Database:** Supabase (PostgreSQL, Row Level Security, Storage, Authentication) with offline-first persistent fallback
- **Formatting:** Indian Rupee (`₹` INR) currency localization

---

## 🚀 Getting Started Locally

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** (v9 or higher)

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 4. Build for Production
```bash
npm run build
```
The optimized bundle will be created in the `dist/` directory.

---

## 🔐 Admin Dashboard Access

1. Open your browser and navigate to:
   ```
   http://localhost:5173/admin/login
   ```
   *(Or click "Admin Login" in the top bar or footer).*

2. **Admin Credentials:**
   - **Email / ID:** `nallutech07@gmail.com`
   - **Password:** `Nallutech@1234`

---

## 🗄️ Supabase Backend & Database Setup (Cloud Connection)

To connect your Supabase project for real-time cloud data storage:

### Step 1: Create or Open Your Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign in.
2. Create a new project (e.g. `NALLU-TECH`) in region **India (Mumbai)**.
3. Once created, go to **Project Settings &rarr; Data API** (or API).
4. Copy your **Project URL** and **`anon` `public` key**.

### Step 2: Configure Environment Variables
Open the `.env` file in the root folder of this project:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here
```
*(Make sure to use the safe `anon` `public` key, NEVER the `service_role` secret key!)*

### Step 3: Run Database Schema & Storage Setup
1. In your Supabase Dashboard, click **SQL Editor** (`>_`) in the left sidebar.
2. Click **New Query**.
3. Open `supabase_schema.sql` from this repository, copy all contents, paste it into the SQL Editor, and click **Run**.
   *This automatically creates:*
   - `public.products` table with all columns and JSONB specifications
   - `public.shop_settings` table with verified NALLU TECH contact info
   - Row Level Security (RLS) policies ensuring public visitors can only view products, while authenticated admins can create, update, and delete them
   - `product-images` storage bucket with public read and authenticated write policies
   - All 12 initial verified products with photos pre-seeded

### Step 4: Create Admin User in Supabase Authentication
1. In Supabase Dashboard, navigate to **Authentication &rarr; Users**.
2. Click **Add User** &rarr; **Create User**.
3. Enter:
   - **User Email:** `nallutech07@gmail.com`
   - **Password:** `Nallutech@1234`
   - Turn **Auto Confirm User?** to **ON** (so no email confirmation is required).
4. Click **Create User**.

You can now sign in at `/admin/login`. All products, prices, edits, and uploaded images will immediately persist in your live Supabase cloud database.

---

## 🌐 Deploying to Vercel or Render

### Deploying to Vercel
1. Push this repository to GitHub or GitLab.
2. Go to [vercel.com](https://vercel.com) &rarr; **Add New Project**.
3. Select your repository.
4. Settings:
   - **Framework Preset:** Vite
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Add Environment Variables (optional, for Supabase):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Click **Deploy**.

#### Vercel SPA Routing Configuration:
Create `vercel.json` in the root folder if needed for deep linking:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Deploying to Render
1. Go to [render.com](https://render.com) &rarr; **New Static Site**.
2. Connect your repository.
3. Configuration:
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`
4. Add Rewrite Rule under **Redirects/Rewrites**:
   - **Source:** `/*`
   - **Destination:** `/index.html`
   - **Action:** Rewrite
5. Click **Create Static Site**.

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

