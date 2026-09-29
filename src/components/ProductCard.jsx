import React from 'react';
import { motion } from 'framer-motion';
import { Package } from 'lucide-react';
import './ProductCard.css';

const ProductCard = ({ product, onViewClick }) => {
  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'chemicals': return '#1E40AF';
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
      <div className={`fmc-card-media ${!product.imgSrc ? 'has-no-image' : ''}`}>
        {product.imgSrc ? (
          <img 
            src={product.imgSrc} 
            alt={product.name} 
            className="fmc-card-img"
            loading="lazy" 
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const placeholder = e.currentTarget.parentElement?.querySelector('.fmc-card-no-image-placeholder');
              if (placeholder) placeholder.style.display = 'flex';
            }}
          />
        ) : null}

        <div 
          className="fmc-card-no-image-placeholder"
          style={{ display: product.imgSrc ? 'none' : 'flex' }}
        >
          <div className="fmc-no-img-badge">
            <Package size={30} strokeWidth={1.5} />
          </div>
          <span className="fmc-no-img-title">No Image Uploaded</span>
        </div>
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
