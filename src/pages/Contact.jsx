import React, { useState } from 'react';
import { MapPin, Phone, Mail, User, FileText, MessageSquare, Leaf, Send, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDataContext } from '../context/DataContext';
import './Contact.css';

const Contact = () => {
  const { addQuery } = useDataContext();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await addQuery({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || 'Not specified',
        location: 'Website Lead',
        productInterest: formData.subject.trim() || 'General Inquiry',
        subject: formData.subject.trim() || 'Contact Form Submission',
        message: formData.message.trim() || 'Customer requested assistance via contact page.'
      });

      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      console.error('Error submitting inquiry:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="contact-hero-bg"></div>
        <div className="contact-hero-leaves-left"></div>
        <div className="container contact-hero-container">
          <motion.div
            className="contact-hero-content"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="contact-hero-eyebrow">
              GET IN TOUCH
            </div>
            <h1 className="contact-hero-title">Contact Us</h1>
            <p className="contact-hero-subtitle">
              We're here to help you grow.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container">
        <div className="contact-layout">

          {/* Contact Form Card */}
          <motion.div
            className="contact-form-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="form-header">
              <h2 className="form-title"><Leaf size={28} color="#174D32" /> Send us a Message</h2>
              <p className="form-subtitle">Your Name and Email Address help us get back to you quickly.</p>
            </div>

            {submitted ? (
              <div style={{
                background: 'rgba(23, 77, 50, 0.08)',
                border: '1px solid #174D32',
                borderRadius: '12px',
                padding: '24px',
                textAlign: 'center',
                margin: '20px 0'
              }}>
                <CheckCircle2 size={40} color="#174D32" style={{ margin: '0 auto 12px' }} />
                <h3 style={{ color: '#174D32', margin: '0 0 8px 0', fontSize: '1.2rem', fontWeight: 700 }}>Thank you for reaching out!</h3>
                <p style={{ color: '#334155', margin: 0, fontSize: '0.95rem' }}>Your inquiry has been received. Our agrochemical team will contact you shortly.</p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  style={{
                    marginTop: '16px',
                    background: '#174D32',
                    color: '#fff',
                    border: 'none',
                    padding: '8px 18px',
                    borderRadius: '6px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="input-group">
                    <User size={18} className="input-icon" />
                    <input
                      type="text"
                      placeholder="Your Name *"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="contact-input"
                    />
                  </div>
                  <div className="input-group">
                    <Mail size={18} className="input-icon" />
                    <input
                      type="email"
                      placeholder="Your Email *"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="contact-input"
                    />
                  </div>
                </div>

                <div className="input-group">
                  <FileText size={18} className="input-icon" />
                  <input
                    type="text"
                    placeholder="Subject / Product of Interest"
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    className="contact-input"
                  />
                </div>

                <div className="input-group">
                  <MessageSquare size={18} className="input-icon" />
                  <textarea
                    placeholder="How can we help?"
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    className="contact-input contact-textarea"
                    rows={4}
                  ></textarea>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="submit-btn"
                  style={{ opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? 'wait' : 'pointer' }}
                >
                  <Send size={18} /> {isSubmitting ? 'SENDING...' : 'SEND INQUIRY →'}
                </motion.button>
              </form>
            )}
          </motion.div>

          {/* Contact Details */}
          <div className="info-cards-container">

            {/* Call Us */}
            <motion.div
              className="info-card"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="info-icon-circle">
                <Phone size={28} />
              </div>
              <div className="info-content">
                <h3 className="info-title">Call Us</h3>
                <p className="info-text-primary">1800 309 3053</p>
                <p className="info-text-secondary">Toll-Free, 24/7 Support</p>
              </div>
              <div className="info-card-line"></div>
              <Leaf size={80} className="info-card-watermark" />
            </motion.div>

            {/* Email Us */}
            <motion.div
              className="info-card"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="info-icon-circle">
                <Mail size={28} />
              </div>
              <div className="info-content">
                <h3 className="info-title">Email Us</h3>
                <p className="info-text-primary">japan@shimanzu.com</p>
                <p className="info-text-secondary">We usually reply within 2 hours</p>
              </div>
              <div className="info-card-line"></div>
              <Leaf size={80} className="info-card-watermark" />
            </motion.div>

            {/* Visit HQ */}
            <motion.div
              className="info-card"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="info-icon-circle">
                <MapPin size={28} />
              </div>
              <div className="info-content">
                <h3 className="info-title">Visit HQ</h3>
                <p className="info-text-primary">Plot No. 271, Village Nawada</p>
                <p className="info-text-secondary">Uttam Nagar, New Delhi - 110059</p>
              </div>
              <div className="info-card-line"></div>
              <Leaf size={80} className="info-card-watermark" />
            </motion.div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
