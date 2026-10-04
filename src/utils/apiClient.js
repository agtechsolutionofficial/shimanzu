// Shimanzu MongoDB & Cloudinary API Client
// Replaces Supabase completely

const API_BASE = '/api';

export const normalizeProduct = (row) => {
  if (!row) return null;

  const name = String(
    row.name || 
    row.productName || 
    row.product_name || 
    row.title || 
    'Untitled Product'
  ).trim();

  const chemical = String(
    row.chemical || 
    row.chemicalComposition || 
    row.chemical_composition || 
    row.composition || 
    row.active_ingredient || 
    ''
  ).trim();

  const brand = String(
    row.brand || 
    row.brandOverlay || 
    'SHIMANZU'
  ).trim();

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

  const categoryLabel = String(
    row.categoryLabel || 
    row.category_label || 
    row.category || 
    (category ? category.toUpperCase() : 'AGROCHEMICAL')
  ).trim();

  const formulation = String(row.formulation || 'SC').trim();

  const group = String(
    row.group || 
    row.groupModeOfAction || 
    `${formulation} FORMULATION`
  ).trim();

  const inStock = row.inStock !== undefined 
    ? Boolean(row.inStock) 
    : (row.in_stock !== undefined ? Boolean(row.in_stock) : true);

  let packSizes = ['1L'];
  const rawPack = row.packSizes || row.pack_sizes || row.packSize;
  if (Array.isArray(rawPack) && rawPack.length > 0) {
    packSizes = rawPack.map(s => String(s).trim()).filter(Boolean);
  } else if (typeof rawPack === 'string' && rawPack.trim()) {
    packSizes = rawPack.split(',').map(s => s.trim()).filter(Boolean);
  }

  let crops = ['All Crops'];
  const rawCrops = row.crops || row.targetCrops || row.target_crops;
  if (Array.isArray(rawCrops) && rawCrops.length > 0) {
    crops = rawCrops.map(s => String(s).trim()).filter(Boolean);
  } else if (typeof rawCrops === 'string' && rawCrops.trim()) {
    crops = rawCrops.split(',').map(s => s.trim()).filter(Boolean);
  }

  const targets = String(row.targets || row.targetPestsDiseases || '').trim();
  const dosage = String(row.dosage || row.recommendedDosage || '').trim();
  const description = String(row.description || row.productOverviewAndEfficacy || '').trim();
  const imgSrc = String(row.imgSrc || row.img_src || row.image || row.imageUrl || '').trim();

  return {
    id: String(row.id || row._id || ('prod-' + name.toLowerCase().replace(/[^a-z0-9]+/g, '-'))),
    _id: String(row._id || row.id),
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

export const normalizeCategory = (row) => {
  if (!row) return null;
  const id = String(row.id || row._id || '').trim();
  const name = String(row.name || '').trim();
  if (!id && !name) return null;

  return {
    id: id || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    _id: id || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    name: name || id.toUpperCase(),
    shortName: String(row.shortName || row.short_name || name).trim(),
    accentColor: String(row.accentColor || row.accent_color || '#10B981').trim(),
    image: String(row.image || row.image_url || row.imgSrc || '').trim(),
    description: String(row.description || '').trim(),
    fullDescription: String(row.fullDescription || row.full_description || row.description || '').trim(),
    productCount: Number(row.productCount || row.product_count || 0),
    createdAt: row.created_at || row.createdAt || null
  };
};

export const normalizeCrop = (row) => {
  if (!row) return null;
  const id = String(row.id || row._id || '').trim();
  const name = String(row.name || '').trim();
  if (!id && !name) return null;

  return {
    id: id || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    _id: id || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    name: name || id,
    cropKey: String(row.cropKey || row.crop_key || name || '').trim(),
    image: String(row.image || row.image_url || row.imgSrc || '').trim(),
    description: String(row.description || '').trim(),
    createdAt: row.created_at || row.createdAt || null
  };
};

export const normalizeQuery = (row) => {
  if (!row) return null;
  const id = String(row.id || row._id || '').trim();
  return {
    id: id || ('query-' + Date.now()),
    _id: id || ('query-' + Date.now()),
    name: String(row.name || 'Anonymous User').trim(),
    email: String(row.email || '').trim(),
    phone: String(row.phone || 'Not specified').trim(),
    location: String(row.location || 'Website Lead').trim(),
    productInterest: String(row.productInterest || row.product_interest || 'General Inquiry').trim(),
    subject: String(row.subject || 'Contact Inquiry').trim(),
    message: String(row.message || '').trim(),
    date: row.date || row.created_at || new Date().toISOString(),
    status: String(row.status || 'new').toLowerCase().trim()
  };
};

export const mongoApi = {
  // Fetch all products from MongoDB Atlas
  async getProducts() {
    try {
      const res = await fetch(`${API_BASE}/products`);
      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }
      const json = await res.json();
      const rows = json.data || [];
      const normalized = Array.isArray(rows) ? rows.map(normalizeProduct).filter(Boolean) : [];
      return { data: normalized, error: null, rawCount: rows.length };
    } catch (err) {
      console.warn('MongoDB API getProducts network error:', err.message);
      return { data: null, error: err.message, rawCount: 0 };
    }
  },

  // Add product to MongoDB
  async addProduct(product) {
    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to add product');
      }
      return { data: normalizeProduct(json.data), error: null };
    } catch (err) {
      console.warn('MongoDB API addProduct error:', err.message);
      return { data: null, error: err.message };
    }
  },

  // Update product in MongoDB
  async updateProduct(id, updatedFields) {
    try {
      const res = await fetch(`${API_BASE}/products/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to update product');
      }
      return { data: normalizeProduct(json.data), error: null };
    } catch (err) {
      console.warn('MongoDB API updateProduct error:', err.message);
      return { data: null, error: err.message };
    }
  },

  // Delete product from MongoDB
  async deleteProduct(id) {
    try {
      const res = await fetch(`${API_BASE}/products/${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to delete product');
      }
      return { error: null };
    } catch (err) {
      console.warn('MongoDB API deleteProduct error:', err.message);
      return { error: err.message };
    }
  },

  // Fetch all categories from MongoDB
  async getCategories() {
    try {
      const res = await fetch(`${API_BASE}/categories`);
      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }
      const json = await res.json();
      const rows = json.data || [];
      const normalized = Array.isArray(rows) ? rows.map(normalizeCategory).filter(Boolean) : [];
      return { data: normalized, error: null, rawCount: rows.length };
    } catch (err) {
      console.warn('MongoDB API getCategories error:', err.message);
      return { data: null, error: err.message, rawCount: 0 };
    }
  },

  // Add category to MongoDB
  async addCategory(category) {
    try {
      const res = await fetch(`${API_BASE}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category)
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to add category');
      }
      return { data: normalizeCategory(json.data), error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  },

  // Update category in MongoDB
  async updateCategory(id, updatedFields) {
    try {
      const res = await fetch(`${API_BASE}/categories/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to update category');
      }
      return { data: normalizeCategory(json.data), error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  },

  // Delete category from MongoDB
  async deleteCategory(id) {
    try {
      const res = await fetch(`${API_BASE}/categories/${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to delete category');
      }
      return { error: null };
    } catch (err) {
      return { error: err.message };
    }
  },

  // Upload product or category image to Cloudinary via backend API
  async uploadImageToCloudinary(imageData, folder = 'shimanzu_products') {
    try {
      const res = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageData, folder })
      });
      const json = await res.json();
      if (json.success && json.url) {
        return { url: json.url, error: null };
      }
      return { url: imageData, error: json.error || 'Upload error' };
    } catch (err) {
      console.warn('Cloudinary upload error, using raw image:', err.message);
      return { url: imageData, error: err.message };
    }
  },

  // -----------------------------------------------------------
  // Crops API Endpoints (MongoDB Atlas)
  // -----------------------------------------------------------
  async getCrops() {
    try {
      const res = await fetch(`${API_BASE}/crops`);
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const json = await res.json();
      const rows = json.data || [];
      const normalized = Array.isArray(rows) ? rows.map(normalizeCrop).filter(Boolean) : [];
      return { data: normalized, error: null, count: normalized.length };
    } catch (err) {
      console.warn('MongoDB API getCrops error:', err.message);
      return { data: null, error: err.message, count: 0 };
    }
  },

  async addCrop(crop) {
    try {
      const res = await fetch(`${API_BASE}/crops`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(crop)
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'Failed to add crop');
      return { data: normalizeCrop(json.data), error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  },

  async updateCrop(id, updatedFields) {
    try {
      const res = await fetch(`${API_BASE}/crops/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'Failed to update crop');
      return { data: normalizeCrop(json.data), error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  },

  async deleteCrop(id) {
    try {
      const res = await fetch(`${API_BASE}/crops/${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'Failed to delete crop');
      return { error: null };
    } catch (err) {
      return { error: err.message };
    }
  },

  // -----------------------------------------------------------
  // Customer Queries API Endpoints (MongoDB Atlas)
  // -----------------------------------------------------------
  async getQueries() {
    try {
      const res = await fetch(`${API_BASE}/queries`);
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const json = await res.json();
      const rows = json.data || [];
      const normalized = Array.isArray(rows) ? rows.map(normalizeQuery).filter(Boolean) : [];
      return { data: normalized, error: null, count: normalized.length };
    } catch (err) {
      console.warn('MongoDB API getQueries error:', err.message);
      return { data: null, error: err.message, count: 0 };
    }
  },

  async addQuery(query) {
    try {
      const res = await fetch(`${API_BASE}/queries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(query)
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'Failed to submit inquiry');
      return { data: normalizeQuery(json.data), error: null };
    } catch (err) {
      console.warn('MongoDB API addQuery error:', err.message);
      return { data: null, error: err.message };
    }
  },

  async updateQuery(id, updatedFields) {
    try {
      const res = await fetch(`${API_BASE}/queries/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'Failed to update inquiry');
      return { data: normalizeQuery(json.data), error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  },

  async deleteQuery(id) {
    try {
      const res = await fetch(`${API_BASE}/queries/${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'Failed to delete inquiry');
      return { error: null };
    } catch (err) {
      return { error: err.message };
    }
  }
};
