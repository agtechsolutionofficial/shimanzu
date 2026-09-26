-- ========================================================================
-- Shimanzu Japan Agro Chemical Products Table Schema for Supabase
-- Paste this script into your Supabase SQL Editor and click "Run"
-- ========================================================================

-- 1. Create 'products' table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    brand TEXT DEFAULT '',
    chemical TEXT DEFAULT '',
    category TEXT DEFAULT 'chemicals',
    category_label TEXT DEFAULT 'CHEMICALS',
    "group" TEXT DEFAULT '',
    formulation TEXT DEFAULT 'SC',
    in_stock BOOLEAN DEFAULT true,
    pack_sizes TEXT[] DEFAULT ARRAY['1L']::TEXT[],
    crops TEXT[] DEFAULT ARRAY['All Crops']::TEXT[],
    targets TEXT DEFAULT '',
    dosage TEXT DEFAULT '',
    description TEXT DEFAULT '',
    img_src TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies to allow reading, adding, editing, and deleting products
DROP POLICY IF EXISTS "Allow anonymous read products" ON public.products;
CREATE POLICY "Allow anonymous read products" ON public.products
    FOR SELECT
    TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Allow anonymous insert products" ON public.products;
CREATE POLICY "Allow anonymous insert products" ON public.products
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anonymous update products" ON public.products;
CREATE POLICY "Allow anonymous update products" ON public.products
    FOR UPDATE
    TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Allow anonymous delete products" ON public.products;
CREATE POLICY "Allow anonymous delete products" ON public.products
    FOR DELETE
    TO anon, authenticated
    USING (true);

-- ========================================================================
-- Schema ready! Any changes in Admin panel will now sync automatically.
-- ========================================================================
