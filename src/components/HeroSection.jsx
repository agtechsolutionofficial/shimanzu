import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';
import './HeroSection.css';

import seedlingVideo from '../assets/images/Seedling_growing_from_soil-clip-1_20260925110529.mp4';
import slide2 from '../assets/images/slide2.mp4';
import slide3 from '../assets/images/slide3.mp4';
import slide4 from '../assets/images/slide4.mp4';
import dioxideVideo from '../assets/images/DIOXIDE VIDEO.mp4';
import slide6 from '../assets/images/slide_6.mp4';

const timeline = [
  { 
    type: 'video', src: seedlingVideo, duration: 5000,
    title1: "Advanced Agricultural", title2: "Solutions for a", titleAccent: "Better Tomorrow"
  },
  
  { 
    type: 'video', src: slide2, duration: 5000,
    title1: "Empowering Farmers:", title2: "Agrochemicals for", titleAccent: "Sustainable Growth"
  },
  { 
    type: 'video', src: slide3, duration: 5000,
    title1: "Advanced Agricultural", title2: "Solutions for a", titleAccent: "Better Tomorrow"
  },
  { 
    type: 'video', src: dioxideVideo, duration: 5000,
    title1: "Empowering Farmers:", title2: "Agrochemicals for", titleAccent: "Sustainable Growth"
  },
  { 
    type: 'video', src: slide4, duration: 5000,
    title1: "Maximizing Yields:", title2: "Japanese Technology for", titleAccent: "Healthy Crops"
  },
  { 
    type: 'video', src: slide6, duration: 4000,
    title1: "Tested for Excellence:", title2: "Japanese Technology for", titleAccent: "Better Crop Solutions"
  }
];

const HeroSection = () => {
  const [cur, setCur] = useState(0);
  const videoRefs = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    // 1. Ensure active video is playing
    const activeVideo = videoRefs.current[cur];
    if (activeVideo && activeVideo.paused) {
      activeVideo.play().catch(() => {});
    }

    // 2. Pre-warm and start next video so frames are ready before cross-fade starts
    const nextIdx = (cur + 1) % timeline.length;
    const nextVideo = videoRefs.current[nextIdx];
    if (nextVideo) {
      nextVideo.currentTime = 0;
      nextVideo.play().catch(() => {});
    }

    // 3. Pause other videos after crossfade completes (1.4s) to conserve CPU
    const pauseTimeout = setTimeout(() => {
      videoRefs.current.forEach((v, i) => {
        if (i !== cur && i !== nextIdx && v && !v.paused) {
          v.pause();
        }
      });
    }, 1400);

    // 4. Advance to next slide
    timerRef.current = setTimeout(() => {
      setCur(nextIdx);
    }, timeline[cur].duration);

    return () => {
      clearTimeout(pauseTimeout);
      clearTimeout(timerRef.current);
    };
  }, [cur]);

  const scrollDown = () => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });

  return (
    <section className="hero">
      <div className="hero-stage">
        {timeline.map((item, index) => {
          const isActive = index === cur;
          return (
            <div
              key={`hero-layer-${index}`}
              className="hero-layer"
              style={{
                opacity: isActive ? 1 : 0,
                zIndex: isActive ? 2 : 1,
                transition: 'opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
                pointerEvents: 'none'
              }}
            >
              <video
                ref={el => (videoRefs.current[index] = el)}
                src={item.src}
                muted
                loop
                playsInline
                preload="auto"
                className="hero-gif"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transform: 'scale(1.08) translateZ(0)',
                  backfaceVisibility: 'hidden'
                }}
              />
              <div className="hero-overlay" />
            </div>
          );
        })}

        <div className="container hero-container">
          <div className="hero-content">
            <h1 className="hero-title" key={`title-${cur}`}>
              {timeline[cur].title1}<br />
              {timeline[cur].title2}<br />
              <span className="hero-title-accent">{timeline[cur].titleAccent}</span>
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
