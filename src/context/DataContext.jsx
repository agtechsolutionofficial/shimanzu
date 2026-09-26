import React, { createContext, useContext, useState, useEffect } from 'react';
import { CATEGORIES as INITIAL_CATEGORIES } from '../data/categoriesData';
import { CROPS as INITIAL_CROPS } from '../data/cropsData';
import { PRODUCTS as INITIAL_PRODUCTS } from '../data/productsData';
import { FALLBACK_PRODUCT_IMAGE } from '../utils/imageCompressor';
import { supabaseApi } from '../utils/supabaseClient';

const DataContext = createContext(null);

const STORAGE_KEYS = {
  CATEGORIES: 'shimanzu_categories_v1',
  CROPS: 'shimanzu_crops_v1',
  PRODUCTS: 'shimanzu_products_v1',
  AUTH: 'shimanzu_admin_auth_v1'
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

  // 3. Products state — loaded from Supabase database with INITIAL_PRODUCTS fallback
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [isSupabaseLoading, setIsSupabaseLoading] = useState(false);
  const [supabaseError, setSupabaseError] = useState(null);

  // Fetch products from Supabase on mount
  useEffect(() => {
    let isMounted = true;

    const loadSupabaseProducts = async () => {
      setIsSupabaseLoading(true);
      const { data, error } = await supabaseApi.getProducts();

      if (!isMounted) return;

      if (error) {
        setSupabaseError(error);
        console.warn('Supabase products fetch failed; using initial catalog:', error);
      } else if (Array.isArray(data) && data.length > 0) {
        setProducts(data);
        setSupabaseError(null);
      } else {
        console.info('Supabase products table is empty; displaying initial catalog');
      }
      setIsSupabaseLoading(false);
    };

    loadSupabaseProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  // 4. Admin Auth state with localStorage persistence
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

    // Only allowed credentials
    if (
      (u === 'admin@shimanzu.com') &&
      (p === 'shimanzu@123')
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
      message: 'Invalid username or password.' 
    };
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
      imgSrc: newProd.imgSrc || 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=80'
    };

    // 1. Optimistic UI update
    setProducts(prev => [product, ...prev]);

    // 2. Persist to Supabase
    try {
      const { data, error } = await supabaseApi.addProduct(product);
      if (error) {
        setSupabaseError(error);
        console.warn('Supabase addProduct failed:', error);
      } else if (data) {
        setProducts(prev => prev.map(p => (p.id === id ? data : p)));
      }
    } catch (err) {
      console.error('Failed to sync added product to Supabase:', err);
    }

    return product;
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

    // Persist to Supabase
    try {
      const { data, error } = await supabaseApi.updateProduct(id, targetUpdated || updatedFields);
      if (error) {
        setSupabaseError(error);
        console.warn('Supabase updateProduct failed:', error);
      } else if (data) {
        setProducts(prev => prev.map(p => (p.id === id ? data : p)));
      }
    } catch (err) {
      console.error('Failed to sync updated product to Supabase:', err);
    }
  };

  const deleteProduct = async (id) => {
    // 1. Optimistic UI update
    setProducts(prev => prev.filter(p => p.id !== id));

    // 2. Persist to Supabase
    try {
      const { error } = await supabaseApi.deleteProduct(id);
      if (error) {
        setSupabaseError(error);
        console.warn('Supabase deleteProduct failed:', error);
      }
    } catch (err) {
      console.error('Failed to delete product in Supabase:', err);
    }
  };

  // Re-fetch products from Supabase
  const refreshProducts = async () => {
    setIsSupabaseLoading(true);
    const { data, error } = await supabaseApi.getProducts();
    if (error) {
      setSupabaseError(error);
    } else if (Array.isArray(data) && data.length > 0) {
      setProducts(data);
      setSupabaseError(null);
    }
    setIsSupabaseLoading(false);
  };

  // Helper to bulk seed initial products to Supabase if empty
  const seedInitialProductsToSupabase = async () => {
    setIsSupabaseLoading(true);
    let successCount = 0;
    for (const prod of INITIAL_PRODUCTS) {
      const { error } = await supabaseApi.addProduct(prod);
      if (!error) successCount++;
    }
    await refreshProducts();
    setIsSupabaseLoading(false);
    return successCount;
  };

  // Reset to initial demo catalog
  const resetToDefaultData = () => {
    setCategories(INITIAL_CATEGORIES);
    setCrops(INITIAL_CROPS);
    setProducts(INITIAL_PRODUCTS);
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
    addCategory,
    updateCategory,
    deleteCategory,
    addCrop,
    updateCrop,
    deleteCrop,
    addProduct,
    updateProduct,
    deleteProduct,
    resetToDefaultData,
    isAdmin,
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
