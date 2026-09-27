import React from 'react';
import { motion } from 'framer-motion';
import { Search, Folder, Calendar, ArrowRight, Leaf, Shield, FlaskConical, Settings, Send, User } from 'lucide-react';
import './Blog.css';

const blog1Img = 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800';
const blog2Img = 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800';
const blog3Img = 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800';
const blog4Img = 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800';
const blog5Img = 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=800';
const blog6Img = 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=800';

const Blog = () => {
  const blogs = [
    {
      id: 1,
      title: "The Role of Agrochemicals in Modern Agriculture",
      desc: "Discover how agrochemicals help increase crop yield, protect plants, and support sustainable farming practices for a better tomorrow.",
      img: blog1Img,
      category: "Agriculture",
      date: "12 Apr 2025"
    },
    {
      id: 2,
      title: "Effective Ways to Control Common Pests in Crops",
      desc: "Integrated Pest Management (IPM) represents a comprehensive approach to pest control that combines biological and chemical tools in a way that minimizes economic risks.",
      img: blog3Img,
      category: "Pesticides",
      date: "08 Apr 2025"
    },
    {
      id: 3,
      title: "Best Practices for Healthy and High-Yield Crops",
      desc: "The quality of agrochemical products directly impacts crop yield. Discover best practices for maintaining optimal plant health.",
      img: blog2Img,
      category: "Agriculture",
      date: "02 Apr 2025"
    },
    {
      id: 4,
      title: "Sustainable Agriculture: Small Steps, Big Impact",
      desc: "Learn about the latest innovations that balance crop productivity with environmental sustainability for future generations.",
      img: blog4Img,
      category: "Sustainable Farming",
      date: "28 Mar 2025"
    },
    {
      id: 5,
      title: "Innovations in Japanese Crop Protection Technologies",
      desc: "Explore how Shimanzu's advanced Japanese formulations are setting new benchmarks in protecting crops from emerging fungal threats.",
      img: blog5Img,
      category: "Crop Protection",
      date: "20 Mar 2025"
    },
    {
      id: 6,
      title: "The Future of Farming: Leveraging Technology for Growth",
      desc: "From precision farming to AI-driven crop monitoring, technology is reshaping the agricultural landscape. Find out what the future holds.",
      img: blog6Img,
      category: "Farming Tech",
      date: "15 Mar 2025"
    }
  ];

  const categories = [
    { name: 'Agriculture', count: 2, icon: Leaf },
    { name: 'Crop Protection', count: 1, icon: Shield },
    { name: 'Pesticides', count: 1, icon: FlaskConical },
    { name: 'Farming Tech', count: 1, icon: Settings },
    { name: 'Sustainable Farming', count: 1, icon: Leaf },
  ];

  const featuredBlog = blogs[0];
  const gridBlogs = blogs.slice(1);

  const [selectedBlog, setSelectedBlog] = React.useState(null);

  if (selectedBlog) {
    return (
      <div className="blog-page">
        <div className="container" style={{ padding: '60px 0' }}>
          <button 
            onClick={() => setSelectedBlog(null)}
            style={{ marginBottom: '24px', background: 'transparent', border: 'none', color: '#174D32', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem' }}
          >
            &larr; Back to Blogs
          </button>
          
          <div style={{ background: '#FFFFFF', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(23,77,50,0.1)', paddingBottom: '60px', boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
            <img src={selectedBlog.img} alt={selectedBlog.title} style={{ width: '100%', height: '500px', objectFit: 'cover' }} />
            
            <div style={{ padding: '40px 40px 0', maxWidth: '900px', margin: '0 auto' }}>
              <div style={{ display: 'flex', gap: '24px', color: '#64748B', fontSize: '0.95rem', fontWeight: '600', marginBottom: '24px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={18} /> {selectedBlog.date}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><User size={18} /> By Admin</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Folder size={18} /> {selectedBlog.category}</span>
              </div>
              
              <h1 style={{ fontFamily: 'var(--font-serif, "Cinzel", serif)', fontSize: '2.4rem', fontWeight: '800', color: '#081B10', marginBottom: '24px', lineHeight: '1.2' }}>
                {selectedBlog.title}
              </h1>
              
              <div style={{ fontSize: '1.05rem', color: '#4B5563', lineHeight: '1.8' }}>
                <p style={{ marginBottom: '20px' }}>{selectedBlog.desc}</p>
                <p style={{ marginBottom: '20px' }}>In today's rapidly evolving agricultural landscape, farmers face numerous challenges, including climate change, resource scarcity, and pest pressures. To address these challenges and achieve sustainable agricultural practices, farmers are increasingly turning to advanced agrochemical solutions that leverage technology and innovation.</p>
                <p>By implementing these modern strategies alongside high-quality Japanese formulations, crop yields can be significantly improved while maintaining ecological balance. At Shimanzu, we remain committed to pioneering these breakthrough solutions for a brighter future.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-page">
      {/* Hero Section */}
      <section className="blog-hero">
        <div className="container blog-hero-container">
          <motion.div 
            className="blog-hero-content"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="blog-hero-eyebrow">
              <Leaf size={16} /> INSIGHTS / TIPS / AGRICULTURE
            </div>
            <h1 className="blog-hero-title">Latest Blogs</h1>
            <p className="blog-hero-subtitle">
              Get expert insights, farming tips, and the latest updates on agrochemicals, crops, and sustainable agriculture.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="blog-hero-script">Better Farming<br/>Brighter Future</div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="blog-main-section">
        <div className="container">
          <div className="blog-layout">
            
            {/* Left Column: Blogs */}
            <div className="blog-posts-area">
              
              {/* Featured Blog */}
              <motion.div 
                className="blog-card featured-blog-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="blog-card-img-wrap">
                  <img src={featuredBlog.img} alt={featuredBlog.title} className="blog-card-img" />
                  <div className="blog-badge">
                    <Leaf size={14} /> {featuredBlog.category}
                  </div>
                </div>
                <div className="blog-card-content">
                  <div className="blog-date">
                    <Calendar size={14} /> {featuredBlog.date}
                  </div>
                  <h3 className="blog-title">{featuredBlog.title}</h3>
                  <p className="blog-desc">{featuredBlog.desc}</p>
                  <button className="blog-read-more" onClick={() => setSelectedBlog(featuredBlog)}>
                    Read More <ArrowRight size={14} />
                  </button>
                  <Leaf size={60} className="blog-card-watermark" />
                </div>
              </motion.div>

              {/* Small Blogs Grid */}
              <div className="small-blogs-grid">
                {gridBlogs.map((blog, idx) => (
                  <motion.div 
                    key={blog.id}
                    className="blog-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * (idx + 1) }}
                  >
                    <div className="blog-card-img-wrap">
                      <img src={blog.img} alt={blog.title} className="blog-card-img" />
                      <div className="blog-badge">
                        <Shield size={14} /> {blog.category}
                      </div>
                    </div>
                    <div className="blog-card-content">
                      <div className="blog-date">
                        <Calendar size={14} /> {blog.date}
                      </div>
                      <h3 className="blog-title" style={{ fontSize: '1.05rem' }}>{blog.title}</h3>
                      <button className="blog-read-more" style={{ padding: '6px 12px', fontSize: '0.75rem', marginTop: '16px' }} onClick={() => setSelectedBlog(blog)}>
                        Read More <ArrowRight size={12} />
                      </button>
                      <Leaf size={40} className="blog-card-watermark" />
                    </div>
                  </motion.div>
                ))}
              </div>

            </div>

            {/* Right Column: Sidebar */}
            <div className="blog-sidebar">
              
              {/* Search Widget */}
              <motion.div 
                className="blog-sidebar-widget"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Leaf size={80} className="widget-watermark" style={{ top: '-10px', right: '-20px' }} />
                <h4 className="widget-title"><Search size={20} /> Search Blogs</h4>
                <div className="sidebar-search-box">
                  <input type="text" placeholder="Search blogs..." className="sidebar-search-input" />
                  <button className="sidebar-search-btn">
                    <Search size={18} />
                  </button>
                </div>
              </motion.div>

              {/* Categories Widget */}
              <motion.div 
                className="blog-sidebar-widget"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h4 className="widget-title"><Folder size={20} /> Categories</h4>
                <ul className="category-list">
                  {categories.map((cat, i) => {
                    const Icon = cat.icon;
                    return (
                      <li key={i} className="category-item">
                        <div className="category-item-left">
                          <div className="category-icon-wrap"><Icon size={16} /></div>
                          <span>{cat.name}</span>
                        </div>
                        <div className="category-item-right">
                          <span className="category-count">{cat.count}</span>
                          <ArrowRight size={14} className="category-arrow" />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </motion.div>

              {/* Newsletter Widget */}
              <motion.div 
                className="blog-sidebar-widget"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Leaf size={100} className="widget-watermark" style={{ bottom: '-20px', right: '-20px', top: 'auto' }} />
                <h4 className="widget-title"><Send size={20} /> Stay Updated</h4>
                <p className="newsletter-desc">Get the latest blog posts and farming tips directly in your inbox.</p>
                <div className="newsletter-form">
                  <input type="email" placeholder="Your email address" className="newsletter-input" />
                  <button className="newsletter-btn">Subscribe</button>
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
