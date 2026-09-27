import React from 'react';
import { motion } from 'framer-motion';
import { FlaskConical, Leaf, Bug, Sprout, Scissors, Beaker } from 'lucide-react';
import { useDataContext } from '../context/DataContext';
import './ProductCategoriesGrid.css';

const CATEGORY_ICONS = {
  chemicals: Beaker,
  herbicides: Leaf,
  fungicides: FlaskConical,
  insecticides: Bug,
  'at-plant': Sprout,
  'harvest-aids': Scissors,
};

const ProductCategoriesGrid = ({ categories: propCategories, selectedCategoryId, onSelectCategory }) => {
  const { categories: contextCategories } = useDataContext();
  const displayCategories = propCategories || contextCategories;

  return (
    <section className="pcg-section">
      <div className="pcg-container">
        {/* Header */}
        <div className="pcg-header">
          <div className="pcg-header-left">
            <span className="pcg-label">OUR PRODUCT RANGE</span>
            <h2 className="pcg-title">
              PRODUCT <span className="pcg-title-green">CATEGORIES</span>
            </h2>
            <p className="pcg-subtitle">
              Select a product category and explore our wide range of high-quality agricultural solutions.
            </p>
          </div>
          <div className="pcg-header-right">
            <span className="pcg-cursive">Healthy Crops<br />Brighter Future</span>
          </div>
        </div>

        {/* Grid */}
        <div className="pcg-grid">
          {displayCategories.map((cat, idx) => {
            const Icon = CATEGORY_ICONS[cat.id] || Leaf;
            return (
              <motion.div
                key={cat.id}
                className={`pcg-card ${selectedCategoryId === cat.id ? 'pcg-card-active' : ''}`}
                onClick={() => onSelectCategory(cat.id)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.35, delay: idx * 0.06 }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectCategory(cat.id); }
                }}
                aria-label={`Select category ${cat.name}`}
              >
                {/* Left image */}
                <div className="pcg-card-img-wrap">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="pcg-card-img"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                </div>

                {/* Right content */}
                <div className="pcg-card-body">
                  <div className="pcg-icon-badge">
                    <Icon size={18} />
                  </div>
                  <h3 className="pcg-card-title">{cat.name}</h3>
                  <p className="pcg-card-desc">{cat.description}</p>
                  <div className="pcg-card-footer">
                    <span className="pcg-count">
                      <FlaskConical size={12} /> {cat.productCount} PRODUCTS
                    </span>
                    <button className="pcg-view-btn">
                      View Products →
                    </button>
                  </div>
                  {/* Decorative leaf */}
                  <span className="pcg-deco-leaf">🌿</span>
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
