import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from 'react-icons/fa';
import './Footer.css';
import logoImg from '../assets/images/1712639794.png';

const Footer = () => {
  const location = useLocation();
  const isLightPage = ['/about', '/products', '/crops', '/gallery', '/blog', '/contact'].some(path => location.pathname.startsWith(path));

  return (
    <footer className={`footer ${isLightPage ? 'light-mode' : ''}`}>
      <div className="footer-top-bar" />
      <div className="container">
      <div className="footer-grid">
        {/* Brand */}
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <img src={logoImg} alt="Shimanzu Japan" className="footer-logo-img" />
          </Link>
          <p className="footer-desc">
            Empowering farmers with advanced Japanese agrochemical research and state-of-the-art manufacturing for sustainable, high-yield agriculture.
          </p>
          <div className="social-links">
            <a href="#" className="social-icon" aria-label="Facebook"><FaFacebookF size={15} /></a>
            <a href="#" className="social-icon" aria-label="Instagram"><FaInstagram size={15} /></a>
            <a href="#" className="social-icon" aria-label="Twitter"><FaTwitter size={15} /></a>
            <a href="#" className="social-icon" aria-label="LinkedIn"><FaLinkedinIn size={15} /></a>
          </div>
        </div>

        {/* Company */}
        <div className="footer-links-col">
          <h4 className="footer-title">Company</h4>
          <ul className="footer-links">
            <li><Link to="/about">About Shimanzu</Link></li>
            <li><Link to="/about">Our Mission</Link></li>
            <li><Link to="/about">Quality & Testing</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Products */}
        <div className="footer-links-col">
          <h4 className="footer-title">Products</h4>
          <ul className="footer-links">
            <li><Link to="/products">All Products</Link></li>
            <li><Link to="/products">Fungicides</Link></li>
            <li><Link to="/products">Herbicides</Link></li>
            <li><Link to="/products">Insecticides</Link></li>
            <li><Link to="/products">Precision Platforms</Link></li>
          </ul>
        </div>

        {/* Agriculture */}
        <div className="footer-links-col">
          <h4 className="footer-title">Agriculture</h4>
          <ul className="footer-links">
            <li><Link to="/crops">Crops</Link></li>
            <li><Link to="/products">Solutions</Link></li>
            <li><Link to="/gallery">Gallery</Link></li>
            <li><Link to="/blog">Resources</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-contact">
          <h4 className="footer-title">Reach Us</h4>
          <div className="contact-item">
            <MapPin size={18} className="contact-icon" />
            <span>Plot No 271, Village Nawada, Uttam Nagar, New Delhi - 110059</span>
          </div>
          <div className="contact-item">
            <Phone size={18} className="contact-icon" />
            <span>1800 309 3053 (Toll-Free)</span>
          </div>
          <div className="contact-item">
            <Mail size={18} className="contact-icon" />
            <span>japan@shimanzu.com</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Shimanzu Chemicals Private Limited. All rights reserved.</p>
        <div className="footer-bottom-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Use</a>
        </div>
      </div>
    </div>
  </footer>
);
};

export default Footer;
