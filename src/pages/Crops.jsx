import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, Search, Sprout, ShieldCheck, Sparkles, 
  ChevronRight, Package, Layers, CheckCircle2, ChevronDown, SlidersHorizontal, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import QuickViewModal from '../components/QuickViewModal';
import { useDataContext } from '../context/DataContext';
import './Crops.css';

const Crops = () => {
  const { crops: CROPS, products: PRODUCTS, categories: CATEGORIES } = useDataContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const cropParam = searchParams.get('crop');

  const [selectedCropId, setSelectedCropId] = useState(cropParam || null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFormulations, setSelectedFormulations] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cropSearchQuery, setCropSearchQuery] = useState('');

  // Sync state with URL params
  useEffect(() => {
    if (cropParam) {
      const exists = CROPS.some(c => c.id === cropParam);
      setSelectedCropId(exists ? cropParam : null);
    } else {
      setSelectedCropId(null);
    }
  }, [cropParam, CROPS]);

  const handleSelectCrop = (cropId) => {
    setSelectedCropId(cropId);
    setSelectedCategory('all');
    setSelectedFormulations([]);
    setSearchParams({ crop: cropId });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCrops = () => {
    setSelectedCropId(null);
    setSelectedCategory('all');
    setSelectedFormulations([]);
    searchParams.delete('crop');
    setSearchParams(searchParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeCropData = useMemo(() => {
    return CROPS.find(c => c.id === selectedCropId) || null;
  }, [selectedCropId, CROPS]);

  // Helper to count how many formulations are registered for any crop
  const getProductCountForCrop = (crop) => {
    if (!crop) return 0;
    const key = (crop.cropKey || crop.name || '').toLowerCase();
    const nameLower = (crop.name || '').toLowerCase();
    return PRODUCTS.filter(p => 
      (p.crops || []).some(c => {
        const cLower = c.toLowerCase();
        return cLower.includes(key) || nameLower.includes(cLower) || cLower === 'all crops';
      })
    ).length;
  };

  // Formulations available for the currently selected crop
  const relevantProducts = useMemo(() => {
    if (!activeCropData) return [];

    const cropKey = (activeCropData.cropKey || activeCropData.name || '').toLowerCase();
    const nameLower = (activeCropData.name || '').toLowerCase();

    return PRODUCTS.filter(product => {
      // 1. Crop matching
      const matchesCrop = (product.crops || []).some(c => {
        const cLower = c.toLowerCase();
        return cLower.includes(cropKey) || nameLower.includes(cLower) || cLower === 'all crops';
      });

      // 2. Category filter
      const matchesCat = selectedCategory === 'all' || product.category === selectedCategory;

      // 3. Formulation filter
      const matchesForm = selectedFormulations.length === 0 || 
        selectedFormulations.includes(product.formulation);

      return matchesCrop && matchesCat && matchesForm;
    });
  }, [activeCropData, selectedCategory, selectedFormulations, PRODUCTS]);

  // Available formulation codes for the active crop scope
  const availableFormulations = useMemo(() => {
    if (!activeCropData) return [];
    const cropKey = (activeCropData.cropKey || activeCropData.name || '').toLowerCase();
    const nameLower = (activeCropData.name || '').toLowerCase();

    const cropProducts = PRODUCTS.filter(product => 
      (product.crops || []).some(c => {
        const cLower = c.toLowerCase();
        return cLower.includes(cropKey) || nameLower.includes(cLower) || cLower === 'all crops';
      })
    );
    const list = cropProducts.map(p => p.formulation);
    return Array.from(new Set(list)).filter(Boolean).sort();
  }, [activeCropData, PRODUCTS]);

  const toggleFormulation = (form) => {
    setSelectedFormulations(prev => 
      prev.includes(form) ? prev.filter(f => f !== form) : [...prev, form]
    );
  };

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedFormulations([]);
  };

  const hasActiveFilters = selectedCategory !== 'all' || selectedFormulations.length > 0;

  // Filter crops list for main view based on search query
  const filteredCropsList = useMemo(() => {
    if (!cropSearchQuery.trim()) return CROPS;
    const q = cropSearchQuery.toLowerCase().trim();
    return CROPS.filter(crop => 
      crop.name.toLowerCase().includes(q) ||
      (crop.cropKey && crop.cropKey.toLowerCase().includes(q)) ||
      (crop.description && crop.description.toLowerCase().includes(q))
    );
  }, [CROPS, cropSearchQuery]);

  return (
    <div className="fmc-crops-page">
      {/* 
        ========================================================================
        CASE 1: NO CROP SELECTED -> SHOW MAIN CROPS CATALOG
        ========================================================================
      */}
      {!selectedCropId && (
        <>
          {/* Main Crops Hero Header */}
          <section className="crops-main-hero">
            <div className="crops-hero-ambient-glow" />
            <div className="container crops-main-hero-container">
              <motion.div 
                className="crops-hero-content-wrap"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="crops-badge-pill">
                  <Sprout size={14} className="crops-badge-icon" />
                  <span>JAPANESE AGRONOMIC EXCELLENCE</span>
                </div>
                <h1 className="crops-hero-title">Crop Protection Portfolio</h1>
                <p className="crops-hero-subtitle">
                  Explore tailored Japanese agrochemical formulations engineered to defend key field, horticulture, 
                  and plantation crops against devastating pests, invasive weeds, and fungal pathogens.
                </p>

                {/* Instant Crop Search Bar */}
                <div className="crops-search-bar-wrap">
                  <Search size={18} className="crops-search-icon" />
                  <input
                    type="text"
                    className="crops-search-input"
                    placeholder="Search crop (e.g. Cotton, Grapes, Rice, Corn, Citrus, Wheat)..."
                    value={cropSearchQuery}
                    onChange={(e) => setCropSearchQuery(e.target.value)}
                  />
                  {cropSearchQuery && (
                    <button 
                      className="crops-search-clear-btn" 
                      onClick={() => setCropSearchQuery('')}
                      aria-label="Clear search"
                    >
                      <X size={16} />
                    </button>
                  )}
                  <div className="crops-count-badge">
                    {filteredCropsList.length} Crops Available
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Crops Grid Section */}
          <section className="crop-selection-section">
            <div className="container">
              <div className="crops-section-header-bar">
                <div className="crops-section-title-wrap">
                  <span className="crops-section-uptitle">AGRONOMIC DIRECTORY</span>
                  <h2 className="crops-section-title">Select a Crop to Explore Formulations</h2>
                </div>
                <p className="crops-section-lead">
                  Click on any registered crop below to inspect customized pest management recommendations, active ingredient formulations, and application guides.
                </p>
              </div>

              {filteredCropsList.length > 0 ? (
                <div className="crop-cards-grid">
                  {filteredCropsList.map((crop, index) => {
                    const count = getProductCountForCrop(crop);
                    return (
                      <motion.div
                        key={crop.id}
                        className="crop-card"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: Math.min(index * 0.03, 0.3) }}
                        onClick={() => handleSelectCrop(crop.id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleSelectCrop(crop.id);
                          }
                        }}
                        aria-label={`Select crop ${crop.name}`}
                      >
                        <div className="crop-card-img-wrap">
                          <img 
                            src={crop.image} 
                            alt={crop.name} 
                            className="crop-circle-thumb" 
                            loading="lazy" 
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=300&q=80';
                            }}
                          />
                        </div>
                        <div className="crop-card-details">
                          <div className="crop-card-name-row">
                            <h3 className="crop-card-name">{crop.name}</h3>
                            <span className="crop-card-count-badge">
                              {count} {count === 1 ? 'Solution' : 'Solutions'}
                            </span>
                          </div>
                          <p className="crop-card-desc-snippet">{crop.description}</p>
                        </div>
                        <div className="crop-card-arrow">
                          <ChevronRight size={18} />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="crops-no-results">
                  <p>No crops match "<strong>{cropSearchQuery}</strong>"</p>
                  <button 
                    className="crops-reset-search-btn"
                    onClick={() => setCropSearchQuery('')}
                  >
                    View All {CROPS.length} Crops
                  </button>
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {/* 
        ========================================================================
        CASE 2: CROP IS SELECTED -> SHOW PREMIUM DEDICATED CROP DETAIL VIEW
        ========================================================================
      */}
      {selectedCropId && activeCropData && (
        <div className="crop-detail-view-wrap">
          {/* Dedicated Crop Hero Showcase */}
          <section className="crop-detail-hero">
            <div className="crop-detail-hero-ambient" />
            <div className="container crop-detail-hero-container">
              {/* Top Navigation Row */}
              <div className="crop-detail-nav-row">
                <button 
                  className="crop-back-pill-btn" 
                  onClick={handleBackToCrops}
                  aria-label="Back to all crops"
                >
                  <ArrowLeft size={16} />
                  <span>Back to Crop Selection</span>
                </button>
              </div>

              {/* Crop Hero Card Banner */}
              <div className="crop-hero-grid">
                {/* Left: Info & Agronomic Summary */}
                <motion.div 
                  className="crop-hero-info"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="crop-hero-badge">
                    <Sprout size={14} />
                    <span>TARGETED CROP PROTECTION PROFILE</span>
                  </div>

                  <h1 className="crop-hero-main-title">{activeCropData.name}</h1>

                  <p className="crop-hero-main-desc">
                    {activeCropData.description}
                  </p>

                  {/* Highlights Grid */}
                  <div className="crop-highlights-grid">
                    <div className="crop-highlight-item">
                      <div className="crop-highlight-icon-wrap">
                        <Package size={18} color="#d4af37" />
                      </div>
                      <div className="crop-highlight-text">
                        <span className="crop-highlight-val">{relevantProducts.length}</span>
                        <span className="crop-highlight-label">Formulations Ready</span>
                      </div>
                    </div>

                    <div className="crop-highlight-item">
                      <div className="crop-highlight-icon-wrap">
                        <ShieldCheck size={18} color="#10b981" />
                      </div>
                      <div className="crop-highlight-text">
                        <span className="crop-highlight-val">Broad Spectrum</span>
                        <span className="crop-highlight-label">Pest & Fungus Control</span>
                      </div>
                    </div>

                    <div className="crop-highlight-item">
                      <div className="crop-highlight-icon-wrap">
                        <Sparkles size={18} color="#38bdf8" />
                      </div>
                      <div className="crop-highlight-text">
                        <span className="crop-highlight-val">Japanese Tech</span>
                        <span className="crop-highlight-label">Certified Efficacy</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Right: Crop Visual Card */}
                <motion.div 
                  className="crop-hero-visual-card"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <div className="crop-visual-frame">
                    <img 
                      src={activeCropData.image} 
                      alt={activeCropData.name} 
                      className="crop-visual-img"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                    <div className="crop-visual-overlay">
                      <span className="crop-visual-tag">REGISTERED SPECIMEN</span>
                      <h4 className="crop-visual-title">{activeCropData.name}</h4>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Formulations Catalog for this Crop */}
          <section className="crop-relevant-products-section">
            <div className="container">
              {/* Section Header */}
              <div className="crop-products-section-header">
                <div>
                  <div className="crop-products-badge-row">
                    <span className="crop-gold-dot" />
                    <span className="crop-products-badge">RECOMMENDED SOLUTIONS</span>
                  </div>
                  <h2 className="crop-products-title">
                    Formulations for {activeCropData.name}
                  </h2>
                  <p className="crop-products-subtitle">
                    Select from our tested portfolio of herbicides, insecticides, and fungicides approved for {activeCropData.name} agronomy.
                  </p>
                </div>
              </div>

              {/* 2-Column Catalog Layout */}
              <div className="fmc-layout-columns">
                {/* Left Filter Sidebar */}
                <FilterSidebar 
                  categories={CATEGORIES}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                  formulations={availableFormulations}
                  selectedFormulations={selectedFormulations}
                  onToggleFormulation={toggleFormulation}
                  onResetFilters={resetFilters}
                  hasActiveFilters={hasActiveFilters}
                />

                {/* Right Results Grid */}
                <div className="fmc-results-area">
                  <div className="fmc-results-counter-bar">
                    <span className="fmc-results-counter-text">
                      DISPLAYING {relevantProducts.length} {relevantProducts.length === 1 ? 'PRODUCT' : 'PRODUCTS'} FOR {activeCropData.name.toUpperCase()}
                    </span>
                    {hasActiveFilters && (
                      <button className="crop-quick-reset-btn" onClick={resetFilters}>
                        Reset Filters
                      </button>
                    )}
                  </div>

                  {relevantProducts.length > 0 ? (
                    <div className="fmc-grid-3col">
                      {relevantProducts.map(product => (
                        <ProductCard 
                          key={product.id}
                          product={product}
                          onViewClick={setSelectedProduct}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="fmc-empty-box">
                      <div className="fmc-empty-icon-wrap">
                        <Package size={40} color="#94a3b8" />
                      </div>
                      <h3 className="fmc-empty-title">No products match current filter</h3>
                      <p>Try switching categories or clearing formulation filters on the left.</p>
                      <button 
                        className="fmc-back-btn" 
                        style={{ marginTop: '16px' }}
                        onClick={resetFilters}
                      >
                        Reset All Filters
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
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

export default Crops;
