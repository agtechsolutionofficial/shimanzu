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
  const { categories: CATEGORIES, products: PRODUCTS } = useDataContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');

  // Active Category (default 'all' shows the categories grid)
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'all');
  const [selectedFormulations, setSelectedFormulations] = useState([]);
  const [selectedCrops, setSelectedCrops] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchAllQuery, setSearchAllQuery] = useState('');

  // Products filtered by all-search query
  const searchedAllProducts = useMemo(() => {
    if (!searchAllQuery.trim()) return PRODUCTS;
    const q = searchAllQuery.toLowerCase();
    return PRODUCTS.filter(p => 
      p.name.toLowerCase().includes(q) ||
      (p.chemical && p.chemical.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q)) ||
      (p.crops && p.crops.some(c => c.toLowerCase().includes(q)))
    );
  }, [PRODUCTS, searchAllQuery]);

  // Sync state with URL params
  useEffect(() => {
    if (categoryParam) {
      const exists = CATEGORIES.some(c => c.id === categoryParam);
      setSelectedCategory(exists ? categoryParam : 'all');
    } else {
      setSelectedCategory('all');
    }
  }, [categoryParam]);

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToAllCategories = () => {
    setSelectedCategory('all');
    setSelectedFormulations([]);
    setSelectedCrops([]);
    searchParams.delete('category');
    setSearchParams(searchParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeCategoryData = useMemo(() => {
    return CATEGORIES.find(c => c.id === selectedCategory) || null;
  }, [selectedCategory]);

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
  };

  // Available formulations for current scope
  const availableFormulations = useMemo(() => {
    const list = PRODUCTS
      .filter(p => selectedCategory === 'all' || p.category === selectedCategory)
      .map(p => p.formulation);
    return Array.from(new Set(list)).filter(Boolean).sort();
  }, [selectedCategory]);

  // Available crops
  const availableCrops = useMemo(() => {
    const set = new Set();
    PRODUCTS
      .filter(p => selectedCategory === 'all' || p.category === selectedCategory)
      .forEach(p => (p.crops || []).forEach(c => set.add(c)));
    return Array.from(set).sort();
  }, [selectedCategory]);

  // Filtered products list
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

      return matchCat && matchForm && matchCrop;
    });
  }, [selectedCategory, selectedFormulations, selectedCrops]);

  const hasActiveFilters = selectedFormulations.length > 0 || selectedCrops.length > 0;

  return (
    <div className="fmc-products-page light-theme">
      {/* 
        Case 1: When user is viewing All Categories, 
        show Categories Grid + Full Product Portfolio Showcase!
      */}
      {selectedCategory === 'all' && (
        <>
          <ProductCategoriesGrid 
            selectedCategoryId={selectedCategory} 
            onSelectCategory={handleSelectCategory} 
          />


        </>
      )}

      {/* 
        Case 2: When a specific category is selected (e.g. Harvest Aids),
        render the EXACT layout from Image 2 (no dark green banner, clean white layout)!
      */}
      {selectedCategory !== 'all' && activeCategoryData && (
        <>
          {/* Header section matching Image 2 */}
          <section className="fmc-type-header-section">
            <div className="container">
              <div className="fmc-type-nav-bar">
                <div className="fmc-product-type-label-wrap">
                  <span className="fmc-product-type-label">PRODUCT TYPE</span>
                  <div className="fmc-product-type-line" />
                </div>
                <button 
                  className="fmc-back-btn" 
                  onClick={handleBackToAllCategories}
                >
                  <ArrowLeft size={14} /> All Categories
                </button>
              </div>

              <h1 className="fmc-type-title">{activeCategoryData.shortName || activeCategoryData.name}</h1>
              <p className="fmc-type-subtitle">{activeCategoryData.description}</p>
            </div>
          </section>

          {/* Main 2-column layout matching Image 2 */}
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
                  <div className="fmc-results-counter">
                    DISPLAYING 1-{filteredProducts.length} OF {filteredProducts.length} RESULTS
                  </div>

                  {filteredProducts.length > 0 ? (
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
                      <p>Try clearing some filters on the left.</p>
                      <button 
                        className="fmc-back-btn" 
                        style={{ marginTop: '14px' }}
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
        </>
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
