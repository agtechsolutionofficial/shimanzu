import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, FlaskConical } from 'lucide-react';
import { useDataContext } from '../../context/DataContext';
import './ProductsSection.css';

const fadeUp = { hidden: { opacity: 0, y: 35 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.08, ease: 'easeOut' } }) };
const vp = { once: true, margin: '-50px' };

const ProductsSection = () => {
  const { products, categories } = useDataContext();
  const [activeTab, setActiveTab] = useState('all');

  const tabs = useMemo(() => [
    { id: 'all', label: 'All Products' },
    ...categories.map(c => ({ id: c.id, label: c.shortName || c.name }))
  ], [categories]);

  const filtered = useMemo(() => {
    if (activeTab === 'all') {
      return products.slice(0, 6);
    }
    return products.filter(p => p.category === activeTab).slice(0, 6);
  }, [activeTab, products]);

  return (
    <section className="products-home-section">
      <div className="products-home-bg" />
      <div className="container">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp} className="products-home-header">
          <span className="products-home-label">OUR PORTFOLIO</span>
          <h2 className="products-home-heading">Our Agricultural Solutions</h2>
          <p className="products-home-subtext">
            Shimanzu Japan provides scientifically formulated solutions designed for diverse agricultural requirements — from crop protection to yield enhancement.
          </p>
        </motion.div>

        {/* Category Tabs */}
        <div className="products-tabs-row">
          {tabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              className={`products-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <motion.div layout className="products-home-grid">
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => (
              <motion.div
                key={p.id}
                layout
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                exit={{ opacity: 0, scale: 0.9 }}
                viewport={vp}
                className="product-home-card"
              >
                <div className="phc-img-wrap">
                  <img src={p.imgSrc} alt={p.name} className="phc-img" loading="lazy" />
                  <span className={`phc-category-tag ${p.category === 'chemicals' ? 'phc-tag-chem' : ''}`}>{p.categoryLabel}</span>
                  <span className="phc-jp-tag">🇯🇵 JP</span>
                </div>
                <div className="phc-body">
                  <h3 className="phc-name">{p.name}</h3>
                  {p.chemical && (
                    <div className="phc-chemical">
                      <FlaskConical size={13} />
                      <span>{p.chemical}</span>
                    </div>
                  )}
                  <p className="phc-desc">{p.description}</p>
                  <Link to="/products" className="phc-btn">
                    View Product <ArrowRight size={14} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp} className="products-home-cta">
          <Link to="/products" className="products-view-all-btn">
            View All Products <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductsSection;
