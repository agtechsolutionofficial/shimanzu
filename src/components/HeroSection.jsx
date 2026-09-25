import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';
import './HeroSection.css';

import gif1 from '../assets/images/gif1-min.gif';
import gif2 from '../assets/images/gif2-min.gif';
import seedlingVideo from '../assets/images/Seedling_growing_from_soil-clip-1_20260925110529.mp4';

const timeline = [
  { type: 'gif',   src: gif1,          duration: 6000 },
  { type: 'gif',   src: gif2,          duration: 6000 },
  { type: 'video', src: seedlingVideo, duration: 12000 },
];

const kbClass = ['kb-zoom-in', 'kb-pan-left', 'kb-pan-right', 'kb-zoom-out', 'kb-zoom-in-left', 'kb-zoom-in-right'];
const FADE = 800;

const HeroSection = () => {
  const [cur, setCur]           = useState(0);
  const [nxt, setNxt]           = useState(null);
  const [entering, setEntering] = useState(false);
  const timerRef                = useRef(null);

  const advance = (from) => {
    const next = (from + 1) % timeline.length;
    setNxt(next);
    setEntering(true);
    setTimeout(() => {
      setCur(next);
      setNxt(null);
      setEntering(false);
    }, FADE);
  };

  useEffect(() => {
    timerRef.current = setTimeout(() => advance(cur), timeline[cur].duration);
    return () => clearTimeout(timerRef.current);
  }, [cur]);

  const renderLayer = (index, cls) => {
    const item = timeline[index];
    if (!item) return null;
    if (item.type === 'gif') {
      return (
        <div key={`${index}-${cls}`} className={`hero-layer ${cls}`}>
          <img src={item.src} alt="Shimanzu agriculture" className="hero-gif" />
          <div className="hero-overlay" />
        </div>
      );
    }
    if (item.type === 'video') {
      return (
        <div key={`${index}-${cls}`} className={`hero-layer ${cls}`}>
          <video
            src={item.src}
            autoPlay
            muted
            loop
            playsInline
            className="hero-gif"
          />
          <div className="hero-overlay" />
        </div>
      );
    }
    const kb = kbClass[index % kbClass.length];
    return (
      <div key={`${index}-${cls}`} className={`hero-layer ${cls}`}>
        <div className={`hero-img-bg ${kb}`} style={{ backgroundImage: `url(${item.src})` }} />
        <div className="hero-overlay" />
      </div>
    );
  };

  const scrollDown = () => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });

  return (
    <section className="hero">
      <div className="hero-stage">
        {renderLayer(cur, entering ? 'layer-exit' : 'layer-active')}
        {nxt !== null && renderLayer(nxt, 'layer-enter')}

<div className="container hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Advanced Agricultural<br />
              Solutions for a<br />
              <span className="hero-title-accent">Better Tomorrow</span>
            </h1>
            <p className="hero-desc">
              Shimanzu Japan develops and provides premium agricultural chemical and crop-care solutions — combining Japanese scientific precision with deep understanding of farmer needs for sustainable, high-yield agriculture.
            </p>
            <div className="hero-actions">
              <Link to="/products" className="hero-btn-primary">
                Explore Products <ArrowRight size={18} />
              </Link>
              <Link to="/about" className="hero-btn-secondary">
                Discover Shimanzu
              </Link>
            </div>

            {/* Stats strip */}
            <div className="hero-stats">
              <div className="hero-stat">
                <span className="hs-num">20,000+</span>
                <span className="hs-label">Farmers Served</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <span className="hs-num">157+</span>
                <span className="hs-label">Export Countries</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <span className="hs-num">200+</span>
                <span className="hs-label">Quality Products</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll down indicator */}
        <button className="hero-scroll-btn" onClick={scrollDown} aria-label="Scroll down">
          <ChevronDown size={22} />
        </button>

        {/* Progress bar */}
        <div className="hero-progress">
          <div className="hero-progress-bar" style={{ animationDuration: '33s' }} />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
