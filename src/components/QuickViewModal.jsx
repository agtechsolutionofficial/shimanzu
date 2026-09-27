import React, { useState } from 'react';
import { X, CheckCircle2, MessageCircle, ZoomIn, ZoomOut } from 'lucide-react';
import { FALLBACK_PRODUCT_IMAGE } from '../utils/imageCompressor';
import './QuickViewModal.css';

const QuickViewModal = ({ product, onClose }) => {
  const [zoom, setZoom] = useState(1);

  if (!product) return null;

  const handleZoom = (e) => {
    e.stopPropagation();
    setZoom(prev => prev >= 2.5 ? 1 : prev + 0.4);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-fade-in-up" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div className="modal-grid">
          {/* Image Column */}
          <div className="modal-image-col">
            <div className="modal-img-frame">
              <img
                src={product.imgSrc || FALLBACK_PRODUCT_IMAGE}
                alt={product.name}
                className="modal-img"
                style={{ transform: `scale(${zoom})` }}
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_PRODUCT_IMAGE; }}
              />
            </div>
            {/* Zoom button */}
            <button className="modal-zoom-btn" onClick={handleZoom} title={zoom >= 2.5 ? 'Reset zoom' : 'Zoom in'}>
              {zoom >= 2.5 ? <ZoomOut size={18} /> : <ZoomIn size={18} />}
              <span>{zoom >= 2.5 ? 'Reset' : 'Zoom'}</span>
            </button>
          </div>

          {/* Info Column */}
          <div className="modal-info-col">
            <div className="modal-badges">
              <span className="badge category-badge">{product.categoryLabel || product.category}</span>
              <span className={`badge stock-badge ${product.inStock ? 'in-stock' : 'low-stock'}`}>
                {product.inStock ? 'In Stock' : 'Available on Request'}
              </span>
              <span className="badge formulation-badge">{product.formulation}</span>
            </div>

            <h2 className="modal-title">{product.name}</h2>
            <p className="modal-chemical">{product.chemical}</p>

            <div className="modal-details">
              <div className="detail-row">
                <span className="detail-label">Pack Sizes:</span>
                <span className="detail-value">{product.packSizes ? product.packSizes.join(', ') : 'Standard'}</span>
              </div>
              {product.dosage && (
                <div className="detail-row">
                  <span className="detail-label">Recommended Dosage:</span>
                  <span className="detail-value dosage">{product.dosage}</span>
                </div>
              )}
              {product.targets && (
                <div className="detail-row">
                  <span className="detail-label">Target Pests / Diseases:</span>
                  <span className="detail-value">{product.targets}</span>
                </div>
              )}
              {product.crops && product.crops.length > 0 && (
                <div className="detail-row">
                  <span className="detail-label">Target Crops:</span>
                  <span className="detail-value">
                    {product.crops.map((crop, idx) => (
                      <span key={idx} className="crop-tag-modal">{crop}</span>
                    ))}
                  </span>
                </div>
              )}
            </div>

            <div className="modal-description">
              <h4 className="description-title">Product Overview & Efficacy</h4>
              <p className="description-text">
                {product.description || `High-potency ${product.categoryLabel || product.category} formulated to provide superior protection, vigorous vegetative growth, and maximum crop harvest yield.`}
              </p>
              <ul className="benefits-list">
                <li><CheckCircle2 size={15} /> High bio-availability with superior rainfastness</li>
                <li><CheckCircle2 size={15} /> Stringent ISO-certified quality manufacturing standards</li>
                <li><CheckCircle2 size={15} /> Low environmental footprint and high crop selectivity</li>
              </ul>
            </div>

            <div className="modal-actions">
              <a
                href={`https://wa.me/919999999999?text=Hello%20Shimanzu,%20I%20am%20interested%20in%20${encodeURIComponent(product.name)}%20(${encodeURIComponent(product.chemical)})`}
                target="_blank"
                rel="noreferrer"
                className="modal-whatsapp-btn"
              >
                <MessageCircle size={18} /> Inquire / Order on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
