import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Warehouse, 
  CheckCircle2, 
  Maximize2, 
  X,
  FlaskConical,
  Award,
  Globe,
  Leaf,
  ArrowRight,
  Shield,
  Eye,
  Activity,
  HeartHandshake,
  CheckCircle
} from 'lucide-react';
import './About.css';

const aboutMainImg = 'https://images.pexels.com/photos/2132250/pexels-photo-2132250.jpeg?auto=compress&cs=tinysrgb&w=900';
const aboutFloatImg = 'https://images.pexels.com/photos/3735218/pexels-photo-3735218.jpeg?auto=compress&cs=tinysrgb&w=400';

// Import Godown/Warehouse photos
import godown1 from '../assets/images/godown/godown-1.jpeg';
import godown2 from '../assets/images/godown/godown-2.jpeg';
import godown3 from '../assets/images/godown/godown-3.jpeg';
import godown4 from '../assets/images/godown/godown-4.jpeg';

const GODOWN_GALLERY = [
  {
    id: 1,
    img: godown1,
    badge: 'PRIMARY DISTRIBUTION HUB',
    tag: '50,000+ SQ. FT. CAPACITY',
    title: 'Central Inventory Stacks & Staging Area',
    desc: 'High-density vertical storage holding ready-to-dispatch master cartons of herbicides, insecticides, and fungicides, organized for rapid multi-state freight.'
  },
  {
    id: 2,
    img: godown2,
    badge: 'BULK STORAGE BAY',
    tag: '500+ MT BUFFER',
    title: 'Bulk Finished Goods & Secondary Storage',
    desc: 'Heavy-duty multi-layer stacking zone with climate and moisture regulation, keeping bulk agricultural chemical formulations pristine before distribution.'
  },
  {
    id: 3,
    img: godown3,
    badge: 'FORMULATION & GRANULE WING',
    tag: 'READY DISPATCH',
    title: 'Granular Packaging & Specialty Inventory',
    desc: 'Dedicated organized storage for granular insecticides and bio-stimulants in tamper-evident multi-ply valve bags, segmented by batch lot numbers.'
  },
  {
    id: 4,
    img: godown4,
    badge: 'LOGISTICS & DISPATCH CORRIDOR',
    tag: '24/7 FREIGHT STAGING',
    title: 'Main Dispatch Corridor & Quality Check Lot',
    desc: 'Spacious logistics aisles allowing swift forklift movement, systematic barcode scanning, and thorough quality inspection prior to nationwide distribution.'
  }
];

const fadeUp = {
  hidden: { opacity: 0, y: 35 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: 'easeOut' }
  })
};

const vp = { once: true, margin: '-50px' };

