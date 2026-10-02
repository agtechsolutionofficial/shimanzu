import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers, Sprout, Package, Plus, Trash2, Edit3,
  ExternalLink, Search, Check, X, Shield, Upload, LogOut, CheckCircle2, AlertCircle, Sparkles,
  KeyRound, Loader2, MessageSquare, Phone, Mail, MapPin, Grid, List, PlusCircle,
  Eye, Menu, ChevronRight, Filter, Tag, CheckSquare, Clock, User, RefreshCw
} from 'lucide-react';
import { useDataContext } from '../context/DataContext';
import { compressImage } from '../utils/imageCompressor';
import ProductCard from '../components/ProductCard';
import logoImg from '../assets/images/1712639794.png';
import './Admin.css';

import prod1 from '../assets/images/1713003050.webp';
import prod2 from '../assets/images/1713003056.webp';
import prod3 from '../assets/images/1713003063.webp';

const PRESET_PRODUCT_IMAGES = [
  { label: 'Bottle 1 (Packaging)', src: prod1 },
  { label: 'Bottle 2 (Pack & Seal)', src: prod2 },
  { label: 'Bottle 3 (Formulation)', src: prod3 },
];

const FORMULATION_OPTIONS = [
  'SC', 'EC', 'SL', 'WG', 'CS', 'FS', 'SE', 'PW', 'Suspension', 'Granules'
];

