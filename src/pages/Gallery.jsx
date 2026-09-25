import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ChevronLeft, ChevronRight, LayoutGrid, Leaf, FlaskConical, Sprout, Image, ArrowRight } from 'lucide-react';
import './Gallery.css';

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: (i=0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i*0.04, ease: 'easeOut' } }) };

const IMAGES = [
  // Field & Crops
  { id:1,  cat:'field',     title:'Precision Spraying',       tag:'Field & Crops',  src:'https://images.pexels.com/photos/2132250/pexels-photo-2132250.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id:2,  cat:'field',     title:'Green Crop Fields',        tag:'Field & Crops',  src:'https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id:3,  cat:'field',     title:'Rice Plantation',          tag:'Field & Crops',  src:'https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id:4,  cat:'field',     title:'Tractor Operations',       tag:'Field & Crops',  src:'https://images.pexels.com/photos/2933243/pexels-photo-2933243.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id:5,  cat:'field',     title:'Seedling Growth',          tag:'Field & Crops',  src:'https://images.pexels.com/photos/1084540/pexels-photo-1084540.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id:6,  cat:'field',     title:'Wheat Harvest',            tag:'Field & Crops',  src:'https://images.pexels.com/photos/326082/pexels-photo-326082.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id:7,  cat:'field',     title:'Drone Agri Technology',    tag:'Field & Crops',  src:'https://images.pexels.com/photos/3943716/pexels-photo-3943716.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id:8,  cat:'field',     title:'Irrigation Systems',       tag:'Field & Crops',  src:'https://images.pexels.com/photos/440731/pexels-photo-440731.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id:9,  cat:'field',     title:'Sustainable Farming',      tag:'Field & Crops',  src:'https://images.pexels.com/photos/1382102/pexels-photo-1382102.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id:10, cat:'field',     title:'Crop Monitoring',          tag:'Field & Crops',  src:'https://images.pexels.com/photos/2165688/pexels-photo-2165688.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id:11, cat:'field',     title:'Vegetable Farming',        tag:'Field & Crops',  src:'https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id:12, cat:'field',     title:'Modern Agriculture',       tag:'Field & Crops',  src:'https://images.pexels.com/photos/2886937/pexels-photo-2886937.jpeg?auto=compress&cs=tinysrgb&w=800' },
  // Lab & Research
  { id:13, cat:'lab',       title:'Laboratory Testing',       tag:'Lab & Research', src:'https://images.pexels.com/photos/954583/pexels-photo-954583.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id:14, cat:'lab',       title:'Chemical Analysis',        tag:'Lab & Research', src:'https://images.pexels.com/photos/3735218/pexels-photo-3735218.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id:15, cat:'lab',       title:'Quality Control',          tag:'Lab & Research', src:'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id:16, cat:'lab',       title:'Molecular Research',       tag:'Lab & Research', src:'https://images.pexels.com/photos/3825527/pexels-photo-3825527.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id:17, cat:'lab',       title:'Formulation Development',  tag:'Lab & Research', src:'https://images.pexels.com/photos/1366942/pexels-photo-1366942.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id:18, cat:'lab',       title:'HPLC Analysis',            tag:'Lab & Research', src:'https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=800' },
  // Products
  { id:19, cat:'products',  title:'Agrochemical Solutions',   tag:'Products',       src:'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id:20, cat:'products',  title:'Crop Protection Range',    tag:'Products',       src:'https://images.pexels.com/photos/4503273/pexels-photo-4503273.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id:21, cat:'products',  title:'Herbicide Formulations',   tag:'Products',       src:'https://images.pexels.com/photos/4503267/pexels-photo-4503267.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id:22, cat:'products',  title:'Fungicide Series',         tag:'Products',       src:'https://images.pexels.com/photos/4503734/pexels-photo-4503734.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id:23, cat:'products',  title:'Insecticide Range',        tag:'Products',       src:'https://images.pexels.com/photos/4503271/pexels-photo-4503271.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id:24, cat:'products',  title:'Bio-Stimulants',           tag:'Products',       src:'https://images.pexels.com/photos/4503269/pexels-photo-4503269.jpeg?auto=compress&cs=tinysrgb&w=800' },
];

const CATS = [
  { id:'all',      label:'All',           icon: LayoutGrid, count: IMAGES.length },
  { id:'field',    label:'Field & Crops', icon: Leaf,        count: IMAGES.filter(i=>i.cat==='field').length },
  { id:'lab',      label:'Lab & Research',icon: FlaskConical,count: IMAGES.filter(i=>i.cat==='lab').length },
  { id:'products', label:'Products',      icon: Sprout,      count: IMAGES.filter(i=>i.cat==='products').length },
];

const Gallery = () => {
  const [activeCat, setActiveCat] = useState('all');
  const [lightbox,  setLightbox]  = useState(null);

  const filtered = activeCat === 'all' ? IMAGES : IMAGES.filter(img => img.cat === activeCat);

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
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7 }} className="container gallery-hero-inner">
          <span className="gallery-eyebrow"><Leaf size={13} className="gallery-eyebrow-icon" /> VISUAL SHOWCASE</span>
          <h1 className="gallery-title">Our Gallery</h1>
          <p className="gallery-subtitle">Field operations, laboratory research, and agrochemical solutions<br/>from Shimanzu Japan.</p>
          <div className="gallery-divider"><span /><Leaf size={14} className="gallery-divider-leaf" /><span /></div>
        </motion.div>
      </div>

      {/* Filter */}
      <div className="gallery-filter-bar">
        <div className="container gallery-filter-inner">
          <div className="gallery-filter-pills">
            {CATS.map(cat => {
              const Icon = cat.icon;
              return (
                <button key={cat.id} className={`gallery-filter-btn${activeCat === cat.id ? ' active' : ''}`} onClick={() => setActiveCat(cat.id)}>
                  <Icon size={15} className="gallery-filter-icon" />
                  {cat.label}
                  {cat.id !== 'all' && <span className="gallery-filter-count">{cat.count}</span>}
                </button>
              );
            })}
          </div>
          <div className="gallery-filter-divider" />
          <span className="gallery-count"><Image size={14} /> {filtered.length} photos <ArrowRight size={13} /></span>
        </div>
      </div>

      {/* Grid */}
      <section className="gallery-grid-section">
        <div className="container">
          <div className="gallery-grid">
            <AnimatePresence mode="popLayout">
              {filtered.map((img, i) => (
                <motion.div
                  key={img.id}
                  layout
                  initial={{ opacity:0, scale:0.92 }}
                  animate={{ opacity:1, scale:1 }}
                  exit={{ opacity:0, scale:0.88 }}
                  transition={{ duration:0.35, delay: i*0.03 }}
                  className="gallery-item"
                  onClick={() => setLightbox(i)}
                >
                  <img src={img.src} alt={img.title} className="gallery-img" loading="lazy" />
                  <div className="gallery-item-overlay">
                    <ZoomIn size={20} className="gallery-zoom-icon" />
                    <div className="gallery-item-info">
                      <span className="gallery-item-tag">{img.tag}</span>
                      <span className="gallery-item-title">{img.title}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div className="gallery-lightbox" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} onClick={closeLightbox}>
            <motion.div className="gallery-lb-content" initial={{ scale:0.85 }} animate={{ scale:1 }} exit={{ scale:0.85 }} transition={{ duration:0.25 }} onClick={e => e.stopPropagation()}>
              <button className="gallery-lb-close" onClick={closeLightbox}><X size={20}/></button>
              <button className="gallery-lb-nav gallery-lb-prev" onClick={prev}><ChevronLeft size={26}/></button>
              <img src={filtered[lightbox].src} alt={filtered[lightbox].title} className="gallery-lb-img" />
              <button className="gallery-lb-nav gallery-lb-next" onClick={next}><ChevronRight size={26}/></button>
              <div className="gallery-lb-caption">
                <span className="gallery-lb-tag">{filtered[lightbox].tag}</span>
                <span className="gallery-lb-title">{filtered[lightbox].title}</span>
                <span className="gallery-lb-counter">{lightbox+1} / {filtered.length}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
