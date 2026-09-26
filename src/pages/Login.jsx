import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Shield, Lock, User, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDataContext } from '../context/DataContext';
import './Login.css';
import logoImg from '../assets/images/1712639794.png';

const Login = () => {
  const { isAdmin, login } = useDataContext();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // If already authenticated, redirect to admin
  useEffect(() => {
    if (isAdmin) {
      const destination = location.state?.from?.pathname || '/admin';
      navigate(destination, { replace: true });
    }
  }, [isAdmin, navigate, location]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Please enter your admin email (admin@shimanzu.com)');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const result = login(username, password);
      setIsLoading(false);

      if (result.success) {
        navigate('/admin', { replace: true });
      } else {
        setError(result.message || 'Invalid email or password');
      }
    }, 300);
  };

  return (
    <div className="login-page">
      <div className="login-bg-glow glow-1" />
      <div className="login-bg-glow glow-2" />

      <motion.div 
        className="login-card"
        initial={{ opacity: 0, y: 25, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* Header */}
        <div className="login-header">
          <div className="login-logo-wrap">
            <img src={logoImg} alt="Shimanzu Logo" className="login-logo-img" />
          </div>
          <div className="login-badge">
            <Shield size={14} className="login-shield-icon" />
            <span>SECURE ADMIN ACCESS</span>
          </div>
          <h1 className="login-title">Administrator Portal</h1>
          <p className="login-subtitle">
            Enter authorized credentials to access the admin portal.
          </p>
        </div>

        {/* Error message */}
        {error && (
          <motion.div 
            className="login-alert-error"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AlertCircle size={18} />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label className="login-label">Admin Email</label>
            <div className="login-input-wrap">
              <User size={18} className="login-input-icon" />
              <input
                type="email"
                className="login-input"
                placeholder="admin@shimanzu.com"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (error) setError('');
                }}
                autoComplete="email"
                autoFocus
              />
            </div>
          </div>

          <div className="login-field">
            <div className="login-label-row">
              <label className="login-label">Password</label>
            </div>
            <div className="login-input-wrap">
              <Lock size={18} className="login-input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                className="login-input"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="login-eye-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="login-submit-btn" 
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="login-spinner">Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Admin Dashboard</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="login-footer">
          <Link to="/" className="login-back-link">
            &larr; Back to Shimanzu Public Website
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
