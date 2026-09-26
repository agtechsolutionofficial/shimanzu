import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Leaf } from 'lucide-react';
import './ReviewsSection.css';
import kisaan1 from '../../assets/images/kisaan1.jpg';
import kisaan2 from '../../assets/images/kisaan2.jpg';
import kisaan3 from '../../assets/images/kisaan3.jpg';
import kisaan4 from '../../assets/images/kisaan4.jpg';
import kisaan5 from '../../assets/images/kisaan5.jpg';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08, ease: 'easeOut' } }) };
const vp = { once: true, margin: '-50px' };

const FEATURED = [
  {
    id: 1,
    name: 'Vikram Singh',
    location: 'Uttar Pradesh',
    rating: 5,
    text: 'Excellent product quality. Shimanzu herbicides gave me the cleanest paddy fields I have ever seen. Will continue using their products.',
    img: kisaan1,
  },
  {
    id: 2,
    name: 'Rajesh Kumar',
    location: 'Punjab',
    rating: 5,
    text: 'Shimanzu products have transformed my paddy yield. The Black Label herbicide gave me clean fields and the Forodon granules protected my roots completely.',
    img: kisaan2,
  },
  {
    id: 3,
    name: 'Suresh Patel',
    location: 'Maharashtra',
    rating: 5,
    text: 'As a distributor, I have seen many brands. Shimanzu stands apart with consistent quality, reliable support and real results.',
    img: kisaan3,
  },
];

const CARDS = [
  { id: 4, name: 'Priya Nair',     location: 'Kerala',         rating: 5, img: kisaan4, text: 'The Volvo Systemic fungicide worked wonders on my coconut plantation. Fast results and no crop damage. Highly satisfied.' },
  { id: 5, name: 'Harpreet Kaur', location: 'Punjab',         rating: 5, img: kisaan5, text: 'Shimanzu customer support is excellent. They guided me on the right product for my wheat crop and the results were outstanding.' },
  { id: 6, name: 'Ramesh Yadav',  location: 'Maharashtra',    rating: 5, img: kisaan1, text: 'Good quality products with consistent results. The packaging is professional and the dosage instructions are very clear.' },
  { id: 7, name: 'Deepak Verma',  location: 'Madhya Pradesh', rating: 5, img: kisaan2, text: 'I have been using Shimanzu products for 3 seasons now. The quality never disappoints. My soybean yield has improved significantly.' },
  { id: 8, name: 'Sunita Devi',   location: 'Bihar',          rating: 5, img: kisaan3, text: 'Forefront 3G is the best soil insecticide I have used. It protected my rice crop from stem borers completely. Very happy with the results.' },
];

const Stars = ({ rating, size = 16 }) => (
  <div className="rev-stars">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} size={size} fill={i < rating ? '#F59E0B' : 'transparent'} color={i < rating ? '#F59E0B' : '#ccc'} />
    ))}
  </div>
);

const ReviewsSection = () => {
  const [active, setActive] = useState(0);
  const timerRef = useRef(null);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive(prev => (prev + 1) % FEATURED.length);
    }, 4000);
  };

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleSelect = (idx) => {
    setActive(idx);
    startTimer();
  };

  const f = FEATURED[active];

  return (
    <section className="reviews-section">
      <div className="reviews-bg-img" />
      <div className="reviews-bg-overlay" />

      <div className="container reviews-inner">
        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp} className="reviews-header">
          <div className="reviews-eyebrow-row">
            <span className="reviews-eyebrow-line" />
            <span className="reviews-label"><Leaf size={13} /> CUSTOMER REVIEWS</span>
            <span className="reviews-eyebrow-line" />
          </div>
          <h2 className="reviews-heading">What Our Customers Say</h2>
          <p className="reviews-subtext">Real feedback from farmers and agricultural partners across India.</p>
        </motion.div>

        {/* Featured card */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp} className="reviews-featured">
          <div className="rf-img-wrap">
            <img src={f.img} alt={f.name} className="rf-img" />
          </div>
          <div className="rf-content">
            <Stars rating={f.rating} size={20} />
            <div className="rf-quote-icon">"</div>
            <p className="rf-text">"{f.text}"</p>
            <div className="rf-author">
              <div className="rf-avatar">{f.name.charAt(0)}</div>
              <div>
                <div className="rf-name">{f.name}</div>
                <div className="rf-loc"><MapPin size={11} /> {f.location}</div>
              </div>
            </div>
            <div className="rf-dots">
              {FEATURED.map((_, i) => (
                <button key={i} className={`rf-dot${i === active ? ' active' : ''}`} onClick={() => handleSelect(i)} />
              ))}
            </div>
            <div className="rf-leaf-deco" />
          </div>
        </motion.div>

        {/* 5 small cards */}
        <div className="reviews-grid">
          {CARDS.map((r, i) => (
            <motion.div key={r.id} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp} className="review-card">
              <div className="rc-top">
                <Stars rating={r.rating} size={14} />
                <Leaf size={14} className="rc-leaf" />
              </div>
              <p className="rc-text"><span className="rc-quote">"</span>{r.text}"</p>
              <div className="rc-author">
                {r.img
                ? <img src={r.img} alt={r.name} className="rc-avatar-img" />
                : <div className="rc-avatar">{r.name.charAt(0)}</div>
              }
                <div>
                  <div className="rc-name">{r.name}</div>
                  <div className="rc-loc"><MapPin size={10} /> {r.location}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom divider */}
        <div className="reviews-footer-divider">
          <span /><Leaf size={14} className="reviews-footer-leaf" /><span />
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
