import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './BrandsSection.css';

import t1  from '../../assets/images/transparent (1).png';
import t2  from '../../assets/images/transparent (2).png';
import t3  from '../../assets/images/transparent (3).png';
import t4  from '../../assets/images/transparent (4).png';
import t5  from '../../assets/images/transparent (5).png';
import t6  from '../../assets/images/transparent (6).png';
import t8  from '../../assets/images/transparent (8).png';
import t9  from '../../assets/images/transparent (9).png';
import t10 from '../../assets/images/transparent (10).png';
import t11 from '../../assets/images/transparent (11).png';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: (i=0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i*0.07, ease: 'easeOut' } }) };
const vp = { once: true, margin: '-50px' };

const BRANDS = [
  { name: 'Black Label',  sub: 'Herbicide',          color: '#15803D', img: t1  },
  { name: 'Khufia',       sub: 'Insecticide',         color: '#7C3AED', img: t2  },
  { name: 'Forodon',      sub: 'Soil Protection',     color: '#B45309', img: t3  },
  { name: 'M-45',         sub: 'Fungicide',           color: '#0F766E', img: t4  },
  { name: 'Hanako',       sub: 'Growth Promoter',     color: '#1D4ED8', img: t5  },
  { name: 'Volvo',        sub: 'Systemic Fungicide',  color: '#0F766E', img: t6  },
  { name: 'Altacor',      sub: 'Insect Control',      color: '#7C3AED', img: t8  },
  { name: 'Beleaf',       sub: 'Sucking Pest Control',color: '#15803D', img: t9  },
  { name: 'Azoxy-Top',    sub: 'Duo Fungicide',       color: '#0F766E', img: t10 },
  { name: 'Gibber-Max',   sub: 'Plant Growth Reg.',   color: '#1D4ED8', img: t11 },
];

const BrandsSection = () => (
  <section className="brands-section">
    {/* Background decoration */}
    <div className="brands-bg-deco" />

    <div className="container" style={{ position: 'relative', zIndex: 1 }}>
      <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp} className="brands-header">
        <span className="brands-eyebrow">OUR PRODUCT PORTFOLIO</span>
        <h2 className="brands-heading">Trusted Brands. Proven Results.</h2>
        <p className="brands-subtext">
          A portfolio of precision-engineered agrochemical brands developed with Japanese technology for Indian farming conditions.
        </p>
      </motion.div>

      <div className="brands-grid">
        {BRANDS.map((brand, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={vp}
            className="brand-card"
            style={{ '--brand-color': brand.color }}
          >
            <div className="brand-img-wrap">
              <img src={brand.img} alt={brand.name} className="brand-img" loading="lazy" />
            </div>
            <div className="brand-info">
              <div className="brand-name">{brand.name}</div>
              <div className="brand-sub">{brand.sub}</div>
            </div>
            <div className="brand-hover-line" />
          </motion.div>
        ))}
      </div>

      <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp} className="brands-cta">
        <Link to="/products" className="brands-cta-btn">
          View All Products <ArrowRight size={16} />
        </Link>
      </motion.div>
    </div>
  </section>
);

export default BrandsSection;
