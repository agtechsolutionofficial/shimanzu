import React from 'react';
import { motion } from 'framer-motion';
import { FALLBACK_PRODUCT_IMAGE } from '../utils/imageCompressor';
import './ProductCard.css';

const ProductCard = ({ product, onViewClick }) => {
  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'fungicides': return '#0D9488';
      case 'herbicides': return '#15803D';
      case 'insecticides': return '#7C3AED';
      case 'at-plant': return '#EA580C';
      case 'harvest-aids': return '#0F766E';
      case 'precision-platforms': return '#1E3A8A';
      default: return '#10B981';
    }
  };

  return (
    <motion.div 
      className="fmc-product-card"
      whileHover={{ y: -4 }}
      onClick={() => onViewClick(product)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onViewClick(product);
        }
      }}
      aria-label={`View details for ${product.name}`}
    >
      {/* Top Media */}
      <div className="fmc-card-media">
        <img 
          src={product.imgSrc || FALLBACK_PRODUCT_IMAGE} 
          alt={product.name} 
          className="fmc-card-img"
          loading="lazy" 
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = FALLBACK_PRODUCT_IMAGE;
          }}
        />
        

      </div>

      {/* Card Body */}
      <div className="fmc-card-body">
        {/* Left vertical color strip */}
        <div 
          className="fmc-card-accent-bar" 
          style={{ backgroundColor: getCategoryColor(product.category) }} 
        />

        {/* Category Label */}
        <span className="fmc-card-category-label">
          {product.categoryLabel || product.category}
        </span>

        {/* Product Title in Bold Red */}
        <h3 className="fmc-card-title">{product.name}</h3>

        {/* Chemical active info */}
        <p className="fmc-card-chemical">{product.chemical}</p>

        {/* Crops tags if available */}
        {product.crops && product.crops.length > 0 && (
          <div className="fmc-crop-tags">
            {product.crops.slice(0, 3).map((crop, idx) => (
              <span key={idx} className="fmc-crop-tag">{crop}</span>
            ))}
            {product.crops.length > 3 && (
              <span className="fmc-crop-tag">+{product.crops.length - 3}</span>
            )}
          </div>
        )}

        {/* Footer with Group / Formulation */}
        <div className="fmc-card-footer">
          <span className="fmc-group-badge">
            {product.group || `${product.formulation} FORMULATION`}
          </span>
          <span className="fmc-view-link">
            Details &rarr;
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
