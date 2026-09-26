import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';
import './Navbar.css';
import logoImg from '../assets/images/1712639794.png';

const navLinks = [
  { name: 'Home',       path: '/' },
  { name: 'About',      path: '/about' },
  { name: 'Products',   path: '/products' },
  { name: 'Crops',      path: '/crops' },
  { name: 'Gallery',    path: '/gallery' },
  { name: 'Blog',       path: '/blog' },
  { name: 'Contact',    path: '/contact' },
];

const Navbar = () => {
  const [isOpen,   setIsOpen]   = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [location]);

  const isLightPage = ['/about', '/products', '/crops', '/gallery', '/blog', '/contact'].some(path => location.pathname.startsWith(path));
  const isScrolled = scrolled || isLightPage;

  return (
    <header className={`navbar ${isScrolled ? 'scrolled' : ''} ${isLightPage ? 'light-mode' : ''}`}>
      <div className="container navbar-container" style={{ position: 'relative', zIndex: 2 }}>
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <img src={logoImg} alt="Shimanzu Japan" className="navbar-logo-img" />
        </Link>

        {/* Desktop Nav */}
        <nav className="navbar-links desktop-only">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="navbar-actions desktop-only">
          <Link to="/contact" className="navbar-cta-btn">
            <Phone size={15} />
            Get in Touch
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <div className={`mobile-nav ${isOpen ? 'open' : ''}`}>
        <div className="container">
          <nav className="mobile-links">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path}
                className={`mobile-nav-link ${location.pathname === link.path ? 'active' : ''}`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="mobile-actions">
            <Link to="/contact" className="navbar-cta-btn" style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}>
              <Phone size={15} /> Get in Touch
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
