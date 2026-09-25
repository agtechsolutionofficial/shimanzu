import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useDataContext } from '../context/DataContext';
import './ProductCategoriesGrid.css';

const ProductCategoriesGrid = ({ categories: propCategories, selectedCategoryId, onSelectCategory }) => {
  const { categories: contextCategories } = useDataContext();
  const displayCategories = propCategories || contextCategories;
  return (
    <section className="categories-section" id="product-categories-grid">
      <div className="categories-container">
        {/* Header matching user's reference image */}
        <div className="categories-header">
          <h2 className="categories-main-title">PRODUCT CATEGORIES</h2>
          <span className="categories-subtitle">Select a product category.</span>
          <div className="categories-header-line" />
        </div>

        {/* 2-Column Responsive Grid */}
        <div className="categories-grid">
          {displayCategories.map((cat, idx) => {
            const isSelected = selectedCategoryId === cat.id;

            return (
              <motion.div
                key={cat.id}
                className={`category-card ${isSelected ? 'is-active' : ''}`}
                onClick={() => onSelectCategory(cat.id)}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.35, delay: idx * 0.06 }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectCategory(cat.id);
                  }
                }}
                aria-label={`Select category ${cat.name}`}
              >
                {/* Left colored stripe */}
                <div
                  className="category-stripe"
                  style={{ backgroundColor: cat.accentColor }}
                />

                {/* Left crop image */}
                <div className="category-image-wrap">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="category-card-img"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                </div>

                {/* Right content */}
                <div className="category-content">
                  <div>
                    <h3 className="category-title">{cat.name}</h3>
                    <p className="category-description">{cat.description}</p>
                  </div>

                  <div className="category-card-footer">
                    <span className="category-item-count">
                      {cat.productCount} Products
                    </span>
                    <div className="category-arrow-btn" aria-hidden="true">
                      <ChevronRight />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductCategoriesGrid;
