import React from 'react';
import { motion } from 'framer-motion';
import { FlaskConical, Microscope, ShieldCheck, TestTube, Sprout, Leaf, ArrowRight } from 'lucide-react';
import './ResearchSection.css';
import img1 from '../../assets/images/1694428044.webp';
import img2 from '../../assets/images/1694428114.webp';
import img3 from '../../assets/images/1694428214.webp';
import img4 from '../../assets/images/1694428268.webp';
import img5 from '../../assets/images/1713003063.webp';

const fadeUp = { hidden: { opacity: 0, y: 35 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.55, delay: i * 0.1, ease: 'easeOut' } }) };
const vp = { once: true, margin: '-50px' };

const cards = [
  {
    icon: <FlaskConical size={22} />,
    img: img1,
    title: 'Product Testing',
    desc: 'Every formulation undergoes rigorous multi-stage testing protocols to verify active ingredient concentration, stability and field performance.',
  },
  {
    icon: <Microscope size={22} />,
    img: img2,
    title: 'Laboratory Analysis',
    desc: 'Advanced GLC, HPLC, and UV spectroscopy instruments ensure molecular purity and formulation integrity at every production batch.',
  },
  {
    icon: <ShieldCheck size={22} />,
    img: img3,
    title: 'Quality Control',
    desc: 'ISO 9001:2015 certified quality management systems govern every step from raw material sourcing to finished product inspection.',
  },
  {
    icon: <TestTube size={22} />,
    img: img4,
    title: 'Safety Evaluation',
    desc: 'Comprehensive safety assessments ensure all products meet regulatory standards for crop safety, workers and environment.',
  },
  {
    icon: <Sprout size={22} />,
    img: img5,
    title: 'Research & Development',
    desc: 'Continuous R&D investment drives next-generation formulations combining Japanese molecular science with local agro-climatic insights.',
  },
];

const ResearchSection = () => (
  <section className="research-section">
    <div className="research-bg-img" />
    <div className="research-bg-overlay" />

    <div className="container research-inner">
      <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp} className="research-header">
        <div className="research-eyebrow-row">
          <span className="research-eyebrow-line" />
          <span className="research-label"><Leaf size={13} /> SCIENCE &amp; INNOVATION</span>
          <span className="research-eyebrow-line" />
        </div>
        <h2 className="research-heading">Science Behind Every Solution</h2>
        <p className="research-subtext">
          Our approach to agricultural chemistry is rooted in rigorous scientific methodology,<br />
          combining Japanese precision with deep understanding of Indian farming conditions.
        </p>
        <div className="research-divider">
          <span /><Leaf size={14} className="research-divider-leaf" /><span />
        </div>
      </motion.div>

      <div className="research-cards-grid">
        {cards.map((card, i) => (
          <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp} className="research-card">
            <div className="research-card-img-wrap">
              <img src={card.img} alt={card.title} className="research-card-img" loading="lazy" />
              <div className="research-card-icon">{card.icon}</div>
            </div>
            <div className="research-card-body">
              <h3 className="research-card-title">{card.title}</h3>
              <p className="research-card-desc">{card.desc}</p>
              <a href="#" className="research-card-link">Learn More <ArrowRight size={14} /></a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ResearchSection;
