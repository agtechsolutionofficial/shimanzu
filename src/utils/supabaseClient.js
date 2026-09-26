// Supabase Client for Shimanzu Products
// Uses direct fetch against Supabase PostgREST REST API
// Works immediately without requiring new external npm packages

const SUPABASE_URL =
  import.meta.env?.VITE_SUPABASE_URL ||
  import.meta.env?.NEXT_PUBLIC_SUPABASE_URL ||
  'https://fxvbvplnucrcamnfblol.supabase.co';

const SUPABASE_ANON_KEY =
  import.meta.env?.VITE_SUPABASE_ANON_KEY ||
  import.meta.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env?.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4dmJ2cGxudWNyY2FtbmZibG9sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk0NjUwMTMsImV4cCI6MjEwNTA0MTAxM30.rhhbTtgUf8rRjY615MorQKFz0_Ud3xY7JmzZ3Mw3NQo';

const getHeaders = () => ({
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
  Prefer: 'return=representation'
});

// Normalizes a database row to match frontend product schema
export const normalizeProduct = (row) => {
  if (!row) return null;
  return {
    id: String(row.id),
    name: row.name || 'Untitled Product',
    brand: row.brand || '',
    chemical: row.chemical || '',
    category: row.category || 'chemicals',
    categoryLabel: row.categoryLabel || row.category_label || (row.category ? row.category.toUpperCase() : 'CHEMICALS'),
    group: row.group || `${row.formulation || 'SC'} FORMULATION`,
    formulation: row.formulation || 'SC',
    inStock: row.inStock !== undefined ? Boolean(row.inStock) : (row.in_stock !== undefined ? Boolean(row.in_stock) : true),
    packSizes: Array.isArray(row.packSizes)
      ? row.packSizes
      : (Array.isArray(row.pack_sizes)
          ? row.pack_sizes
          : (row.packSizes || row.pack_sizes ? String(row.packSizes || row.pack_sizes).split(',').map(s => s.trim()).filter(Boolean) : ['1L'])),
    crops: Array.isArray(row.crops)
      ? row.crops
      : (row.crops ? String(row.crops).split(',').map(s => s.trim()).filter(Boolean) : ['All Crops']),
    targets: row.targets || '',
    dosage: row.dosage || '',
    description: row.description || '',
    imgSrc: row.imgSrc || row.img_src || row.image || 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=80',
    createdAt: row.created_at || row.createdAt || null
  };
};

// Formats product for database insert/update
export const formatProductForDb = (prod) => {
  return {
    id: String(prod.id),
    name: prod.name || '',
    brand: prod.brand || '',
    chemical: prod.chemical || '',
    category: prod.category || 'chemicals',
    category_label: prod.categoryLabel || prod.category_label || (prod.category ? prod.category.toUpperCase() : 'CHEMICALS'),
    group: prod.group || '',
    formulation: prod.formulation || 'SC',
    in_stock: prod.inStock !== false,
    pack_sizes: Array.isArray(prod.packSizes) ? prod.packSizes : (prod.packSizes ? String(prod.packSizes).split(',').map(s => s.trim()) : []),
    crops: Array.isArray(prod.crops) ? prod.crops : (prod.crops ? String(prod.crops).split(',').map(s => s.trim()) : []),
    targets: prod.targets || '',
    dosage: prod.dosage || '',
    description: prod.description || '',
    img_src: prod.imgSrc || prod.img_src || ''
  };
};

export const supabaseApi = {
  // Fetch all products from Supabase
  async getProducts() {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/products?select=*`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.warn('Supabase fetch products warning:', res.status, errorText);
        return { data: null, error: errorText };
      }

      const rows = await res.json();
      const normalized = Array.isArray(rows) ? rows.map(normalizeProduct) : [];
      return { data: normalized, error: null };
    } catch (err) {
      console.warn('Supabase getProducts network error:', err);
      return { data: null, error: err.message };
    }
  },

  // Insert a new product
  async addProduct(product) {
    try {
      const payload = formatProductForDb(product);
      let res = await fetch(`${SUPABASE_URL}/rest/v1/products`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });

      // If snake_case column fails, try camelCase payload
      if (!res.ok) {
        const camelPayload = {
          id: String(product.id),
          name: product.name,
          brand: product.brand,
          chemical: product.chemical,
          category: product.category,
          categoryLabel: product.categoryLabel,
          group: product.group,
          formulation: product.formulation,
          inStock: product.inStock,
          packSizes: product.packSizes,
          crops: product.crops,
          targets: product.targets,
          dosage: product.dosage,
          description: product.description,
          imgSrc: product.imgSrc
        };
        const retryRes = await fetch(`${SUPABASE_URL}/rest/v1/products`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(camelPayload)
        });
        if (retryRes.ok) {
          const inserted = await retryRes.json();
          return { data: normalizeProduct(inserted[0] || camelPayload), error: null };
        }
      }

      if (!res.ok) {
        const errorText = await res.text();
        console.warn('Supabase addProduct warning:', res.status, errorText);
        return { data: product, error: errorText };
      }

      const inserted = await res.json();
      return { data: normalizeProduct(inserted[0] || payload), error: null };
    } catch (err) {
      console.warn('Supabase addProduct network error:', err);
      return { data: product, error: err.message };
    }
  },

  // Update an existing product
  async updateProduct(id, updates) {
    try {
      const payload = formatProductForDb({ ...updates, id });
      let res = await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        // Fallback to camelCase update
        const camelPayload = {
          ...updates,
          id: String(id)
        };
        const retryRes = await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${encodeURIComponent(id)}`, {
          method: 'PATCH',
          headers: getHeaders(),
          body: JSON.stringify(camelPayload)
        });
        if (retryRes.ok) {
          const updated = await retryRes.json();
          return { data: normalizeProduct(updated[0] || camelPayload), error: null };
        }
      }

      if (!res.ok) {
        const errorText = await res.text();
        console.warn('Supabase updateProduct warning:', res.status, errorText);
        return { data: updates, error: errorText };
      }

      const updated = await res.json();
      return { data: normalizeProduct(updated[0] || payload), error: null };
    } catch (err) {
      console.warn('Supabase updateProduct network error:', err);
      return { data: updates, error: err.message };
    }
  },

  // Delete a product
  async deleteProduct(id) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: getHeaders()
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.warn('Supabase deleteProduct warning:', res.status, errorText);
        return { error: errorText };
      }

      return { error: null };
    } catch (err) {
      console.warn('Supabase deleteProduct network error:', err);
      return { error: err.message };
    }
  }
};