const About = () => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  return (
    <div className="about-page-wrap">
      {/* Page Header */}
      <div className="about-hero-header">
        <div className="about-hero-bg" style={{ backgroundImage: `url(${aboutMainImg})` }}></div>
        <div className="about-hero-overlay"></div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container about-hero-content"
        >
          <div className="about-hero-text">
            <div className="about-eyebrow">
              <span className="eyebrow-text">SHIMANZU CHEMICALS PVT. LTD.</span>
              <div className="eyebrow-line"></div>
            </div>
            <h1 className="about-page-title">About Shimanzu</h1>
            <p className="about-page-subtitle">
              Pioneering Japanese agricultural technology, world-class formulations,<br/>and nationwide supply chain infrastructure.
            </p>
            <div className="about-dots">
               <span className="dot-line"></span>
               <span className="dot"></span>
               <span className="dot"></span>
               <span className="dot"></span>
            </div>
          </div>
          <div className="about-hero-script">
            <span className="script-text">Better Crops<br/>Brighter Future</span>
          </div>
        </motion.div>
      </div>

      <div className="container" style={{ marginTop: '70px', marginBottom: '80px' }}>
        {/* Company Intro — two column */}
        <div className="grid grid-cols-2 gap-8 items-center" style={{ marginBottom: '60px' }}>
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={vp}
            transition={{ duration: 0.6 }}
            style={{ position: 'relative' }}
          >
            <img 
              src={aboutMainImg}
              alt="Shimanzu agricultural fields" 
              style={{ borderRadius: 'var(--radius-lg)', width: '100%', display: 'block', boxShadow: '0 15px 35px rgba(0,0,0,0.5)', height: '460px', objectFit: 'cover' }} 
            />
            {/* Floating lab image */}
            <div style={{ position: 'absolute', bottom: '-24px', right: '-24px', width: '200px', background: '#fff', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 12px 35px rgba(0,0,0,0.2)', border: '2px solid #E8F5E9' }}>
              <img src={aboutFloatImg} alt="Laboratory" style={{ width: '100%', height: '110px', objectFit: 'cover', display: 'block' }} />
              <div style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.3rem' }}>🇯🇵</span>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1B5E20' }}>Japanese Technology</div>
                  <div style={{ fontSize: '0.7rem', color: '#66BB6A' }}>Agricultural Innovation</div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={vp}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="section-pill-badge" style={{ marginBottom: '14px', display: 'inline-block', background: '#E8F5E9', color: '#174D32', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1.5px', padding: '4px 14px', borderRadius: '9999px', border: '1px solid #2E7D32' }}>ABOUT US</span>
            <h2 className="h3" style={{ color: '#081B10', marginBottom: '20px' }}>Growing Agriculture. Empowering Farmers. Building a Better Future.</h2>
            <p className="text-secondary" style={{ marginBottom: '16px', lineHeight: '1.8' }}>
              Shimanzu Chemicals Private Limited is a professionally managed agricultural solutions company committed to delivering innovative, reliable, and quality-driven solutions for modern farming. Our objective is to support farmers with effective agricultural products that help protect crops, improve plant health, enhance productivity, and contribute to better farm outcomes.
            </p>
            <p className="text-secondary" style={{ lineHeight: '1.8', marginBottom: '16px' }}>
              We understand that agriculture is more than just a profession—it is the foundation of our society and economy. With this belief, we work towards developing and delivering solutions that address the changing requirements of farmers and modern agricultural practices.
            </p>
            <p className="text-secondary" style={{ lineHeight: '1.8', marginBottom: '28px' }}>
              At Shimanzu Chemicals, quality, innovation, farmer satisfaction, and integrity are at the core of our business. We continuously focus on product development, quality standards, technical knowledge, and market understanding to provide dependable solutions to the agricultural community.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Vision & Mission Section styled like reference image */}
      <section className="vision-mission-section" style={{ padding: '80px 0', background: '#F8FAF8' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#E8F5E9', color: '#10B981', padding: '8px 20px', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px' }}>
              <Shield size={16} /> OUR PURPOSE
            </span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#081B10' }}>Vision & Mission</h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', alignItems: 'stretch' }}>
            {/* Vision Card */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={vp}
              transition={{ duration: 0.5 }}
              style={{ background: '#10B981', borderRadius: '32px', padding: '48px', color: '#fff', boxShadow: '0 20px 40px rgba(16, 185, 129, 0.15)' }}
            >
              <div style={{ width: '64px', height: '64px', border: '2px solid rgba(255,255,255,0.3)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' }}>
                <Eye size={32} color="#fff" />
              </div>
              <h3 style={{ fontSize: '2.3rem', fontWeight: 700, marginBottom: '24px' }}>Our Vision</h3>
              <p style={{ fontSize: '1.05rem', lineHeight: '1.8', opacity: 0.95 }}>
                To become a trusted and recognized name in the agricultural industry by delivering innovative, effective, and quality-driven solutions that contribute to healthier crops, better productivity, and a prosperous farming community.
              </p>
            </motion.div>

            {/* Mission Card */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={vp}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{ background: '#10B981', borderRadius: '32px', padding: '48px', color: '#fff', boxShadow: '0 20px 40px rgba(16, 185, 129, 0.15)' }}
            >
              <div style={{ width: '64px', height: '64px', border: '2px solid rgba(255,255,255,0.3)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' }}>
                <Activity size={32} color="#fff" />
              </div>
              <h3 style={{ fontSize: '2.3rem', fontWeight: 700, marginBottom: '24px' }}>Our Mission</h3>
              <p style={{ fontSize: '1.05rem', lineHeight: '1.8', opacity: 0.95 }}>
                Our mission is to provide farmers with reliable agricultural solutions that combine quality, innovation, technology, and value. We strive to continuously improve our products and services while building strong and long-lasting relationships with farmers, dealers, distributors, and agricultural partners.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values / Approach Section */}
      <div className="container" style={{ padding: '80px 0' }}>
        <div className="grid grid-cols-3 gap-8" style={{ marginBottom: '60px' }}>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp} className="pillar-card">
            <div className="pillar-icon">
              <Award size={36} />
            </div>
            <h3 className="pillar-title">Our Commitment to Quality</h3>
            <p className="pillar-desc" style={{ marginBottom: '16px' }}>Quality is an integral part of everything we do. We believe that agricultural products must meet high standards of performance, consistency, and reliability. Our approach focuses on maintaining quality throughout the product journey—from product development and sourcing to manufacturing, packaging, and delivery.</p>
            <p className="pillar-desc">We are committed to continuous improvement and responsible business practices so that our customers can place their trust in Shimanzu Chemicals.</p>
          </motion.div>
          
          <motion.div variants={fadeUp} custom={1} initial="hidden" whileInView="visible" viewport={vp} className="pillar-card">
            <div className="pillar-icon">
              <FlaskConical size={36} />
            </div>
            <h3 className="pillar-title">Innovation for Modern Agriculture</h3>
            <p className="pillar-desc" style={{ marginBottom: '16px' }}>Agriculture is continuously evolving, and so are the challenges faced by farmers. At Shimanzu Chemicals, we believe in embracing innovation and modern agricultural technologies to develop solutions that are relevant to today’s farming needs.</p>
            <p className="pillar-desc">Our focus is to provide practical and effective solutions that can help farmers manage crop challenges efficiently and move towards more productive and sustainable farming practices.</p>
          </motion.div>
          
          <motion.div variants={fadeUp} custom={2} initial="hidden" whileInView="visible" viewport={vp} className="pillar-card">
            <div className="pillar-icon">
              <HeartHandshake size={36} />
            </div>
            <h3 className="pillar-title">Farmer-Centric Approach</h3>
            <p className="pillar-desc" style={{ marginBottom: '16px' }}>Farmers are at the heart of our business. We believe that understanding their real-world challenges is essential to creating meaningful agricultural solutions.</p>
            <p className="pillar-desc">We work with a farmer-first approach, focusing on product quality, performance, accessibility, technical support, and customer satisfaction. Our aim is not simply to provide products, but to build lasting relationships and contribute to the success of the farming community.</p>
          </motion.div>
        </div>

        {/* Why Choose & Promise */}
        <div className="grid grid-cols-2 gap-12 items-center" style={{ marginTop: '80px' }}>
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={vp} transition={{ duration: 0.6 }}>
            <h2 className="h3" style={{ color: '#081B10', marginBottom: '24px' }}>Why Choose Shimanzu Chemicals?</h2>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                'Quality-Focused Products',
                'Innovation & Technology',
                'Farmer-Centric Approach',
                'Reliable Agricultural Solutions',
                'Strong Industry Commitment',
                'Continuous Product Improvement',
                'Long-Term Customer Relationships'
              ].map((text, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.05rem', color: '#455A64', fontWeight: 500 }}>
                  <CheckCircle size={20} color="#10B981" style={{ flexShrink: 0 }} />
                  {text}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={vp} transition={{ duration: 0.6 }} style={{ background: '#E8F5E9', padding: '40px', borderRadius: '24px', border: '1px solid #C8E6C9' }}>
            <h2 className="h3" style={{ color: '#081B10', marginBottom: '20px' }}>Our Promise</h2>
            <p className="text-secondary" style={{ marginBottom: '16px', lineHeight: '1.8', color: '#2E7D32' }}>
              At Shimanzu Chemicals Private Limited, our promise is to continuously work towards delivering quality agricultural solutions with integrity, responsibility, and innovation.
            </p>
            <p className="text-secondary" style={{ marginBottom: '24px', lineHeight: '1.8', color: '#2E7D32' }}>
              We envision a future where farmers have access to dependable solutions that help them cultivate healthier crops, improve productivity, and create greater value from their farming efforts.
            </p>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1B5E20', borderTop: '1px solid rgba(46, 125, 50, 0.2)', paddingTop: '20px' }}>
              Shimanzu Chemicals Private Limited —<br/>
              Growing with Farmers, Growing with Agriculture.
            </div>
          </motion.div>
        </div>
      </div>

      {/* =========================================================================
          WAREHOUSE & GODOWN INFRASTRUCTURE SECTION
          ========================================================================= */}
      <section className="warehouse-section">
        <div className="container">
          <div className="warehouse-header-wrap">
            <div className="about-eyebrow" style={{ justifyContent: 'center' }}>
              <span className="eyebrow-text">WAREHOUSING & INVENTORY SCALE</span>
              <div className="eyebrow-line"></div>
            </div>
            <h2 className="heritage-title" style={{ textAlign: 'center' }}>
              Our Godown & Storage Infrastructure
            </h2>
            <p className="heritage-desc" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 40px' }}>
              Real-time glimpse inside Shimanzu's massive storage facilities. With modern climate regulation, high-throughput logistics aisles, and extensive safety protocols, we maintain ample buffer inventory to serve agricultural demand year-round.
            </p>
          </div>

          {/* Infrastructure Metrics Bar */}
          <div className="warehouse-stats-bar">
            <div className="wh-stat-card">
              <div className="wh-stat-number">50,000+</div>
              <div className="wh-stat-label">Square Feet Storage Area</div>
            </div>
            <div className="wh-stat-card">
              <div className="wh-stat-number">500+ MT</div>
              <div className="wh-stat-label">Ready Inventory Buffer</div>
            </div>
            <div className="wh-stat-card">
              <div className="wh-stat-number">100%</div>
              <div className="wh-stat-label">Batch Traceability</div>
            </div>
            <div className="wh-stat-card">
              <div className="wh-stat-number">24/7</div>
              <div className="wh-stat-label">Expedited Dispatch</div>
            </div>
          </div>

          {/* Godown Photos 2x2 Interactive Grid */}
          <div className="godown-photos-grid">
            {GODOWN_GALLERY.map((item, idx) => (
              <motion.div
                key={item.id}
                custom={idx}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={vp}
                className="godown-photo-card"
                onClick={() => setSelectedPhoto(item)}
              >
                <div className="godown-img-wrap">
                  <img 
                    src={item.img} 
                    alt={item.title} 
                    className="godown-img"
                    loading="lazy"
                  />
                  <div className="godown-zoom-overlay">
                    <span className="zoom-pill">
                      <Maximize2 size={15} /> Click to Enlarge
                    </span>
                  </div>
                </div>

                <div className="godown-card-caption">
                  <div className="godown-caption-top">
                    <span className="godown-badge">{item.badge}</span>
                    <span className="godown-capacity-tag">{item.tag}</span>
                  </div>
                  <h3 className="godown-title">{item.title}</h3>
                  <p className="godown-desc">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal for Fullscreen Godown Inspection */}
      <AnimatePresence>
        {selectedPhoto && (
          <div className="godown-modal-backdrop" onClick={() => setSelectedPhoto(null)}>
            <motion.div 
              className="godown-modal-box"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="godown-modal-close" 
                onClick={() => setSelectedPhoto(null)}
                aria-label="Close image"
              >
                <X size={22} />
              </button>

              <img 
                src={selectedPhoto.img} 
                alt={selectedPhoto.title} 
                className="godown-modal-img" 
              />

              <div className="godown-modal-footer">
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                  <span className="godown-badge">{selectedPhoto.badge}</span>
                  <span className="godown-capacity-tag">{selectedPhoto.tag}</span>
                </div>
                <h3 className="godown-modal-title">{selectedPhoto.title}</h3>
                <p className="godown-modal-desc">{selectedPhoto.desc}</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default About;
