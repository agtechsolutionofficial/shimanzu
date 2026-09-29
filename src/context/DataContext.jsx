import React, { createContext, useContext, useState, useEffect } from 'react';
import { CATEGORIES as INITIAL_CATEGORIES } from '../data/categoriesData';
import { CROPS as INITIAL_CROPS } from '../data/cropsData';
import { PACKAGING_BOTTLES } from '../data/productsData';
import { supabaseApi, normalizeProduct } from '../utils/supabaseClient';

const DataContext = createContext(null);

const STORAGE_KEYS = {
  CATEGORIES: 'shimanzu_categories_v1',
  CROPS: 'shimanzu_crops_v1',
  PRODUCTS: 'shimanzu_products_v1',
  QUERIES: 'shimanzu_queries_v1',
  AUTH: 'shimanzu_admin_auth_v1',
  PASSWORD: 'shimanzu_admin_pwd_v1'
};

export const INITIAL_QUERIES = [
  {
    id: 'query-101',
    name: 'Ramesh Patel',
    email: 'ramesh.farmer@gmail.com',
    phone: '+91 98251 44820',
    location: 'Surat, Gujarat',
    productInterest: 'TEBCIN (Fungicide)',
    subject: 'Bulk order requirement for Paddy Season',
    message: 'We require 200 Litres of TEBCIN for our co-operative paddy fields in Olpad block to control Sheath Blight. Please share dealer quotation and delivery timeline.',
    date: '2026-09-28T14:30:00Z',
    status: 'new'
  },
  {
    id: 'query-102',
    name: 'Vikram Singh (Agro Chem Dist.)',
    email: 'vikram.singh@agrochemindia.com',
    phone: '+91 94140 88219',
    location: 'Indore, Madhya Pradesh',
    productInterest: 'Ghiroilkona R-999 (PW)',
    subject: 'Distributorship & 25kg Bag pricing for Coatings',
    message: 'We are chemical stockists in Indore dealing in industrial paints and masterbatch formulations. We would like to place an initial order for 10 metric tons of Ghiroilkona R-999 Rutile Grade pigment.',
    date: '2026-09-27T10:15:00Z',
    status: 'contacted'
  },
  {
    id: 'query-103',
    name: 'Dr. Suresh Deshmukh',
    email: 'suresh.horticulture@yahoo.com',
    phone: '+91 98220 31405',
    location: 'Nashik, Maharashtra',
    productInterest: 'MANGO BAR (PGR)',
    subject: 'Dosage clarification for 8-year-old Alphonso trees',
    message: 'Can you please provide the technical bulletin and soil drenching schedule for MANGO BAR (Paclobutrazol 23% SC) for October collar drenching?',
    date: '2026-09-26T16:45:00Z',
    status: 'resolved'
  },
  {
    id: 'query-104',
    name: 'Harpreet Singh Mann',
    email: 'mann.farms@outlook.com',
    phone: '+91 98142 55901',
    location: 'Ludhiana, Punjab',
    productInterest: 'SHIM PYROX (Herbicide)',
    subject: 'Wheat Phalaris minor pre-emergence application',
    message: 'Need advice on tank mixing SHIM PYROX (Pyroxasulfone 85% WG) with other selective herbicides for zero-till wheat sowing.',
    date: '2026-09-25T09:20:00Z',
    status: 'new'
  }
];

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
  // 1. Categories state with localStorage persistence
  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.some(c => c.id === 'chemicals')) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load categories from localStorage', e);
    }
    return INITIAL_CATEGORIES;
  });

  // 2. Crops state with localStorage persistence
  const [crops, setCrops] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CROPS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load crops from localStorage', e);
    }
    return INITIAL_CROPS;
  });

  // 3. Customer Queries state with localStorage persistence
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
    return INITIAL_QUERIES;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.QUERIES, JSON.stringify(queries));
    } catch (e) {}
  }, [queries]);

  const addQuery = (queryData) => {
    const newQuery = {
      ...queryData,
      id: 'query-' + Date.now(),
      date: new Date().toISOString(),
      status: 'new'
    };
    setQueries(prev => [newQuery, ...prev]);
    return newQuery;
  };

  const updateQueryStatus = (id, newStatus) => {
    setQueries(prev => prev.map(q => q.id === id ? { ...q, status: newStatus } : q));
  };

  const deleteQuery = (id) => {
    setQueries(prev => prev.filter(q => q.id !== id));
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

  // Fetch products from Supabase on mount with auto-retry if cold start / statement timeout
  useEffect(() => {
    let isMounted = true;
    let retryTimer = null;

    const loadSupabaseProducts = async (attempt = 1) => {
      setIsSupabaseLoading(true);
      const { data, error, rawCount } = await supabaseApi.getProducts();

      if (!isMounted) return;

      if (error) {
        setSupabaseError(error);
        console.warn(`Supabase products fetch (attempt ${attempt}) warning:`, error);
        setProducts(prev => (Array.isArray(prev) ? prev : []));
        
        // If Supabase is cold starting or unfreezing, retry up to 3 times
        if (attempt < 3) {
          retryTimer = setTimeout(() => {
            if (isMounted) loadSupabaseProducts(attempt + 1);
          }, attempt * 3500);
        }
      } else if (Array.isArray(data) && data.length > 0) {
        const unique = processProductsFromDb(data);
        setProducts(unique);
        setSupabaseError(null);
        console.info(`✓ Loaded ${unique.length} live products directly from Supabase (Raw rows: ${rawCount})`);
      } else {
        setProducts(prev => (Array.isArray(prev) ? prev : []));
      }
      setIsSupabaseLoading(false);
    };

    loadSupabaseProducts();

    return () => {
      isMounted = false;
      if (retryTimer) clearTimeout(retryTimer);
    };
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

  // CATEGORY CRUD
  const addCategory = (newCat) => {
    const id = newCat.id || newCat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const category = {
      ...newCat,
      id,
      shortName: newCat.shortName || newCat.name,
      accentColor: newCat.accentColor || '#10B981',
      image: newCat.image || 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?auto=format&fit=crop&w=800&q=80',
      description: newCat.description || '',
      fullDescription: newCat.fullDescription || newCat.description || '',
      productCount: 0
    };
    setCategories(prev => [...prev, category]);
    return category;
  };

  const updateCategory = (id, updatedFields) => {
    setCategories(prev => prev.map(cat => cat.id === id ? { ...cat, ...updatedFields } : cat));
  };

  const deleteCategory = (id) => {
    setCategories(prev => prev.filter(cat => cat.id !== id));
    // Optional: unlink or remove products in this category or leave them
  };

  // CROP CRUD
  const addCrop = (newCrop) => {
    const id = newCrop.id || newCrop.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const crop = {
      ...newCrop,
      id,
      cropKey: newCrop.cropKey || newCrop.name,
      image: newCrop.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=300&q=80',
      description: newCrop.description || `High-potency crop protection solutions for ${newCrop.name}.`
    };
    setCrops(prev => [...prev, crop]);
    return crop;
  };

  const updateCrop = (id, updatedFields) => {
    setCrops(prev => prev.map(c => c.id === id ? { ...c, ...updatedFields } : c));
  };

  const deleteCrop = (id) => {
    setCrops(prev => prev.filter(c => c.id !== id));
  };

  // PRODUCT CRUD
  const addProduct = async (newProd) => {
    const id = newProd.id || 'prod-' + Date.now();
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
      imgSrc: newProd.imgSrc ? newProd.imgSrc.trim() : ''
    };

    if (product.imgSrc && (product.imgSrc.startsWith('data:') || product.imgSrc.startsWith('blob:'))) {
      persistCustomImage(id, product.name, product.imgSrc);
    }

    // 1. Optimistic UI update
    setProducts(prev => [product, ...prev]);

    // 2. Persist to Supabase
    try {
      const { data, error } = await supabaseApi.addProduct(product);
      if (error) {
        setSupabaseError(error);
        console.warn('Supabase addProduct failed:', error);
        return { success: false, error, data: product };
      } else if (data) {
        setProducts(prev => prev.map(p => (p.id === id ? data : p)));
        return { success: true, data };
      }
      return { success: true, data: product };
    } catch (err) {
      console.error('Failed to sync added product to Supabase:', err);
      return { success: false, error: err.message, data: product };
    }
  };

  const updateProduct = async (id, updatedFields) => {
    let targetUpdated = null;
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const updated = { ...p, ...updatedFields };
        if (updatedFields.category && (!updatedFields.categoryLabel || updatedFields.categoryLabel === p.categoryLabel)) {
          const cat = categories.find(c => c.id === updatedFields.category);
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

    if (updatedFields.imgSrc) {
      persistCustomImage(id, updatedFields.name || targetUpdated?.name, updatedFields.imgSrc);
    }

    // Persist to Supabase
    try {
      const { data, error } = await supabaseApi.updateProduct(id, targetUpdated || updatedFields);
      if (error) {
        setSupabaseError(error);
        console.warn('Supabase updateProduct failed:', error);
        return { success: false, error };
      } else if (data) {
        setProducts(prev => prev.map(p => (p.id === id ? data : p)));
        return { success: true, data };
      }
      return { success: true, data: targetUpdated || updatedFields };
    } catch (err) {
      console.error('Failed to sync updated product to Supabase:', err);
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

    // 2. Persist to Supabase
    try {
      const { error } = await supabaseApi.deleteProduct(id);
      if (error) {
        setSupabaseError(error);
        console.warn('Supabase deleteProduct failed:', error);
        return { success: false, error };
      }
      return { success: true };
    } catch (err) {
      console.error('Failed to delete product in Supabase:', err);
      return { success: false, error: err.message };
    }
  };

  // Re-fetch products from Supabase
  const refreshProducts = async () => {
    setIsSupabaseLoading(true);
    const { data, error, rawCount } = await supabaseApi.getProducts();
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

  // Helper to bulk seed initial products to Supabase if empty
  const seedInitialProductsToSupabase = async () => {
    return 0;
  };

  // Helper to remove duplicate products from Supabase database
  const cleanDuplicateProductsInSupabase = async () => {
    setIsSupabaseLoading(true);
    try {
      const { data, error } = await supabaseApi.getProducts();
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

      console.info(`Cleaning ${duplicatesToDelete.length} duplicates from Supabase...`);

      let deletedCount = 0;
      for (const id of duplicatesToDelete) {
        const res = await supabaseApi.deleteProduct(id);
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

  // Reset to initial demo catalog
  const resetToDefaultData = () => {
    setCategories(INITIAL_CATEGORIES);
    setCrops(INITIAL_CROPS);
    setProducts([]);
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.CROPS);
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
    products,
    isSupabaseLoading,
    supabaseError,
    refreshProducts,
    seedInitialProductsToSupabase,
    cleanDuplicateProductsInSupabase,
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
