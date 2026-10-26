import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, CheckCircle2, Eye, Target, Award, Leaf, Handshake, Lightbulb, TrendingUp,
  Sparkles,
} from 'lucide-react';
import seedlingImg from '../../assets/images/about-seedling-tech-hd-generated.png';
import './AboutSection.css';

const fadeLeft = { hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut' } } };
const fadeRight = { hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut' } } };
const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1, ease: 'easeOut' } }) };
const vp = { once: true, margin: '-60px' };

const highlights = [
  'Quality-Focused Products & Reliable Solutions',
  'Innovation & Technology Driven',
  'Farmer-Centric Approach',
  'Continuous Product Improvement',
];

const coreValues = [
  { icon: <Award size={15} />, title: 'Quality', text: 'Good and reliable products', color: '#2E7D32' },
  { icon: <Leaf size={15} />, title: 'Sustainability', text: 'Care for nature and farming future', color: '#00897B' },
  { icon: <Handshake size={15} />, title: 'Trust', text: 'Faith and honesty in every relation', color: '#1565C0' },
  { icon: <Lightbulb size={15} />, title: 'Innovation', text: 'New and better ideas', color: '#F57C00' },
  { icon: <TrendingUp size={15} />, title: 'Growth', text: 'Progress every day', color: '#C62828' },
];

const investments = [
  'Farmer Training Workshops',
  'Dealer & Distributor Reward Tours',
  'Personalized Schemes & Long-Term Partnerships',
];

const portfolio = [
  { title: 'Insecticides', text: 'Reliable crop protection for higher yields' },
  { title: 'Fungicides', text: 'Strong shield against crop diseases' },
  { title: 'Herbicides', text: 'Smart solutions for effective weed management' },
  { title: 'Fertilizers', text: 'Nutrition for soil, strength for crops, prosperity for farmers', tagline: 'Protecting crops, enriching soil, empowering farmers.' },
  { title: 'Plant Growth Regulators (PGRs)', text: 'Enhancing growth and resilience' },
];

const AboutSection = () => (
  <section className="about-home-section">
    <div className="container">
      <div className="about-home-grid">
        {/* Left: image + vision / mission / values */}
        <motion.div variants={fadeLeft} initial="hidden" whileInView="visible" viewport={vp} className="about-vmv-col">
          <div className="about-img-frame">
            <img src={seedlingImg} alt="Young seedling growing in a green field" className="about-img" loading="lazy" />
          </div>

          <div className="mv-row">
            <div className="mv-card mv-card--vision">
              <div className="mv-head"><Eye size={15} /> Our Vision</div>
              <p className="mv-text">To make farming with trust, simple ideas, and care for nature.</p>
            </div>
            <div className="mv-card mv-card--mission">
              <div className="mv-head"><Target size={15} /> Our Mission</div>
              <p className="mv-text">To give farmers the right products that protect crops, improve soil, and support their growth.</p>
            </div>
          </div>

          <div className="core-values">
            <div className="core-values-title">Core Values</div>
            <div className="core-values-grid">
              {coreValues.map((v) => (
                <div key={v.title} className="core-value" style={{ '--cv': v.color }}>
                  <span className="core-value-icon">{v.icon}</span>
                  <div>
                    <div className="core-value-name">{v.title}</div>
                    <div className="core-value-text">{v.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right: intro content */}
        <motion.div variants={fadeRight} initial="hidden" whileInView="visible" viewport={vp} className="about-content-col">
          <span className="about-eyebrow"><Sparkles size={12} /> About Shimanzu</span>
          <h2 className="about-home-heading">
            Growing Agriculture. <span>Empowering Farmers.</span> Building a Better Future.
          </h2>
          <p className="about-home-para">
            Shimanzu Chemicals Private Limited is a professionally managed agricultural solutions company committed to delivering innovative, reliable, and quality-driven solutions for modern farming.
          </p>
          <p className="about-home-para">
            We understand that agriculture is more than just a profession—it is the foundation of our society and economy. At Shimanzu Chemicals, quality, innovation, farmer satisfaction, and integrity are at the core of our business.
          </p>

          <ul className="about-highlights-list">
            {highlights.map((text) => (
              <li key={text} className="about-highlight-item">
                <span className="highlight-icon"><CheckCircle2 size={15} /></span>
                <span>{text}</span>
              </li>
            ))}
          </ul>

          <Link to="/about" className="about-learn-btn">
            Learn More About Us <ArrowRight size={15} />
          </Link>
        </motion.div>
      </div>

      {/* Connect + Portfolio — poster style */}
      <div className="ab-cards-grid">
        <motion.div custom={0} variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp} className="ab-card ab-card--orange">
          <h3 className="ab-card-title">Farmer &amp; Distributor Connect</h3>
          <p className="ab-card-text">
            Shimanzu&apos;s greatest strength is its people — the farmers and distributors who form the foundation of our journey.
          </p>

          <h4 className="ab-card-sub">We Continuously Invest In :</h4>
          <ul className="ab-list">
            {investments.map((text) => (
              <li key={text}>{text}</li>
            ))}
          </ul>

          <h4 className="ab-card-sub">Our Philosophy Is Simple :</h4>
          <p className="ab-card-text">Shimanzu grows only when our farmers and partners grow.</p>

          <blockquote className="ab-quote">
            &quot;Our Distributors And Farmers Are Our True Strength&quot;
          </blockquote>
        </motion.div>

        <motion.div custom={1} variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp} className="ab-card ab-card--blue">
          <h3 className="ab-card-title">Our Product Portfolio</h3>

          <ul className="portfolio-list">
            {portfolio.map((p) => (
              <li key={p.title} className="portfolio-item">
                <div className="portfolio-name">{p.title}</div>
                <div className="portfolio-text">{p.text}</div>
                {p.tagline && <div className="portfolio-text portfolio-tagline">{p.tagline}</div>}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  </section>
);

export default AboutSection;
