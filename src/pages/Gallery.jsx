import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ZoomIn, ChevronLeft, ChevronRight, LayoutGrid, Leaf,
  FlaskConical, Sprout, Image as ImageIcon, ArrowRight, Loader2
} from 'lucide-react';
import { useDataContext } from '../context/DataContext';
import './Gallery.css';

const CATEGORY_META = {
  field: { label: 'Field & Crops', icon: Leaf },
  lab: { label: 'Lab & Research', icon: FlaskConical },
  products: { label: 'Products', icon: Sprout }
};

const Gallery = () => {
  const { gallery = [], isGalleryLoading } = useDataContext();
  const [activeCat, setActiveCat] = useState('all');
  const [lightbox, setLightbox] = useState(null);

  // Compute dynamic categories based on live gallery data
  const dynamicCategories = useMemo(() => {
    const catMap = new Map();

    gallery.forEach(img => {
      const c = (img.cat || 'field').toLowerCase();
      if (!catMap.has(c)) {
        const meta = CATEGORY_META[c] || {
          label: img.tag || c.charAt(0).toUpperCase() + c.slice(1),
          icon: ImageIcon
        };
        catMap.set(c, {
          id: c,
          label: meta.label,
          icon: meta.icon,
          count: 0
        });
      }
      catMap.get(c).count += 1;
    });

    const list = Array.from(catMap.values());
    return [
      { id: 'all', label: 'All', icon: LayoutGrid, count: gallery.length },
      ...list
    ];
  }, [gallery]);

  const filtered = useMemo(() => {
    if (activeCat === 'all') return gallery;
    return gallery.filter(img => (img.cat || '').toLowerCase() === activeCat);
  }, [gallery, activeCat]);

  const closeLightbox = () => setLightbox(null);
  const prev = () => setLightbox(i => (i - 1 + filtered.length) % filtered.length);
  const next = () => setLightbox(i => (i + 1) % filtered.length);

  return (
    <div className="gallery-page">
      {/* Hero */}
      <div className="gallery-hero">
        <div className="gallery-hero-leaves">
          <div className="gallery-leaf gallery-leaf-left" />
          <div className="gallery-leaf gallery-leaf-right" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="container gallery-hero-inner"
        >
          <span className="gallery-eyebrow">
            <Leaf size={13} className="gallery-eyebrow-icon" /> VISUAL SHOWCASE
          </span>
          <h1 className="gallery-title">Our Gallery</h1>
          <p className="gallery-subtitle">
            Field operations, laboratory research, and agrochemical solutions<br />
            from Shimanzu Japan.
          </p>
          <div className="gallery-divider">
            <span />
            <Leaf size={14} className="gallery-divider-leaf" />
            <span />
          </div>
        </motion.div>
      </div>

      {/* Filter Bar */}
      <div className="gallery-filter-bar">
        <div className="container gallery-filter-inner">
          <div className="gallery-filter-pills">
            {dynamicCategories.map(cat => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  className={`gallery-filter-btn${activeCat === cat.id ? ' active' : ''}`}
                  onClick={() => setActiveCat(cat.id)}
                >
                  <Icon size={15} className="gallery-filter-icon" />
                  {cat.label}
                  <span className="gallery-filter-count">{cat.count}</span>
                </button>
              );
            })}
          </div>
          <div className="gallery-filter-divider" />
          <span className="gallery-count">
            <ImageIcon size={14} /> {filtered.length} photos <ArrowRight size={13} />
          </span>
        </div>
      </div>

      {/* Grid */}
      <section className="gallery-grid-section">
        <div className="container">
          {isGalleryLoading && gallery.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px', color: '#174D32' }}>
              <Loader2 size={36} className="animate-spin" style={{ margin: '0 auto 16px', display: 'block' }} />
              <p style={{ fontWeight: 600 }}>Loading gallery from database...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px', color: '#64748B' }}>
              <ImageIcon size={48} style={{ opacity: 0.4, margin: '0 auto 16px', display: 'block' }} />
              <h3>No photos found in this category</h3>
              <p>Try selecting another category or check back soon.</p>
            </div>
          ) : (
            <div className="gallery-grid">
              <AnimatePresence mode="popLayout">
                {filtered.map((img, i) => (
                  <motion.div
                    key={img.id || img._id || i}
                    layout
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.88 }}
                    transition={{ duration: 0.35, delay: i * 0.03 }}
                    className="gallery-item"
                    onClick={() => setLightbox(i)}
                  >
                    <img
                      src={img.src}
                      alt={img.title}
                      className="gallery-img"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.pexels.com/photos/2132250/pexels-photo-2132250.jpeg?auto=compress&cs=tinysrgb&w=800';
                      }}
                    />
                    <div className="gallery-item-overlay">
                      <ZoomIn size={20} className="gallery-zoom-icon" />
                      <div className="gallery-item-info">
                        <span className="gallery-item-tag">{img.tag || img.cat}</span>
                        <span className="gallery-item-title">{img.title}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && filtered[lightbox] && (
          <motion.div
            className="gallery-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            <motion.div
              className="gallery-lb-content"
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              transition={{ duration: 0.25 }}
              onClick={e => e.stopPropagation()}
            >
              <button className="gallery-lb-close" onClick={closeLightbox}>
                <X size={20} />
              </button>
              <button className="gallery-lb-nav gallery-lb-prev" onClick={prev}>
                <ChevronLeft size={26} />
              </button>
              <img
                src={filtered[lightbox].src}
                alt={filtered[lightbox].title}
                className="gallery-lb-img"
              />
              <button className="gallery-lb-nav gallery-lb-next" onClick={next}>
                <ChevronRight size={26} />
              </button>
              <div className="gallery-lb-caption">
                <span className="gallery-lb-tag">
                  {filtered[lightbox].tag || filtered[lightbox].cat}
                </span>
                <span className="gallery-lb-title">{filtered[lightbox].title}</span>
                <span className="gallery-lb-counter">
                  {lightbox + 1} / {filtered.length}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
