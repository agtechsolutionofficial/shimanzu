import React from 'react';
import { motion } from 'framer-motion';
import { Search, Folder, Calendar } from 'lucide-react';

const blog1Img = 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800';
const blog2Img = 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800';
const blog3Img = 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800';
const blog4Img = 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800';

const Blog = () => {
  const blogs = [
    {
      id: 1,
      title: "Shimanzu Chemicals: Pioneering Sustainable Agriculture",
      desc: "Shimanzu Chemicals Private Limited has been at the forefront of agrochemical innovation, providing farmers with cutting-edge solutions that enhance crop productivity while maintaining environmental sustainability. Our commitment to research and development has led to breakthrough formulations that address the most challenging agricultural problems faced by farmers today.",
      img: blog1Img,
      category: "Agriculture",
      date: "Mar 15, 2024"
    },
    {
      id: 2,
      title: "The Role of Fungicides in Modern Crop Protection",
      desc: "Fungal diseases are among the most devastating threats to agricultural productivity worldwide. At Shimanzu Chemicals, we have developed a comprehensive range of fungicide solutions that provide broad-spectrum protection against a wide variety of fungal pathogens. Our products are formulated using the latest Japanese technology to ensure maximum efficacy with minimal environmental impact.",
      img: blog2Img,
      category: "Crop Protection",
      date: "Feb 28, 2024"
    },
    {
      id: 3,
      title: "Integrated Pest Management: A Holistic Approach",
      desc: "Integrated Pest Management (IPM) represents a comprehensive approach to pest control that combines biological, cultural, physical, and chemical tools in a way that minimizes economic, health, and environmental risks. Shimanzu Chemicals supports IPM practices by offering targeted insecticide solutions that are effective against specific pests while preserving beneficial insects and the broader ecosystem.",
      img: blog3Img,
      category: "Pesticides",
      date: "Jan 20, 2024"
    },
    {
      id: 4,
      title: "Why Quality Agrochemicals Matter for Farmer Success",
      desc: "The quality of agrochemical products directly impacts crop yield, farmer profitability, and long-term soil health. Shimanzu Chemicals Private Limited is committed to manufacturing and distributing only the highest quality agrochemical products. Every product undergoes rigorous quality control testing to ensure it meets international standards before reaching the hands of farmers across India and beyond.",
      img: blog4Img,
      category: "Farming Tech",
      date: "Dec 10, 2023"
    }
  ];

  return (
    <div style={{ backgroundColor: 'var(--bg-dark)', minHeight: '100vh', paddingBottom: '100px' }}>
      <div style={{ backgroundColor: 'var(--bg-card)', padding: '120px 0 60px', borderBottom: '1px solid var(--border-color)', textAlign: 'center' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container"
        >
          <h1 className="h2" style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>Latest Blogs</h1>
          <p className="text-secondary">Home / Blogs</p>
        </motion.div>
      </div>

      <section className="section-padding">
        <div className="container">
          <div className="grid gap-8" style={{ gridTemplateColumns: '2fr 1fr' }}>
            
            {/* Blog List */}
            <div>
              {blogs.map((blog, idx) => (
                <motion.div 
                  key={blog.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}
                  style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', overflow: 'hidden', marginBottom: '2rem', cursor: 'pointer' }}
                >
                  <motion.div style={{ overflow: 'hidden' }}>
                    <motion.img 
                      src={blog.img} 
                      alt={blog.title} 
                      style={{ width: '100%', height: '350px', objectFit: 'cover' }} 
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.4 }}
                    />
                  </motion.div>
                  <div style={{ padding: '32px' }}>
                    <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', fontSize: '0.9rem' }}>
                      <span style={{ color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600' }}>
                        <Folder size={16} /> {blog.category}
                      </span>
                      <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Calendar size={16} /> {blog.date}
                      </span>
                    </div>
                    <h3 className="h3" style={{ marginBottom: '16px', color: 'var(--text-primary)' }}>{blog.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: '1.7' }}>{blog.desc}</p>
                    <motion.button 
                      whileHover={{ x: 5, backgroundColor: 'var(--accent-gold)', color: 'var(--bg-dark)' }}
                      whileTap={{ scale: 0.95 }}
                      className="btn btn-outline-gold"
                    >
                      Read More
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Sidebar */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', marginBottom: '24px' }}>
                <h4 className="h5" style={{ marginBottom: '16px', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>Search</h4>
                <div style={{ display: 'flex' }}>
                  <input type="text" placeholder="Search blogs..." style={{ width: '100%', padding: '12px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm) 0 0 var(--radius-sm)', color: 'var(--text-primary)', outline: 'none' }} />
                  <button style={{ background: 'var(--accent-gold)', color: 'var(--bg-dark)', padding: '0 16px', borderRadius: '0 var(--radius-sm) var(--radius-sm) 0', border: 'none', cursor: 'pointer' }}>
                    <Search size={20} />
                  </button>
                </div>
              </div>

              <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
                <h4 className="h5" style={{ marginBottom: '16px', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>Categories</h4>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <li style={{ marginBottom: '12px' }}><a href="#" style={{ color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between' }} onMouseOver={e => e.target.style.color = 'var(--accent-gold)'} onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}><span>Agriculture</span> <span>(2)</span></a></li>
                  <li style={{ marginBottom: '12px' }}><a href="#" style={{ color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between' }} onMouseOver={e => e.target.style.color = 'var(--accent-gold)'} onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}><span>Crop Protection</span> <span>(1)</span></a></li>
                  <li style={{ marginBottom: '12px' }}><a href="#" style={{ color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between' }} onMouseOver={e => e.target.style.color = 'var(--accent-gold)'} onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}><span>Pesticides</span> <span>(1)</span></a></li>
                  <li style={{ marginBottom: '12px' }}><a href="#" style={{ color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between' }} onMouseOver={e => e.target.style.color = 'var(--accent-gold)'} onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}><span>Farming Tech</span> <span>(1)</span></a></li>
                </ul>
              </div>
            </motion.div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
