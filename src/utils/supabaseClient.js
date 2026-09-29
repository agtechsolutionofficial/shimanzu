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

const getQueryHeaders = () => ({
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`
});

const getHeaders = () => ({
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
  Prefer: 'return=representation'
});

// Normalizes a database row to match frontend product schema, supporting all column name variations
export const normalizeProduct = (row) => {
  if (!row) return null;

  // 1. Name
  const name = String(
    row.name || 
    row.productName || 
    row.product_name || 
    row.title || 
    row.product_title || 
    'Untitled Product'
  ).trim();

  // 2. Chemical
  const chemical = String(
    row.chemical || 
    row.chemicalComposition || 
    row.chemical_composition || 
    row.composition || 
    row.active_ingredient || 
    ''
  ).trim();

  // 3. Brand
  const brand = String(
    row.brand || 
    row.brandOverlay || 
    row.brand_overlay || 
    'SHIMANZU'
  ).trim();

  // 4. Category
  const rawCat = String(row.category || row.category_key || '').toLowerCase().trim();
  let category = 'chemicals';
  if (rawCat.includes('fungicide')) category = 'fungicides';
  else if (rawCat.includes('herbicide')) category = 'herbicides';
  else if (rawCat.includes('insecticide') || rawCat.includes('miticide')) category = 'insecticides';
  else if (rawCat.includes('at-plant') || rawCat.includes('biofertilizer') || rawCat.includes('growth regulator') || rawCat.includes('plant growth')) category = 'at-plant';
  else if (rawCat.includes('harvest')) category = 'harvest-aids';
  else if (rawCat.includes('precision')) category = 'precision-platforms';
  else if (rawCat.includes('chemical') || rawCat.includes('pigment')) category = 'chemicals';
  else if (row.category) category = String(row.category).toLowerCase().trim();

  // 5. Category label
  const categoryLabel = String(
    row.categoryLabel || 
    row.category_label || 
    row.category || 
    (category ? category.toUpperCase() : 'AGROCHEMICAL')
  ).trim();

  // 6. Formulation
  const formulation = String(row.formulation || row.formulation_type || 'SC').trim();

  // 7. Group / Mode of action
  const group = String(
    row.group || 
    row.groupModeOfAction || 
    row.group_mode_of_action || 
    `${formulation} FORMULATION`
  ).trim();

  // 8. In Stock
  const inStock = row.inStock !== undefined 
    ? Boolean(row.inStock) 
    : (row.in_stock !== undefined ? Boolean(row.in_stock) : true);

  // 9. Pack sizes
  let packSizes = ['1L'];
  const rawPack = row.packSizes || row.pack_sizes || row.packSize || row.pack_size;
  if (Array.isArray(rawPack) && rawPack.length > 0) {
    packSizes = rawPack.map(s => String(s).trim()).filter(Boolean);
  } else if (typeof rawPack === 'string' && rawPack.trim()) {
    packSizes = rawPack.split(',').map(s => s.trim()).filter(Boolean);
  }

  // 10. Crops
  let crops = ['All Crops'];
  const rawCrops = row.crops || row.targetCrops || row.target_crops;
  if (Array.isArray(rawCrops) && rawCrops.length > 0) {
    crops = rawCrops.map(s => String(s).trim()).filter(Boolean);
  } else if (typeof rawCrops === 'string' && rawCrops.trim()) {
    crops = rawCrops.split(',').map(s => s.trim()).filter(Boolean);
  }

  // 11. Targets
  const targets = String(
    row.targets || 
    row.targetPestsDiseases || 
    row.target_pests_diseases || 
    row.target_pests || 
    ''
  ).trim();

  // 12. Dosage
  const dosage = String(
    row.dosage || 
    row.recommendedDosage || 
    row.recommended_dosage || 
    ''
  ).trim();

  // 13. Description
  const description = String(
    row.description || 
    row.productOverviewAndEfficacy || 
    row.product_overview || 
    row.overview || 
    ''
  ).trim();

  // 14. Image
  const imgSrc = String(
    row.imgSrc || 
    row.img_src || 
    row.image || 
    row.image_url || 
    row.imageUrl || 
    ''
  ).trim();

  return {
    id: String(row.id || ('prod-' + name.toLowerCase().replace(/[^a-z0-9]+/g, '-'))),
    name,
    brand,
    chemical,
    category,
    categoryLabel,
    group,
    formulation,
    inStock,
    packSizes,
    crops,
    targets,
    dosage,
    description,
    imgSrc,
    createdAt: row.created_at || row.createdAt || null
  };
};

export const isUUID = (str) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(str || ''));

// Formats product for database insert/update
export const formatProductForDb = (prod, includeId = false) => {
  const payload = {
    name: prod.name || '',
    brand: prod.brand || 'SHIMANZU',
    chemical: prod.chemical || '',
    category: prod.category || 'chemicals',
    category_label: prod.categoryLabel || prod.category_label || (prod.category ? prod.category.toUpperCase() : 'CHEMICALS'),
    group: prod.group || '',
    formulation: prod.formulation || 'SC',
    in_stock: prod.inStock !== false,
    pack_sizes: Array.isArray(prod.packSizes) ? prod.packSizes : (prod.packSizes ? String(prod.packSizes).split(',').map(s => s.trim()) : ['1L']),
    crops: Array.isArray(prod.crops) ? prod.crops : (prod.crops ? String(prod.crops).split(',').map(s => s.trim()) : ['All Crops']),
    targets: prod.targets || '',
    dosage: prod.dosage || '',
    description: prod.description || '',
    img_src: prod.imgSrc || prod.img_src || ''
  };

  if (includeId && isUUID(prod.id)) {
    payload.id = prod.id;
  }
  return payload;
};

const fetchWithRetry = async (url, options = {}, retries = 2, delay = 1000, timeout = 30000) => {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const res = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeoutId);
      return res;
    } catch (err) {
      clearTimeout(timeoutId);
      lastError = err;
      // Wait before retrying on transient network failures
      if (attempt < retries) {
        await new Promise(r => setTimeout(r, delay * (attempt + 1)));
      }
    }
  }
  throw lastError;
};

const formatErrorMessage = (err) => {
  if (err?.name === 'AbortError') {
    return 'Connection timed out (Supabase cold start or slow network)';
  }
  if (err?.message === 'Failed to fetch' || err?.message?.includes('NetworkError')) {
    return 'Failed to fetch (Supabase project may be paused or offline)';
  }
  return err?.message || 'Network error';
};

export const supabaseApi = {
  // Fetch all products dynamically from Supabase
  async getProducts() {
    const url = `${SUPABASE_URL}/rest/v1/products?select=*&order=name.asc`;
    const headers = getQueryHeaders();

    try {
      // 1. Direct native fetch (avoids any preflight issues or abrupt AbortController triggers)
      let res;
      try {
        res = await fetch(url, { method: 'GET', headers });
      } catch (directErr) {
        console.warn('Direct fetch attempt failed, using fetchWithRetry with 30s timeout...', directErr);
        res = await fetchWithRetry(url, { method: 'GET', headers }, 2, 1000, 30000);
      }

      if (!res.ok) {
        const errorText = await res.text();
        console.warn('Supabase fetch products warning:', res.status, errorText);
        return { data: null, error: `${res.status}: ${errorText}` };
      }

      const rows = await res.json();
      console.info(`✓ Successfully fetched ${rows.length} rows directly from Supabase!`);
      const normalized = Array.isArray(rows) ? rows.map(normalizeProduct).filter(Boolean) : [];
      return { data: normalized, error: null, rawCount: rows.length };
    } catch (err) {
      const friendlyMsg = formatErrorMessage(err);
      console.warn('Supabase getProducts network error:', friendlyMsg, err);
      return { data: null, error: friendlyMsg };
    }
  },

  // Insert a new product
  async addProduct(product) {
    try {
      const payload = formatProductForDb(product, false);
      let res = await fetch(`${SUPABASE_URL}/rest/v1/products`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });

      // If full payload fails (e.g. extra columns missing in DB), retry with core table columns
      if (!res.ok) {
        const corePayload = {
          name: product.name,
          chemical: product.chemical || '',
          category: product.category || 'chemicals',
          formulation: product.formulation || 'SC'
        };
        const coreRes = await fetch(`${SUPABASE_URL}/rest/v1/products`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(corePayload)
        });
        if (coreRes.ok) {
          const inserted = await coreRes.json();
          return { data: normalizeProduct(inserted[0] || { ...product, ...corePayload }), error: null };
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
      const friendlyMsg = formatErrorMessage(err);
      console.warn('Supabase addProduct network error:', friendlyMsg, err);
      return { data: product, error: friendlyMsg };
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
      const friendlyMsg = formatErrorMessage(err);
      console.warn('Supabase updateProduct network error:', friendlyMsg, err);
      return { data: updates, error: friendlyMsg };
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
      const friendlyMsg = formatErrorMessage(err);
      console.warn('Supabase deleteProduct network error:', friendlyMsg, err);
      return { error: friendlyMsg };
    }
  }
};
