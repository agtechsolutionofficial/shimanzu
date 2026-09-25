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
  { icon: <FlaskConical size={18} />, text: 'Advanced GLC, HPLC & UV molecular testing' },
  { icon: <Leaf size={18} />, text: 'ISO 9001:2015 & 14001:2015 certified manufacturing' },
  { icon: <Globe size={18} />, text: 'Exporting to 157+ countries worldwide' },
  { icon: <CheckCircle2 size={18} />, text: 'Complex formulations: EC, SC, WG standards' },
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
            Pioneering Japanese Agricultural Science for Indian Farmers
          </h2>
          <p className="about-home-para">
            Shimanzu Chemicals Private Limited is committed to bringing the pinnacle of Japanese agricultural technology to farmers across India and the globe. By establishing state-of-the-art manufacturing plants, we ensure that every formulation meets the highest standards of purity, efficacy, and environmental safety.
          </p>
          <p className="about-home-para">
            Our mission is to enhance crop productivity, maximize farm income, and champion sustainable agriculture through our robust nationwide network of dealers, distributors, and certified agronomists.
          </p>

          <div className="about-mission-vision">
            <div className="mv-card">
              <h4 className="mv-title">Our Mission</h4>
              <p className="mv-text">To empower every farmer with scientifically advanced, safe, and effective agrochemical solutions that maximize yield and promote sustainable land stewardship.</p>
            </div>
            <div className="mv-card">
              <h4 className="mv-title">Our Vision</h4>
              <p className="mv-text">To be the most trusted agricultural chemical company in Asia, recognized for Japanese precision, product integrity, and farmer-first innovation.</p>
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
