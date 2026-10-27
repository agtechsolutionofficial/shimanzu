import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import ProductCategoriesGrid from '../components/ProductCategoriesGrid';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import QuickViewModal from '../components/QuickViewModal';
import { useDataContext } from '../context/DataContext';
import './Products.css';

const Products = ({ division = null }) => {
  const { categories: CATEGORIES, products: PRODUCTS, isSupabaseLoading } = useDataContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const divisionProducts = useMemo(
    () => {
      if (!division) return PRODUCTS;
      if (division === 'chemical') {
        return PRODUCTS.filter(product => product.category === 'chemicals');
      }
      if (division === 'food') {
        return PRODUCTS.filter(product => (
          product.division === 'food' || product.category === 'food'
        ));
      }
      return PRODUCTS.filter(product => product.division === division);
    },
    [PRODUCTS, division]
  );
  // The Chemicals category is represented by the dedicated Chemical Division page.
  // Keep it available within that division while omitting it from the all-products view.
  const visibleCategories = useMemo(
    () => {
      const categories = division
        ? CATEGORIES.filter(category => divisionProducts.some(product => product.category === category.id))
        : CATEGORIES.filter(category => category.id !== 'chemicals');
      return categories;
    },
    [CATEGORIES, division, divisionProducts]
  );

  // Active Category (default 'all' shows all products)
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'all');
  const [selectedFormulations, setSelectedFormulations] = useState([]);
  const [selectedCrops, setSelectedCrops] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCategoryCards, setShowCategoryCards] = useState(!categoryParam && !division);

  // Sync state with URL params
  useEffect(() => {
    if (categoryParam) {
      const exists = visibleCategories.some(c => c.id === categoryParam);
      setSelectedCategory(exists ? categoryParam : 'all');
    } else {
      setSelectedCategory('all');
    }
  }, [categoryParam, visibleCategories]);

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
    return visibleCategories.find(c => c.id === selectedCategory) || null;
  }, [selectedCategory, visibleCategories]);

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
    const list = divisionProducts
      .filter(p => selectedCategory === 'all' || p.category === selectedCategory)
      .map(p => p.formulation);
    return Array.from(new Set(list)).filter(Boolean).sort();
  }, [divisionProducts, selectedCategory]);

  // Available crops
  const availableCrops = useMemo(() => {
    const set = new Set();
    divisionProducts
      .filter(p => selectedCategory === 'all' || p.category === selectedCategory)
      .forEach(p => (p.crops || []).forEach(c => set.add(c)));
    return Array.from(set).sort();
  }, [divisionProducts, selectedCategory]);

  // Filtered products list (matches category, formulation, crops, and search query)
  const filteredProducts = useMemo(() => {
    return divisionProducts.filter(product => {
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
  }, [divisionProducts, selectedCategory, selectedFormulations, selectedCrops, searchQuery]);

  const hasActiveFilters = selectedFormulations.length > 0 || selectedCrops.length > 0 || !!searchQuery.trim();

  return (
    <div className="fmc-products-page">
      {/* Header section matching brand design */}
      <section className="fmc-type-header-section">
        <div className="container">
          <div className="fmc-type-nav-bar">
            <div className="fmc-product-type-label-wrap">
              <span className="fmc-product-type-label">
            {division ? `${division.toUpperCase()} DIVISION` : (selectedCategory === 'all' ? 'PRODUCT PORTFOLIO' : 'PRODUCT TYPE')}
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
              ) : !division ? (
                <button
                  type="button"
                  className={`fmc-category-toggle-btn ${showCategoryCards ? 'active' : ''}`}
                  onClick={() => setShowCategoryCards(prev => !prev)}
                >
                  {showCategoryCards ? '✕ Hide Category Cards' : '▦ Explore Category Cards'}
                </button>
              ) : null}
            </div>
          </div>

          <h1 className="fmc-type-title">
            {activeCategoryData ? (activeCategoryData.shortName || activeCategoryData.name) : (division === 'food' ? 'Food Division' : division === 'chemical' ? 'Chemical Division' : 'All Products')}
          </h1>
          <p className="fmc-type-subtitle">
            {activeCategoryData 
              ? activeCategoryData.description 
              : division === 'food' ? 'Explore our food division products and formulations.' : division === 'chemical' ? 'Explore our complete portfolio of advanced crop protection and specialty chemical formulations.' : 'Explore our complete portfolio of advanced crop protection, specialty chemical formulations, and high-performance agricultural solutions.'}
          </p>
        </div>
      </section>

      {/* Optional Category Cards Showcase (when expanded by user) */}
      {selectedCategory === 'all' && showCategoryCards && (
        <section className="fmc-expanded-categories">
          <ProductCategoriesGrid 
            categories={visibleCategories}
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
            {/* Keep division pages focused on their products without the catalog filter panel. */}
            {!division && (
              <FilterSidebar 
                categories={visibleCategories}
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
            )}

            {/* Right Results Area */}
            <div className="fmc-results-area">
              {/* Category pills are only needed on the all-products catalog. */}
              {!division && (
                <div className="fmc-category-pills-bar">
                  <button 
                    type="button"
                    className={`fmc-cat-pill ${selectedCategory === 'all' ? 'active' : ''}`}
                    onClick={() => handleSelectCategory('all')}
                  >
                    All Types
                  </button>
                  {visibleCategories.map(cat => {
                    const count = divisionProducts.filter(p => p.category === cat.id).length;
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
              )}

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