const Admin = () => {
  const {
    categories, crops, products, queries = [],
    isSupabaseLoading, supabaseError, refreshProducts,
    addCategory, updateCategory, deleteCategory,
    addCrop, updateCrop, deleteCrop,
    addProduct, updateProduct, deleteProduct,
    updateQueryStatus, deleteQuery,
    logout, changeAdminPassword
  } = useDataContext();

  // Navigation tab: 'all-products' | 'add-product' | 'queries' | 'crops' | 'categories'
  const [activeTab, setActiveTab] = useState('all-products');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Products filtering & view
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [productStockFilter, setProductStockFilter] = useState('all'); // 'all' | 'in-stock' | 'out-of-stock'
  const [productViewMode, setProductViewMode] = useState('grid'); // 'grid' | 'table'

  // Queries filtering
  const [queryStatusFilter, setQueryStatusFilter] = useState('all'); // 'all' | 'new' | 'contacted' | 'resolved'
  const [selectedQueryModal, setSelectedQueryModal] = useState(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState(null);
  const toastTimeoutRef = useRef(null);

  const showToast = useCallback((newToast) => {
    if (!newToast) {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      setToastMessage(null);
      return;
    }
    if (toastMessage && toastMessage.text === newToast.text) return;
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);

    setToastMessage(newToast);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  }, [toastMessage]);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  // Modals state
  const [modalMode, setModalMode] = useState(null); // 'edit-product' | 'add-category' | 'edit-category' | 'add-crop' | 'edit-crop' | 'change-password' | 'delete-confirm'
  const [editingItem, setEditingItem] = useState(null);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState(null); // { type: 'product'|'crop'|'category'|'query', item }

  // Change password state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    error: ''
  });

  // Dedicated Product Form state (used for both Add Product tab and Edit Modal)
  const defaultProductState = {
    name: '',
    brand: 'SHIMANZU',
    chemical: '',
    category: categories[0]?.id || 'fungicides',
    categoryLabel: categories[0]?.name || 'FUNGICIDES',
    formulation: 'SC',
    group: 'GROUP 1',
    inStock: true,
    packSizes: '250ml, 500ml, 1L',
    crops: 'Paddy, Cotton, Wheat',
    targets: 'Blast, Sheath Blight, Sucking Pests',
    dosage: '400 ml / acre in 200 L water',
    description: 'High-efficacy Japanese formulation designed for maximum crop protection and yield.',
    imgSrc: ''
  };

  const [productForm, setProductForm] = useState(defaultProductState);
  const [isCompressingImage, setIsCompressingImage] = useState(false);
  const [isProductSaving, setIsProductSaving] = useState(false);

  // Category Form
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    shortName: '',
    accentColor: '#0D9488',
    image: '',
    description: '',
    fullDescription: ''
  });

  // Crop Form
  const [cropForm, setCropForm] = useState({
    name: '',
    cropKey: '',
    image: '',
    description: ''
  });

  // Auto-compress image to compact WebP
  const handleImageUpload = async (file, setField) => {
    if (!file) return;
    try {
      setIsCompressingImage(true);
      const compressedDataUrl = await compressImage(file, 600, 600, 0.75);
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

  // Open Edit Product Modal
  const openEditProductModal = (prod) => {
    setProductForm({
      name: prod.name,
      brand: prod.brand || 'SHIMANZU',
      chemical: prod.chemical || '',
      category: prod.category || 'fungicides',
      categoryLabel: prod.categoryLabel || prod.category,
      formulation: prod.formulation || 'SC',
      group: prod.group || 'GROUP 1',
      inStock: prod.inStock !== false,
      packSizes: Array.isArray(prod.packSizes) ? prod.packSizes.join(', ') : (prod.packSizes || '1L'),
      crops: Array.isArray(prod.crops) ? prod.crops.join(', ') : (prod.crops || 'All Crops'),
      targets: prod.targets || '',
      dosage: prod.dosage || '',
      description: prod.description || '',
      imgSrc: prod.imgSrc || ''
    });
    setEditingItem(prod);
    setModalMode('edit-product');
  };

  // Switch to Add Product tab & reset form
  const navigateToAddProduct = () => {
    setProductForm({
      ...defaultProductState,
      category: categories[0]?.id || 'fungicides',
      categoryLabel: categories[0]?.name || 'FUNGICIDES'
    });
    setActiveTab('add-product');
    setSearchQuery('');
  };

  // Toggle in-stock instantly from card or table
  const handleToggleStock = async (prod, e) => {
    if (e) e.stopPropagation();
    const newStock = !prod.inStock;
    await updateProduct(prod.id, { inStock: newStock });
    showToast({
      type: 'success',
      text: `"${prod.name}" is now ${newStock ? 'In Stock' : 'Marked Out of Stock'}.`
    });
  };

  // Handle Product Submission (for either Add Product tab or Edit Modal)
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    if (!productForm.name.trim()) return alert('Product Name is required');
    if (isProductSaving) return;

    setIsProductSaving(true);
    try {
      const selectedCat = categories.find(c => c.id === productForm.category);
      const sanitizedProduct = {
        ...productForm,
        name: productForm.name.trim(),
        chemical: productForm.chemical.trim() || 'Japanese Formulation Standard',
        categoryLabel: selectedCat?.name || productForm.category.toUpperCase(),
        imgSrc: productForm.imgSrc ? productForm.imgSrc.trim() : ''
      };

      if (modalMode === 'edit-product' && editingItem) {
        const res = await updateProduct(editingItem.id, sanitizedProduct);
        if (res && res.success === false) {
          showToast({ type: 'error', text: `Failed to update product: ${res.error || 'Please try again.'}` });
        } else {
          showToast({
            type: 'success',
            text: `Product "${sanitizedProduct.name}" updated successfully!`,
            actionUrl: `/products?category=${sanitizedProduct.category}`
          });
          setModalMode(null);
        }
      } else {
        // Add new product
        const res = await addProduct(sanitizedProduct);
        if (res && res.success === false) {
          showToast({ type: 'error', text: `Failed to create product: ${res.error || 'Please try again.'}` });
        } else {
          showToast({
            type: 'success',
            text: `Product "${sanitizedProduct.name}" published to catalog!`,
            actionUrl: `/products?category=${sanitizedProduct.category}`
          });
          // Reset form and return to all products
          setProductForm(defaultProductState);
          setActiveTab('all-products');
        }
      }
    } catch (err) {
      console.error('Error saving product:', err);
      showToast({ type: 'error', text: `Error: ${err.message || 'Could not save product.'}` });
    } finally {
      setIsProductSaving(false);
    }
  };

  // Category CRUD Handlers
  const openAddCategoryModal = () => {
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

  const openEditCategoryModal = (cat) => {
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

  const handleCategorySubmit = (e) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) return alert('Category Name is required');

    if (modalMode === 'add-category') {
      addCategory(categoryForm);
      showToast({ type: 'success', text: `Category "${categoryForm.name}" created!` });
    } else {
      updateCategory(editingItem.id, categoryForm);
      showToast({ type: 'success', text: `Category "${categoryForm.name}" updated!` });
    }
    setModalMode(null);
  };

  // Crop CRUD Handlers
  const openAddCropModal = () => {
    setCropForm({ name: '', cropKey: '', image: '', description: '' });
    setEditingItem(null);
    setModalMode('add-crop');
  };

  const openEditCropModal = (crop) => {
    setCropForm({
      name: crop.name,
      cropKey: crop.cropKey || crop.name,
      image: crop.image,
      description: crop.description || ''
    });
    setEditingItem(crop);
    setModalMode('edit-crop');
  };

  const handleCropSubmit = (e) => {
    e.preventDefault();
    if (!cropForm.name.trim()) return alert('Crop Name is required');

    if (modalMode === 'add-crop') {
      addCrop(cropForm);
      showToast({ type: 'success', text: `Crop "${cropForm.name}" registered!` });
    } else {
      updateCrop(editingItem.id, cropForm);
      showToast({ type: 'success', text: `Crop "${cropForm.name}" updated!` });
    }
    setModalMode(null);
  };

  // Safe delete handler with confirmation modal
  const confirmDeleteItem = (type, item) => {
    setDeleteConfirmItem({ type, item });
    setModalMode('delete-confirm');
  };

  const executeDelete = async () => {
    if (!deleteConfirmItem) return;
    const { type, item } = deleteConfirmItem;

    if (type === 'product') {
      await deleteProduct(item.id);
      showToast({ type: 'success', text: `Product "${item.name}" deleted.` });
    } else if (type === 'crop') {
      deleteCrop(item.id);
      showToast({ type: 'success', text: `Crop "${item.name}" deleted.` });
    } else if (type === 'category') {
      deleteCategory(item.id);
      showToast({ type: 'success', text: `Category "${item.name}" deleted.` });
    } else if (type === 'query') {
      deleteQuery(item.id);
      showToast({ type: 'success', text: `Customer query from ${item.name} removed.` });
    }

    setModalMode(null);
    setDeleteConfirmItem(null);
  };

  // Filtered queries and counts
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.chemical && p.chemical.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchCategory = productCategoryFilter === 'all' || p.category === productCategoryFilter;

      const matchStock =
        productStockFilter === 'all' ||
        (productStockFilter === 'in-stock' && p.inStock) ||
        (productStockFilter === 'out-of-stock' && !p.inStock);

      return matchSearch && matchCategory && matchStock;
    });
  }, [products, searchQuery, productCategoryFilter, productStockFilter]);

  const filteredQueries = useMemo(() => {
    return queries.filter(q => {
      const matchSearch =
        q.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (q.email && q.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (q.phone && q.phone.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (q.subject && q.subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (q.productInterest && q.productInterest.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchStatus = queryStatusFilter === 'all' || q.status === queryStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [queries, searchQuery, queryStatusFilter]);

  const filteredCrops = useMemo(() => {
    return crops.filter(c =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [crops, searchQuery]);

  const filteredCategories = useMemo(() => {
    return categories.filter(c =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [categories, searchQuery]);

  // Statistics counters
  const inStockCount = useMemo(() => products.filter(p => p.inStock !== false).length, [products]);
  const newQueriesCount = useMemo(() => queries.filter(q => q.status === 'new').length, [queries]);

  // Live preview product object for Add Product workspace
  const livePreviewProduct = useMemo(() => {
    const activeCat = categories.find(c => c.id === productForm.category);
    return {
      id: 'preview',
      name: productForm.name || 'Sample Product Name',
      brand: productForm.brand || 'SHIMANZU',
      chemical: productForm.chemical || 'Active Ingredient 00% Formulation Standard',
      category: productForm.category || 'fungicides',
      categoryLabel: activeCat?.name || 'FUNGICIDES',
      group: productForm.group || `${productForm.formulation} FORMULATION`,
      formulation: productForm.formulation || 'SC',
      inStock: productForm.inStock !== false,
      packSizes: productForm.packSizes ? productForm.packSizes.split(',').map(s => s.trim()) : ['1 L'],
      crops: productForm.crops ? productForm.crops.split(',').map(s => s.trim()) : ['Field Crops'],
      imgSrc: productForm.imgSrc ? productForm.imgSrc.trim() : ''
    };
  }, [productForm, categories]);

  return (
    <div className="admin-dashboard-layout">
      {/* ===================== SIDEBAR ===================== */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Brand Header */}
        <div className="admin-sidebar-header">
          <Link to="/" className="admin-sidebar-brand" title="View Public Website">
            <img src={logoImg} alt="Shimanzu Japan" className="admin-sidebar-logo-img" />
            <div className="admin-console-chip">
              <span className="admin-chip-pulse"></span>
              <span>ADMIN CONSOLE</span>
              <span className="admin-chip-sep">&bull;</span>
              <span className="admin-chip-ver">v2.5</span>
            </div>
          </Link>
          <button
            className="admin-sidebar-close-btn"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Admin Quick Profile */}
        <div className="admin-sidebar-profile">
          <div className="admin-profile-avatar">
            <span>SA</span>
            <span className="admin-online-indicator"></span>
          </div>
          <div className="admin-profile-info">
            <span className="admin-profile-name">Super Administrator</span>
            <span className="admin-profile-role">Agrochemical Director</span>
          </div>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="admin-sidebar-nav">
          <span className="admin-nav-section-title">MANAGEMENT</span>

          {/* 1. All Products */}
          <button
            className={`admin-nav-item ${activeTab === 'all-products' ? 'active' : ''}`}
            onClick={() => { setActiveTab('all-products'); setSearchQuery(''); setSidebarOpen(false); }}
          >
            <div className="admin-nav-item-left">
              <Package size={19} className="admin-nav-icon" />
              <span className="admin-nav-label">All Products</span>
            </div>
            <span className="admin-nav-badge">{products.length}</span>
          </button>

          {/* 2. Add Product */}
          <button
            className={`admin-nav-item ${activeTab === 'add-product' ? 'active' : ''}`}
            onClick={() => { navigateToAddProduct(); setSidebarOpen(false); }}
          >
            <div className="admin-nav-item-left">
              <PlusCircle size={19} className="admin-nav-icon accent-green" />
              <span className="admin-nav-label">Add Product</span>
            </div>
            <span className="admin-nav-badge-new">NEW</span>
          </button>

          {/* 3. Query / Leads */}
          <button
            className={`admin-nav-item ${activeTab === 'queries' ? 'active' : ''}`}
            onClick={() => { setActiveTab('queries'); setSearchQuery(''); setSidebarOpen(false); }}
          >
            <div className="admin-nav-item-left">
              <MessageSquare size={19} className="admin-nav-icon accent-amber" />
              <span className="admin-nav-label">Query</span>
            </div>
            {newQueriesCount > 0 ? (
              <span className="admin-nav-badge-alert">{newQueriesCount} New</span>
            ) : (
              <span className="admin-nav-badge">{queries.length}</span>
            )}
          </button>

          {/* 4. Crops */}
          <button
            className={`admin-nav-item ${activeTab === 'crops' ? 'active' : ''}`}
            onClick={() => { setActiveTab('crops'); setSearchQuery(''); setSidebarOpen(false); }}
          >
            <div className="admin-nav-item-left">
              <Sprout size={19} className="admin-nav-icon accent-emerald" />
              <span className="admin-nav-label">Crops</span>
            </div>
            <span className="admin-nav-badge">{crops.length}</span>
          </button>

          {/* 5. Category */}
          <button
            className={`admin-nav-item ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => { setActiveTab('categories'); setSearchQuery(''); setSidebarOpen(false); }}
          >
            <div className="admin-nav-item-left">
              <Layers size={19} className="admin-nav-icon accent-blue" />
              <span className="admin-nav-label">Category</span>
            </div>
            <span className="admin-nav-badge">{categories.length}</span>
          </button>
        </nav>

        {/* Sidebar Footer Controls */}
        <div className="admin-sidebar-footer">
          <button
            className="admin-sidebar-action-btn"
            onClick={() => {
              setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '', error: '' });
              setModalMode('change-password');
            }}
          >
            <KeyRound size={16} />
            <span>Change Password</span>
          </button>

          <button
            className="admin-sidebar-logout-btn"
            onClick={() => {
              if (window.confirm('Log out from Shimanzu Administrator session?')) {
                logout();
              }
            }}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Backdrop overlay for mobile drawer */}
      {sidebarOpen && (
        <div className="admin-sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ===================== MAIN CONTENT AREA ===================== */}
      <main className="admin-main">
        {/* Top Navbar */}
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              className="admin-mobile-menu-trigger"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu size={22} />
            </button>

            <div className="admin-page-title-box">
              <h1>
                {activeTab === 'all-products' && 'All Products Catalog'}
                {activeTab === 'add-product' && 'Add New Formulation'}
                {activeTab === 'queries' && 'Customer Inquiries & Leads'}
                {activeTab === 'crops' && 'Agricultural Crops Directory'}
                {activeTab === 'categories' && 'Agrochemical Categories'}
              </h1>
              <span className="admin-page-subtitle">
                {activeTab === 'all-products' && `Managing ${products.length} registered agrochemicals & industrial pigments`}
                {activeTab === 'add-product' && 'Create a new product with live real-time packaging preview'}
                {activeTab === 'queries' && `${queries.length} total customer inquiries (${newQueriesCount} require follow-up)`}
                {activeTab === 'crops' && `${crops.length} supported agricultural crops & horticultural species`}
                {activeTab === 'categories' && `${categories.length} active agrochemical market segments`}
              </span>
            </div>
          </div>

          <div className="admin-topbar-right">
            {/* Context Search Input (for current active tab) */}
            {activeTab !== 'add-product' && (
              <div className="admin-topbar-search">
                <Search size={17} className="admin-search-icon" />
                <input
                  type="text"
                  placeholder={
                    activeTab === 'all-products' ? 'Search by name, chemical active, category...' :
                    activeTab === 'queries' ? 'Search queries by name, phone, product...' :
                    activeTab === 'crops' ? 'Search crops by name or keyword...' :
                    'Search categories...'
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button className="admin-search-clear" onClick={() => setSearchQuery('')}>
                    <X size={14} />
                  </button>
                )}
              </div>
            )}

            {/* Quick action button depending on tab */}
            {activeTab === 'all-products' && (
              <button className="admin-action-btn-primary" onClick={navigateToAddProduct}>
                <Plus size={16} />
                <span>Add Product</span>
              </button>
            )}

            {activeTab === 'crops' && (
              <button className="admin-action-btn-primary" onClick={openAddCropModal}>
                <Plus size={16} />
                <span>Add Crop</span>
              </button>
            )}

            {activeTab === 'categories' && (
              <button className="admin-action-btn-primary" onClick={openAddCategoryModal}>
                <Plus size={16} />
                <span>Add Category</span>
              </button>
            )}

            <Link to="/products" className="admin-view-site-btn" target="_blank" title="Preview public website">
              <ExternalLink size={16} />
              <span>Live Site</span>
            </Link>
          </div>
        </header>

        {/* Global Toast Banner */}
        {toastMessage && (
          <div className={`admin-toast-banner ${toastMessage.type || 'success'}`}>
            <div className="admin-toast-content">
              {toastMessage.type === 'error' ? (
                <AlertCircle size={18} color="#ef4444" />
              ) : (
                <CheckCircle2 size={18} color="#10b981" />
              )}
              <span>{toastMessage.text}</span>
              {toastMessage.actionUrl && (
                <Link to={toastMessage.actionUrl} className="admin-toast-link" target="_blank">
                  View Live on Site &rarr;
                </Link>
              )}
            </div>
            <button className="admin-toast-close" onClick={() => setToastMessage(null)}>
              <X size={16} />
            </button>
          </div>
        )}

        {/* Executive KPI Stats Bar */}
        <div className="admin-stats-container">
          {/* Card 1: Total Products */}
          <div
            className={`admin-stat-card ${activeTab === 'all-products' ? 'selected' : ''}`}
            onClick={() => setActiveTab('all-products')}
          >
            <div className="admin-stat-top">
              <span className="admin-stat-label">Total Products</span>
              <div className="admin-stat-icon-wrap bg-blue">
                <Package size={20} />
              </div>
            </div>
            <div className="admin-stat-value">{products.length}</div>
            <div className="admin-stat-footer">
              <span className="admin-stat-subtext">
                <strong>{inStockCount}</strong> in stock &bull; <strong>{products.length - inStockCount}</strong> on request
              </span>
            </div>
          </div>

          {/* Card 2: Queries / Leads */}
          <div
            className={`admin-stat-card ${activeTab === 'queries' ? 'selected' : ''}`}
            onClick={() => setActiveTab('queries')}
          >
            <div className="admin-stat-top">
              <span className="admin-stat-label">Customer Queries</span>
              <div className="admin-stat-icon-wrap bg-amber">
                <MessageSquare size={20} />
              </div>
            </div>
            <div className="admin-stat-value">{queries.length}</div>
            <div className="admin-stat-footer">
              {newQueriesCount > 0 ? (
                <span className="admin-stat-alert">
                  <Sparkles size={13} /> {newQueriesCount} new farmer leads
                </span>
              ) : (
                <span className="admin-stat-subtext">All inquiries attended</span>
              )}
            </div>
          </div>

          {/* Card 3: Crops */}
          <div
            className={`admin-stat-card ${activeTab === 'crops' ? 'selected' : ''}`}
            onClick={() => setActiveTab('crops')}
          >
            <div className="admin-stat-top">
              <span className="admin-stat-label">Supported Crops</span>
              <div className="admin-stat-icon-wrap bg-emerald">
                <Sprout size={20} />
              </div>
            </div>
            <div className="admin-stat-value">{crops.length}</div>
            <div className="admin-stat-footer">
              <span className="admin-stat-subtext">Rice, Cotton, Wheat, Mango & more</span>
            </div>
          </div>

          {/* Card 4: Categories */}
          <div
            className={`admin-stat-card ${activeTab === 'categories' ? 'selected' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            <div className="admin-stat-top">
              <span className="admin-stat-label">Categories</span>
              <div className="admin-stat-icon-wrap bg-purple">
                <Layers size={20} />
              </div>
            </div>
            <div className="admin-stat-value">{categories.length}</div>
            <div className="admin-stat-footer">
              <span className="admin-stat-subtext">Chemicals, Fungicides, Herbicides...</span>
            </div>
          </div>
        </div>

        {/* ===================== TAB 1: ALL PRODUCTS ===================== */}
        {activeTab === 'all-products' && (
          <div className="admin-section-wrap animate-fade-in">
            {/* Filter Bar */}
            <div className="admin-toolbar">
              <div className="admin-category-pills">
                <button
                  className={`admin-filter-pill ${productCategoryFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setProductCategoryFilter('all')}
                >
                  All Categories ({products.length})
                </button>
                {categories.map(cat => {
                  const count = products.filter(p => p.category === cat.id).length;
                  return (
                    <button
                      key={cat.id}
                      className={`admin-filter-pill ${productCategoryFilter === cat.id ? 'active' : ''}`}
                      onClick={() => setProductCategoryFilter(cat.id)}
                    >
                      <span className="admin-pill-dot" style={{ backgroundColor: cat.accentColor || '#10B981' }} />
                      {cat.name} ({count})
                    </button>
                  );
                })}
              </div>

              <div className="admin-toolbar-right">
                {/* Stock status filter */}
                <div className="admin-select-wrapper">
                  <Filter size={14} className="admin-select-icon" />
                  <select
                    value={productStockFilter}
                    onChange={e => setProductStockFilter(e.target.value)}
                    className="admin-compact-select"
                  >
                    <option value="all">All Stock Status</option>
                    <option value="in-stock">In Stock Only</option>
                    <option value="out-of-stock">Out of Stock</option>
                  </select>
                </div>

                {/* Grid / Table View Switcher */}
                <div className="admin-view-toggle">
                  <button
                    className={`admin-view-btn ${productViewMode === 'grid' ? 'active' : ''}`}
                    onClick={() => setProductViewMode('grid')}
                    title="Grid View"
                  >
                    <Grid size={16} />
                  </button>
                  <button
                    className={`admin-view-btn ${productViewMode === 'table' ? 'active' : ''}`}
                    onClick={() => setProductViewMode('table')}
                    title="Table View"
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Results Counter */}
            <div className="admin-results-bar">
              <span>Showing <strong>{filteredProducts.length}</strong> of <strong>{products.length}</strong> products</span>
              {searchQuery && (
                <span className="admin-search-indicator">
                  Filter: "{searchQuery}" <button onClick={() => setSearchQuery('')}>Clear</button>
                </span>
              )}
            </div>

            {/* View Mode: Grid */}
            {productViewMode === 'grid' && (
              <div className="admin-products-grid">
                {isSupabaseLoading && products.length === 0 ? (
                  <div className="admin-empty-state" style={{ gridColumn: '1 / -1', padding: '60px 20px' }}>
                    <Loader2 size={40} className="admin-spin" style={{ color: '#10B981', margin: '0 auto' }} />
                    <h3 style={{ marginTop: '16px', color: '#f8fafc' }}>Loading Database Products...</h3>
                    <p style={{ color: '#94a3b8' }}>Fetching dynamic catalog directly from Supabase cloud database.</p>
                  </div>
                ) : filteredProducts.length > 0 ? (
                  filteredProducts.map(prod => (
                    <div key={prod.id} className="admin-prod-card">
                      {/* Top Media */}
                      <div className={`admin-prod-card-media ${!prod.imgSrc ? 'no-img' : ''}`}>
                        {prod.imgSrc ? (
                          <img
                            src={prod.imgSrc}
                            alt={prod.name}
                            className="admin-prod-card-img"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const ph = e.currentTarget.parentElement?.querySelector('.admin-prod-no-img');
                              if (ph) ph.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div 
                          className="admin-prod-no-img"
                          style={{ display: prod.imgSrc ? 'none' : 'flex' }}
                        >
                          <Package size={28} />
                          <span>No Image</span>
                        </div>
                        <span className="admin-prod-formulation-tag">
                          {prod.formulation || 'SC'}
                        </span>
                      </div>

                      {/* Card Content */}
                      <div className="admin-prod-card-body">
                        <div className="admin-prod-category-line">
                          <span className="admin-prod-category-badge">
                            {prod.categoryLabel || prod.category}
                          </span>
                          {/* Stock Toggle Switch */}
                          <label className="admin-stock-switch" title="Click to toggle in-stock status">
                            <input
                              type="checkbox"
                              checked={prod.inStock !== false}
                              onChange={(e) => handleToggleStock(prod, e)}
                            />
                            <span className="admin-slider round"></span>
                            <span className="admin-stock-text">
                              {prod.inStock !== false ? 'In Stock' : 'Out'}
                            </span>
                          </label>
                        </div>

                        <h3 className="admin-prod-card-title">{prod.name}</h3>
                        <p className="admin-prod-card-chemical">{prod.chemical}</p>

                        {/* Crops & Pack sizes tags */}
                        {prod.crops && prod.crops.length > 0 && (
                          <div className="admin-prod-crops-tags">
                            {prod.crops.slice(0, 3).map((crop, idx) => (
                              <span key={idx} className="admin-prod-tag">{crop}</span>
                            ))}
                            {prod.crops.length > 3 && (
                              <span className="admin-prod-tag-more">+{prod.crops.length - 3}</span>
                            )}
                          </div>
                        )}

                        {/* Card Actions Footer */}
                        <div className="admin-prod-card-footer">
                          <span className="admin-prod-pack-info">
                            {Array.isArray(prod.packSizes) ? prod.packSizes.slice(0, 2).join(', ') : prod.packSizes}
                          </span>
                          <div className="admin-prod-btn-group">
                            <button
                              className="admin-mini-btn edit"
                              onClick={() => openEditProductModal(prod)}
                              title="Edit product"
                            >
                              <Edit3 size={14} /> Edit
                            </button>
                            <button
                              className="admin-mini-btn delete"
                              onClick={() => confirmDeleteItem('product', prod)}
                              title="Delete product"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="admin-empty-state">
                    <Package size={48} className="admin-empty-icon" />
                    <h3>No products found</h3>
                    <p>Try adjusting your search query or category filters.</p>
                    <button
                      className="admin-action-btn-primary"
                      onClick={() => { setSearchQuery(''); setProductCategoryFilter('all'); }}
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* View Mode: Table */}
            {productViewMode === 'table' && (
              <div className="admin-table-card">
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th style={{ width: '60px' }}>Image</th>
                      <th>Product Name</th>
                      <th>Chemical Composition</th>
                      <th>Category</th>
                      <th>Formulation</th>
                      <th>Pack Sizes</th>
                      <th>Stock Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isSupabaseLoading && products.length === 0 ? (
                      <tr>
                        <td colSpan={8} style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
                          <Loader2 size={32} className="admin-spin" style={{ color: '#10B981', margin: '0 auto 12px auto' }} />
                          <div style={{ color: '#f8fafc', fontWeight: 600 }}>Loading Database Products...</div>
                          <div style={{ fontSize: '13px', marginTop: '4px' }}>Connecting to Supabase cloud database...</div>
                        </td>
                      </tr>
                    ) : filteredProducts.length > 0 ? (
                      filteredProducts.map(prod => (
                        <tr key={prod.id}>
                          <td>
                            {prod.imgSrc ? (
                              <img
                                src={prod.imgSrc}
                                alt={prod.name}
                                className="admin-table-img"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  const ph = e.currentTarget.parentElement?.querySelector('.admin-table-no-img');
                                  if (ph) ph.style.display = 'inline-flex';
                                }}
                              />
                            ) : null}
                            <div 
                              className="admin-table-no-img"
                              style={{ display: prod.imgSrc ? 'none' : 'inline-flex' }}
                            >
                              <Package size={16} />
                            </div>
                          </td>
                          <td>
                            <strong className="admin-table-prod-name">{prod.name}</strong>
                            <div className="admin-table-prod-brand">{prod.brand || 'SHIMANZU'}</div>
                          </td>
                          <td className="admin-table-chemical">{prod.chemical}</td>
                          <td>
                            <span className="admin-table-badge cat">
                              {prod.categoryLabel || prod.category}
                            </span>
                          </td>
                          <td>
                            <span className="admin-table-badge form">
                              {prod.formulation || 'SC'}
                            </span>
                          </td>
                          <td className="admin-table-packs">
                            {Array.isArray(prod.packSizes) ? prod.packSizes.join(', ') : prod.packSizes}
                          </td>
                          <td>
                            <label className="admin-stock-switch table-switch">
                              <input
                                type="checkbox"
                                checked={prod.inStock !== false}
                                onChange={(e) => handleToggleStock(prod, e)}
                              />
                              <span className="admin-slider round"></span>
                              <span className="admin-stock-text">
                                {prod.inStock !== false ? 'In Stock' : 'Out'}
                              </span>
                            </label>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div className="admin-table-actions">
                              <button
                                className="admin-icon-btn"
                                onClick={() => openEditProductModal(prod)}
                                title="Edit Product"
                              >
                                <Edit3 size={15} />
                              </button>
                              <button
                                className="admin-icon-btn delete"
                                onClick={() => confirmDeleteItem('product', prod)}
                                title="Delete Product"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" style={{ textAlign: 'center', padding: '40px' }}>
                          No products match this filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB 2: ADD PRODUCT (DEDICATED WORKSPACE) ===================== */}
        {activeTab === 'add-product' && (
          <div className="admin-add-product-workspace animate-fade-in">
            <div className="admin-workspace-grid">
              {/* Left Column: Form */}
              <div className="admin-workspace-form-card">
                <div className="admin-workspace-header">
                  <div className="admin-workspace-title">
                    <PlusCircle size={22} color="#10B981" />
                    <h2>Product Formulation Creator</h2>
                  </div>
                  <p>Fill in chemical specifications and packaging details. Changes render live in the preview.</p>
                </div>

                <form onSubmit={handleProductSubmit} className="admin-product-creator-form">
                  {/* Step 1: Identity */}
                  <div className="admin-form-section">
                    <span className="admin-section-step">01. PRODUCT IDENTITY</span>
                    <div className="admin-form-row">
                      <div className="admin-form-group">
                        <label className="admin-form-label">Product Name *</label>
                        <input
                          type="text"
                          required
                          className="admin-form-input"
                          placeholder="e.g. TEBCIN, GHIROILKONA R-999"
                          value={productForm.name}
                          onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                        />
                      </div>
                      <div className="admin-form-group">
                        <label className="admin-form-label">Brand Overlay</label>
                        <input
                          type="text"
                          className="admin-form-input"
                          placeholder="e.g. SHIMANZU JAPAN"
                          value={productForm.brand}
                          onChange={e => setProductForm({ ...productForm, brand: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="admin-form-group">
                      <label className="admin-form-label">Chemical Composition *</label>
                      <input
                        type="text"
                        required
                        className="admin-form-input"
                        placeholder="e.g. Validamycin 5% + Tebuconazole 15% SC"
                        value={productForm.chemical}
                        onChange={e => setProductForm({ ...productForm, chemical: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Step 2: Classification */}
                  <div className="admin-form-section">
                    <span className="admin-section-step">02. CLASSIFICATION & MODE OF ACTION</span>
                    <div className="admin-form-row three-col">
                      <div className="admin-form-group">
                        <label className="admin-form-label">Category *</label>
                        <select
                          className="admin-form-select"
                          value={productForm.category}
                          onChange={e => {
                            const cat = categories.find(c => c.id === e.target.value);
                            setProductForm({
                              ...productForm,
                              category: e.target.value,
                              categoryLabel: cat?.name || e.target.value.toUpperCase()
                            });
                          }}
                        >
                          {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="admin-form-group">
                        <label className="admin-form-label">Formulation Type</label>
                        <select
                          className="admin-form-select"
                          value={productForm.formulation}
                          onChange={e => setProductForm({ ...productForm, formulation: e.target.value })}
                        >
                          {FORMULATION_OPTIONS.map(f => (
                            <option key={f} value={f}>{f}</option>
                          ))}
                        </select>
                      </div>

                      <div className="admin-form-group">
                        <label className="admin-form-label">Group / Mode of Action</label>
                        <input
                          type="text"
                          className="admin-form-input"
                          placeholder="e.g. FRAC 18 + 3; Systemic"
                          value={productForm.group}
                          onChange={e => setProductForm({ ...productForm, group: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Step 3: Stock & Packaging */}
                  <div className="admin-form-section">
                    <span className="admin-section-step">03. STOCK & PACKAGING SIZES</span>
                    <div className="admin-form-row">
                      <div className="admin-form-group">
                        <label className="admin-form-label">Available Pack Sizes (comma-separated)</label>
                        <input
                          type="text"
                          className="admin-form-input"
                          placeholder="e.g. 250 ml, 500 ml, 1 L, 5 L"
                          value={productForm.packSizes}
                          onChange={e => setProductForm({ ...productForm, packSizes: e.target.value })}
                        />
                      </div>

                      <div className="admin-form-group">
                        <label className="admin-form-label">Target Crops (comma-separated)</label>
                        <input
                          type="text"
                          className="admin-form-input"
                          placeholder="e.g. Rice, Cotton, Soybean, Wheat"
                          value={productForm.crops}
                          onChange={e => setProductForm({ ...productForm, crops: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="admin-form-checkbox-row">
                      <label className="admin-checkbox-label">
                        <input
                          type="checkbox"
                          checked={productForm.inStock}
                          onChange={e => setProductForm({ ...productForm, inStock: e.target.checked })}
                        />
                        <span>Ready in Stock (Immediate Dispatch)</span>
                      </label>
                    </div>
                  </div>

                  {/* Step 4: Technical Specs */}
                  <div className="admin-form-section">
                    <span className="admin-section-step">04. APPLICATION & TECHNICAL DOSAGE</span>
                    <div className="admin-form-row">
                      <div className="admin-form-group">
                        <label className="admin-form-label">Recommended Dosage</label>
                        <input
                          type="text"
                          className="admin-form-input"
                          placeholder="e.g. 400 ml/acre in 200 L water"
                          value={productForm.dosage}
                          onChange={e => setProductForm({ ...productForm, dosage: e.target.value })}
                        />
                      </div>

                      <div className="admin-form-group">
                        <label className="admin-form-label">Target Pests / Diseases</label>
                        <input
                          type="text"
                          className="admin-form-input"
                          placeholder="e.g. Sheath Blight, Blast, Leaf Folder"
                          value={productForm.targets}
                          onChange={e => setProductForm({ ...productForm, targets: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="admin-form-group">
                      <label className="admin-form-label">Product Overview & Efficacy</label>
                      <textarea
                        className="admin-form-textarea"
                        rows={3}
                        placeholder="Detailed technical overview and advantages..."
                        value={productForm.description}
                        onChange={e => setProductForm({ ...productForm, description: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Step 5: Packaging Image */}
                  <div className="admin-form-section">
                    <span className="admin-section-step">05. PACKAGING MEDIA (AUTO-OPTIMIZED WEBP)</span>
                    <div className="admin-upload-dropzone">
                      <Upload size={32} className="admin-upload-icon" />
                      <div className="admin-upload-text">
                        <strong>Upload Packaging Photo</strong>
                        <span>Auto-compressed into ultra-fast WebP format</span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="admin-file-hidden-input"
                        onChange={e => handleImageUpload(e.target.files[0], (val) => setProductForm({ ...productForm, imgSrc: val }))}
                      />
                    </div>

                    {isCompressingImage && (
                      <div className="admin-compressing-indicator">
                        <Loader2 size={16} className="admin-spin" />
                        <span>Optimizing image for lightning-fast catalog rendering...</span>
                      </div>
                    )}

                    {/* Presets or manual URL */}
                    <div className="admin-preset-picker">
                      <span className="admin-preset-title">Or pick a standard packaging preset:</span>
                      <div className="admin-preset-chips">
                        {PRESET_PRODUCT_IMAGES.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            className={`admin-preset-chip ${productForm.imgSrc === preset.src ? 'selected' : ''}`}
                            onClick={() => setProductForm({ ...productForm, imgSrc: preset.src })}
                          >
                            <img src={preset.src} alt={preset.label} />
                            <span>{preset.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="admin-form-group" style={{ marginTop: '12px' }}>
                      <input
                        type="text"
                        className="admin-form-input"
                        placeholder="Or paste external image URL (https://...)"
                        value={productForm.imgSrc}
                        onChange={e => setProductForm({ ...productForm, imgSrc: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Form Submission */}
                  <div className="admin-workspace-footer">
                    <button
                      type="submit"
                      disabled={isProductSaving}
                      className="admin-publish-btn"
                    >
                      {isProductSaving ? (
                        <>
                          <Loader2 size={18} className="admin-spin" />
                          <span>Publishing Product...</span>
                        </>
                      ) : (
                        <>
                          <Check size={18} />
                          <span>Publish Product to Catalog</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      className="admin-reset-form-btn"
                      onClick={() => setProductForm(defaultProductState)}
                    >
                      Reset Form
                    </button>
                  </div>
                </form>
              </div>

              {/* Right Column: Real-Time Live Preview */}
              <div className="admin-workspace-preview-card">
                <div className="admin-preview-header">
                  <div className="admin-preview-badge">
                    <Sparkles size={14} /> LIVE CATALOG PREVIEW
                  </div>
                  <span className="admin-preview-hint">Rendered exactly as public users see it</span>
                </div>

                <div className="admin-live-card-container">
                  <ProductCard
                    product={livePreviewProduct}
                    onViewClick={() => alert('Quick View Modal Preview')}
                  />
                </div>

                <div className="admin-preview-meta-info">
                  <div className="admin-meta-row">
                    <span className="meta-label">Selected Category:</span>
                    <span className="meta-value">{livePreviewProduct.categoryLabel}</span>
                  </div>
                  <div className="admin-meta-row">
                    <span className="meta-label">Formulation Type:</span>
                    <span className="meta-value">{livePreviewProduct.formulation}</span>
                  </div>
                  <div className="admin-meta-row">
                    <span className="meta-label">Stock Status:</span>
                    <span className={`meta-value ${livePreviewProduct.inStock ? 'green' : 'amber'}`}>
                      {livePreviewProduct.inStock ? 'Ready in Stock' : 'Available on Request'}
                    </span>
                  </div>
                  <div className="admin-meta-row">
                    <span className="meta-label">Image Status:</span>
                    <span className={`meta-value ${productForm.imgSrc ? 'green' : 'amber'}`}>
                      {productForm.imgSrc ? 'Custom Image Attached' : 'No Image Uploaded'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 3: QUERIES & LEADS ===================== */}
        {activeTab === 'queries' && (
          <div className="admin-section-wrap animate-fade-in">
            {/* Queries Filter Bar */}
            <div className="admin-toolbar">
              <div className="admin-category-pills">
                <button
                  className={`admin-filter-pill ${queryStatusFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setQueryStatusFilter('all')}
                >
                  All Inquiries ({queries.length})
                </button>
                <button
                  className={`admin-filter-pill ${queryStatusFilter === 'new' ? 'active' : ''}`}
                  onClick={() => setQueryStatusFilter('new')}
                >
                  <span className="admin-pill-dot" style={{ backgroundColor: '#38BDF8' }} />
                  New Leads ({queries.filter(q => q.status === 'new').length})
                </button>
                <button
                  className={`admin-filter-pill ${queryStatusFilter === 'contacted' ? 'active' : ''}`}
                  onClick={() => setQueryStatusFilter('contacted')}
                >
                  <span className="admin-pill-dot" style={{ backgroundColor: '#F59E0B' }} />
                  Contacted ({queries.filter(q => q.status === 'contacted').length})
                </button>
                <button
                  className={`admin-filter-pill ${queryStatusFilter === 'resolved' ? 'active' : ''}`}
                  onClick={() => setQueryStatusFilter('resolved')}
                >
                  <span className="admin-pill-dot" style={{ backgroundColor: '#10B981' }} />
                  Resolved ({queries.filter(q => q.status === 'resolved').length})
                </button>
              </div>
            </div>

            {/* Queries Cards List */}
            <div className="admin-queries-grid">
              {filteredQueries.length > 0 ? (
                filteredQueries.map(query => {
                  const cleanPhone = (query.phone || '').replace(/[^0-9+]/g, '');
                  return (
                    <div key={query.id} className={`admin-query-card status-${query.status}`}>
                      <div className="admin-query-card-top">
                        <div className="admin-query-author">
                          <div className="admin-query-avatar">
                            {query.name ? query.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div className="admin-query-author-meta">
                            <h4>{query.name}</h4>
                            <span className="admin-query-location">
                              <MapPin size={12} /> {query.location || 'India'}
                            </span>
                          </div>
                        </div>

                        {/* Status Selector Dropdown */}
                        <div className="admin-query-status-select-wrap">
                          <select
                            value={query.status}
                            onChange={(e) => {
                              updateQueryStatus(query.id, e.target.value);
                              showToast({ type: 'success', text: `Inquiry status changed to "${e.target.value}".` });
                            }}
                            className={`admin-status-dropdown ${query.status}`}
                          >
                            <option value="new">● New Lead</option>
                            <option value="contacted">● Contacted</option>
                            <option value="resolved">● Resolved</option>
                          </select>
                        </div>
                      </div>

                      {/* Product of interest tag */}
                      {query.productInterest && (
                        <div className="admin-query-product-tag">
                          <Tag size={13} />
                          <span>Product Interest: <strong>{query.productInterest}</strong></span>
                        </div>
                      )}

                      {/* Subject & Message */}
                      <h4 className="admin-query-subject">{query.subject}</h4>
                      <p className="admin-query-message">{query.message}</p>

                      {/* Date & Contact Actions */}
                      <div className="admin-query-card-footer">
                        <span className="admin-query-date">
                          <Clock size={13} /> {new Date(query.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>

                        <div className="admin-query-contact-actions">
                          {query.phone && query.phone !== 'Not specified' && (
                            <>
                              <a
                                href={`tel:${cleanPhone}`}
                                className="admin-contact-btn phone"
                                title="Call Farmer / Dealer"
                              >
                                <Phone size={13} /> Call
                              </a>
                              <a
                                href={`https://wa.me/${cleanPhone.replace('+', '')}`}
                                target="_blank"
                                rel="noreferrer"
                                className="admin-contact-btn whatsapp"
                                title="Chat on WhatsApp"
                              >
                                WhatsApp
                              </a>
                            </>
                          )}
                          {query.email && (
                            <a
                              href={`mailto:${query.email}?subject=RE: ${encodeURIComponent(query.subject || 'Shimanzu Inquiry')}`}
                              className="admin-contact-btn email"
                              title="Send Email"
                            >
                              <Mail size={13} /> Email
                            </a>
                          )}
                          <button
                            className="admin-contact-btn delete"
                            onClick={() => confirmDeleteItem('query', query)}
                            title="Delete query"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="admin-empty-state">
                  <MessageSquare size={48} className="admin-empty-icon" />
                  <h3>No customer queries match this filter</h3>
                  <p>Inquiries submitted via the Contact page or product inquiry forms appear here automatically.</p>
                  <button
                    className="admin-action-btn-primary"
                    onClick={() => { setSearchQuery(''); setQueryStatusFilter('all'); }}
                  >
                    View All Queries
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===================== TAB 4: CROPS ===================== */}
        {activeTab === 'crops' && (
          <div className="admin-section-wrap animate-fade-in">
            <div className="admin-crops-grid">
              {filteredCrops.length > 0 ? (
                filteredCrops.map(crop => (
                  <div key={crop.id} className="admin-crop-card">
                    <div className="admin-crop-img-wrap">
                      <img src={crop.image} alt={crop.name} />
                      <span className="admin-crop-key-tag">{crop.cropKey || crop.name}</span>
                    </div>
                    <div className="admin-crop-card-body">
                      <h3 className="admin-crop-card-title">{crop.name}</h3>
                      <p className="admin-crop-card-desc">{crop.description}</p>
                      <div className="admin-crop-card-footer">
                        <button
                          className="admin-mini-btn edit"
                          onClick={() => openEditCropModal(crop)}
                        >
                          <Edit3 size={14} /> Edit
                        </button>
                        <button
                          className="admin-mini-btn delete"
                          onClick={() => confirmDeleteItem('crop', crop)}
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="admin-empty-state">
                  <Sprout size={48} className="admin-empty-icon" />
                  <h3>No crops found</h3>
                  <p>Search didn't match any registered crops.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===================== TAB 5: CATEGORIES ===================== */}
        {activeTab === 'categories' && (
          <div className="admin-section-wrap animate-fade-in">
            <div className="admin-categories-grid">
              {filteredCategories.length > 0 ? (
                filteredCategories.map(cat => {
                  const count = products.filter(p => p.category === cat.id).length;
                  return (
                    <div key={cat.id} className="admin-category-card">
                      <div className="admin-cat-card-header" style={{ borderTop: `4px solid ${cat.accentColor || '#0D9488'}` }}>
                        <div className="admin-cat-img-box">
                          {cat.image ? (
                            <img src={cat.image} alt={cat.name} />
                          ) : (
                            <div className="admin-cat-color-placeholder" style={{ backgroundColor: cat.accentColor || '#0D9488' }} />
                          )}
                        </div>
                        <div className="admin-cat-title-box">
                          <h3>{cat.name}</h3>
                          <span className="admin-cat-short-tag">{cat.shortName || cat.id}</span>
                        </div>
                        <span className="admin-cat-product-counter">
                          {count} Products
                        </span>
                      </div>

                      <div className="admin-cat-card-body">
                        <p className="admin-cat-desc">{cat.description}</p>
                        <div className="admin-cat-card-footer">
                          <button
                            className="admin-mini-btn edit"
                            onClick={() => openEditCategoryModal(cat)}
                          >
                            <Edit3 size={14} /> Edit
                          </button>
                          <button
                            className="admin-mini-btn delete"
                            onClick={() => confirmDeleteItem('category', cat)}
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="admin-empty-state">
                  <Layers size={48} className="admin-empty-icon" />
                  <h3>No categories found</h3>
                  <p>Search didn't match any active categories.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* ===================== MODAL: EDIT PRODUCT ===================== */}
      {modalMode === 'edit-product' && (
        <div className="admin-modal-overlay" onClick={() => setModalMode(null)}>
          <div className="admin-modal-content wide animate-scale-up" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2><Edit3 size={20} color="#38bdf8" /> Edit Agrochemical Product</h2>
              <button className="admin-modal-close" onClick={() => setModalMode(null)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleProductSubmit}>
              <div className="admin-form-grid">
                <div className="admin-form-group">
                  <label className="admin-form-label">Product Name *</label>
                  <input
                    type="text"
                    required
                    className="admin-form-input"
                    value={productForm.name}
                    onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Brand Overlay</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    value={productForm.brand}
                    onChange={e => setProductForm({ ...productForm, brand: e.target.value })}
                  />
                </div>

                <div className="admin-form-group full">
                  <label className="admin-form-label">Chemical Composition *</label>
                  <input
                    type="text"
                    required
                    className="admin-form-input"
                    value={productForm.chemical}
                    onChange={e => setProductForm({ ...productForm, chemical: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Category *</label>
                  <select
                    className="admin-form-select"
                    value={productForm.category}
                    onChange={e => {
                      const cat = categories.find(c => c.id === e.target.value);
                      setProductForm({
                        ...productForm,
                        category: e.target.value,
                        categoryLabel: cat?.name || e.target.value.toUpperCase()
                      });
                    }}
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Formulation Type</label>
                  <select
                    className="admin-form-select"
                    value={productForm.formulation}
                    onChange={e => setProductForm({ ...productForm, formulation: e.target.value })}
                  >
                    {FORMULATION_OPTIONS.map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Group / Mode of Action</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    value={productForm.group}
                    onChange={e => setProductForm({ ...productForm, group: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Pack Sizes (comma-separated)</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    value={productForm.packSizes}
                    onChange={e => setProductForm({ ...productForm, packSizes: e.target.value })}
                  />
                </div>

                <div className="admin-form-group full">
                  <label className="admin-form-label">Target Crops (comma-separated)</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    value={productForm.crops}
                    onChange={e => setProductForm({ ...productForm, crops: e.target.value })}
                  />
                </div>

                <div className="admin-form-group full">
                  <label className="admin-form-label">Update Packaging Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="admin-form-input"
                    onChange={e => handleImageUpload(e.target.files[0], (val) => setProductForm({ ...productForm, imgSrc: val }))}
                  />
                  {isCompressingImage && (
                    <div className="admin-compressing-indicator">
                      <Loader2 size={14} className="admin-spin" />
                      <span>Optimizing image...</span>
                    </div>
                  )}
                  {productForm.imgSrc && (
                    <div className="admin-preview-thumbnail-box">
                      <img src={productForm.imgSrc} alt="Preview" />
                      <span>Attached custom packaging</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="admin-modal-actions">
                <button type="button" className="admin-modal-cancel-btn" onClick={() => setModalMode(null)}>
                  Cancel
                </button>
                <button type="submit" disabled={isProductSaving} className="admin-action-btn-primary">
                  {isProductSaving ? <Loader2 size={16} className="admin-spin" /> : <Check size={16} />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== MODAL: ADD / EDIT CATEGORY ===================== */}
      {(modalMode === 'add-category' || modalMode === 'edit-category') && (
        <div className="admin-modal-overlay" onClick={() => setModalMode(null)}>
          <div className="admin-modal-content animate-scale-up" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2><Layers size={20} color="#10B981" /> {modalMode === 'add-category' ? 'Add New Category' : 'Edit Category'}</h2>
              <button className="admin-modal-close" onClick={() => setModalMode(null)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCategorySubmit}>
              <div className="admin-form-group">
                <label className="admin-form-label">Category Name *</label>
                <input
                  type="text"
                  required
                  className="admin-form-input"
                  placeholder="e.g. Fungicides"
                  value={categoryForm.name}
                  onChange={e => setCategoryForm({ ...categoryForm, name: e.target.value })}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Short Name (For Filters/Badges)</label>
                <input
                  type="text"
                  className="admin-form-input"
                  placeholder="e.g. Fungicides"
                  value={categoryForm.shortName}
                  onChange={e => setCategoryForm({ ...categoryForm, shortName: e.target.value })}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Accent Color</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input
                    type="color"
                    style={{ width: '50px', height: '38px', borderRadius: '6px', cursor: 'pointer', background: 'none', border: '1px solid rgba(255,255,255,0.2)' }}
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
                <label className="admin-form-label">Category Image (Upload)</label>
                <input
                  type="file"
                  accept="image/*"
                  className="admin-form-input"
                  onChange={e => handleImageUpload(e.target.files[0], (val) => setCategoryForm({ ...categoryForm, image: val }))}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Overview Description</label>
                <textarea
                  className="admin-form-textarea"
                  rows={3}
                  value={categoryForm.description}
                  onChange={e => setCategoryForm({ ...categoryForm, description: e.target.value })}
                />
              </div>

              <div className="admin-modal-actions">
                <button type="button" className="admin-modal-cancel-btn" onClick={() => setModalMode(null)}>
                  Cancel
                </button>
                <button type="submit" className="admin-action-btn-primary">
                  <Check size={16} /> Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== MODAL: ADD / EDIT CROP ===================== */}
      {(modalMode === 'add-crop' || modalMode === 'edit-crop') && (
        <div className="admin-modal-overlay" onClick={() => setModalMode(null)}>
          <div className="admin-modal-content animate-scale-up" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2><Sprout size={20} color="#10B981" /> {modalMode === 'add-crop' ? 'Register New Crop' : 'Edit Crop Details'}</h2>
              <button className="admin-modal-close" onClick={() => setModalMode(null)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCropSubmit}>
              <div className="admin-form-group">
                <label className="admin-form-label">Crop Name *</label>
                <input
                  type="text"
                  required
                  className="admin-form-input"
                  placeholder="e.g. Paddy / Rice"
                  value={cropForm.name}
                  onChange={e => setCropForm({ ...cropForm, name: e.target.value })}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Crop Key / Tag</label>
                <input
                  type="text"
                  className="admin-form-input"
                  placeholder="e.g. Rice"
                  value={cropForm.cropKey}
                  onChange={e => setCropForm({ ...cropForm, cropKey: e.target.value })}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Crop Image (Upload or URL)</label>
                <input
                  type="file"
                  accept="image/*"
                  className="admin-form-input"
                  onChange={e => handleImageUpload(e.target.files[0], (val) => setCropForm({ ...cropForm, image: val }))}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Description</label>
                <textarea
                  className="admin-form-textarea"
                  rows={3}
                  value={cropForm.description}
                  onChange={e => setCropForm({ ...cropForm, description: e.target.value })}
                />
              </div>

              <div className="admin-modal-actions">
                <button type="button" className="admin-modal-cancel-btn" onClick={() => setModalMode(null)}>
                  Cancel
                </button>
                <button type="submit" className="admin-action-btn-primary">
                  <Check size={16} /> Save Crop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== MODAL: CHANGE PASSWORD ===================== */}
      {modalMode === 'change-password' && (
        <div className="admin-modal-overlay" onClick={() => setModalMode(null)}>
          <div className="admin-modal-content animate-scale-up" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2><KeyRound size={20} color="#F59E0B" /> Change Admin Password</h2>
              <button className="admin-modal-close" onClick={() => setModalMode(null)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              if (passwordForm.newPassword !== passwordForm.confirmPassword) {
                setPasswordForm({ ...passwordForm, error: 'New passwords do not match' });
                return;
              }
              const result = changeAdminPassword(passwordForm.currentPassword, passwordForm.newPassword);
              if (!result.success) {
                setPasswordForm({ ...passwordForm, error: result.error });
              } else {
                showToast({ type: 'success', text: 'Admin password changed successfully!' });
                setModalMode(null);
              }
            }}>
              {passwordForm.error && (
                <div className="admin-form-error-banner">
                  <AlertCircle size={16} />
                  <span>{passwordForm.error}</span>
                </div>
              )}

              <div className="admin-form-group">
                <label className="admin-form-label">Current Password</label>
                <input
                  type="password"
                  required
                  className="admin-form-input"
                  value={passwordForm.currentPassword}
                  onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value, error: '' })}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">New Password</label>
                <input
                  type="password"
                  required
                  className="admin-form-input"
                  value={passwordForm.newPassword}
                  onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value, error: '' })}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Confirm New Password</label>
                <input
                  type="password"
                  required
                  className="admin-form-input"
                  value={passwordForm.confirmPassword}
                  onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value, error: '' })}
                />
              </div>

              <div className="admin-modal-actions">
                <button type="button" className="admin-modal-cancel-btn" onClick={() => setModalMode(null)}>
                  Cancel
                </button>
                <button type="submit" className="admin-action-btn-primary">
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== MODAL: DELETE CONFIRMATION ===================== */}
      {modalMode === 'delete-confirm' && deleteConfirmItem && (
        <div className="admin-modal-overlay" onClick={() => setModalMode(null)}>
          <div className="admin-modal-content small animate-scale-up" onClick={e => e.stopPropagation()}>
            <div className="admin-delete-confirm-box">
              <div className="admin-delete-confirm-icon">
                <Trash2 size={28} />
              </div>
              <h3>Confirm Deletion</h3>
              <p>
                Are you sure you want to delete <strong>"{deleteConfirmItem.item.name || deleteConfirmItem.item.subject}"</strong>?
                This action cannot be undone.
              </p>
              <div className="admin-modal-actions" style={{ justifyContent: 'center' }}>
                <button type="button" className="admin-modal-cancel-btn" onClick={() => setModalMode(null)}>
                  Cancel
                </button>
                <button type="button" className="admin-btn-danger" onClick={executeDelete}>
                  Yes, Delete Item
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
