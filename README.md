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

2. **Default Local Development Credentials:**
   - **Email:** `admin@nallutech.com`
   - **Password:** `nallu@1234`

---

## 🗄️ Supabase Backend & Database Setup (Production)

To connect your own cloud database and Supabase authentication:

### Step 1: Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a free project.
2. Note your **Project URL** and **anon public key** from `Project Settings > API`.

### Step 2: Run Database Schema
1. In your Supabase dashboard, go to the **SQL Editor**.
2. Open the file `supabase_schema.sql` included in this repository.
3. Paste the contents into the SQL Editor and click **Run**.  
   *This creates the `products` table, `shop_settings` table, `product-images` storage bucket, and configures Row Level Security (RLS) policies.*

### Step 3: Create First Admin User
1. In Supabase Dashboard, go to **Authentication > Users**.
2. Click **Add User** &rarr; **Create User**.
3. Enter your admin email (e.g. `admin@nallutech.com`) and a strong password.
4. Confirm email creation.

### Step 4: Configure Environment Variables
Create or edit `.env` in the root folder:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here
```
Re-run `npm run build` or `npm run dev`. Your website will now synchronize with Supabase in real-time.

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

