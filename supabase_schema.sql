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
-- 4. Create 'categories' table
-- ========================================================================
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    short_name TEXT DEFAULT '',
    accent_color TEXT DEFAULT '#10B981',
    image TEXT DEFAULT '',
    description TEXT DEFAULT '',
    full_description TEXT DEFAULT '',
    product_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Policies for categories
DROP POLICY IF EXISTS "Allow anonymous read categories" ON public.categories;
CREATE POLICY "Allow anonymous read categories" ON public.categories
    FOR SELECT
    TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Allow anonymous insert categories" ON public.categories;
CREATE POLICY "Allow anonymous insert categories" ON public.categories
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anonymous update categories" ON public.categories;
CREATE POLICY "Allow anonymous update categories" ON public.categories
    FOR UPDATE
    TO anon, authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anonymous delete categories" ON public.categories;
CREATE POLICY "Allow anonymous delete categories" ON public.categories
    FOR DELETE
    TO anon, authenticated
    USING (true);

-- 5. Seed Initial Categories to Database
INSERT INTO public.categories (id, name, short_name, accent_color, image, description, full_description)
VALUES
  ('chemicals', 'CHEMICALS', 'Chemicals', '#1E40AF', 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80', 'Explore our high-purity chemical technicals, titanium dioxide rutile pigments, and specialty industrial formulations.', 'High-purity chemical technicals, titanium dioxide rutile grade pigments, specialty industrial additives, and advanced chemical intermediates manufactured with Japanese precision.'),
  ('fungicides', 'FUNGICIDES', 'Fungicides', '#0D9488', 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80', 'Learn more about our best-in-class selection of fungicides, many with proprietary active ingredients.', 'Our fungicide portfolio provides broad-spectrum and systemic control against destructive plant pathogens, powdery mildew, blast, blights, and rusts, protecting plant vitality from root to leaf.'),
  ('herbicides', 'HERBICIDES', 'Herbicides', '#15803D', 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?auto=format&fit=crop&w=800&q=80', 'Clean fields improve your yield potential. Formulated to help you control tough, resistant weeds across crops.', 'Clean fields improve your yield potential. Formulated to suppress invasive grass, sedges, and broadleaf weeds in paddy, cotton, soybean, maize, and pulses with superior crop safety.'),
  ('insecticides', 'INSECTICIDES & MITICIDES', 'Insecticides & Miticides', '#7C3AED', 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=800&q=80', 'View our insecticide and miticide offerings featuring innovative chemistries for superior control.', 'Engineered with advanced chemistries that target chewing and sucking pests, borer complexes, aphids, thrips, and mites while preserving beneficial predatory insects.'),
  ('at-plant', 'AT-PLANT', 'At-Plant Technologies', '#EA580C', 'https://images.unsplash.com/photo-1592417817098-8f3d69109853?auto=format&fit=crop&w=800&q=80', 'View our leading At-Plant technologies designed to protect your input investments from the start.', 'Protect crops right from seedling emergence with root-zone bio-stimulants, seed dressers, and soil health restorers that unlock early vigor and robust disease resilience.'),
  ('harvest-aids', 'HARVEST AIDS', 'Harvest Aids', '#0F766E', 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80', 'See our tools developed to support an easier, more efficient harvest.', 'Uniform maturation defoliants, crop desiccants, and harvest conditioners designed to accelerate harvesting schedules, reduce moisture content, and maximize grade quality.'),
  ('precision-platforms', 'PRECISION PLATFORMS', 'Precision Platforms', '#1E3A8A', 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80', 'Read more about our proprietary technologies transforming crop protection application.', 'Next-generation bio-stimulants, nano-adjuvants, drone-compatible formulations, and foliar nutrition technologies designed to maximize chemical efficacy and minimize environmental footprint.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  accent_color = EXCLUDED.accent_color,
  description = EXCLUDED.description,
  full_description = EXCLUDED.full_description;

-- ========================================================================
-- Schema ready! Any changes in Admin panel will now sync automatically with Supabase.
-- ========================================================================

