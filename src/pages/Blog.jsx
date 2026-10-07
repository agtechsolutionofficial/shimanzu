import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Folder, Calendar, ArrowRight, Leaf, Shield,
  FlaskConical, Settings, Send, User, Loader2, Sparkles, BookOpen
} from 'lucide-react';
import { useDataContext } from '../context/DataContext';
import './Blog.css';

const CATEGORY_ICONS = {
  'Agriculture': Leaf,
  'Crop Protection': Shield,
  'Pesticides': FlaskConical,
  'Farming Tech': Settings,
  'Sustainable Farming': Leaf
};

const Blog = () => {
  const { blogs = [], isBlogsLoading } = useDataContext();
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // Compute categories dynamically with counts
  const categoriesList = useMemo(() => {
    const map = new Map();
    blogs.forEach(b => {
      const cat = b.category || 'Agriculture';
      map.set(cat, (map.get(cat) || 0) + 1);
    });

    return Array.from(map.entries()).map(([name, count]) => {
      const Icon = CATEGORY_ICONS[name] || Leaf;
      return { name, count, icon: Icon };
    });
  }, [blogs]);

  // Filtered blogs based on search query and category
  const filteredBlogs = useMemo(() => {
    return blogs.filter(b => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        (b.title && b.title.toLowerCase().includes(q)) ||
        (b.desc && b.desc.toLowerCase().includes(q)) ||
        (b.content && b.content.toLowerCase().includes(q)) ||
        (b.category && b.category.toLowerCase().includes(q));

      const matchCategory =
        activeCategory === 'all' ||
        (b.category && b.category.toLowerCase() === activeCategory.toLowerCase());

      return matchSearch && matchCategory;
    });
  }, [blogs, searchQuery, activeCategory]);

  const featuredBlog = filteredBlogs[0];
  const gridBlogs = filteredBlogs.slice(1);

  // Single Blog Detailed Article View
  if (selectedBlog) {
    const paragraphs = (selectedBlog.content || selectedBlog.desc || '')
      .split('\n')
      .map(p => p.trim())
      .filter(Boolean);

    return (
      <div className="blog-page">
        <div className="container" style={{ padding: '120px 0 60px' }}>
          <button
            onClick={() => setSelectedBlog(null)}
            style={{
              marginBottom: '24px',
              background: 'transparent',
              border: 'none',
              color: '#174D32',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '1rem'
            }}
          >
            &larr; Back to Blogs
          </button>

          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1px solid rgba(23,77,50,0.1)',
              paddingBottom: '60px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.04)'
            }}
          >
            {selectedBlog.img && (
              <img
                src={selectedBlog.img}
                alt={selectedBlog.title}
                style={{ width: '100%', height: '480px', objectFit: 'cover' }}
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800';
                }}
              />
            )}

            <div style={{ padding: '40px 40px 0', maxWidth: '900px', margin: '0 auto' }}>
              <div
                style={{
                  display: 'flex',
                  gap: '24px',
                  color: '#64748B',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  marginBottom: '24px',
                  flexWrap: 'wrap'
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={18} /> {selectedBlog.date}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <User size={18} /> By {selectedBlog.author || 'Shimanzu Agrosciences'}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Folder size={18} /> {selectedBlog.category}
                </span>
              </div>

              <h1
                style={{
                  fontFamily: 'var(--font-serif, "Cinzel", serif)',
                  fontSize: '2.4rem',
                  fontWeight: '800',
                  color: '#081B10',
                  marginBottom: '24px',
                  lineHeight: '1.2'
                }}
              >
                {selectedBlog.title}
              </h1>

              <div style={{ fontSize: '1.05rem', color: '#4B5563', lineHeight: '1.8' }}>
                {paragraphs.length > 0 ? (
                  paragraphs.map((p, idx) => (
                    <p key={idx} style={{ marginBottom: '20px' }}>
                      {p}
                    </p>
                  ))
                ) : (
                  <p>{selectedBlog.desc}</p>
                )}
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
              Get expert insights, farming tips, and the latest updates on agrochemicals, crops,
              and sustainable agriculture.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="blog-hero-script">
              Better Farming<br />Brighter Future
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="blog-main-section">
        <div className="container">
          <div className="blog-layout">

            {/* Left Column: Blogs */}
            <div className="blog-posts-area">

              {/* Active Filter Bar if filter applied */}
              {(searchQuery || activeCategory !== 'all') && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#EDF5EF',
                  border: '1px solid #C8E6C9',
                  borderRadius: '10px',
                  padding: '12px 18px',
                  marginBottom: '24px',
                  fontSize: '0.9rem',
                  color: '#174D32'
                }}>
                  <div>
                    <span>Filtering by: </span>
                    {activeCategory !== 'all' && <strong>Category: {activeCategory} </strong>}
                    {searchQuery && <strong>Keyword: "{searchQuery}"</strong>}
                  </div>
                  <button
                    onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                    style={{
                      background: '#174D32',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '4px 10px',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                  >
                    Reset Filter
                  </button>
                </div>
              )}

              {isBlogsLoading && blogs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 20px', color: '#174D32' }}>
                  <Loader2 size={36} className="animate-spin" style={{ margin: '0 auto 16px', display: 'block' }} />
                  <p style={{ fontWeight: 600 }}>Loading blogs from database...</p>
                </div>
              ) : filteredBlogs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 20px', color: '#64748B', background: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                  <BookOpen size={48} style={{ opacity: 0.35, margin: '0 auto 16px', display: 'block' }} />
                  <h3>No blog articles found</h3>
                  <p>Try clearing your search keyword or selecting another category.</p>
                  <button
                    onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                    style={{
                      marginTop: '16px',
                      background: '#174D32',
                      color: '#fff',
                      border: 'none',
                      padding: '8px 18px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                  >
                    Show All Blogs
                  </button>
                </div>
              ) : (
                <>
                  {/* Featured Blog */}
                  {featuredBlog && (
                    <motion.div
                      className="blog-card featured-blog-card"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="blog-card-img-wrap">
                        <img
                          src={featuredBlog.img}
                          alt={featuredBlog.title}
                          className="blog-card-img"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800';
                          }}
                        />
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
                        <button
                          className="blog-read-more"
                          onClick={() => setSelectedBlog(featuredBlog)}
                        >
                          Read More <ArrowRight size={14} />
                        </button>
                        <Leaf size={60} className="blog-card-watermark" />
                      </div>
                    </motion.div>
                  )}

                  {/* Small Blogs Grid */}
                  {gridBlogs.length > 0 && (
                    <div className="small-blogs-grid">
                      {gridBlogs.map((blog, idx) => (
                        <motion.div
                          key={blog.id || blog._id || idx}
                          className="blog-card"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.08 * (idx + 1) }}
                        >
                          <div className="blog-card-img-wrap">
                            <img
                              src={blog.img}
                              alt={blog.title}
                              className="blog-card-img"
                              onError={(e) => {
                                e.currentTarget.src = 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800';
                              }}
                            />
                            <div className="blog-badge">
                              <Shield size={14} /> {blog.category}
                            </div>
                          </div>
                          <div className="blog-card-content">
                            <div className="blog-date">
                              <Calendar size={14} /> {blog.date}
                            </div>
                            <h3 className="blog-title" style={{ fontSize: '1.05rem' }}>
                              {blog.title}
                            </h3>
                            <button
                              className="blog-read-more"
                              style={{ padding: '6px 12px', fontSize: '0.75rem', marginTop: '16px' }}
                              onClick={() => setSelectedBlog(blog)}
                            >
                              Read More <ArrowRight size={12} />
                            </button>
                            <Leaf size={40} className="blog-card-watermark" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </>
              )}

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
                  <input
                    type="text"
                    placeholder="Search articles & topics..."
                    className="sidebar-search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery ? (
                    <button
                      className="sidebar-search-btn"
                      onClick={() => setSearchQuery('')}
                      title="Clear search"
                    >
                      &times;
                    </button>
                  ) : (
                    <button className="sidebar-search-btn" aria-label="Search">
                      <Search size={18} />
                    </button>
                  )}
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
                  <li
                    className={`category-item ${activeCategory === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveCategory('all')}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="category-item-left">
                      <div className="category-icon-wrap"><Leaf size={16} /></div>
                      <span style={{ fontWeight: activeCategory === 'all' ? '700' : '500' }}>
                        All Categories
                      </span>
                    </div>
                    <div className="category-item-right">
                      <span className="category-count">{blogs.length}</span>
                      <ArrowRight size={14} className="category-arrow" />
                    </div>
                  </li>

                  {categoriesList.map((cat, i) => {
                    const Icon = cat.icon;
                    const isSelected = activeCategory.toLowerCase() === cat.name.toLowerCase();
                    return (
                      <li
                        key={i}
                        className={`category-item ${isSelected ? 'active' : ''}`}
                        onClick={() => setActiveCategory(isSelected ? 'all' : cat.name)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="category-item-left">
                          <div className="category-icon-wrap"><Icon size={16} /></div>
                          <span style={{ fontWeight: isSelected ? '700' : '500' }}>
                            {cat.name}
                          </span>
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
                <p className="newsletter-desc">
                  Get the latest blog posts and Japanese farming formulation tips directly in your inbox.
                </p>
                <form
                  className="newsletter-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert('Thank you for subscribing to Shimanzu Agrosciences news!');
                  }}
                >
                  <input
                    type="email"
                    required
                    placeholder="Your email address"
                    className="newsletter-input"
                  />
                  <button type="submit" className="newsletter-btn">Subscribe</button>
                </form>
              </motion.div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
