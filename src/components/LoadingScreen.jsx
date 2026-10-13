import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logoImg from '../assets/images/shimanzu.png';

const LoadingScreen = () => {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); return 100; }
        return p + 2;
      });
    }, 40);

    const timer = setTimeout(() => setVisible(false), 2800);
    return () => { clearTimeout(timer); clearInterval(interval); };
  }, []);

  const particles = Array.from({ length: 12 });

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          style={{
            position: 'fixed', inset: 0,
            background: '#ffffff',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            zIndex: 999999, overflow: 'hidden',
          }}
        >
          {/* Floating particles */}
          {particles.map((_, i) => (
            <motion.div
              key={i}
              style={{
                position: 'absolute',
                width: i % 3 === 0 ? '6px' : '3px',
                height: i % 3 === 0 ? '6px' : '3px',
                borderRadius: '50%',
                background: 'rgba(139,0,0,0.4)',
                left: `${8 + i * 7.5}%`,
                top: `${20 + (i % 5) * 15}%`,
              }}
              animate={{
                y: [-20, 20, -20],
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 2 + (i % 3),
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut',
              }}
            />
          ))}

          {/* Glowing ring behind logo */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.35, 0.15] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              width: '280px', height: '280px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(139,0,0,0.1) 0%, transparent 70%)',
            }}
          />

          {/* Second ring */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [1.1, 1.3, 1.1], opacity: [0.08, 0.2, 0.08] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
            style={{
              position: 'absolute',
              width: '380px', height: '380px',
              borderRadius: '50%',
              border: '1px solid rgba(139,0,0,0.15)',
            }}
          />

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            style={{ position: 'relative', zIndex: 2, marginBottom: '48px' }}
          >
            <motion.img
              src={logoImg}
              alt="Shimanzu"
              style={{ width: '180px' }}
              animate={{ opacity: [1, 0.85, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>

          {/* Progress bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{ position: 'relative', zIndex: 2, width: '220px' }}
          >
            <div style={{
              width: '100%', height: '2px',
              background: 'rgba(0,0,0,0.08)',
              borderRadius: '2px', overflow: 'hidden',
            }}>
              <motion.div
                style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, #8B0000, #FFD700)',
                  borderRadius: '2px',
                  width: `${progress}%`,
                  boxShadow: '0 0 8px rgba(139,0,0,0.8)',
                }}
              />
            </div>
            <motion.p
              style={{
                color: 'black',
                fontSize: '11px',
                letterSpacing: '3px',
                textAlign: 'center',
                marginTop: '14px',
                fontFamily: 'sans-serif',
                textTransform: 'uppercase',
              }}
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Loading...
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
