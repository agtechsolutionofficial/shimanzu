import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import ProductCategoriesGrid from '../components/ProductCategoriesGrid';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import QuickViewModal from '../components/QuickViewModal';
import { useDataContext } from '../context/DataContext';
import './Products.css';

const Products = () => {
  const { categories: CATEGORIES, products: PRODUCTS, isSupabaseLoading } = useDataContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');

  // Active Category (default 'all' shows all products)
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'all');
  const [selectedFormulations, setSelectedFormulations] = useState([]);
  const [selectedCrops, setSelectedCrops] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCategoryCards, setShowCategoryCards] = useState(!categoryParam);

  // Sync state with URL params
  useEffect(() => {
    if (categoryParam) {
      const exists = CATEGORIES.some(c => c.id === categoryParam);
      setSelectedCategory(exists ? categoryParam : 'all');
    } else {
      setSelectedCategory('all');
    }
  }, [categoryParam, CATEGORIES]);

  const handleSelectCategory = (catId) => {
    setSelectedCategory(catId);
    setSelectedFormulations([]);
    setSelectedCrops([]);
    if (catId === 'all') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: catId });
    }
  };

  const handleBackToAllCategories = () => {
    handleSelectCategory('all');
  };

  const activeCategoryData = useMemo(() => {
    if (selectedCategory === 'all') return null;
    return CATEGORIES.find(c => c.id === selectedCategory) || null;
  }, [selectedCategory, CATEGORIES]);

  const toggleFormulation = (form) => {
    setSelectedFormulations(prev => 
      prev.includes(form) ? prev.filter(f => f !== form) : [...prev, form]
    );
  };

  const toggleCrop = (crop) => {
    setSelectedCrops(prev => 
      prev.includes(crop) ? prev.filter(c => c !== crop) : [...prev, crop]
    );
  };

  const resetFilters = () => {
    setSelectedFormulations([]);
    setSelectedCrops([]);
    setSearchQuery('');
  };

  // Available formulations for current scope
  const availableFormulations = useMemo(() => {
    const list = PRODUCTS
      .filter(p => selectedCategory === 'all' || p.category === selectedCategory)
      .map(p => p.formulation);
    return Array.from(new Set(list)).filter(Boolean).sort();
  }, [PRODUCTS, selectedCategory]);

  // Available crops
  const availableCrops = useMemo(() => {
    const set = new Set();
    PRODUCTS
      .filter(p => selectedCategory === 'all' || p.category === selectedCategory)
      .forEach(p => (p.crops || []).forEach(c => set.add(c)));
    return Array.from(set).sort();
  }, [PRODUCTS, selectedCategory]);

  // Filtered products list (matches category, formulation, crops, and search query)
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(product => {
      // Category match
      const matchCat = selectedCategory === 'all' || product.category === selectedCategory;

      // Formulation match
      const matchForm = selectedFormulations.length === 0 || 
        selectedFormulations.includes(product.formulation);

      // Crop match
      const matchCrop = selectedCrops.length === 0 || 
        (product.crops && product.crops.some(c => selectedCrops.includes(c)));

      // Search query match
      const q = searchQuery.trim().toLowerCase();
      const matchSearch = !q || (
        product.name.toLowerCase().includes(q) ||
        (product.chemical && product.chemical.toLowerCase().includes(q)) ||
        (product.category && product.category.toLowerCase().includes(q)) ||
        (product.crops && product.crops.some(c => c.toLowerCase().includes(q)))
      );

      return matchCat && matchForm && matchCrop && matchSearch;
    });
  }, [PRODUCTS, selectedCategory, selectedFormulations, selectedCrops, searchQuery]);

  const hasActiveFilters = selectedFormulations.length > 0 || selectedCrops.length > 0 || !!searchQuery.trim();

  return (
    <div className="fmc-products-page">
      {/* Header section matching brand design */}
      <section className="fmc-type-header-section">
        <div className="container">
          <div className="fmc-type-nav-bar">
            <div className="fmc-product-type-label-wrap">
              <span className="fmc-product-type-label">
                {selectedCategory === 'all' ? 'PRODUCT PORTFOLIO' : 'PRODUCT TYPE'}
              </span>
              <div className="fmc-product-type-line" />
            </div>

            <div className="fmc-header-nav-actions">
              {selectedCategory !== 'all' ? (
                <button 
                  type="button"
                  className="fmc-back-btn" 
                  onClick={handleBackToAllCategories}
                >
                  <ArrowLeft size={14} /> All Products
                </button>
              ) : (
                <button
                  type="button"
                  className={`fmc-category-toggle-btn ${showCategoryCards ? 'active' : ''}`}
                  onClick={() => setShowCategoryCards(prev => !prev)}
                >
                  {showCategoryCards ? '✕ Hide Category Cards' : '▦ Explore Category Cards'}
                </button>
              )}
            </div>
          </div>

          <h1 className="fmc-type-title">
            {activeCategoryData ? (activeCategoryData.shortName || activeCategoryData.name) : 'All Products'}
          </h1>
          <p className="fmc-type-subtitle">
            {activeCategoryData 
              ? activeCategoryData.description 
              : 'Explore our complete portfolio of advanced crop protection, specialty chemical formulations, and high-performance agricultural solutions.'}
          </p>
        </div>
      </section>

      {/* Optional Category Cards Showcase (when expanded by user) */}
      {selectedCategory === 'all' && showCategoryCards && (
        <section className="fmc-expanded-categories">
          <ProductCategoriesGrid 
            selectedCategoryId={selectedCategory} 
            onSelectCategory={(catId) => {
              handleSelectCategory(catId);
              setShowCategoryCards(false);
            }} 
          />
        </section>
      )}

      {/* Main 2-column Catalog Layout */}
      {!showCategoryCards && (
        <section className="fmc-main-layout">
          <div className="container">
          <div className="fmc-layout-columns">
            {/* Left Filter Sidebar */}
            <FilterSidebar 
              categories={CATEGORIES}
              selectedCategory={selectedCategory}
              onSelectCategory={handleSelectCategory}
              formulations={availableFormulations}
              selectedFormulations={selectedFormulations}
              onToggleFormulation={toggleFormulation}
              crops={availableCrops}
              selectedCrops={selectedCrops}
              onToggleCrop={toggleCrop}
              onResetFilters={resetFilters}
              hasActiveFilters={hasActiveFilters}
            />

            {/* Right Results Area */}
            <div className="fmc-results-area">
              {/* Category Pills Quick Selector */}
              <div className="fmc-category-pills-bar">
                <button 
                  type="button"
                  className={`fmc-cat-pill ${selectedCategory === 'all' ? 'active' : ''}`}
                  onClick={() => handleSelectCategory('all')}
                >
                  All Types ({PRODUCTS.length})
                </button>
                {CATEGORIES.map(cat => {
                  const count = PRODUCTS.filter(p => p.category === cat.id).length;
                  return (
                    <button 
                      key={cat.id}
                      type="button"
                      className={`fmc-cat-pill ${selectedCategory === cat.id ? 'active' : ''}`}
                      onClick={() => handleSelectCategory(cat.id)}
                    >
                      {cat.shortName || cat.name} ({count})
                    </button>
                  );
                })}
              </div>

              {/* Results Counter & Search Input */}
              <div className="fmc-results-meta-bar">
                <div className="fmc-results-counter">
                  DISPLAYING 1-{filteredProducts.length} OF {filteredProducts.length} RESULTS
                </div>

                <div className="fmc-results-search-wrap">
                  <Search size={14} className="fmc-results-search-icon" />
                  <input 
                    type="text" 
                    placeholder="Search products, chemical, crop..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="fmc-results-search-input"
                  />
                  {searchQuery && (
                    <button 
                      type="button" 
                      className="fmc-results-search-clear" 
                      onClick={() => setSearchQuery('')}
                      aria-label="Clear search"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

              {/* Products Grid */}
              {isSupabaseLoading && PRODUCTS.length === 0 ? (
                <div className="fmc-empty-box" style={{ padding: '60px 20px' }}>
                  <div style={{ display: 'inline-block', width: '36px', height: '36px', border: '3px solid #2e7d32', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginBottom: '16px' }} />
                  <h3 className="fmc-empty-title">Loading Products Catalog...</h3>
                  <p>Fetching dynamic products directly from database.</p>
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="fmc-grid-3col">
                  {filteredProducts.map(product => (
                    <ProductCard 
                      key={product.id}
                      product={product}
                      onViewClick={setSelectedProduct}
                    />
                  ))}
                </div>
              ) : (
                <div className="fmc-empty-box">
                  <h3 className="fmc-empty-title">No products match this filter</h3>
                  <p>Try clearing your search query or filters on the left.</p>
                  <button 
                    type="button"
                    className="fmc-back-btn" 
                    style={{ marginTop: '14px', background: '#2e7d32', borderColor: '#2e7d32', color: '#fff' }}
                    onClick={resetFilters}
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Quick View Modal */}
      {selectedProduct && (
        <QuickViewModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
    </div>
  );
};

export default Products;
