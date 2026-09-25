import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
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

  // Sync state with URL params
  useEffect(() => {
    if (cropParam) {
      const exists = CROPS.some(c => c.id === cropParam);
      setSelectedCropId(exists ? cropParam : null);
    } else {
      setSelectedCropId(null);
    }
  }, [cropParam]);

  const handleSelectCrop = (cropId) => {
    setSelectedCropId(cropId);
    setSearchParams({ crop: cropId });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCrops = () => {
    setSelectedCropId(null);
    searchParams.delete('crop');
    setSearchParams(searchParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeCropData = useMemo(() => {
    return CROPS.find(c => c.id === selectedCropId) || null;
  }, [selectedCropId]);

  // Formulations available for this crop
  const relevantProducts = useMemo(() => {
    if (!activeCropData) return [];

    return PRODUCTS.filter(product => {
      // Crop match
      const cropKey = activeCropData.cropKey || activeCropData.name;
      const matchesCrop = (product.crops || []).some(c => 
        c.toLowerCase().includes(cropKey.toLowerCase()) || 
        activeCropData.name.toLowerCase().includes(c.toLowerCase()) ||
        c === 'All Crops'
      );

      // Category filter
      const matchesCat = selectedCategory === 'all' || product.category === selectedCategory;

      // Formulation filter
      const matchesForm = selectedFormulations.length === 0 || 
        selectedFormulations.includes(product.formulation);

      return matchesCrop && matchesCat && matchesForm;
    });
  }, [activeCropData, selectedCategory, selectedFormulations]);

  const availableFormulations = useMemo(() => {
    const list = relevantProducts.map(p => p.formulation);
    return Array.from(new Set(list)).filter(Boolean).sort();
  }, [relevantProducts]);

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

  return (
    <div className="fmc-crops-page">
      {/* 1. Hero Section matching Image 3 */}
      <section className="crops-hero-section">
        <div className="container">
          <h1 className="crops-hero-title">CROPS</h1>
          <p className="crops-hero-subtitle">
            Shimanzu is focused on delivering innovative and sustainable solutions to protect your crops.
          </p>
        </div>
      </section>

      {/* 
        Case 1: No crop selected -> Show full 3-column CROP SELECTION grid matching Image 3 & 4
      */}
      {!selectedCropId && (
        <section className="crop-selection-section">
          <div className="container">
            {/* Header intro matching Image 3 */}
            <div className="crop-selection-header">
              <div className="crop-selection-heading-wrap">
                <div className="crop-selection-bar" />
                <h2 className="crop-selection-title">CROP SELECTION</h2>
              </div>
              <p className="crop-selection-text">
                For more than 120 years, Shimanzu has been a major contributor to the success of agriculture. 
                Our highly targeted, broad-spectrum insecticides, herbicides and fungicides enable growers to raise 
                more high quality yield from every acre. Growers who demand the highest level of results in agriculture 
                count on our innovative chemistries for their pest challenges on their grain, oil, nut, fruit and vegetable crops.
              </p>
            </div>

            {/* 3-Column Crops Grid matching Image 3 & 4 */}
            <div className="crop-cards-grid">
              {CROPS.map(crop => (
                <div 
                  key={crop.id} 
                  className="crop-card"
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
                  <h3 className="crop-card-name">{crop.name}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 
        Case 2: A Crop is selected (e.g. Grapes) -> Show RELEVANT PRODUCTS matching Image 5
      */}
      {selectedCropId && activeCropData && (
        <>
          {/* Crop Header Section matching Image 5 */}
          <section className="crop-detail-header-section">
            <div className="container">
              <div className="crop-detail-nav">
                <h1 className="crop-detail-title">{activeCropData.name}</h1>
                <button 
                  className="fmc-back-btn" 
                  onClick={handleBackToCrops}
                >
                  <ArrowLeft size={14} /> Back to Crop Selection
                </button>
              </div>
              <p className="crop-detail-description">{activeCropData.description}</p>
            </div>
          </section>

          {/* Relevant Products Section matching Image 5 */}
          <section className="crop-relevant-products-section">
            <div className="container">
              <h2 className="crop-relevant-title">RELEVANT PRODUCTS</h2>

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
                  <div className="fmc-results-counter">
                    DISPLAYING 1-{relevantProducts.length} OF {relevantProducts.length} RESULTS
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
                      <h3 className="fmc-empty-title">No products found for this filter</h3>
                      <p>Try resetting the category or formulation filters on the left.</p>
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

export default Crops;
