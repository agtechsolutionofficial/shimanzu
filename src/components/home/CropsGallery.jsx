import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { CROPS } from '../../data/cropsData';
import './CropsGallery.css';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.07, ease: 'easeOut' } }) };
const vp = { once: true, margin: '-50px' };

// Show first 12 crops
const DISPLAY_CROPS = CROPS.slice(0, 12);

const CropsGallery = () => (
  <section className="crops-gallery-section">
    <div className="container">
      <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp} className="crops-gallery-header">
        <span className="crops-gallery-label">CROP SOLUTIONS</span>
        <h2 className="crops-gallery-heading">Solutions Across Every Crop</h2>
        <p className="crops-gallery-subtext">
          From paddy fields to orchards, Shimanzu provides targeted protection and growth solutions for every major crop.
        </p>
      </motion.div>

      <div className="crops-gallery-grid">
        {DISPLAY_CROPS.map((crop, i) => (
          <motion.div
            key={crop.id}
            custom={i}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={vp}
            className="crop-gallery-card"
          >
            <div className="crop-img-wrap">
              <img src={crop.image} alt={crop.name} className="crop-img" loading="lazy" />
              <div className="crop-img-overlay" />
              <div className="crop-hover-content">
                <p className="crop-hover-desc">{crop.description}</p>
                <Link to="/crops" className="crop-hover-btn">
                  View Solutions <ArrowRight size={14} />
                </Link>
              </div>
            </div>
            <div className="crop-card-footer">
              <span className="crop-name">{crop.name}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp} className="crops-gallery-cta">
        <Link to="/crops" className="crops-view-all-btn">
          View All Crops <ArrowRight size={16} />
        </Link>
      </motion.div>
    </div>
  </section>
);

export default CropsGallery;
