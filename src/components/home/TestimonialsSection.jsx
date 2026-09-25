import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, MapPin, Leaf } from 'lucide-react';
import './TestimonialsSection.css';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } };
const vp = { once: true, margin: '-50px' };

// Placeholder testimonials — replace with real data when available
const TESTIMONIALS = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    role: 'Progressive Farmer',
    location: 'Punjab, India',
    img: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=120',
    text: 'Shimanzu products have transformed my paddy yield. The Black Label herbicide gave me clean fields and the Forodon granules protected my roots completely. I trust Shimanzu for every season.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Suresh Patel',
    role: 'Agricultural Distributor',
    location: 'Maharashtra, India',
    img: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=120',
    text: 'As a distributor, I have seen many brands. Shimanzu stands apart with consistent quality, reliable support and real results.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Anita Sharma',
    role: 'Vegetable Farmer',
    location: 'Haryana, India',
    img: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=120',
    text: 'I\'m-45 Mancozeb saved my tomato crop from blight last season. The product quality is outstanding and the results are visible within days.',
    rating: 5,
  },
  {
    id: 4,
    name: 'Mohammed Farooq',
    role: 'Cotton Farmer',
    location: 'Telangana, India',
    img: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=120',
    text: 'Khufia Fopronil gave me excellent control over bollworm and stem borer in my cotton. The dual-action chemistry is truly effective. Shimanzu understands what farmers need.',
    rating: 5,
  },
];

const TestimonialsSection = () => {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent(c => (c - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const next = () => setCurrent(c => (c + 1) % TESTIMONIALS.length);

  const t = TESTIMONIALS[current];

  return (
    <section className="testimonials-section">
      <div className="testimonials-bg-pattern" />
      <div className="container">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp} className="testimonials-header">
          <div className="testimonials-eyebrow-row">
            <span className="testimonials-eyebrow-line" />
            <span className="testimonials-label"><Leaf size={13} /> TRUSTED PARTNERS</span>
            <span className="testimonials-eyebrow-line" />
          </div>
          <h2 className="testimonials-heading">Trusted by Agricultural Partners</h2>
          <p className="testimonials-subtext">
            Hear from the farmers and distributors who rely on Shimanzu solutions every season.
          </p>
        </motion.div>

        <div className="testimonials-layout">
          {/* Featured large testimonial */}
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4 }}
            className="testimonial-featured"
          >
            <div className="tf-stars">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} size={18} fill="#F59E0B" color="#F59E0B" />
              ))}
            </div>
            <p className="tf-text">"{t.text}"</p>
            <div className="tf-leaf-deco" />
            <div className="tf-author">
              {t.img
                ? <img src={t.img} alt={t.name} className="tf-author-img" />
                : <div className="tf-author-avatar">{t.name.charAt(0)}</div>
              }
              <div>
                <div className="tf-author-name">{t.name}</div>
                <div className="tf-author-role">{t.role}</div>
                <div className="tf-author-location"><MapPin size={11} /> {t.location}</div>
              </div>
            </div>
            <div className="tf-quote-bg">""</div>
          </motion.div>

          {/* Side cards */}
          <div className="testimonials-side">
            {TESTIMONIALS.filter((_, i) => i !== current).slice(0, 2).map((item) => (
              <div key={item.id} className="testimonial-side-card" onClick={() => setCurrent(TESTIMONIALS.indexOf(item))}>
                <div className="tsc-top">
                  <div className="tsc-stars">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} size={14} fill="#F59E0B" color="#F59E0B" />
                    ))}
                  </div>
                  <span className="tsc-quote-bg">""</span>
                </div>
                <p className="tsc-text">"{item.text.slice(0, 110)}..."</p>
                <div className="tsc-author">
                  {item.img
                    ? <img src={item.img} alt={item.name} className="tsc-img" />
                    : <div className="tsc-avatar">{item.name.charAt(0)}</div>
                  }
                  <div>
                    <div className="tsc-name">{item.name}</div>
                    <div className="tsc-role">{item.role}</div>
                    <div className="tsc-location"><MapPin size={10} /> {item.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="testimonials-nav">
          <button className="tn-btn" onClick={prev} aria-label="Previous"><ChevronLeft size={20} /></button>
          <div className="tn-dots">
            {TESTIMONIALS.map((_, i) => (
              <button key={i} className={`tn-dot ${i === current ? 'active' : ''}`} onClick={() => setCurrent(i)} aria-label={`Go to ${i + 1}`} />
            ))}
          </div>
          <button className="tn-btn" onClick={next} aria-label="Next"><ChevronRight size={20} /></button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
