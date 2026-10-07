import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Leaf, FlaskConical, Globe } from 'lucide-react';
import './AboutSection.css';
const aboutMainImg = 'https://images.pexels.com/photos/2132250/pexels-photo-2132250.jpeg?auto=compress&cs=tinysrgb&w=900';
const aboutFloatImg = 'https://images.pexels.com/photos/3735218/pexels-photo-3735218.jpeg?auto=compress&cs=tinysrgb&w=400';

const fadeLeft = { hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut' } } };
const fadeRight = { hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut' } } };
const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1, ease: 'easeOut' } }) };
const vp = { once: true, margin: '-60px' };

const highlights = [
  { icon: <CheckCircle2 size={18} />, text: 'Quality-Focused Products & Reliable Solutions' },
  { icon: <CheckCircle2 size={18} />, text: 'Innovation & Technology Driven' },
  { icon: <CheckCircle2 size={18} />, text: 'Farmer-Centric Approach' },
  { icon: <CheckCircle2 size={18} />, text: 'Continuous Product Improvement' },
];

const AboutSection = () => (
  <section className="about-home-section">
    <div className="container">
      <div className="about-home-grid">
        {/* Left: Images */}
        <motion.div variants={fadeLeft} initial="hidden" whileInView="visible" viewport={vp} className="about-img-col">
          <div className="about-main-img-wrap">
            <img
              src={aboutMainImg}
              alt="Shimanzu agricultural research"
              className="about-main-img"
              loading="lazy"
            />
            <div className="about-img-overlay" />
          </div>
          <div className="about-float-card">
            <img
              src={aboutFloatImg}
              alt="Laboratory research"
              className="about-float-img"
              loading="lazy"
            />
            <div className="about-float-badge">
              <span className="float-badge-icon">🇯🇵</span>
              <div>
                <div className="float-badge-title">Japanese Technology</div>
                <div className="float-badge-sub">Agricultural Innovation</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right: Content */}
        <motion.div variants={fadeRight} initial="hidden" whileInView="visible" viewport={vp} className="about-content-col">
          <h2 className="about-home-heading">
            Growing Agriculture. Empowering Farmers. Building a Better Future.
          </h2>
          <p className="about-home-para">
            Shimanzu Chemicals Private Limited is a professionally managed agricultural solutions company committed to delivering innovative, reliable, and quality-driven solutions for modern farming.
          </p>
          <p className="about-home-para">
            We understand that agriculture is more than just a profession—it is the foundation of our society and economy. At Shimanzu Chemicals, quality, innovation, farmer satisfaction, and integrity are at the core of our business.
          </p>

          <div className="about-mission-vision">
            <div className="mv-card">
              <h4 className="mv-title">Our Vision</h4>
              <p className="mv-text">To become a trusted and recognized name in the agricultural industry by delivering innovative, effective, and quality-driven solutions that contribute to healthier crops, better productivity, and a prosperous farming community.</p>
            </div>
            <div className="mv-card">
              <h4 className="mv-title">Our Mission</h4>
              <p className="mv-text">To provide farmers with reliable agricultural solutions that combine quality, innovation, technology, and value. We strive to build strong and long-lasting relationships with farmers, dealers, and agricultural partners.</p>
            </div>
          </div>

          <ul className="about-highlights-list">
            {highlights.map((h, i) => (
              <motion.li key={i} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp} className="about-highlight-item">
                <span className="highlight-icon">{h.icon}</span>
                <span>{h.text}</span>
              </motion.li>
            ))}
          </ul>

          <Link to="/about" className="about-learn-btn">
            Learn More About Us <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </div>
  </section>
);

export default AboutSection;
