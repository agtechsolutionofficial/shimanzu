import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers, Sprout, Package, Plus, Trash2, Edit3, RotateCcw,
  ExternalLink, Search, Check, X, Shield, Upload, LogOut, CheckCircle2, AlertCircle, Sparkles,
  Database, RefreshCw, KeyRound
} from 'lucide-react';
import { useDataContext } from '../context/DataContext';
import { compressImage, FALLBACK_PRODUCT_IMAGE } from '../utils/imageCompressor';
import './Admin.css';

import prod1 from '../assets/images/1713003050.webp';
import prod2 from '../assets/images/1713003056.webp';
import prod3 from '../assets/images/1713003063.webp';
import prod4 from '../assets/images/1713003050.webp';
import prod5 from '../assets/images/1713003056.webp';
import prod6 from '../assets/images/1713003063.webp';

const PRESET_PRODUCT_IMAGES = [
  { label: 'Bottle 1 (Herbicide)', src: prod1 },
  { label: 'Bottle 2 (Insecticide)', src: prod2 },
  { label: 'Bottle 3 (Granules)', src: prod3 },
  { label: 'Bottle 4 (Fungicide)', src: prod4 },
  { label: 'Bottle 5 (PGR/Bio)', src: prod5 },
  { label: 'Bottle 6 (Systemic)', src: prod6 },
];

