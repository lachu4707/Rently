# RentalHub Backend (Supabase Cloud Database + Express)

Node.js + Express API backed by **Supabase Cloud PostgreSQL** that connects your React pages: **Profile**, **Sell**, **Recently Viewed**, **About Us**, and the dashboard **Feed/Search**.

---

## 1. Quick Setup with Supabase

### Step 1: Create a Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and create a free account / project.
2. Under your Project Dashboard, go to **Project Settings** -> **API**.
3. Copy:
   - **Project URL** (`https://xyzcompany.supabase.co`)
   - **anon / public key** or **service_role key**

### Step 2: Set up the Database Schema
1. In your Supabase Dashboard, go to the **SQL Editor** tab (left sidebar).
2. Click **New Query**.
3. Copy and paste the contents of [`supabase-schema.sql`](./supabase-schema.sql) into the editor.
4. Click **Run**. This creates the `users`, `products`, and `recently_viewed` tables, indexes, security policies, and initial sample items.

### Step 3: Configure `.env`
Inside `rentalhub-backend/.env`:
```env
PORT=5001
CLIENT_ORIGIN=http://localhost:5173
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d

# Supabase Cloud Database Configuration
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### Step 4: Run the Backend
```bash
cd rentalhub-backend
npm install
npm run dev           # development with auto-reload
npm run seed:supabase # optional: populate / verify demo data
npm start             # production mode
```

API runs at `http://localhost:5001/api`.

---

## 2. API Endpoints

| Method | Route                          | Auth | Purpose                          |
|--------|---------------------------------|------|-----------------------------------|
| GET    | `/api/health`                   | –    | Health check & database status    |
| POST   | `/api/auth/register`            | –    | Create account                    |
| POST   | `/api/auth/login`               | –    | Log in, get JWT                   |
| GET    | `/api/users/me`                 | ✅   | Profile page data                 |
| PUT    | `/api/users/me`                 | ✅   | Edit profile                      |
| GET    | `/api/users/me/listings`        | ✅   | "My listings" on profile page     |
| GET    | `/api/products`                 | –    | Feed + search (`?q=&sort=&tag=`)  |
| GET    | `/api/products/:id`             | –    | Product detail / modal            |
| POST   | `/api/products`                 | ✅   | Sell page — create listing        |
| PUT    | `/api/products/:id`             | ✅   | Edit own listing                  |
| DELETE | `/api/products/:id`             | ✅   | Delete own listing                |
| GET    | `/api/recently-viewed`          | ✅   | Recently Viewed page              |
| POST   | `/api/recently-viewed/:productId` | ✅ | Log a view (call on modal open)   |
| DELETE | `/api/recently-viewed/:productId` | ✅ | Remove one entry                  |
