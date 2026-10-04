import React, { createContext, useContext, useState, useEffect } from 'react';
import { mongoApi, normalizeProduct, normalizeCategory, normalizeCrop, normalizeQuery } from '../utils/apiClient';

const DataContext = createContext(null);

const STORAGE_KEYS = {
  CATEGORIES: 'shimanzu_categories_v1',
  CROPS: 'shimanzu_crops_v1',
  PRODUCTS: 'shimanzu_products_v1',
  QUERIES: 'shimanzu_queries_v1',
  AUTH: 'shimanzu_admin_auth_v1',
  PASSWORD: 'shimanzu_admin_pwd_v1'
};

export const INITIAL_QUERIES = [];

const CUSTOM_IMAGES_KEY = 'shimanzu_custom_product_images';

const getCustomImagesMap = () => {
  try {
    const raw = localStorage.getItem(CUSTOM_IMAGES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
};

const persistCustomImage = (id, name, imgSrc) => {
  if (!imgSrc || typeof imgSrc !== 'string' || imgSrc.length > 200000) return;
  try {
    const map = getCustomImagesMap();
    if (id) map[String(id)] = imgSrc;
    if (name) map[String(name).trim().toLowerCase()] = imgSrc;
    localStorage.setItem(CUSTOM_IMAGES_KEY, JSON.stringify(map));
  } catch (e) {
    // Quota reached, ignore silently
  }
};

const resolveProductImage = (prod, customMap = null) => {
  const map = customMap || getCustomImagesMap();
  const nameKey = (prod?.name || '').trim().toLowerCase();
  const idKey = String(prod?.id || '');

  // 1. Prioritize user custom uploaded image (data URL or saved in custom image map)
  if (map[idKey]) return map[idKey];
  if (map[nameKey]) return map[nameKey];
  if (prod?.imgSrc && (String(prod.imgSrc).startsWith('data:') || String(prod.imgSrc).startsWith('blob:'))) {
    return prod.imgSrc;
  }

  const currentImg = String(prod?.imgSrc || prod?.img_src || '').trim();

  // If product has no image (e.g. newly added without image), return empty string - NO DEFAULT IMAGE!
  if (!currentImg) {
    return '';
  }

  // If already a valid custom URL or data URL
  if (!currentImg.includes('images.unsplash.com') && !currentImg.includes('chemicals.jpg')) {
    return currentImg;
  }

  // 2. Only if it had legacy unsplash photo or generic chemicals.jpg, assign Japanese packaging
  if ((currentImg.includes('images.unsplash.com') || currentImg.includes('chemicals.jpg')) && PACKAGING_BOTTLES && PACKAGING_BOTTLES.length > 0 && nameKey) {
    const charCodeSum = nameKey.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const bottleIndex = charCodeSum % PACKAGING_BOTTLES.length;
    return PACKAGING_BOTTLES[bottleIndex] || '';
  }

  return '';
};

export const DataProvider = ({ children }) => {
  // 1. Categories state loaded directly from MongoDB Atlas (Zero static fallback)
  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(c => ({
            ...c,
            image: (c.image && (String(c.image).startsWith('http') || String(c.image).startsWith('data:'))) ? c.image : ''
          }));
        }
      }
    } catch (e) {
      console.error('Failed to load categories from localStorage', e);
    }
    return [];
  });
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);
  const [categoriesError, setCategoriesError] = useState(null);

  const resolveCategoryImage = (cat) => {
    if (cat?.image && (String(cat.image).startsWith('http') || String(cat.image).startsWith('data:') || String(cat.image).startsWith('blob:'))) {
      return cat.image;
    }
    return '';
  };

  // 2. Crops state loaded directly from MongoDB Atlas (Zero static fallback)
  const [crops, setCrops] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CROPS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load crops from localStorage', e);
    }
    return [];
  });
  const [isCropsLoading, setIsCropsLoading] = useState(false);
  const [cropsError, setCropsError] = useState(null);

  const loadDatabaseCrops = async () => {
    setIsCropsLoading(true);
    try {
      const { data, error } = await mongoApi.getCrops();
      if (error) {
        console.warn('MongoDB crops fetch warning:', error);
        setCropsError(error);
      } else if (Array.isArray(data) && data.length > 0) {
        setCrops(data);
        setCropsError(null);
        console.info(`✓ Loaded ${data.length} crops directly from MongoDB Atlas!`);
      }
    } catch (err) {
      console.warn('Error loading crops from MongoDB:', err);
      setCropsError(err.message);
    } finally {
      setIsCropsLoading(false);
    }
  };

  useEffect(() => {
    loadDatabaseCrops();
  }, []);

  // 3. Customer Queries state loaded directly from MongoDB Atlas
  const [queries, setQueries] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.QUERIES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load queries from localStorage', e);
    }
    return [];
  });
  const [isQueriesLoading, setIsQueriesLoading] = useState(false);
  const [queriesError, setQueriesError] = useState(null);

  const loadDatabaseQueries = async () => {
    setIsQueriesLoading(true);
    try {
      const { data, error } = await mongoApi.getQueries();
      if (error) {
        console.warn('MongoDB queries fetch warning:', error);
        setQueriesError(error);
      } else if (Array.isArray(data)) {
        setQueries(data);
        setQueriesError(null);
        console.info(`✓ Loaded ${data.length} customer inquiries directly from MongoDB Atlas!`);
      }
    } catch (err) {
      console.warn('Error loading queries from MongoDB:', err);
      setQueriesError(err.message);
    } finally {
      setIsQueriesLoading(false);
    }
  };

  useEffect(() => {
    loadDatabaseQueries();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.QUERIES, JSON.stringify(queries));
    } catch (e) {}
  }, [queries]);

  const addQuery = async (queryData) => {
    const id = 'query-' + Date.now();
    const newQuery = {
      ...queryData,
      id,
      _id: id,
      date: new Date().toISOString(),
      status: 'new'
    };
    // Optimistic UI update
    setQueries(prev => [newQuery, ...prev]);

    // Persist to MongoDB Atlas
    try {
      const { data, error } = await mongoApi.addQuery(newQuery);
      if (error) {
        console.warn('Failed to save query in MongoDB:', error);
        return { success: false, error, data: newQuery };
      }
      return { success: true, data: data || newQuery };
    } catch (err) {
      console.error('Error saving customer query to MongoDB:', err);
      return { success: false, error: err.message, data: newQuery };
    }
  };

  const updateQueryStatus = async (id, newStatus) => {
    setQueries(prev => prev.map(q => q.id === id ? { ...q, status: newStatus } : q));
    try {
      await mongoApi.updateQuery(id, { status: newStatus });
    } catch (err) {
      console.warn('Failed to update query status in MongoDB:', err);
    }
  };

  const deleteQuery = async (id) => {
    setQueries(prev => prev.filter(q => q.id !== id));
    try {
      await mongoApi.deleteQuery(id);
    } catch (err) {
      console.warn('Failed to delete query in MongoDB:', err);
    }
  };

  // 3. Products state — ONLY dynamic database products (zero static data fallback)
  const [products, setProducts] = useState(() => {
    const customMap = getCustomImagesMap();
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Only load if it's the real live database catalog (more than 31 items)
        if (Array.isArray(parsed) && parsed.length > 31) {
          return parsed.map(p => ({
            ...p,
            imgSrc: resolveProductImage(p, customMap)
          }));
        } else {
          // Immediately purge old static 31 items from cache!
          localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
        }
      }
    } catch (e) {
      console.error('Failed to load products from localStorage', e);
    }
    return [];
  });
  const [isSupabaseLoading, setIsSupabaseLoading] = useState(false);
  const [supabaseError, setSupabaseError] = useState(null);

  // Sync products to localStorage whenever products state updates
  useEffect(() => {
    try {
      if (Array.isArray(products) && products.length > 0) {
        // Strip large base64 strings so 73 products take ~25KB and always fit in 5MB limit
        const lightweight = products.map(p => {
          const isHuge = p.imgSrc && typeof p.imgSrc === 'string' && p.imgSrc.startsWith('data:') && p.imgSrc.length > 30000;
          return isHuge ? { ...p, imgSrc: '' } : p;
        });
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(lightweight));
      }
    } catch (e) {
      try {
        localStorage.removeItem(CUSTOM_IMAGES_KEY);
        const minimal = products.map(({ imgSrc, ...rest }) => rest);
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(minimal));
      } catch (innerErr) {
        // Ignore fallback error
      }
    }
  }, [products]);

  // Helper to process products from database and assign matching bottle packaging images
  const processProductsFromDb = (dbRows) => {
    if (!Array.isArray(dbRows) || dbRows.length === 0) return [];
    const seenIds = new Set();
    const processed = [];
    const customMap = getCustomImagesMap();

    for (const rawRow of dbRows) {
      const row = normalizeProduct(rawRow);
      if (!row || !row.name) continue; // Skip empty rows
      const rawName = row.name.trim();
      if (!rawName) continue;

      const idKey = String(row.id || '').trim().toLowerCase();

      // Avoid duplicate row IDs while preserving ALL distinct database products (all 73 rows)
      if (idKey && seenIds.has(idKey)) continue;
      if (idKey) seenIds.add(idKey);

      const finalImg = resolveProductImage({ ...row, name: rawName }, customMap);

      processed.push({
        ...row,
        name: rawName,
        categoryLabel: row.categoryLabel || (row.category ? row.category.toUpperCase() : 'AGROCHEMICAL'),
        imgSrc: finalImg
      });
    }

    return processed;
  };

  // Fetch products from MongoDB Atlas on mount
  useEffect(() => {
    let isMounted = true;
    let retryTimer = null;

    const loadDatabaseProducts = async (attempt = 1) => {
      setIsSupabaseLoading(true);
      const { data, error, rawCount } = await mongoApi.getProducts();

      if (!isMounted) return;

      if (error) {
        setSupabaseError(error);
        console.warn(`MongoDB products fetch (attempt ${attempt}) warning:`, error);
        setProducts(prev => (Array.isArray(prev) ? prev : []));
        
        if (attempt < 3) {
          retryTimer = setTimeout(() => {
            if (isMounted) loadDatabaseProducts(attempt + 1);
          }, attempt * 2500);
        }
      } else if (Array.isArray(data) && data.length > 0) {
        const unique = processProductsFromDb(data);
        setProducts(unique);
        setSupabaseError(null);
        console.info(`✓ Loaded ${unique.length} live products directly from MongoDB Atlas (Raw: ${rawCount})`);
      } else {
        setProducts(prev => (Array.isArray(prev) ? prev : []));
      }
      setIsSupabaseLoading(false);
    };

    loadDatabaseProducts();

    return () => {
      isMounted = false;
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, []);

  // Fetch categories from MongoDB Atlas on mount
  const loadDatabaseCategories = async (attempt = 1) => {
    setIsCategoriesLoading(true);
    try {
      const { data, error, rawCount } = await mongoApi.getCategories();
      if (error) {
        console.warn(`MongoDB categories fetch (attempt ${attempt}):`, error);
        setCategoriesError(error);
      } else if (Array.isArray(data) && data.length > 0) {
        const resolved = data.map(c => ({
          ...c,
          image: resolveCategoryImage(c)
        }));
        setCategories(resolved);
        setCategoriesError(null);
        console.info(`✓ Loaded ${resolved.length} categories directly from MongoDB Atlas!`);
      }
    } catch (err) {
      console.warn('Error loading categories from MongoDB:', err);
      setCategoriesError(err.message);
    } finally {
      setIsCategoriesLoading(false);
    }
  };

  useEffect(() => {
    loadDatabaseCategories();
  }, []);

  // 4. Admin Auth & Password state with localStorage persistence
  const [adminPassword, setAdminPassword] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.PASSWORD) || 'admin@123';
    } catch {
      return 'admin@123';
    }
  });

  const [isAdmin, setIsAdmin] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
    } catch {
      return false;
    }
  });

  const login = (username, password) => {
    const u = (username || '').trim().toLowerCase();
    const p = (password || '').trim();

    // Validate email and current admin password (default: admin@123)
    if (
      u === 'admin@shimanzu.com' &&
      p === adminPassword
    ) {
      setIsAdmin(true);
      try {
        localStorage.setItem(STORAGE_KEYS.AUTH, 'true');
      } catch (e) {
        console.error('Failed to save auth to localStorage', e);
      }
      return { success: true };
    }

    return { 
      success: false, 
      message: 'Invalid email or password. Please try again.' 
    };
  };

  const changeAdminPassword = (currentPassword, newPassword) => {
    const cur = (currentPassword || '').trim();
    const next = (newPassword || '').trim();

    if (cur !== adminPassword) {
      return {
        success: false,
        message: 'Current password does not match.'
      };
    }

    if (!next || next.length < 4) {
      return {
        success: false,
        message: 'New password must be at least 4 characters long.'
      };
    }

    try {
      localStorage.setItem(STORAGE_KEYS.PASSWORD, next);
      setAdminPassword(next);
      return {
        success: true,
        message: 'Admin password changed successfully!'
      };
    } catch (e) {
      console.error('Failed to save new password to localStorage', e);
      return {
        success: false,
        message: 'Failed to save password in browser storage.'
      };
    }
  };

  const logout = () => {
    setIsAdmin(false);
    try {
      localStorage.removeItem(STORAGE_KEYS.AUTH);
    } catch (e) {
      console.error('Failed to remove auth from localStorage', e);
    }
  };

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.error('Failed to save categories to localStorage', e);
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CROPS, JSON.stringify(crops));
    } catch (e) {
      console.error('Failed to save crops to localStorage', e);
    }
  }, [crops]);

  // CATEGORY CRUD (Connected to MongoDB Atlas & Cloudinary)
  const addCategory = async (newCat) => {
    const id = newCat.id || newCat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    let finalImg = (newCat.image || '').trim();

    // If image is a base64 or blob string, upload directly to Cloudinary (folder: shimanzu_categories)
    if (finalImg && (finalImg.startsWith('data:') || finalImg.startsWith('blob:'))) {
      try {
        const uploadRes = await mongoApi.uploadImageToCloudinary(finalImg, 'shimanzu_categories');
        if (uploadRes && uploadRes.url) {
          finalImg = uploadRes.url;
        }
      } catch (uploadErr) {
        console.warn('Cloudinary upload category error:', uploadErr);
      }
    }

    const category = {
      ...newCat,
      id,
      _id: id,
      name: newCat.name.trim(),
      shortName: newCat.shortName ? newCat.shortName.trim() : newCat.name.trim(),
      accentColor: newCat.accentColor || '#10B981',
      image: finalImg, // Real Cloudinary URL or empty string, NO static default image!
      description: newCat.description ? newCat.description.trim() : '',
      fullDescription: newCat.fullDescription ? newCat.fullDescription.trim() : (newCat.description ? newCat.description.trim() : ''),
      productCount: 0,
      created_at: new Date().toISOString()
    };

    // 1. Optimistic UI update
    setCategories(prev => {
      const filtered = prev.filter(c => c.id !== id);
      return [...filtered, category];
    });

    // 2. Persist to MongoDB Atlas
    try {
      const { data, error } = await mongoApi.addCategory(category);
      if (error) {
        console.warn('MongoDB addCategory warning:', error);
        return { success: false, error, data: category };
      } else if (data) {
        setCategories(prev => prev.map(c => c.id === id ? { ...data, image: resolveCategoryImage(data) } : c));
        return { success: true, data };
      }
    } catch (err) {
      console.error('Error adding category to MongoDB:', err);
      return { success: false, error: err.message };
    }
    return { success: true, data: category };
  };

  const updateCategory = async (id, updatedFields) => {
    let finalImg = updatedFields.image !== undefined ? (updatedFields.image || '').trim() : undefined;

    // If image is a base64 or blob string, upload directly to Cloudinary (folder: shimanzu_categories)
    if (finalImg && (finalImg.startsWith('data:') || finalImg.startsWith('blob:'))) {
      try {
        const uploadRes = await mongoApi.uploadImageToCloudinary(finalImg, 'shimanzu_categories');
        if (uploadRes && uploadRes.url) {
          finalImg = uploadRes.url;
        }
      } catch (uploadErr) {
        console.warn('Cloudinary category update upload warning:', uploadErr);
      }
    }

    const sanitizedFields = {
      ...updatedFields,
      ...(finalImg !== undefined ? { image: finalImg } : {})
    };
    delete sanitizedFields._id;

    // 1. Optimistic UI update
    setCategories(prev => prev.map(cat => cat.id === id ? { ...cat, ...sanitizedFields } : cat));

    // 2. Persist to MongoDB Atlas
    try {
      const { data, error } = await mongoApi.updateCategory(id, sanitizedFields);
      if (error) {
        console.warn('MongoDB updateCategory warning:', error);
        return { success: false, error };
      }
      if (data) {
        setCategories(prev => prev.map(cat => cat.id === id ? { ...data, image: resolveCategoryImage(data) } : cat));
      }
      return { success: true, data };
    } catch (err) {
      console.error('Error updating category in MongoDB:', err);
      return { success: false, error: err.message };
    }
  };

  const deleteCategory = async (id) => {
    try {
      const { error } = await mongoApi.deleteCategory(id);
      if (error) {
        console.warn('MongoDB deleteCategory error:', error);
        return { success: false, error };
      }
      setCategories(prev => prev.filter(cat => cat.id !== id));
      return { success: true };
    } catch (err) {
      console.error('Error deleting category in MongoDB:', err);
      return { success: false, error: err.message };
    }
  };

  const refreshCategories = () => {
    return loadDatabaseCategories();
  };

  // CROP CRUD (Connected to MongoDB Atlas & Cloudinary)
  const addCrop = async (newCrop) => {
    const id = newCrop.id || newCrop.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    let finalImg = (newCrop.image || '').trim();

    if (finalImg && (finalImg.startsWith('data:') || finalImg.startsWith('blob:'))) {
      try {
        const uploadRes = await mongoApi.uploadImageToCloudinary(finalImg, 'shimanzu_crops');
        if (uploadRes && uploadRes.url) {
          finalImg = uploadRes.url;
        }
      } catch (uploadErr) {
        console.warn('Cloudinary upload crop error:', uploadErr);
      }
    }

    const crop = {
      ...newCrop,
      id,
      _id: id,
      cropKey: newCrop.cropKey || newCrop.name,
      image: finalImg || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
      description: newCrop.description || `High-potency crop protection solutions for ${newCrop.name}.`,
      created_at: new Date().toISOString()
    };

    setCrops(prev => {
      const filtered = prev.filter(c => c.id !== id);
      return [...filtered, crop];
    });

    try {
      const { data, error } = await mongoApi.addCrop(crop);
      if (error) {
        console.warn('MongoDB addCrop warning:', error);
        return { success: false, error, data: crop };
      } else if (data) {
        setCrops(prev => prev.map(c => c.id === id ? data : c));
        return { success: true, data };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
    return { success: true, data: crop };
  };

  const updateCrop = async (id, updatedFields) => {
    let finalImg = updatedFields.image !== undefined ? (updatedFields.image || '').trim() : undefined;

    if (finalImg && (finalImg.startsWith('data:') || finalImg.startsWith('blob:'))) {
      try {
        const uploadRes = await mongoApi.uploadImageToCloudinary(finalImg, 'shimanzu_crops');
        if (uploadRes && uploadRes.url) {
          finalImg = uploadRes.url;
        }
      } catch (uploadErr) {
        console.warn('Cloudinary crop update upload warning:', uploadErr);
      }
    }

    const sanitized = {
      ...updatedFields,
      ...(finalImg !== undefined ? { image: finalImg } : {})
    };
    delete sanitized._id;

    setCrops(prev => prev.map(c => c.id === id ? { ...c, ...sanitized } : c));

    try {
      const { data, error } = await mongoApi.updateCrop(id, sanitized);
      if (error) {
        console.warn('MongoDB updateCrop warning:', error);
        return { success: false, error };
      }
      if (data) {
        setCrops(prev => prev.map(c => c.id === id ? data : c));
      }
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteCrop = async (id) => {
    setCrops(prev => prev.filter(c => c.id !== id));
    try {
      const { error } = await mongoApi.deleteCrop(id);
      if (error) {
        console.warn('MongoDB deleteCrop error:', error);
        return { success: false, error };
      }
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // PRODUCT CRUD (Connected to MongoDB Atlas & Cloudinary)
  const addProduct = async (newProd) => {
    const id = newProd.id || 'prod-' + Date.now();
    let finalImg = newProd.imgSrc ? newProd.imgSrc.trim() : '';

    // If image is a base64 string, upload to Cloudinary for permanent hosting
    if (finalImg && (finalImg.startsWith('data:') || finalImg.startsWith('blob:'))) {
      try {
        const uploadRes = await mongoApi.uploadImageToCloudinary(finalImg);
        if (uploadRes && uploadRes.url) {
          finalImg = uploadRes.url;
        }
      } catch (uploadErr) {
        console.warn('Cloudinary upload warning:', uploadErr);
      }
    }

    const product = {
      ...newProd,
      id,
      name: newProd.name || 'Untitled Product',
      chemical: newProd.chemical || '',
      category: newProd.category || (categories[0]?.id || 'fungicides'),
      categoryLabel: newProd.categoryLabel || categories.find(c => c.id === newProd.category)?.name || 'AGROCHEMICAL',
      group: newProd.group || (newProd.formulation ? `${newProd.formulation} FORMULATION` : 'AGRO CHEMICAL'),
      formulation: newProd.formulation || 'SC',
      inStock: newProd.inStock !== false,
      packSizes: Array.isArray(newProd.packSizes) ? newProd.packSizes : (newProd.packSizes ? newProd.packSizes.split(',').map(s => s.trim()) : ['1L']),
      crops: Array.isArray(newProd.crops) ? newProd.crops : (newProd.crops ? newProd.crops.split(',').map(s => s.trim()) : ['All Crops']),
      targets: newProd.targets || '',
      dosage: newProd.dosage || '',
      description: newProd.description || '',
      imgSrc: finalImg
    };

    if (product.imgSrc && (product.imgSrc.startsWith('data:') || product.imgSrc.startsWith('blob:'))) {
      persistCustomImage(id, product.name, product.imgSrc);
    }

    // 1. Optimistic UI update
    setProducts(prev => [product, ...prev]);

    // 2. Persist to MongoDB Atlas
    try {
      const { data, error } = await mongoApi.addProduct(product);
      if (error) {
        setSupabaseError(error);
        console.warn('MongoDB addProduct warning:', error);
        return { success: false, error, data: product };
      } else if (data) {
        setProducts(prev => prev.map(p => (p.id === id ? data : p)));
        return { success: true, data };
      }
      return { success: true, data: product };
    } catch (err) {
      console.error('Failed to sync added product to MongoDB:', err);
      return { success: false, error: err.message, data: product };
    }
  };

  const updateProduct = async (id, updatedFields) => {
    let targetUpdated = null;
    let fieldsToUpdate = { ...updatedFields };

    // If new image is base64, upload to Cloudinary
    if (fieldsToUpdate.imgSrc && (fieldsToUpdate.imgSrc.startsWith('data:') || fieldsToUpdate.imgSrc.startsWith('blob:'))) {
      try {
        const uploadRes = await mongoApi.uploadImageToCloudinary(fieldsToUpdate.imgSrc);
        if (uploadRes && uploadRes.url) {
          fieldsToUpdate.imgSrc = uploadRes.url;
        }
      } catch (uploadErr) {
        console.warn('Cloudinary upload warning:', uploadErr);
      }
    }

    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const updated = { ...p, ...fieldsToUpdate };
        if (fieldsToUpdate.category && (!fieldsToUpdate.categoryLabel || fieldsToUpdate.categoryLabel === p.categoryLabel)) {
          const cat = categories.find(c => c.id === fieldsToUpdate.category);
          if (cat) updated.categoryLabel = cat.name;
        }
        if (typeof updated.packSizes === 'string') {
          updated.packSizes = updated.packSizes.split(',').map(s => s.trim()).filter(Boolean);
        }
        if (typeof updated.crops === 'string') {
          updated.crops = updated.crops.split(',').map(s => s.trim()).filter(Boolean);
        }
        targetUpdated = updated;
        return updated;
      }
      return p;
    }));

    if (fieldsToUpdate.imgSrc) {
      persistCustomImage(id, fieldsToUpdate.name || targetUpdated?.name, fieldsToUpdate.imgSrc);
    }

    // Persist to MongoDB Atlas
    try {
      const { data, error } = await mongoApi.updateProduct(id, targetUpdated || fieldsToUpdate);
      if (error) {
        setSupabaseError(error);
        console.warn('MongoDB updateProduct warning:', error);
        return { success: false, error };
      } else if (data) {
        setProducts(prev => prev.map(p => (p.id === id ? data : p)));
        return { success: true, data };
      }
      return { success: true, data: targetUpdated || fieldsToUpdate };
    } catch (err) {
      console.error('Failed to sync updated product to MongoDB:', err);
      return { success: false, error: err.message };
    }
  };

  const deleteProduct = async (id) => {
    // 1. Optimistic UI update
    setProducts(prev => prev.filter(p => p.id !== id));

    try {
      const map = getCustomImagesMap();
      delete map[String(id)];
      localStorage.setItem(CUSTOM_IMAGES_KEY, JSON.stringify(map));
    } catch (e) {}

    // 2. Persist to MongoDB Atlas
    try {
      const { error } = await mongoApi.deleteProduct(id);
      if (error) {
        setSupabaseError(error);
        console.warn('MongoDB deleteProduct warning:', error);
        return { success: false, error };
      }
      return { success: true };
    } catch (err) {
      console.error('Failed to delete product in MongoDB:', err);
      return { success: false, error: err.message };
    }
  };

  // Re-fetch products from MongoDB
  const refreshProducts = async () => {
    setIsSupabaseLoading(true);
    const { data, error, rawCount } = await mongoApi.getProducts();
    let result = { success: false };

    if (error) {
      setSupabaseError(error);
      result = { success: false, error, count: products.length };
    } else if (Array.isArray(data) && data.length > 0) {
      const unique = processProductsFromDb(data);
      setProducts(unique);
      setSupabaseError(null);
      result = { success: true, count: unique.length, rawCount };
    } else {
      setProducts([]);
      setSupabaseError(null);
      result = { success: true, count: 0, rawCount: 0 };
    }

    setIsSupabaseLoading(false);
    return result;
  };

  // Helper to bulk seed initial products if empty
  const seedInitialProductsToSupabase = async () => {
    return 0;
  };

  // Helper to remove duplicate products from database
  const cleanDuplicateProductsInSupabase = async () => {
    setIsSupabaseLoading(true);
    try {
      const { data, error } = await mongoApi.getProducts();
      if (error || !Array.isArray(data)) {
        setIsSupabaseLoading(false);
        return { success: false, message: error || 'Failed to fetch products' };
      }

      const seenNames = new Set();
      const duplicatesToDelete = [];
      const keepProducts = [];

      for (const p of data) {
        const rawName = (p.name || '').trim();
        const key = rawName.toLowerCase();
        if (!key || seenNames.has(key)) {
          duplicatesToDelete.push(p.id);
        } else {
          seenNames.add(key);
          keepProducts.push(p);
        }
      }

      console.info(`Cleaning ${duplicatesToDelete.length} duplicates from MongoDB...`);

      let deletedCount = 0;
      for (const id of duplicatesToDelete) {
        const res = await mongoApi.deleteProduct(id);
        if (!res.error) deletedCount++;
      }

      const unique = processProductsFromDb(keepProducts);
      setProducts(unique);
      setIsSupabaseLoading(false);

      return {
        success: true,
        deletedCount,
        remainingCount: unique.length
      };
    } catch (err) {
      setIsSupabaseLoading(false);
      return { success: false, message: err.message };
    }
  };

  // Reset demo catalog
  const resetToDefaultData = () => {
    loadDatabaseCrops();
    loadDatabaseCategories();
    loadDatabaseQueries();
    setProducts([]);
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.CROPS);
    localStorage.removeItem(STORAGE_KEYS.QUERIES);
    localStorage.removeItem('shimanzu_products_v1');
  };

  // Dynamically compute product counts per category
  const dynamicCategories = categories.map(cat => ({
    ...cat,
    productCount: products.filter(p => p.category === cat.id).length
  }));

  const value = {
    categories: dynamicCategories,
    rawCategories: categories,
    crops,
    isCropsLoading,
    cropsError,
    refreshCrops: loadDatabaseCrops,
    products,
    isSupabaseLoading,
    supabaseError,
    isDatabaseLoading: isSupabaseLoading,
    databaseError: supabaseError,
    refreshProducts,
    seedInitialProductsToSupabase,
    cleanDuplicateProductsInSupabase,
    isCategoriesLoading,
    categoriesError,
    refreshCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    addCrop,
    updateCrop,
    deleteCrop,
    addProduct,
    updateProduct,
    deleteProduct,
    queries,
    isQueriesLoading,
    queriesError,
    refreshQueries: loadDatabaseQueries,
    addQuery,
    updateQueryStatus,
    deleteQuery,
    resetToDefaultData,
    isAdmin,
    adminPassword,
    changeAdminPassword,
    login,
    logout
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useDataContext must be used within a DataProvider');
  }
  return context;
};
