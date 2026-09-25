-- RentalHub Database Schema for Supabase (PostgreSQL)
-- Run this script in the Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)

-- 1. Create Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Users Table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  phone TEXT DEFAULT '',
  location TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC NOT NULL CHECK (price >= 0),
  price_unit TEXT DEFAULT 'day',
  tag TEXT NOT NULL,
  location TEXT NOT NULL,
  coordinates JSONB DEFAULT '{"lat": null, "lng": null}'::jsonb,
  images TEXT[] NOT NULL DEFAULT '{}',
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create Recently Viewed Table
CREATE TABLE IF NOT EXISTS public.recently_viewed (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT unique_user_product UNIQUE (user_id, product_id)
);

-- 5. Create Indexes for High Performance Search and Queries
CREATE INDEX IF NOT EXISTS idx_products_owner ON public.products(owner_id);
CREATE INDEX IF NOT EXISTS idx_products_tag ON public.products(tag);
CREATE INDEX IF NOT EXISTS idx_products_location ON public.products(location);
CREATE INDEX IF NOT EXISTS idx_products_is_available ON public.products(is_available);
CREATE INDEX IF NOT EXISTS idx_recently_viewed_user ON public.recently_viewed(user_id);
CREATE INDEX IF NOT EXISTS idx_recently_viewed_product ON public.recently_viewed(product_id);

-- Full-text search index for title and description
CREATE INDEX IF NOT EXISTS idx_products_search ON public.products USING gin(
  to_tsvector('english', title || ' ' || description || ' ' || tag || ' ' || location)
);

-- 6. Disable RLS or Add Open Public Access Policies for API Server integration
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recently_viewed ENABLE ROW LEVEL SECURITY;

-- Allow full access for anon & service role keys through backend API
DROP POLICY IF EXISTS "Allow all access to users" ON public.users;
CREATE POLICY "Allow all access to users" ON public.users FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all access to products" ON public.products;
CREATE POLICY "Allow all access to products" ON public.products FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all access to recently_viewed" ON public.recently_viewed;
CREATE POLICY "Allow all access to recently_viewed" ON public.recently_viewed FOR ALL USING (true) WITH CHECK (true);

-- 7. Seed Demo Data (Demo User + Initial Items)
INSERT INTO public.users (id, name, email, password, location, bio)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'RentalHub Community Member',
  'demo@rentalhub.com',
  '$2a$10$wN9aC04p2K3kOa3fEcmr..xS7g1zF37tEsqLqD7H4eO0jU5a1H9lS', -- 'password123'
  'Chennai, Tamil Nadu',
  'Verified community member lending tools, gadgets, and outdoor equipment.'
)
ON CONFLICT (email) DO NOTHING;

INSERT INTO public.products (owner_id, title, description, price, price_unit, tag, location, images, is_available)
VALUES
(
  'a0000000-0000-0000-0000-000000000001',
  'Sony Alpha A7 III Full-Frame Camera with 28-70mm Lens',
  'Professional 24.2MP mirrorless camera in pristine condition. Includes 2 batteries, 64GB fast SD card, charger, and camera bag. Perfect for weddings, travel photography, and 4K video shoots.',
  1499,
  'day',
  'Electronics',
  'T. Nagar, Chennai',
  ARRAY['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80'],
  true
),
(
  'a0000000-0000-0000-0000-000000000001',
  'Bosch Professional Cordless Hammer Drill Kit (18V)',
  'Heavy duty cordless drill with hammer function, 2x 4.0Ah batteries, rapid charger, and 30-piece masonry & metal bit set in hard case. Ideal for home improvement and DIY carpentry.',
  350,
  'day',
  'Tools & Equipment',
  'Adyar, Chennai',
  ARRAY['https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80'],
  true
),
(
  'a0000000-0000-0000-0000-000000000001',
  'Quechua Waterproof 4-Person Camping Tent + 2 Sleeping Bags',
  'Spacious 4-person dome tent with double skin for weatherproofing and ventilation. Easy 10-minute setup. Includes ground pegs, carry bag, and 2 clean sleeping bags.',
  499,
  'day',
  'Sports & Fitness',
  'Velachery, Chennai',
  ARRAY['https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80'],
  true
),
(
  'a0000000-0000-0000-0000-000000000001',
  'Epson Full HD 1080p Home Theater Projector + 100" Screen',
  '3400 Lumens high brightness cinema projector with HDMI/Wireless casting support and built-in speakers. Comes with foldable 100-inch screen and tripod stand for movie nights.',
  799,
  'day',
  'Electronics',
  'Anna Nagar, Chennai',
  ARRAY['https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80'],
  true
),
(
  'a0000000-0000-0000-0000-000000000001',
  'Trek Marlin 7 Mountain Bike (Hydraulic Disc Brakes, 29")',
  'Lightweight aluminum frame MTB with front suspension lockout and Shimano 1x10 drivetrain. Helmet, bottle cage, and bike lock included. Suitable for city trails and road cycling.',
  599,
  'day',
  'Vehicles',
  'Besant Nagar, Chennai',
  ARRAY['https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80'],
  true
)
ON CONFLICT DO NOTHING;
