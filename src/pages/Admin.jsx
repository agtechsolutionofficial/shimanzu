import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers, Sprout, Package, Plus, Trash2, Edit3,
  ExternalLink, Search, Check, X, Shield, Upload, LogOut, CheckCircle2, AlertCircle, Sparkles,
  KeyRound, Loader2, MessageSquare, Phone, Mail, MapPin, Grid, List, PlusCircle,
  Eye, Menu, ChevronRight, Filter, Tag, CheckSquare, Clock, User, RefreshCw,
  Image as ImageIcon, BookOpen, FileText, Calendar
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
    isCategoriesLoading, categoriesError, refreshCategories,
    isCropsLoading, cropsError, refreshCrops,
    isQueriesLoading, queriesError, refreshQueries,
    addCategory, updateCategory, deleteCategory,
    addCrop, updateCrop, deleteCrop,
    addProduct, updateProduct, deleteProduct,
    addQuery, updateQueryStatus, deleteQuery,
    gallery = [], isGalleryLoading, galleryError, refreshGallery,
    addGalleryItem, updateGalleryItem, deleteGalleryItem,
    blogs = [], isBlogsLoading, blogsError, refreshBlogs,
    addBlog, updateBlog, deleteBlog,
    logout, changeAdminPassword
  } = useDataContext();

  // Navigation tab: 'all-products' | 'add-product' | 'queries' | 'crops' | 'categories' | 'gallery' | 'blogs'
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
    brand: '',
    chemical: '',
    category: '',
    categoryLabel: '',
    formulation: '',
    group: '',
    inStock: false,
    packSizes: '',
    crops: '',
    targets: '',
    dosage: '',
    description: '',
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
  const [isCategorySaving, setIsCategorySaving] = useState(false);

  // Crop Form
  const [cropForm, setCropForm] = useState({
    name: '',
    cropKey: '',
    image: '',
    description: ''
  });

  // Gallery Form
  const defaultGalleryState = {
    title: '',
    cat: '',
    tag: '',
    src: '',
    description: ''
  };
  const [galleryForm, setGalleryForm] = useState(defaultGalleryState);
  const [isGallerySaving, setIsGallerySaving] = useState(false);
  const [galleryCategoryFilter, setGalleryCategoryFilter] = useState('all');

  // Blog Form
  const defaultBlogState = {
    title: '',
    category: '',
    date: '',
    author: '',
    img: '',
    desc: '',
    content: ''
  };
  const [blogForm, setBlogForm] = useState(defaultBlogState);
  const [isBlogSaving, setIsBlogSaving] = useState(false);
  const [blogCategoryFilter, setBlogCategoryFilter] = useState('all');
  const [selectedBlogPreview, setSelectedBlogPreview] = useState(null);

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
    setProductForm(defaultProductState);
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
    if (!productForm.category) return alert('Please select a Category from the dropdown.');
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
      name: cat.name || '',
      shortName: cat.shortName || cat.name || '',
      accentColor: cat.accentColor || '#0D9488',
      image: cat.image || '',
      description: cat.description || '',
      fullDescription: cat.fullDescription || cat.description || ''
    });
    setEditingItem(cat);
    setModalMode('edit-category');
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) return alert('Category Name is required');
    if (isCategorySaving) return;

    setIsCategorySaving(true);
    try {
      if (modalMode === 'add-category') {
        const res = await addCategory(categoryForm);
        if (res && res.success === false) {
          showToast({ type: 'error', text: `Failed to create category: ${res.error || 'Database error'}` });
        } else {
          showToast({ type: 'success', text: `Category "${categoryForm.name}" created and synced to MongoDB Atlas!` });
          setModalMode(null);
        }
      } else {
        const res = await updateCategory(editingItem.id, categoryForm);
        if (res && res.success === false) {
          showToast({ type: 'error', text: `Failed to update category: ${res.error || 'Database error'}` });
        } else {
          showToast({ type: 'success', text: `Category "${categoryForm.name}" updated in MongoDB Atlas!` });
          setModalMode(null);
        }
      }
    } catch (err) {
      console.error('Error saving category:', err);
      showToast({ type: 'error', text: `Error saving category: ${err.message}` });
    } finally {
      setIsCategorySaving(false);
    }
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

  const handleCropSubmit = async (e) => {
    e.preventDefault();
    if (!cropForm.name.trim()) return alert('Crop Name is required');

    if (modalMode === 'add-crop') {
      const res = await addCrop(cropForm);
      if (res && res.success === false) {
        showToast({ type: 'error', text: `Failed to add crop: ${res.error || 'Database error'}` });
      } else {
        showToast({ type: 'success', text: `Crop "${cropForm.name}" registered and synced to MongoDB!` });
      }
    } else {
      const res = await updateCrop(editingItem.id, cropForm);
      if (res && res.success === false) {
        showToast({ type: 'error', text: `Failed to update crop: ${res.error || 'Database error'}` });
      } else {
        showToast({ type: 'success', text: `Crop "${cropForm.name}" updated in MongoDB Atlas!` });
      }
    }
    setModalMode(null);
  };

  // Gallery CRUD Handlers
  const openAddGalleryModal = () => {
    setGalleryForm({
      title: '',
      cat: '',
      tag: '',
      src: '',
      description: ''
    });
    setEditingItem(null);
    setModalMode('add-gallery');
  };

  const openEditGalleryModal = (item) => {
    setGalleryForm({
      title: item.title || '',
      cat: item.cat || '',
      tag: item.tag || '',
      src: item.src || '',
      description: item.description || ''
    });
    setEditingItem(item);
    setModalMode('edit-gallery');
  };

  const handleGallerySubmit = async (e) => {
    e.preventDefault();
    if (!galleryForm.title.trim()) return alert('Photo title is required');
    if (!galleryForm.cat) return alert('Please select a Category');
    if (!galleryForm.src.trim()) return alert('Photo image is required');
    if (isGallerySaving) return;

    setIsGallerySaving(true);
    try {
      const sanitized = {
        ...galleryForm,
        title: galleryForm.title.trim(),
        cat: galleryForm.cat.trim().toLowerCase(),
        tag: galleryForm.tag.trim() || (galleryForm.cat === 'lab' ? 'Lab & Research' : galleryForm.cat === 'products' ? 'Products' : 'Field & Crops'),
        src: galleryForm.src.trim(),
        description: (galleryForm.description || '').trim()
      };

      if (modalMode === 'add-gallery') {
        const res = await addGalleryItem(sanitized);
        if (res && res.success === false) {
          showToast({ type: 'error', text: `Failed to add photo: ${res.error || 'Upload error'}` });
        } else {
          showToast({ type: 'success', text: `Photo "${sanitized.title}" uploaded to Cloudinary & saved to MongoDB!` });
        }
      } else if (modalMode === 'edit-gallery' && editingItem) {
        const res = await updateGalleryItem(editingItem.id, sanitized);
        if (res && res.success === false) {
          showToast({ type: 'error', text: `Failed to update photo: ${res.error || 'Database error'}` });
        } else {
          showToast({ type: 'success', text: `Photo "${sanitized.title}" updated successfully!` });
        }
      }
      setModalMode(null);
    } catch (err) {
      console.error('Error saving gallery item:', err);
      showToast({ type: 'error', text: `Error: ${err.message}` });
    } finally {
      setIsGallerySaving(false);
    }
  };

  // Blog CRUD Handlers
  const openAddBlogModal = () => {
    setBlogForm({
      title: '',
      category: '',
      date: '',
      author: '',
      img: '',
      desc: '',
      content: ''
    });
    setEditingItem(null);
    setModalMode('add-blog');
  };

  const openEditBlogModal = (blog) => {
    setBlogForm({
      title: blog.title || '',
      category: blog.category || '',
      date: blog.date || '',
      author: blog.author || '',
      img: blog.img || '',
      desc: blog.desc || '',
      content: blog.content || blog.desc || ''
    });
    setEditingItem(blog);
    setModalMode('edit-blog');
  };

  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    if (!blogForm.title.trim()) return alert('Blog title is required');
    if (!blogForm.category) return alert('Please select a Category');
    if (!blogForm.img.trim()) return alert('Cover image is required');
    if (isBlogSaving) return;

    setIsBlogSaving(true);
    try {
      const sanitized = {
        ...blogForm,
        title: blogForm.title.trim(),
        category: (blogForm.category || 'Agriculture').trim(),
        author: (blogForm.author || 'Shimanzu Agrosciences').trim(),
        date: (blogForm.date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })).trim(),
        img: blogForm.img.trim(),
        desc: blogForm.desc.trim(),
        content: (blogForm.content || blogForm.desc).trim()
      };

      if (modalMode === 'add-blog') {
        const res = await addBlog(sanitized);
        if (res && res.success === false) {
          showToast({ type: 'error', text: `Failed to create blog: ${res.error || 'Upload error'}` });
        } else {
          showToast({ type: 'success', text: `Blog "${sanitized.title}" published with Cloudinary image & saved to MongoDB!` });
        }
      } else if (modalMode === 'edit-blog' && editingItem) {
        const res = await updateBlog(editingItem.id, sanitized);
        if (res && res.success === false) {
          showToast({ type: 'error', text: `Failed to update blog: ${res.error || 'Database error'}` });
        } else {
          showToast({ type: 'success', text: `Blog "${sanitized.title}" updated successfully!` });
        }
      }
      setModalMode(null);
    } catch (err) {
      console.error('Error saving blog:', err);
      showToast({ type: 'error', text: `Error: ${err.message}` });
    } finally {
      setIsBlogSaving(false);
    }
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
      await deleteCrop(item.id);
      showToast({ type: 'success', text: `Crop "${item.name}" deleted from MongoDB.` });
    } else if (type === 'category') {
      const res = await deleteCategory(item.id);
      if (res && res.success === false) {
        showToast({ type: 'error', text: `Failed to delete category: ${res.error || 'Database error'}` });
      } else {
        showToast({ type: 'success', text: `Category "${item.name}" deleted from database.` });
      }
    } else if (type === 'query') {
      await deleteQuery(item.id);
      showToast({ type: 'success', text: `Customer query from ${item.name} removed from MongoDB.` });
    } else if (type === 'gallery') {
      await deleteGalleryItem(item.id);
      showToast({ type: 'success', text: `Gallery photo "${item.title}" deleted from database.` });
    } else if (type === 'blog') {
      await deleteBlog(item.id);
      showToast({ type: 'success', text: `Blog post "${item.title}" deleted from database.` });
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

  const filteredGallery = useMemo(() => {
    return gallery.filter(item => {
      const matchSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.tag && item.tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchCategory = galleryCategoryFilter === 'all' || (item.cat || '').toLowerCase() === galleryCategoryFilter.toLowerCase();
      return matchSearch && matchCategory;
    });
  }, [gallery, searchQuery, galleryCategoryFilter]);

  const filteredAdminBlogs = useMemo(() => {
    return blogs.filter(b => {
      const matchSearch =
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.desc && b.desc.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (b.category && b.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (b.author && b.author.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchCategory = blogCategoryFilter === 'all' || (b.category || '').toLowerCase() === blogCategoryFilter.toLowerCase();
      return matchSearch && matchCategory;
    });
  }, [blogs, searchQuery, blogCategoryFilter]);

  // Statistics counters
  const inStockCount = useMemo(() => products.filter(p => p.inStock !== false).length, [products]);
  const newQueriesCount = useMemo(() => queries.filter(q => q.status === 'new').length, [queries]);

  // Live preview product object for Add Product workspace
  const livePreviewProduct = useMemo(() => {
    const activeCat = categories.find(c => c.id === productForm.category);
    return {
      id: 'preview',
      name: productForm.name ? productForm.name.trim() : '',
      brand: productForm.brand ? productForm.brand.trim() : '',
      chemical: productForm.chemical ? productForm.chemical.trim() : '',
      category: productForm.category || '',
      categoryLabel: activeCat ? activeCat.name : '',
      group: productForm.group ? productForm.group.trim() : (productForm.formulation ? `${productForm.formulation} FORMULATION` : ''),
      formulation: productForm.formulation || '',
      inStock: Boolean(productForm.inStock),
      packSizes: productForm.packSizes ? productForm.packSizes.split(',').map(s => s.trim()).filter(Boolean) : [],
      crops: productForm.crops ? productForm.crops.split(',').map(s => s.trim()).filter(Boolean) : [],
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
          </Link>
          <button
            className="admin-sidebar-close-btn"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
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

          {/* 6. Gallery */}
          <button
            className={`admin-nav-item ${activeTab === 'gallery' ? 'active' : ''}`}
            onClick={() => { setActiveTab('gallery'); setSearchQuery(''); setSidebarOpen(false); }}
          >
            <div className="admin-nav-item-left">
              <ImageIcon size={19} className="admin-nav-icon accent-emerald" />
              <span className="admin-nav-label">Gallery</span>
            </div>
            <span className="admin-nav-badge">{gallery.length}</span>
          </button>

          {/* 7. Blogs */}
          <button
            className={`admin-nav-item ${activeTab === 'blogs' ? 'active' : ''}`}
            onClick={() => { setActiveTab('blogs'); setSearchQuery(''); setSidebarOpen(false); }}
          >
            <div className="admin-nav-item-left">
              <BookOpen size={19} className="admin-nav-icon accent-purple" />
              <span className="admin-nav-label">Blogs</span>
            </div>
            <span className="admin-nav-badge">{blogs.length}</span>
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
                {activeTab === 'gallery' && 'Visual Gallery Showcase'}
                {activeTab === 'blogs' && 'Blog Articles & Editorial'}
              </h1>
              <span className="admin-page-subtitle">
                {activeTab === 'all-products' && `Managing ${products.length} registered agrochemicals & industrial pigments`}
                {activeTab === 'add-product' && 'Create a new product with live real-time packaging preview'}
                {activeTab === 'queries' && `${queries.length} total customer inquiries (${newQueriesCount} require follow-up)`}
                {activeTab === 'crops' && `${crops.length} supported agricultural crops & horticultural species`}
                {activeTab === 'categories' && `${categories.length} active agrochemical market segments`}
                {activeTab === 'gallery' && `${gallery.length} dynamic showcase photos in MongoDB Atlas & Cloudinary`}
                {activeTab === 'blogs' && `${blogs.length} published blog articles in MongoDB Atlas & Cloudinary`}
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
                          activeTab === 'categories' ? 'Search categories...' :
                            activeTab === 'gallery' ? 'Search gallery by title, tag...' :
                              'Search blogs by title, author...'
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
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  className="admin-action-btn-secondary"
                  onClick={async () => {
                    await refreshCrops();
                    showToast({ type: 'success', text: 'Crops synced from MongoDB Atlas!' });
                  }}
                  title="Refresh crops directly from database"
                >
                  <RefreshCw size={15} className={isCropsLoading ? 'animate-spin' : ''} />
                  <span>Sync DB</span>
                </button>
                <button className="admin-action-btn-primary" onClick={openAddCropModal}>
                  <Plus size={16} />
                  <span>Add Crop</span>
                </button>
              </div>
            )}

            {activeTab === 'queries' && (
              <button
                className="admin-action-btn-secondary"
                onClick={async () => {
                  await refreshQueries();
                  showToast({ type: 'success', text: 'Queries synced from MongoDB Atlas!' });
                }}
                title="Refresh customer leads from database"
              >
                <RefreshCw size={15} className={isQueriesLoading ? 'animate-spin' : ''} />
                <span>Sync DB</span>
              </button>
            )}

            {activeTab === 'categories' && (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  className="admin-action-btn-secondary"
                  onClick={async () => {
                    await refreshCategories();
                    showToast({ type: 'success', text: 'Categories synced from MongoDB Atlas!' });
                  }}
                  title="Refresh categories directly from database"
                >
                  <RefreshCw size={15} className={isCategoriesLoading ? 'animate-spin' : ''} />
                  <span>Sync DB</span>
                </button>
                <button className="admin-action-btn-primary" onClick={openAddCategoryModal}>
                  <Plus size={16} />
                  <span>Add Category</span>
                </button>
              </div>
            )}

            {activeTab === 'gallery' && (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  className="admin-action-btn-secondary"
                  onClick={async () => {
                    await refreshGallery();
                    showToast({ type: 'success', text: 'Gallery synced from MongoDB Atlas!' });
                  }}
                  title="Refresh gallery from database"
                >
                  <RefreshCw size={15} className={isGalleryLoading ? 'animate-spin' : ''} />
                  <span>Sync DB</span>
                </button>
                <button className="admin-action-btn-primary" onClick={openAddGalleryModal}>
                  <Plus size={16} />
                  <span>Add Photo</span>
                </button>
              </div>
            )}

            {activeTab === 'blogs' && (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  className="admin-action-btn-secondary"
                  onClick={async () => {
                    await refreshBlogs();
                    showToast({ type: 'success', text: 'Blogs synced from MongoDB Atlas!' });
                  }}
                  title="Refresh blogs from database"
                >
                  <RefreshCw size={15} className={isBlogsLoading ? 'animate-spin' : ''} />
                  <span>Sync DB</span>
                </button>
                <button className="admin-action-btn-primary" onClick={openAddBlogModal}>
                  <Plus size={16} />
                  <span>Create Blog</span>
                </button>
              </div>
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

          {/* Card 5: Gallery */}
          <div
            className={`admin-stat-card ${activeTab === 'gallery' ? 'selected' : ''}`}
            onClick={() => setActiveTab('gallery')}
          >
            <div className="admin-stat-top">
              <span className="admin-stat-label">Gallery Photos</span>
              <div className="admin-stat-icon-wrap bg-emerald">
                <ImageIcon size={20} />
              </div>
            </div>
            <div className="admin-stat-value">{gallery.length}</div>
            <div className="admin-stat-footer">
              <span className="admin-stat-subtext">Field operations, labs, products</span>
            </div>
          </div>

          {/* Card 6: Blogs */}
          <div
            className={`admin-stat-card ${activeTab === 'blogs' ? 'selected' : ''}`}
            onClick={() => setActiveTab('blogs')}
          >
            <div className="admin-stat-top">
              <span className="admin-stat-label">Blog Articles</span>
              <div className="admin-stat-icon-wrap bg-purple">
                <BookOpen size={20} />
              </div>
            </div>
            <div className="admin-stat-value">{blogs.length}</div>
            <div className="admin-stat-footer">
              <span className="admin-stat-subtext">Published insights & agro tips</span>
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
                          required
                          value={productForm.category}
                          onChange={e => {
                            const cat = categories.find(c => c.id === e.target.value);
                            setProductForm({
                              ...productForm,
                              category: e.target.value,
                              categoryLabel: cat?.name || ''
                            });
                          }}
                        >
                          <option value="">Select Category</option>
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
                          <option value="">Select Formulation Type</option>
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
                    <span className="meta-value">{livePreviewProduct.categoryLabel || '-'}</span>
                  </div>
                  <div className="admin-meta-row">
                    <span className="meta-label">Formulation Type:</span>
                    <span className="meta-value">{livePreviewProduct.formulation || '-'}</span>
                  </div>
                  <div className="admin-meta-row">
                    <span className="meta-label">Stock Status:</span>
                    <span className={`meta-value ${livePreviewProduct.inStock ? 'green' : 'amber'}`}>
                      {livePreviewProduct.inStock ? 'Ready in Stock' : 'Not In Stock'}
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

        {/* ===================== TAB 6: GALLERY MANAGEMENT ===================== */}
        {activeTab === 'gallery' && (
          <div className="admin-section-wrap animate-fade-in">
            {/* Gallery Toolbar & Category Pills */}
            <div className="admin-toolbar">
              <div className="admin-category-pills">
                <button
                  className={`admin-filter-pill ${galleryCategoryFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setGalleryCategoryFilter('all')}
                >
                  All Photos ({gallery.length})
                </button>
                <button
                  className={`admin-filter-pill ${galleryCategoryFilter === 'field' ? 'active' : ''}`}
                  onClick={() => setGalleryCategoryFilter('field')}
                >
                  <span className="admin-pill-dot" style={{ backgroundColor: '#10B981' }} />
                  Field & Crops ({gallery.filter(i => (i.cat || '').toLowerCase() === 'field').length})
                </button>
                <button
                  className={`admin-filter-pill ${galleryCategoryFilter === 'lab' ? 'active' : ''}`}
                  onClick={() => setGalleryCategoryFilter('lab')}
                >
                  <span className="admin-pill-dot" style={{ backgroundColor: '#38BDF8' }} />
                  Lab & Research ({gallery.filter(i => (i.cat || '').toLowerCase() === 'lab').length})
                </button>
                <button
                  className={`admin-filter-pill ${galleryCategoryFilter === 'products' ? 'active' : ''}`}
                  onClick={() => setGalleryCategoryFilter('products')}
                >
                  <span className="admin-pill-dot" style={{ backgroundColor: '#A855F7' }} />
                  Products ({gallery.filter(i => (i.cat || '').toLowerCase() === 'products').length})
                </button>
              </div>

              <button className="admin-action-btn-primary" onClick={openAddGalleryModal}>
                <Plus size={16} />
                <span>Upload Photo</span>
              </button>
            </div>

            {/* Counter */}
            <div className="admin-results-bar">
              <span>Showing <strong>{filteredGallery.length}</strong> of <strong>{gallery.length}</strong> gallery photos</span>
              {searchQuery && (
                <span className="admin-search-indicator">
                  Filter: "{searchQuery}" <button onClick={() => setSearchQuery('')}>Clear</button>
                </span>
              )}
            </div>

            {/* Gallery Grid */}
            <div className="admin-gallery-grid">
              {filteredGallery.length > 0 ? (
                filteredGallery.map(img => (
                  <div key={img.id || img._id} className="admin-gallery-card">
                    <div className="admin-gallery-img-wrap">
                      <img
                        src={img.src}
                        alt={img.title}
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.pexels.com/photos/2132250/pexels-photo-2132250.jpeg?auto=compress&cs=tinysrgb&w=800';
                        }}
                      />
                      <span className="admin-gallery-tag-chip">
                        {img.tag || img.cat}
                      </span>
                    </div>

                    <div className="admin-gallery-card-body">
                      <h3 className="admin-gallery-card-title">{img.title}</h3>
                      {img.description && (
                        <p className="admin-gallery-card-desc">{img.description}</p>
                      )}
                      <div className="admin-gallery-card-meta">
                        <span className="admin-gallery-cat-text">Category: <strong>{img.cat}</strong></span>
                      </div>
                      <div className="admin-gallery-card-footer">
                        <button
                          className="admin-mini-btn edit"
                          onClick={() => openEditGalleryModal(img)}
                        >
                          <Edit3 size={14} /> Edit
                        </button>
                        <button
                          className="admin-mini-btn delete"
                          onClick={() => confirmDeleteItem('gallery', img)}
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="admin-empty-state" style={{ gridColumn: '1 / -1' }}>
                  <ImageIcon size={48} className="admin-empty-icon" />
                  <h3>No gallery photos found</h3>
                  <p>Try resetting filters or click "Upload Photo" to add your first dynamic photo.</p>
                  <button className="admin-action-btn-primary" onClick={openAddGalleryModal} style={{ marginTop: '12px' }}>
                    <Plus size={16} /> Upload New Photo
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===================== TAB 7: BLOGS MANAGEMENT ===================== */}
        {activeTab === 'blogs' && (
          <div className="admin-section-wrap animate-fade-in">
            {/* Blogs Toolbar */}
            <div className="admin-toolbar">
              <div className="admin-category-pills">
                <button
                  className={`admin-filter-pill ${blogCategoryFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setBlogCategoryFilter('all')}
                >
                  All Blogs ({blogs.length})
                </button>
                {['Agriculture', 'Crop Protection', 'Pesticides', 'Sustainable Farming', 'Farming Tech'].map(c => {
                  const count = blogs.filter(b => (b.category || '').toLowerCase() === c.toLowerCase()).length;
                  return (
                    <button
                      key={c}
                      className={`admin-filter-pill ${blogCategoryFilter.toLowerCase() === c.toLowerCase() ? 'active' : ''}`}
                      onClick={() => setBlogCategoryFilter(c)}
                    >
                      <span className="admin-pill-dot" style={{ backgroundColor: '#10B981' }} />
                      {c} ({count})
                    </button>
                  );
                })}
              </div>

              <button className="admin-action-btn-primary" onClick={openAddBlogModal}>
                <Plus size={16} />
                <span>Create New Blog</span>
              </button>
            </div>

            {/* Results counter */}
            <div className="admin-results-bar">
              <span>Showing <strong>{filteredAdminBlogs.length}</strong> of <strong>{blogs.length}</strong> blog articles</span>
              {searchQuery && (
                <span className="admin-search-indicator">
                  Filter: "{searchQuery}" <button onClick={() => setSearchQuery('')}>Clear</button>
                </span>
              )}
            </div>

            {/* Blogs Grid */}
            <div className="admin-blogs-grid">
              {filteredAdminBlogs.length > 0 ? (
                filteredAdminBlogs.map(blog => (
                  <div key={blog.id || blog._id} className="admin-blog-card">
                    <div className="admin-blog-img-wrap">
                      <img
                        src={blog.img}
                        alt={blog.title}
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800';
                        }}
                      />
                      <span className="admin-blog-cat-badge">
                        {blog.category}
                      </span>
                    </div>

                    <div className="admin-blog-card-body">
                      <div className="admin-blog-meta-row">
                        <span><Calendar size={13} /> {blog.date}</span>
                        <span><User size={13} /> {blog.author}</span>
                      </div>
                      <h3 className="admin-blog-card-title">{blog.title}</h3>
                      <p className="admin-blog-card-desc">{blog.desc}</p>

                      <div className="admin-blog-card-footer">
                        <button
                          className="admin-mini-btn preview"
                          onClick={() => setSelectedBlogPreview(blog)}
                          title="Read full article preview"
                        >
                          <Eye size={14} /> Read
                        </button>
                        <button
                          className="admin-mini-btn edit"
                          onClick={() => openEditBlogModal(blog)}
                        >
                          <Edit3 size={14} /> Edit
                        </button>
                        <button
                          className="admin-mini-btn delete"
                          onClick={() => confirmDeleteItem('blog', blog)}
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="admin-empty-state" style={{ gridColumn: '1 / -1' }}>
                  <BookOpen size={48} className="admin-empty-icon" />
                  <h3>No blogs found</h3>
                  <p>Try resetting filters or click "Create New Blog" to write an article.</p>
                  <button className="admin-action-btn-primary" onClick={openAddBlogModal} style={{ marginTop: '12px' }}>
                    <Plus size={16} /> Write New Article
                  </button>
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
                    required
                    value={productForm.category}
                    onChange={e => {
                      const cat = categories.find(c => c.id === e.target.value);
                      setProductForm({
                        ...productForm,
                        category: e.target.value,
                        categoryLabel: cat?.name || ''
                      });
                    }}
                  >
                    <option value="">Select Category</option>
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
                    <option value="">Select Formulation Type</option>
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
                  <label className="admin-form-label">Product Overview & Efficacy</label>
                  <textarea
                    className="admin-form-textarea"
                    rows={3}
                    placeholder="Detailed technical overview and advantages..."
                    value={productForm.description}
                    onChange={e => setProductForm({ ...productForm, description: e.target.value })}
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
                <label className="admin-form-label">Category Image (Upload to Cloudinary)</label>
                <div style={{
                  border: '1px dashed rgba(255, 255, 255, 0.2)',
                  borderRadius: '10px',
                  padding: '14px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  {categoryForm.image ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{
                        width: '70px',
                        height: '70px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        background: '#070d18',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        flexShrink: 0
                      }}>
                        <img
                          src={categoryForm.image}
                          alt="Category Preview"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <div style={{ flexGrow: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          {categoryForm.image.includes('cloudinary.com') ? (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              background: 'rgba(16, 185, 129, 0.15)',
                              color: '#10b981',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: 600
                            }}>
                              <CheckCircle2 size={12} /> Stored on Cloudinary
                            </span>
                          ) : (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              background: 'rgba(56, 189, 248, 0.15)',
                              color: '#38bdf8',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: 600
                            }}>
                              <Sparkles size={12} /> Uploads to Cloudinary on Save
                            </span>
                          )}
                        </div>
                        <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8', wordBreak: 'break-all', maxHeight: '34px', overflow: 'hidden' }}>
                          {categoryForm.image.startsWith('data:') ? 'Image selected from device' : categoryForm.image}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCategoryForm({ ...categoryForm, image: '' })}
                        style={{
                          background: 'rgba(239, 68, 68, 0.15)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          color: '#ef4444',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          flexShrink: 0
                        }}
                      >
                        <Trash2 size={13} /> Remove
                      </button>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '10px 0', color: '#94a3b8', fontSize: '12px' }}>
                      <Upload size={22} style={{ color: '#10b981', margin: '0 auto 6px', display: 'block' }} />
                      <span>No image selected. Click 'Choose File' below to pick an image.</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                      id="category-file-input"
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={e => handleImageUpload(e.target.files[0], (val) => setCategoryForm({ ...categoryForm, image: val }))}
                    />
                    <label
                      htmlFor="category-file-input"
                      style={{
                        background: '#10b981',
                        color: '#fff',
                        padding: '7px 16px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Upload size={14} /> {categoryForm.image ? 'Change File' : 'Choose File'}
                    </label>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>
                      PNG, JPG, WebP &bull; Auto-uploads to Cloudinary & saves in MongoDB
                    </span>
                  </div>
                </div>
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
                <button type="submit" disabled={isCategorySaving} className="admin-action-btn-primary">
                  {isCategorySaving ? (
                    <>
                      <Loader2 size={16} className="admin-spin" />
                      <span>Uploading to Cloudinary & Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      <span>Save Category</span>
                    </>
                  )}
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

      {/* ===================== MODAL: ADD / EDIT GALLERY PHOTO ===================== */}
      {(modalMode === 'add-gallery' || modalMode === 'edit-gallery') && (
        <div className="admin-modal-overlay" onClick={() => setModalMode(null)}>
          <div className="admin-modal-content animate-scale-up" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>
                <ImageIcon size={20} color="#10B981" />
                {modalMode === 'add-gallery' ? 'Upload Gallery Photo' : 'Edit Gallery Photo'}
              </h2>
              <button className="admin-modal-close" onClick={() => setModalMode(null)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleGallerySubmit}>
              <div className="admin-form-group">
                <label className="admin-form-label">Photo Title *</label>
                <input
                  type="text"
                  required
                  className="admin-form-input"
                  placeholder="e.g. Precision Spraying"
                  value={galleryForm.title}
                  onChange={e => setGalleryForm({ ...galleryForm, title: e.target.value })}
                />
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-form-label">Category *</label>
                  <select
                    className="admin-form-select"
                    required
                    value={galleryForm.cat}
                    onChange={e => {
                      const c = e.target.value;
                      let tag = '';
                      if (c === 'field') tag = 'Field & Crops';
                      else if (c === 'lab') tag = 'Lab & Research';
                      else if (c === 'products') tag = 'Products';
                      setGalleryForm({ ...galleryForm, cat: c, tag: tag });
                    }}
                  >
                    <option value="">Select Category</option>
                    <option value="field">Field & Crops</option>
                    <option value="lab">Lab & Research</option>
                    <option value="products">Products</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Badge Tag</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    placeholder="e.g. Field & Crops"
                    value={galleryForm.tag}
                    onChange={e => setGalleryForm({ ...galleryForm, tag: e.target.value })}
                  />
                </div>
              </div>

              {/* Photo Upload & Preview */}
              <div className="admin-form-group">
                <label className="admin-form-label">Photo Image * (Upload or Image URL)</label>
                <div style={{
                  border: '1px dashed rgba(255, 255, 255, 0.2)',
                  borderRadius: '10px',
                  padding: '14px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  {galleryForm.src ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        background: '#070d18',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        flexShrink: 0
                      }}>
                        <img
                          src={galleryForm.src}
                          alt="Gallery Preview"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <div style={{ flexGrow: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          {galleryForm.src.includes('cloudinary.com') ? (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              background: 'rgba(16, 185, 129, 0.15)',
                              color: '#10b981',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: 600
                            }}>
                              <CheckCircle2 size={12} /> Stored on Cloudinary
                            </span>
                          ) : (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              background: 'rgba(56, 189, 248, 0.15)',
                              color: '#38bdf8',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: 600
                            }}>
                              Ready for Cloudinary
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => setGalleryForm({ ...galleryForm, src: '' })}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#ef4444',
                            fontSize: '12px',
                            cursor: 'pointer',
                            padding: 0,
                            fontWeight: 600
                          }}
                        >
                          Remove Photo
                        </button>
                      </div>
                    </div>
                  ) : null}

                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <label className="admin-action-btn-secondary" style={{ cursor: 'pointer', margin: 0 }}>
                      <Upload size={14} /> Upload Local Photo
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={e => handleImageUpload(e.target.files[0], (val) => setGalleryForm({ ...galleryForm, src: val }))}
                      />
                    </label>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>
                      PNG, JPG, WebP &bull; Auto-uploads to Cloudinary
                    </span>
                  </div>

                  <input
                    type="text"
                    className="admin-form-input"
                    placeholder="Or paste external image URL (https://...)"
                    value={galleryForm.src}
                    onChange={e => setGalleryForm({ ...galleryForm, src: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Description (Optional)</label>
                <textarea
                  className="admin-form-textarea"
                  rows={2}
                  placeholder="Additional context about this photograph..."
                  value={galleryForm.description}
                  onChange={e => setGalleryForm({ ...galleryForm, description: e.target.value })}
                />
              </div>

              <div className="admin-modal-actions">
                <button type="button" className="admin-modal-cancel-btn" onClick={() => setModalMode(null)}>
                  Cancel
                </button>
                <button type="submit" disabled={isGallerySaving} className="admin-action-btn-primary">
                  {isGallerySaving ? (
                    <>
                      <Loader2 size={16} className="admin-spin" />
                      <span>Uploading to Cloudinary & Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      <span>Save Photo</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== MODAL: ADD / EDIT BLOG ===================== */}
      {(modalMode === 'add-blog' || modalMode === 'edit-blog') && (
        <div className="admin-modal-overlay" onClick={() => setModalMode(null)}>
          <div className="admin-modal-content wide animate-scale-up" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>
                <BookOpen size={20} color="#a855f7" />
                {modalMode === 'add-blog' ? 'Create New Blog Post' : 'Edit Blog Article'}
              </h2>
              <button className="admin-modal-close" onClick={() => setModalMode(null)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleBlogSubmit}>
              <div className="admin-form-grid">
                <div className="admin-form-group full">
                  <label className="admin-form-label">Article Title *</label>
                  <input
                    type="text"
                    required
                    className="admin-form-input"
                    placeholder="e.g. Modern Crop Protection Techniques in Japanese Agrosciences"
                    value={blogForm.title}
                    onChange={e => setBlogForm({ ...blogForm, title: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Category *</label>
                  <select
                    className="admin-form-select"
                    required
                    value={blogForm.category}
                    onChange={e => setBlogForm({ ...blogForm, category: e.target.value })}
                  >
                    <option value="">Select Category</option>
                    <option value="Agriculture">Agriculture</option>
                    <option value="Crop Protection">Crop Protection</option>
                    <option value="Pesticides">Pesticides</option>
                    <option value="Sustainable Farming">Sustainable Farming</option>
                    <option value="Farming Tech">Farming Tech</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Author</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    placeholder="e.g. Shimanzu Agrosciences"
                    value={blogForm.author}
                    onChange={e => setBlogForm({ ...blogForm, author: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Publication Date</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    placeholder="e.g. 12 Apr 2025"
                    value={blogForm.date}
                    onChange={e => setBlogForm({ ...blogForm, date: e.target.value })}
                  />
                </div>

                {/* Cover Image Upload & Preview */}
                <div className="admin-form-group full">
                  <label className="admin-form-label">Cover Image * (Upload or URL)</label>
                  <div style={{
                    border: '1px dashed rgba(255, 255, 255, 0.2)',
                    borderRadius: '10px',
                    padding: '14px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    {blogForm.img ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{
                          width: '100px',
                          height: '70px',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          background: '#070d18',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          flexShrink: 0
                        }}>
                          <img
                            src={blogForm.img}
                            alt="Cover Preview"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                        <div style={{ flexGrow: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            {blogForm.img.includes('cloudinary.com') ? (
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                background: 'rgba(16, 185, 129, 0.15)',
                                color: '#10b981',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                fontSize: '11px',
                                fontWeight: 600
                              }}>
                                <CheckCircle2 size={12} /> Stored on Cloudinary
                              </span>
                            ) : (
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                background: 'rgba(56, 189, 248, 0.15)',
                                color: '#38bdf8',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                fontSize: '11px',
                                fontWeight: 600
                              }}>
                                Ready for Cloudinary
                              </span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => setBlogForm({ ...blogForm, img: '' })}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#ef4444',
                              fontSize: '12px',
                              cursor: 'pointer',
                              padding: 0,
                              fontWeight: 600
                            }}
                          >
                            Remove Image
                          </button>
                        </div>
                      </div>
                    ) : null}

                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <label className="admin-action-btn-secondary" style={{ cursor: 'pointer', margin: 0 }}>
                        <Upload size={14} /> Upload Local Cover
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={e => handleImageUpload(e.target.files[0], (val) => setBlogForm({ ...blogForm, img: val }))}
                        />
                      </label>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>
                        PNG, JPG, WebP &bull; Auto-uploads to Cloudinary
                      </span>
                    </div>

                    <input
                      type="text"
                      className="admin-form-input"
                      placeholder="Or paste external image URL (https://...)"
                      value={blogForm.img}
                      onChange={e => setBlogForm({ ...blogForm, img: e.target.value })}
                    />
                  </div>
                </div>

                <div className="admin-form-group full">
                  <label className="admin-form-label">Short Summary / Excerpt *</label>
                  <textarea
                    className="admin-form-textarea"
                    rows={2}
                    required
                    placeholder="Brief 1-2 sentence overview for the blog cards..."
                    value={blogForm.desc}
                    onChange={e => setBlogForm({ ...blogForm, desc: e.target.value })}
                  />
                </div>

                <div className="admin-form-group full">
                  <label className="admin-form-label">Full Article Content (Paragraphs)</label>
                  <textarea
                    className="admin-form-textarea"
                    rows={6}
                    placeholder="Full article body. Separate paragraphs with an empty line..."
                    value={blogForm.content}
                    onChange={e => setBlogForm({ ...blogForm, content: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-modal-actions">
                <button type="button" className="admin-modal-cancel-btn" onClick={() => setModalMode(null)}>
                  Cancel
                </button>
                <button type="submit" disabled={isBlogSaving} className="admin-action-btn-primary">
                  {isBlogSaving ? (
                    <>
                      <Loader2 size={16} className="admin-spin" />
                      <span>Uploading to Cloudinary & Publishing...</span>
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      <span>Publish Blog</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== MODAL: READ BLOG PREVIEW ===================== */}
      {selectedBlogPreview && (
        <div className="admin-modal-overlay" onClick={() => setSelectedBlogPreview(null)}>
          <div className="admin-modal-content wide animate-scale-up" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2><BookOpen size={20} color="#a855f7" /> Article Preview</h2>
              <button className="admin-modal-close" onClick={() => setSelectedBlogPreview(null)}>
                <X size={20} />
              </button>
            </div>

            <div style={{ maxHeight: '70vh', overflowY: 'auto', paddingRight: '8px' }}>
              {selectedBlogPreview.img && (
                <img
                  src={selectedBlogPreview.img}
                  alt={selectedBlogPreview.title}
                  style={{ width: '100%', height: '260px', objectFit: 'cover', borderRadius: '10px', marginBottom: '16px' }}
                />
              )}
              <div style={{ display: 'flex', gap: '16px', color: '#94a3b8', fontSize: '13px', marginBottom: '12px' }}>
                <span><Calendar size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> {selectedBlogPreview.date}</span>
                <span><User size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> {selectedBlogPreview.author}</span>
                <span style={{ color: '#10b981', fontWeight: 600 }}>{selectedBlogPreview.category}</span>
              </div>
              <h2 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '16px' }}>{selectedBlogPreview.title}</h2>
              <div style={{ color: '#cbd5e1', lineHeight: '1.7', fontSize: '14px' }}>
                {(selectedBlogPreview.content || selectedBlogPreview.desc || '').split('\n').map((p, i) => (
                  <p key={i} style={{ marginBottom: '14px' }}>{p}</p>
                ))}
              </div>
            </div>

            <div className="admin-modal-actions">
              <button
                type="button"
                className="admin-action-btn-primary"
                onClick={() => setSelectedBlogPreview(null)}
              >
                Close Preview
              </button>
            </div>
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
                Are you sure you want to delete <strong>"{deleteConfirmItem.item.name || deleteConfirmItem.item.title || deleteConfirmItem.item.subject}"</strong>?
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