const Admin = () => {
  const {
    categories, crops, products,
    addCategory, updateCategory, deleteCategory,
    addCrop, updateCrop, deleteCrop,
    addProduct, updateProduct, deleteProduct,
    resetToDefaultData, logout,
    isSupabaseLoading, supabaseError, refreshProducts, seedInitialProductsToSupabase,
    cleanDuplicateProductsInSupabase,
    changeAdminPassword
  } = useDataContext();

  const [activeTab, setActiveTab] = useState('categories'); // 'categories' | 'crops' | 'products'
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  const [isCompressingImage, setIsCompressingImage] = useState(false);

  // Modals state
  const [modalMode, setModalMode] = useState(null); // 'add-category' | 'edit-category' | 'add-crop' | 'edit-crop' | 'add-product' | 'edit-product' | 'change-password'
  const [editingItem, setEditingItem] = useState(null);

  // Change password state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    error: ''
  });

  // Form states
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    shortName: '',
    accentColor: '#10B981',
    image: '',
    description: '',
    fullDescription: ''
  });

  const [cropForm, setCropForm] = useState({
    name: '',
    cropKey: '',
    image: '',
    description: ''
  });

  const [productForm, setProductForm] = useState({
    name: '',
    brand: '',
    chemical: '',
    category: '',
    formulation: 'SC',
    group: 'GROUP 1',
    inStock: true,
    packSizes: '250ml, 500ml, 1L',
    crops: 'Cotton, Grapes',
    targets: '',
    dosage: '',
    description: '',
    imgSrc: ''
  });

  // Handle image upload with auto-compression to avoid localStorage quota limits
  const handleImageUpload = async (file, setField) => {
    if (!file) return;
    try {
      setIsCompressingImage(true);
      const compressedDataUrl = await compressImage(file, 800, 800, 0.8);
      setField(compressedDataUrl);
    } catch (err) {
      console.error('Image compression fallback', err);
      const reader = new FileReader();
      reader.onloadend = () => {
        setField(reader.result);
      };
      reader.readAsDataURL(file);
    } finally {
      setIsCompressingImage(false);
    }
  };

  // Open Category Modal
  const openAddCategory = () => {
    setCategoryForm({
      name: '',
      shortName: '',
      accentColor: '#0D9488',
      image: '',
      description: '',
      fullDescription: ''
    });
    setEditingItem(null);
    setModalMode('add-category');
  };

  const openEditCategory = (cat) => {
    setCategoryForm({
      name: cat.name,
      shortName: cat.shortName || cat.name,
      accentColor: cat.accentColor || '#0D9488',
      image: cat.image,
      description: cat.description || '',
      fullDescription: cat.fullDescription || cat.description || ''
    });
    setEditingItem(cat);
    setModalMode('edit-category');
  };

  // Open Crop Modal
  const openAddCrop = () => {
    setCropForm({
      name: '',
      cropKey: '',
      image: '',
      description: ''
    });
    setEditingItem(null);
    setModalMode('add-crop');
  };

  const openEditCrop = (crop) => {
    setCropForm({
      name: crop.name,
      cropKey: crop.cropKey || crop.name,
      image: crop.image,
      description: crop.description || ''
    });
    setEditingItem(crop);
    setModalMode('edit-crop');
  };

  // Open Product Modal
  const openAddProduct = () => {
    setProductForm({
      name: '',
      brand: '',
      chemical: '',
      category: categories[0]?.id || 'fungicides',
      formulation: 'SC',
      group: 'GROUP 1',
      inStock: true,
      packSizes: '250ml, 500ml, 1L',
      crops: 'Cotton, Grapes',
      targets: '',
      dosage: '',
      description: '',
      imgSrc: ''
    });
    setEditingItem(null);
    setModalMode('add-product');
  };

  const openEditProduct = (prod) => {
    setProductForm({
      name: prod.name,
      brand: prod.brand || '',
      chemical: prod.chemical,
      category: prod.category,
      formulation: prod.formulation || 'SC',
      group: prod.group || 'GROUP 1',
      inStock: prod.inStock !== false,
      packSizes: Array.isArray(prod.packSizes) ? prod.packSizes.join(', ') : prod.packSizes,
      crops: Array.isArray(prod.crops) ? prod.crops.join(', ') : prod.crops,
      targets: prod.targets || '',
      dosage: prod.dosage || '',
      description: prod.description || '',
      imgSrc: prod.imgSrc || ''
    });
    setEditingItem(prod);
    setModalMode('edit-product');
  };

  // Handle Form Submit
  const handleCategorySubmit = (e) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) return alert('Category Name is required');

    if (modalMode === 'add-category') {
      addCategory(categoryForm);
      setToastMessage({ type: 'success', text: `Category "${categoryForm.name}" added successfully!` });
    } else {
      updateCategory(editingItem.id, categoryForm);
      setToastMessage({ type: 'success', text: `Category "${categoryForm.name}" updated successfully!` });
    }
    setModalMode(null);
  };

  const handleCropSubmit = (e) => {
    e.preventDefault();
    if (!cropForm.name.trim()) return alert('Crop Name is required');

    if (modalMode === 'add-crop') {
      addCrop(cropForm);
      setToastMessage({ type: 'success', text: `Crop "${cropForm.name}" added successfully!` });
    } else {
      updateCrop(editingItem.id, cropForm);
      setToastMessage({ type: 'success', text: `Crop "${cropForm.name}" updated successfully!` });
    }
    setModalMode(null);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    if (!productForm.name.trim()) return alert('Product Name is required');

    const sanitizedProduct = {
      ...productForm,
      name: productForm.name.trim(),
      chemical: productForm.chemical.trim() || 'Japanese Formulation Standard',
      imgSrc: productForm.imgSrc || FALLBACK_PRODUCT_IMAGE
    };

    if (modalMode === 'add-product') {
      await addProduct(sanitizedProduct);
      setToastMessage({
        type: 'success',
        text: `Product "${sanitizedProduct.name}" saved to Supabase database!`,
        actionUrl: `/products?category=${sanitizedProduct.category}`
      });
    } else {
      await updateProduct(editingItem.id, sanitizedProduct);
      setToastMessage({
        type: 'success',
        text: `Product "${sanitizedProduct.name}" updated in Supabase database!`,
        actionUrl: `/products?category=${sanitizedProduct.category}`
      });
    }
    setModalMode(null);
  };

  const handleSyncSupabase = async () => {
    try {
      await refreshProducts();
      setToastMessage({ type: 'success', text: 'Products synced successfully from Supabase database!' });
    } catch (e) {
      setToastMessage({ type: 'warning', text: 'Supabase sync warning: ' + e.message });
    }
  };

  const handleSeedSupabase = async () => {
    if (window.confirm('Upload all current catalog products to your Supabase products table?')) {
      const count = await seedInitialProductsToSupabase();
      setToastMessage({ type: 'success', text: `Uploaded ${count} products to Supabase database successfully!` });
    }
  };

  const handleCleanDuplicates = async () => {
    if (window.confirm('Clean up duplicate rows in Supabase database and keep only the 31 unique products?')) {
      const res = await cleanDuplicateProductsInSupabase();
      if (res.success) {
        setToastMessage({
          type: 'success',
          text: `Cleaned ${res.deletedCount} duplicate rows! Exactly ${res.remainingCount} unique products remain in Supabase.`
        });
      } else {
        setToastMessage({ type: 'warning', text: 'Clean failed: ' + res.message });
      }
    }
  };

  // Filtered queries
  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredCrops = crops.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.chemical && p.chemical.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="admin-page">
      <div className="container">
        {/* Top Header */}
        <div className="admin-header">
          <div className="admin-title-wrap">
            <h1><Shield size={28} color="#38bdf8" /> Shimanzu Catalog Admin</h1>
            <p>Manage Categories, Crops, and Agrochemical Products dynamically in real-time.</p>
          </div>

          <div className="admin-header-actions">
            <Link to="/products" className="admin-btn admin-btn-outline" target="_blank">
              <ExternalLink size={16} /> View Products
            </Link>
            <Link to="/crops" className="admin-btn admin-btn-outline" target="_blank">
              <ExternalLink size={16} /> View Crops
            </Link>
            <button
              className="admin-btn admin-btn-outline"
              onClick={() => {
                setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '', error: '' });
                setModalMode('change-password');
              }}
              title="Change your admin password"
            >
              <KeyRound size={16} /> Change Password
            </button>
            <button
              className="admin-btn admin-btn-danger"
              onClick={() => {
                if (window.confirm('Reset all catalog data back to default demo data? All custom additions will be reverted.')) {
                  resetToDefaultData();
                  setToastMessage({ type: 'info', text: 'Catalog data reset to default demo data.' });
                }
              }}
            >
              <RotateCcw size={16} /> Reset to Demo
            </button>
            <button
              className="admin-btn admin-btn-logout"
              onClick={() => {
                if (window.confirm('Are you sure you want to log out of the admin panel?')) {
                  logout();
                }
              }}
              title="Logout from admin session"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        {/* Dynamic Toast / Feedback Banner */}
        {toastMessage && (
          <div className={`admin-toast-banner ${toastMessage.type || 'success'}`}>
            <div className="admin-toast-content">
              <CheckCircle2 size={18} color="#10b981" />
              <span>{toastMessage.text}</span>
              {toastMessage.actionUrl && (
                <Link to={toastMessage.actionUrl} className="admin-toast-link" target="_blank">
                  View on Website &rarr;
                </Link>
              )}
            </div>
            <button className="admin-toast-close" onClick={() => setToastMessage(null)}>
              <X size={16} />
            </button>
          </div>
        )}

        {/* Stats Metrics */}
        <div className="admin-metrics-grid">
          <div className="admin-stat-card">
            <div className="admin-stat-info">
              <h3>{categories.length}</h3>
              <span>Active Categories</span>
            </div>
            <div className="admin-stat-icon" style={{ background: 'rgba(13, 148, 136, 0.15)', color: '#0d9488' }}>
              <Layers size={24} />
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-info">
              <h3>{crops.length}</h3>
              <span>Registered Crops</span>
            </div>
            <div className="admin-stat-icon" style={{ background: 'rgba(21, 128, 61, 0.15)', color: '#15803d' }}>
              <Sprout size={24} />
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-info">
              <h3>{products.length}</h3>
              <span>Total Formulations</span>
            </div>
            <div className="admin-stat-icon" style={{ background: 'rgba(211, 47, 47, 0.15)', color: '#d32f2f' }}>
              <Package size={24} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          <button
            className={`admin-tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => { setActiveTab('categories'); setSearchQuery(''); }}
          >
            <Layers size={18} /> Product Categories ({categories.length})
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'crops' ? 'active' : ''}`}
            onClick={() => { setActiveTab('crops'); setSearchQuery(''); }}
          >
            <Sprout size={18} /> Crops ({crops.length})
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => { setActiveTab('products'); setSearchQuery(''); }}
          >
            <Package size={18} /> Products & Formulations ({products.length})
          </button>
        </div>

        {/* TAB 1: CATEGORIES */}
        {activeTab === 'categories' && (
          <div>
            <div className="admin-section-bar">
              <input
                type="text"
                placeholder="Search categories..."
                className="admin-search-input"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <button className="admin-btn admin-btn-primary" onClick={openAddCategory}>
                <Plus size={16} /> Add Category
              </button>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Category Name</th>
                    <th>Color</th>
                    <th>Description</th>
                    <th>Products</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.map(cat => (
                    <tr key={cat.id}>
                      <td>
                        <img src={cat.image} alt={cat.name} className="admin-thumb" />
                      </td>
                      <td>
                        <strong>{cat.name}</strong>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>ID: {cat.id}</div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ width: '14px', height: '14px', borderRadius: '50%', background: cat.accentColor, display: 'inline-block' }} />
                          <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>{cat.accentColor}</span>
                        </div>
                      </td>
                      <td style={{ maxWidth: '300px' }}>
                        <div style={{ fontSize: '0.82rem', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {cat.description}
                        </div>
                      </td>
                      <td>
                        <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '3px 8px', borderRadius: '4px', fontWeight: '700', fontSize: '0.78rem' }}>
                          {cat.productCount} Items
                        </span>
                      </td>
                      <td>
                        <div className="admin-row-actions">
                          <button className="admin-icon-btn" onClick={() => openEditCategory(cat)} title="Edit Category">
                            <Edit3 size={15} />
                          </button>
                          <button
                            className="admin-icon-btn delete"
                            onClick={() => {
                              if (window.confirm(`Delete category "${cat.name}"?`)) {
                                deleteCategory(cat.id);
                              }
                            }}
                            title="Delete Category"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: CROPS */}
        {activeTab === 'crops' && (
          <div>
            <div className="admin-section-bar">
              <input
                type="text"
                placeholder="Search crops..."
                className="admin-search-input"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <button className="admin-btn admin-btn-primary" onClick={openAddCrop}>
                <Plus size={16} /> Add Crop
              </button>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Photo</th>
                    <th>Crop Name</th>
                    <th>Crop Key</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCrops.map(crop => (
                    <tr key={crop.id}>
                      <td>
                        <img src={crop.image} alt={crop.name} className="admin-thumb circle" />
                      </td>
                      <td>
                        <strong style={{ color: '#ef4444' }}>{crop.name}</strong>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: '4px' }}>
                          {crop.cropKey}
                        </span>
                      </td>
                      <td style={{ maxWidth: '350px' }}>
                        <div style={{ fontSize: '0.82rem', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {crop.description}
                        </div>
                      </td>
                      <td>
                        <div className="admin-row-actions">
                          <button className="admin-icon-btn" onClick={() => openEditCrop(crop)} title="Edit Crop">
                            <Edit3 size={15} />
                          </button>
                          <button
                            className="admin-icon-btn delete"
                            onClick={() => {
                              if (window.confirm(`Delete crop "${crop.name}"?`)) {
                                deleteCrop(crop.id);
                              }
                            }}
                            title="Delete Crop"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: PRODUCTS */}
        {activeTab === 'products' && (
          <div>
            {/* Supabase Live Database Status Bar */}
            <div className="admin-supabase-bar">
              <div className="admin-supabase-status">
                <span className={`admin-status-dot ${isSupabaseLoading ? 'syncing' : (supabaseError ? 'error' : '')}`} />
                <div>
                  <span className="admin-supabase-title">Supabase Database:</span>
                  <span className="admin-supabase-url">fxvbvplnucrcamnfblol.supabase.co</span>
                  {supabaseError && <span className="admin-supabase-err">({supabaseError})</span>}
                </div>
              </div>
              <div className="admin-supabase-actions">
                <button
                  type="button"
                  className="admin-btn admin-btn-supabase"
                  onClick={handleSyncSupabase}
                  disabled={isSupabaseLoading}
                  title="Fetch latest products directly from Supabase"
                >
                  <RefreshCw size={14} className={isSupabaseLoading ? 'admin-spin' : ''} />
                  {isSupabaseLoading ? 'Syncing...' : 'Sync Supabase'}
                </button>
                <button
                  type="button"
                  className="admin-btn admin-btn-danger"
                  style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                  onClick={handleCleanDuplicates}
                  disabled={isSupabaseLoading}
                  title="Remove duplicate rows from Supabase database"
                >
                  <Trash2 size={14} /> Clean Duplicates
                </button>
              </div>
            </div>

            <div className="admin-section-bar">
              <input
                type="text"
                placeholder="Search products by name, chemical, or category..."
                className="admin-search-input"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <button className="admin-btn admin-btn-primary" onClick={openAddProduct}>
                <Plus size={16} /> Add Product
              </button>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Photo</th>
                    <th>Product Title</th>
                    <th>Chemical Formulation</th>
                    <th>Category</th>
                    <th>Target Crops</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(prod => (
                    <tr key={prod.id}>
                      <td>
                        <img
                          src={prod.imgSrc || FALLBACK_PRODUCT_IMAGE}
                          alt={prod.name}
                          className="admin-thumb"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = FALLBACK_PRODUCT_IMAGE;
                          }}
                        />
                      </td>
                      <td>
                        <strong style={{ color: '#ef4444' }}>{prod.name}</strong>
                        {prod.brand && <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{prod.brand}</div>}
                      </td>
                      <td>
                        <div style={{ fontSize: '0.82rem' }}>{prod.chemical}</div>
                        <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: '700' }}>
                          {prod.group || prod.formulation}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.78rem', background: 'rgba(255,255,255,0.08)', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
                          {prod.category}
                        </span>
                      </td>
                      <td style={{ maxWidth: '200px' }}>
                        <div style={{ fontSize: '0.78rem', color: '#cbd5e1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {Array.isArray(prod.crops) ? prod.crops.join(', ') : prod.crops}
                        </div>
                      </td>
                      <td>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          background: prod.inStock ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          color: prod.inStock ? '#10b981' : '#ef4444'
                        }}>
                          {prod.inStock ? 'In Stock' : 'On Order'}
                        </span>
                      </td>
                      <td>
                        <div className="admin-row-actions">
                          <button className="admin-icon-btn" onClick={() => openEditProduct(prod)} title="Edit Product">
                            <Edit3 size={15} />
                          </button>
                          <button
                            className="admin-icon-btn delete"
                            onClick={async () => {
                              if (window.confirm(`Delete product "${prod.name}" from database?`)) {
                                await deleteProduct(prod.id);
                                setToastMessage({
                                  type: 'info',
                                  text: `Product "${prod.name}" deleted from database.`
                                });
                              }
                            }}
                            title="Delete Product"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ================= MODALS ================= */}

      {/* CATEGORY MODAL */}
      {(modalMode === 'add-category' || modalMode === 'edit-category') && (
        <div className="admin-modal-overlay" onClick={() => setModalMode(null)}>
          <div className="admin-modal-box" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">
                {modalMode === 'add-category' ? 'Add New Category' : 'Edit Category'}
              </h3>
              <button className="admin-icon-btn" onClick={() => setModalMode(null)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCategorySubmit}>
              <div className="admin-form-grid">
                <div className="admin-form-group">
                  <label className="admin-form-label">Category Name (e.g. FUNGICIDES)</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    value={categoryForm.name}
                    onChange={e => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Short Name (Display)</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    value={categoryForm.shortName}
                    onChange={e => setCategoryForm({ ...categoryForm, shortName: e.target.value })}
                    placeholder="e.g. Fungicides"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Accent Stripe Color</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                      type="color"
                      style={{ width: '40px', height: '40px', border: 'none', background: 'none', cursor: 'pointer' }}
                      value={categoryForm.accentColor}
                      onChange={e => setCategoryForm({ ...categoryForm, accentColor: e.target.value })}
                    />
                    <input
                      type="text"
                      className="admin-form-input"
                      value={categoryForm.accentColor}
                      onChange={e => setCategoryForm({ ...categoryForm, accentColor: e.target.value })}
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Upload Image or URL</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="admin-form-input"
                    onChange={e => handleImageUpload(e.target.files[0], (val) => setCategoryForm({ ...categoryForm, image: val }))}
                  />
                  <input
                    type="text"
                    className="admin-form-input"
                    style={{ marginTop: '6px' }}
                    placeholder="Or enter image URL"
                    value={categoryForm.image}
                    onChange={e => setCategoryForm({ ...categoryForm, image: e.target.value })}
                  />
                  {categoryForm.image && (
                    <img src={categoryForm.image} alt="Preview" className="admin-image-preview" />
                  )}
                </div>

                <div className="admin-form-group full">
                  <label className="admin-form-label">Short Description (Cards Grid)</label>
                  <textarea
                    className="admin-form-textarea"
                    value={categoryForm.description}
                    onChange={e => setCategoryForm({ ...categoryForm, description: e.target.value })}
                    rows={2}
                    required
                  />
                </div>

                <div className="admin-form-group full">
                  <label className="admin-form-label">Full Description (Selected View)</label>
                  <textarea
                    className="admin-form-textarea"
                    value={categoryForm.fullDescription}
                    onChange={e => setCategoryForm({ ...categoryForm, fullDescription: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>

              <div className="admin-modal-footer">
                <button type="button" className="admin-btn admin-btn-outline" onClick={() => setModalMode(null)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  {modalMode === 'add-category' ? 'Save Category' : 'Update Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CROP MODAL */}
      {(modalMode === 'add-crop' || modalMode === 'edit-crop') && (
        <div className="admin-modal-overlay" onClick={() => setModalMode(null)}>
          <div className="admin-modal-box" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">
                {modalMode === 'add-crop' ? 'Add New Crop' : 'Edit Crop'}
              </h3>
              <button className="admin-icon-btn" onClick={() => setModalMode(null)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCropSubmit}>
              <div className="admin-form-grid">
                <div className="admin-form-group">
                  <label className="admin-form-label">Crop Name (e.g. Sugarcane)</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    value={cropForm.name}
                    onChange={e => setCropForm({
                      ...cropForm,
                      name: e.target.value,
                      cropKey: cropForm.cropKey || e.target.value
                    })}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Crop Matching Keyword</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    value={cropForm.cropKey}
                    onChange={e => setCropForm({ ...cropForm, cropKey: e.target.value })}
                    placeholder="Keyword used to match products"
                  />
                </div>

                <div className="admin-form-group full">
                  <label className="admin-form-label">Circular Photo (Upload or URL)</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="admin-form-input"
                    onChange={e => handleImageUpload(e.target.files[0], (val) => setCropForm({ ...cropForm, image: val }))}
                  />
                  <input
                    type="text"
                    className="admin-form-input"
                    style={{ marginTop: '6px' }}
                    placeholder="Or enter image URL"
                    value={cropForm.image}
                    onChange={e => setCropForm({ ...cropForm, image: e.target.value })}
                  />
                  {cropForm.image && (
                    <img src={cropForm.image} alt="Preview" className="admin-image-preview" style={{ borderRadius: '50%', width: '60px', height: '60px' }} />
                  )}
                </div>

                <div className="admin-form-group full">
                  <label className="admin-form-label">Crop Description (Relevant Products View)</label>
                  <textarea
                    className="admin-form-textarea"
                    value={cropForm.description}
                    onChange={e => setCropForm({ ...cropForm, description: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>

              <div className="admin-modal-footer">
                <button type="button" className="admin-btn admin-btn-outline" onClick={() => setModalMode(null)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  {modalMode === 'add-crop' ? 'Save Crop' : 'Update Crop'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRODUCT MODAL */}
      {(modalMode === 'add-product' || modalMode === 'edit-product') && (
        <div className="admin-modal-overlay" onClick={() => setModalMode(null)}>
          <div className="admin-modal-box" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">
                {modalMode === 'add-product' ? 'Add New Product' : 'Edit Product'}
              </h3>
              <button className="admin-icon-btn" onClick={() => setModalMode(null)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleProductSubmit}>
              <div className="admin-form-grid">
                <div className="admin-form-group">
                  <label className="admin-form-label">Product Name</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    placeholder="e.g. AIM® EC HERBICIDE"
                    value={productForm.name}
                    onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Brand Overlay (Short)</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    placeholder="e.g. AIM"
                    value={productForm.brand}
                    onChange={e => setProductForm({ ...productForm, brand: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Chemical Composition</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    placeholder="e.g. Carfentrazone-ethyl 21.3% EC"
                    value={productForm.chemical}
                    onChange={e => setProductForm({ ...productForm, chemical: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Category</label>
                  <select
                    className="admin-form-select"
                    value={productForm.category}
                    onChange={e => setProductForm({ ...productForm, category: e.target.value })}
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Formulation</label>
                  <select
                    className="admin-form-select"
                    value={productForm.formulation}
                    onChange={e => setProductForm({ ...productForm, formulation: e.target.value })}
                  >
                    <option value="EC">EC (Emulsifiable Concentrate)</option>
                    <option value="SC">SC (Suspension Concentrate)</option>
                    <option value="WP">WP (Wettable Powder)</option>
                    <option value="SL">SL (Soluble Liquid)</option>
                    <option value="WG">WG (Water Dispersible Granule)</option>
                    <option value="CG">CG (Granules)</option>
                    <option value="FS">FS (Flowable Seed Concentrate)</option>
                    <option value="EW">EW (Emulsion in Water)</option>
                    <option value="SG">SG (Soluble Granule)</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Group / Mode of Action</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    placeholder="e.g. GROUP 14"
                    value={productForm.group}
                    onChange={e => setProductForm({ ...productForm, group: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Pack Sizes (comma separated)</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    placeholder="e.g. 250ml, 500ml, 1L"
                    value={productForm.packSizes}
                    onChange={e => setProductForm({ ...productForm, packSizes: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Target Crops (comma separated)</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    placeholder="e.g. Cotton, Grapes, Rice, Potatoes"
                    value={productForm.crops}
                    onChange={e => setProductForm({ ...productForm, crops: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Recommended Dosage</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    placeholder="e.g. 200 ml / acre in 200 L water"
                    value={productForm.dosage}
                    onChange={e => setProductForm({ ...productForm, dosage: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Target Pests / Diseases</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    placeholder="e.g. Stem borer, Blast, Downy mildew"
                    value={productForm.targets}
                    onChange={e => setProductForm({ ...productForm, targets: e.target.value })}
                  />
                </div>

                <div className="admin-form-group full">
                  <label className="admin-form-label">Product Image (Upload or Enter URL)</label>

                  <div style={{ marginTop: '12px' }}>
                    <label className="admin-form-sublabel">Upload Photo (Auto-compressed for web):</label>
                    <input
                      type="file"
                      accept="image/*"
                      className="admin-form-input"
                      onChange={e => handleImageUpload(e.target.files[0], (val) => setProductForm({ ...productForm, imgSrc: val }))}
                    />
                    {isCompressingImage && (
                      <div className="admin-compressing-tag">
                        ⏳ Optimizing & compressing image for instant storage...
                      </div>
                    )}
                  </div>

                  <input
                    type="text"
                    className="admin-form-input"
                    style={{ marginTop: '8px' }}
                    placeholder="Or paste external image URL"
                    value={productForm.imgSrc}
                    onChange={e => setProductForm({ ...productForm, imgSrc: e.target.value })}
                  />

                  {productForm.imgSrc && (
                    <div className="admin-preview-box">
                      <span className="admin-preview-label">Selected Image Preview:</span>
                      <img
                        src={productForm.imgSrc || FALLBACK_PRODUCT_IMAGE}
                        alt="Preview"
                        className="admin-image-preview"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = FALLBACK_PRODUCT_IMAGE;
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="admin-form-group full">
                  <label className="admin-form-label">Product Overview & Efficacy</label>
                  <textarea
                    className="admin-form-textarea"
                    value={productForm.description}
                    onChange={e => setProductForm({ ...productForm, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="admin-form-group full">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#e2e8f0', fontSize: '0.88rem' }}>
                    <input
                      type="checkbox"
                      checked={productForm.inStock}
                      onChange={e => setProductForm({ ...productForm, inStock: e.target.checked })}
                      style={{ width: '18px', height: '18px', accentColor: '#10b981' }}
                    />
                    <span>Product is Available / In Stock</span>
                  </label>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button type="button" className="admin-btn admin-btn-outline" onClick={() => setModalMode(null)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  {modalMode === 'add-product' ? 'Save Product' : 'Update Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {modalMode === 'change-password' && (
        <div className="admin-modal-overlay" onClick={() => setModalMode(null)}>
          <div className="admin-modal-box" style={{ maxWidth: '440px' }} onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2 className="admin-modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <KeyRound size={20} color="#38bdf8" /> Change Admin Password
              </h2>
              <button className="admin-icon-btn" onClick={() => setModalMode(null)}>
                <X size={18} />
              </button>
            </div>

            {passwordForm.error && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#fca5a5',
                padding: '10px 14px',
                borderRadius: '6px',
                marginBottom: '16px',
                fontSize: '0.85rem'
              }}>
                {passwordForm.error}
              </div>
            )}

            <form onSubmit={(e) => {
              e.preventDefault();
              setPasswordForm(prev => ({ ...prev, error: '' }));

              if (!passwordForm.currentPassword) {
                setPasswordForm(prev => ({ ...prev, error: 'Please enter current password' }));
                return;
              }
              if (!passwordForm.newPassword || passwordForm.newPassword.length < 4) {
                setPasswordForm(prev => ({ ...prev, error: 'New password must be at least 4 characters' }));
                return;
              }
              if (passwordForm.newPassword !== passwordForm.confirmPassword) {
                setPasswordForm(prev => ({ ...prev, error: 'New password and confirm password do not match' }));
                return;
              }

              const res = changeAdminPassword(passwordForm.currentPassword, passwordForm.newPassword);
              if (res.success) {
                setToastMessage({ type: 'success', text: 'Admin password changed successfully! Your new password is now active.' });
                setModalMode(null);
                setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '', error: '' });
              } else {
                setPasswordForm(prev => ({ ...prev, error: res.message || 'Failed to update password' }));
              }
            }}>
              <div className="admin-form-group">
                <label className="admin-form-label">Current Password</label>
                <input
                  type="password"
                  className="admin-form-input"
                  placeholder="Enter current password (default: admin@123)"
                  value={passwordForm.currentPassword}
                  onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value, error: '' })}
                  required
                  autoFocus
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">New Password</label>
                <input
                  type="password"
                  className="admin-form-input"
                  placeholder="Enter new password (min 4 chars)"
                  value={passwordForm.newPassword}
                  onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value, error: '' })}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Confirm New Password</label>
                <input
                  type="password"
                  className="admin-form-input"
                  placeholder="Re-type new password"
                  value={passwordForm.confirmPassword}
                  onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value, error: '' })}
                  required
                />
              </div>

              <div className="admin-modal-footer">
                <button type="button" className="admin-btn admin-btn-outline" onClick={() => setModalMode(null)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  Save New Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
