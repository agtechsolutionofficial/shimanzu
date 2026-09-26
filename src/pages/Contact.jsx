import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const Contact = () => {
  return (
    <div className="light-theme" style={{ backgroundColor: 'var(--bg-dark)', minHeight: '100vh', paddingBottom: '100px' }}>
      <div style={{ backgroundColor: 'var(--bg-card)', padding: '120px 0 60px', borderBottom: '1px solid var(--border-color)', textAlign: 'center' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container"
        >
          <h1 className="h2" style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>Contact Us</h1>
          <p className="text-secondary">We're here to help you grow.</p>
        </motion.div>
      </div>

      <div className="container" style={{ marginTop: '80px' }}>
        <div className="grid grid-cols-2 gap-8 items-start">
          
          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ background: 'var(--bg-card)', padding: '40px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}
          >
            <h2 className="h4" style={{ color: 'var(--accent-gold)', marginBottom: '24px' }}>Send us a Message</h2>
            <form onSubmit={e => e.preventDefault()}>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', outline: 'none' }}
                />
                <input 
                  type="email" 
                  placeholder="Your Email" 
                  style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', outline: 'none' }}
                />
              </div>
              <input 
                type="text" 
                placeholder="Subject" 
                style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', marginBottom: '16px', outline: 'none' }}
              />
              <textarea 
                placeholder="How can we help?" 
                rows="5"
                style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', marginBottom: '24px', resize: 'vertical', outline: 'none' }}
              ></textarea>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="btn btn-gold" style={{ width: '100%' }}>Send Inquiry</motion.button>
            </form>
          </motion.div>

          {/* Contact Details */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <motion.div whileHover={{ x: 5 }} style={{ background: 'var(--bg-card)', padding: '32px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', display: 'flex', gap: '24px', alignItems: 'center' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(212, 175, 55, 0.1)', color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Phone size={32} />
                </div>
                <div>
                  <h3 className="h5" style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Call Us</h3>
                  <p className="text-secondary" style={{ fontSize: '1.2rem' }}>1800 309 3053</p>
                  <p className="text-muted" style={{ fontSize: '0.85rem' }}>Toll-Free, 24/7 Support</p>
                </div>
              </motion.div>

              <motion.div whileHover={{ x: 5 }} style={{ background: 'var(--bg-card)', padding: '32px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', display: 'flex', gap: '24px', alignItems: 'center' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Mail size={32} />
                </div>
                <div>
                  <h3 className="h5" style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Email Us</h3>
                  <p className="text-secondary" style={{ fontSize: '1.2rem' }}>japan@shimanzu.com</p>
                  <p className="text-muted" style={{ fontSize: '0.85rem' }}>We usually reply within 2 hours</p>
                </div>
              </motion.div>

              <motion.div whileHover={{ x: 5 }} style={{ background: 'var(--bg-card)', padding: '32px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', display: 'flex', gap: '24px', alignItems: 'center' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(212, 175, 55, 0.1)', color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MapPin size={32} />
                </div>
                <div>
                  <h3 className="h5" style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Visit HQ</h3>
                  <p className="text-secondary">Plot No 271, Village Nawada</p>
                  <p className="text-muted" style={{ fontSize: '0.85rem' }}>Uttam Nagar, New Delhi - 110059</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
