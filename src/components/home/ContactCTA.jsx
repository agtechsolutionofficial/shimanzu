import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Send } from 'lucide-react';
import './ContactCTA.css';
import contactImg from '../../assets/images/video_slides/slide_1.jpeg';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1, ease: 'easeOut' } }) };
const vp = { once: true, margin: '-50px' };

const ContactCTA = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setForm({ name: '', email: '', phone: '', company: '', message: '' });
  };

  return (
    <section className="contact-cta-section">
      <div className="contact-cta-bg" />
      <div className="container">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp} className="contact-cta-header">
          <span className="contact-cta-label">GET IN TOUCH</span>
          <h2 className="contact-cta-heading">Let's Grow Better Together</h2>
          <p className="contact-cta-subtext">
            Connect with Shimanzu Japan for product information, agricultural guidance, or business partnership inquiries.
          </p>
        </motion.div>

        <div className="contact-cta-grid">
          {/* Contact Info */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp} className="contact-info-col">
            <div className="contact-info-card">
              <div className="cic-item">
                <div className="cic-icon"><MapPin size={20} /></div>
                <div>
                  <div className="cic-label">Our Address</div>
                  <div className="cic-value">Plot No 271, Village Nawada, Uttam Nagar, New Delhi - 110059</div>
                </div>
              </div>
              <div className="cic-item">
                <div className="cic-icon"><Phone size={20} /></div>
                <div>
                  <div className="cic-label">Phone</div>
                  <div className="cic-value">1800 309 3053 (Toll-Free)</div>
                </div>
              </div>
              <div className="cic-item">
                <div className="cic-icon"><Mail size={20} /></div>
                <div>
                  <div className="cic-label">Email</div>
                  <div className="cic-value">japan@shimanzu.com</div>
                </div>
              </div>
            </div>

            <div className="contact-img-wrap">
              <img
                src={contactImg}
                alt="Agricultural fields"
                className="contact-img"
                loading="lazy"
              />
              <div className="contact-img-overlay" />
              <div className="contact-img-badge">
                <span>🌾</span>
                <div>
                  <div className="cib-title">Farmer-First Approach</div>
                  <div className="cib-sub">Supporting agriculture across India</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp} className="contact-form-col">
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="cf-row">
                <div className="cf-field">
                  <label className="cf-label">Full Name *</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange} className="cf-input" placeholder="Your full name" required />
                </div>
                <div className="cf-field">
                  <label className="cf-label">Email Address *</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} className="cf-input" placeholder="your@email.com" required />
                </div>
              </div>
              <div className="cf-row">
                <div className="cf-field">
                  <label className="cf-label">Phone Number</label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange} className="cf-input" placeholder="+91 XXXXX XXXXX" />
                </div>
                <div className="cf-field">
                  <label className="cf-label">Company / Farm Name</label>
                  <input type="text" name="company" value={form.company} onChange={handleChange} className="cf-input" placeholder="Your company or farm" />
                </div>
              </div>
              <div className="cf-field">
                <label className="cf-label">Message *</label>
                <textarea name="message" value={form.message} onChange={handleChange} className="cf-textarea" placeholder="Tell us about your agricultural needs or inquiry..." rows={5} required />
              </div>
              <button type="submit" className="cf-submit-btn">
                {submitted ? '✓ Message Sent!' : <><Send size={16} /> Send Message</>}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;
