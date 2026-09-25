import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import './QualitySection.css';
const qualityImg = 'https://images.pexels.com/photos/954583/pexels-photo-954583.jpeg?auto=compress&cs=tinysrgb&w=900';

const fadeLeft = { hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut' } } };
const fadeRight = { hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut' } } };
const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.12, ease: 'easeOut' } }) };
const vp = { once: true, margin: '-50px' };

const steps = [
  { num: '01', title: 'Product Research', desc: 'Identifying agricultural needs and developing targeted chemical solutions based on crop science and pest biology.' },
  { num: '02', title: 'Laboratory Testing', desc: 'Rigorous GLC, HPLC, and UV analysis verifying active ingredient purity and formulation stability.' },
  { num: '03', title: 'Quality Analysis', desc: 'Multi-parameter quality checks ensuring every batch meets ISO 9001:2015 certified standards.' },
  { num: '04', title: 'Field Evaluation', desc: 'Real-world crop trials across diverse agro-climatic zones to validate efficacy and crop safety.' },
  { num: '05', title: 'Final Quality Control', desc: 'Comprehensive pre-dispatch inspection and batch traceability before products reach farmers.' },
];

const highlights = [
  'Quality-focused manufacturing processes',
  'Controlled testing at every production stage',
  'Agricultural performance evaluation in field conditions',
  'Consistent product standards across all batches',
];

const QualitySection = () => (
  <section className="quality-section">
    <div className="container">
      <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp} className="quality-header">
        <span className="quality-label">QUALITY ASSURANCE</span>
        <h2 className="quality-heading">Quality You Can Trust</h2>
        <p className="quality-subtext">
          Every Shimanzu product passes through a rigorous multi-stage quality process before reaching your farm.
        </p>
      </motion.div>

      <div className="quality-main-grid">
        {/* Left: Lab Image */}
        <motion.div variants={fadeLeft} initial="hidden" whileInView="visible" viewport={vp} className="quality-img-col">
          <div className="quality-img-wrap">
            <img
              src={qualityImg}
              alt="Quality laboratory testing"
              className="quality-main-img"
              loading="lazy"
            />
            <div className="quality-img-badge">
              <span className="quality-badge-icon">✓</span>
              <div>
                <div className="quality-badge-title">ISO 9001:2015</div>
                <div className="quality-badge-sub">Certified Manufacturing</div>
              </div>
            </div>
          </div>

          <div className="quality-highlights">
            {highlights.map((h, i) => (
              <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp} className="quality-highlight-item">
                <CheckCircle2 size={16} className="qh-icon" />
                <span>{h}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right: Process Steps */}
        <motion.div variants={fadeRight} initial="hidden" whileInView="visible" viewport={vp} className="quality-steps-col">
          {steps.map((step, i) => (
            <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp} className="quality-step">
              <div className="step-num-col">
                <div className="step-number">{step.num}</div>
                {i < steps.length - 1 && <div className="step-connector" />}
              </div>
              <div className="step-content">
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  </section>
);

export default QualitySection;
