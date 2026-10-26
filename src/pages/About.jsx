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
  CheckCircle,
  Target,
  Sprout,
  Handshake,
  Lightbulb,
  TrendingUp
} from 'lucide-react';
import './About.css';
import aboutSeedlingImg from '../assets/images/about-seedling-tech-technology-generated.png';

const aboutMainImg = 'https://images.pexels.com/photos/2132250/pexels-photo-2132250.jpeg?auto=compress&cs=tinysrgb&w=900';

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

      <div className="container abp-intro">
        {/* About Shimanzu — image + story */}
        <div className="abp-grid">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={vp}
            transition={{ duration: 0.6 }}
            className="abp-media"
          >
            <div className="abp-img-frame">
              <img src={aboutSeedlingImg} alt="Seedling growing in rich soil with smart agriculture technology" className="abp-img" />
            </div>
            <div className="abp-stats">
              <div className="abp-stat abp-stat--green">
                <span className="abp-stat-num">1200+</span>
                <span className="abp-stat-label">Distributors</span>
              </div>
              <div className="abp-stat abp-stat--red">
                <span className="abp-stat-num">2800+</span>
                <span className="abp-stat-label">Dealers</span>
              </div>
              <div className="abp-stat abp-stat--blue">
                <span className="abp-stat-num">Pan India</span>
                <span className="abp-stat-label">Network</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={vp}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="abp-story"
          >
            <span className="abp-pill">About Shimanzu</span>
            <h2 className="abp-title">
              Not Just a Company. <span>A Commitment.</span>
            </h2>
            <p className="abp-text">
              Shimanzu Chemicals Pvt. Ltd. is not just a company. It is a commitment — a commitment to empower farmers, enrich soils, and strengthen agriculture.
            </p>
            <p className="abp-text">
              Our journey begins with the soil and extends to every farm where a farmer nurtures his dreams. Guided by quality, trust, and innovation, Shimanzu today is a trusted name across India with thousands of distributors, dealers, and farmers.
            </p>
            <p className="abp-strength">
              <Leaf size={16} /> Our strength lies in the farmers of India.
            </p>
          </motion.div>
        </div>

        {/* MD message + highlights */}
        <div className="abp-bottom">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp} className="abp-md-card">
            <span className="abp-md-label">Message from the Managing Director</span>
            <p className="abp-md-quote">
              “At Shimanzu, we believe that agriculture is the backbone of our nation. For us, this is not just a business. It is a responsibility and a mission.”
            </p>
            <p className="abp-md-text">
              I sincerely thank our farmers, distributors, and partners — your trust is our greatest strength.
            </p>
            <p className="abp-md-sign">
              Together, let us build a tomorrow where — <strong>“Where there is Shimanzu, there is prosperity.”</strong>
            </p>
          </motion.div>

          <div className="abp-highlights">
            {[
              { icon: <FlaskConical size={18} />, title: 'Research-Driven Solutions', text: 'Creating innovative formulations', color: '#1565C0' },
              { icon: <Leaf size={18} />, title: 'Soil-Health & Sustainability', text: 'Focused fertilizers for long-term farm health', color: '#2E7D32' },
              { icon: <HeartHandshake size={18} />, title: 'A Strong Network', text: '1200+ distributors and 2800+ dealers across India', color: '#D32F2F' },
            ].map((h, i) => (
              <motion.div key={h.title} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp} className="abp-hl" style={{ '--hl': h.color }}>
                <span className="abp-hl-icon">{h.icon}</span>
                <div>
                  <div className="abp-hl-title">{h.title}</div>
                  <div className="abp-hl-text">{h.text}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Vision & Mission */}
      <section className="vm-section">
        <div className="container">
          <div className="vm-header">
            <span className="vm-pill"><Shield size={14} /> Our Purpose</span>
            <h2 className="vm-heading">Vision <span>&amp;</span> Mission</h2>
            <p className="vm-sub">What drives us every day — for our farmers, our soil and our future.</p>
          </div>

          <div className="vm-grid">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={vp}
              transition={{ duration: 0.6 }}
              className="vm-card vm-card--vision"
            >
              <Eye className="vm-watermark" size={180} strokeWidth={1} />
              <div className="vm-icon"><Eye size={26} /></div>
              <span className="vm-label">Our Vision</span>
              <p className="vm-statement">
                To make farming with <em>trust</em>, <em>simple ideas</em>, and <em>care for nature</em>.
              </p>
              <div className="vm-tags">
                <span>Trust</span><span>Simplicity</span><span>Nature</span>
              </div>
            </motion.div>

            <div className="vm-center" aria-hidden="true">
              <Sprout size={28} />
            </div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={vp}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="vm-card vm-card--mission"
            >
              <Target className="vm-watermark" size={180} strokeWidth={1} />
              <div className="vm-icon"><Target size={26} /></div>
              <span className="vm-label">Our Mission</span>
              <p className="vm-statement">
                To give farmers the <em>right products</em> that protect crops, improve soil, and support their growth.
              </p>
              <div className="vm-tags">
                <span>Protect Crops</span><span>Improve Soil</span><span>Support Growth</span>
              </div>
            </motion.div>
          </div>

          <div className="vm-values">
            <div className="vm-values-title">Our Core Values</div>
            <div className="vm-values-grid">
              {[
                { icon: <Award size={22} />, title: 'Quality', text: 'Good and reliable products', color: '#2E7D32' },
                { icon: <Leaf size={22} />, title: 'Sustainability', text: 'Care for nature and farming future', color: '#00897B' },
                { icon: <Handshake size={22} />, title: 'Trust', text: 'Faith and honesty in every relation', color: '#1565C0' },
                { icon: <Lightbulb size={22} />, title: 'Innovation', text: 'New and better ideas', color: '#F57C00' },
                { icon: <TrendingUp size={22} />, title: 'Growth', text: 'Progress every day', color: '#D32F2F' },
              ].map((v, i) => (
                <motion.div key={v.title} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp} className="vm-value" style={{ '--vc': v.color }}>
                  <span className="vm-value-icon">{v.icon}</span>
                  <div className="vm-value-name">{v.title}</div>
                  <div className="vm-value-text">{v.text}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Values / Approach Section */}
      <div className="container" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
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
