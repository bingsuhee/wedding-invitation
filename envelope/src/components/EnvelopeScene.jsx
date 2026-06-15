import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WaxSeal = () => (
  <div className="env-seal-wrapper" aria-hidden="true">
    <div className="seal-disc" />
    <div className="seal-monogram">♥</div>
  </div>
);

const EnvelopeScene = ({ onOpen }) => {
  const [phase, setPhase] = useState('sealed');

  const handleTap = () => {
    if (phase !== 'sealed') return;
    setPhase('opening');
    setTimeout(() => setPhase('rising'), 820);
    setTimeout(() => {
      setPhase('open');
      setTimeout(onOpen, 420);
    }, 2100);
  };

  const isOpening = phase === 'opening' || phase === 'rising' || phase === 'open';
  const isFloating = phase === 'sealed';

  return (
    <motion.div
      className="env-stage"
      onClick={handleTap}
      animate={phase === 'open' ? { opacity: 0, scale: 0.97 } : { opacity: 1, scale: 1 }}
      transition={{ duration: 0.42, ease: 'easeInOut' }}
    >
      {/* paper-grain desk */}
      <div className="env-desk" style={{ opacity: phase === 'open' ? 0 : 1, transition: 'opacity 0.7s ease 0.5s' }} />

      {/* hint text */}
      <AnimatePresence>
        {phase === 'sealed' && (
          <motion.div
            className="env-hint"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="env-hint-script">Wedding Invitation</span>
            탭하여 열어보세요
          </motion.div>
        )}
      </AnimatePresence>

      {/* envelope */}
      <motion.div
        className="envelope-wrap"
        animate={phase === 'open' ? { opacity: 0, y: 26, scale: 0.97 } : { opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeInOut', delay: phase === 'open' ? 0 : 0 }}
        style={{ pointerEvents: phase === 'open' ? 'none' : 'auto' }}
      >
        <div className="env-shadow" />

        {/* floating wrapper */}
        <motion.div
          style={{ position: 'absolute', inset: 0 }}
          animate={isFloating ? { y: [0, -7, 0] } : { y: 0 }}
          transition={isFloating ? { duration: 5.5, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.3 }}
        >
          {/* back panel */}
          <div className="env-back" />

          {/* letter preview (rises when opening) */}
          <motion.div
            className="env-letter-preview"
            animate={phase === 'rising' || phase === 'open' ? { y: -160 } : { y: 0 }}
            transition={{ delay: 0.32, duration: 0.88, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <span className="preview-label">청첩장</span>
            <span className="preview-script">We invite you to</span>
            <span className="preview-script">our wedding</span>
          </motion.div>

          {/* front V-pocket */}
          <div className="env-front" />

          {/* flap container */}
          <div className="env-flap-container">
            <motion.div
              className="env-flap-inner"
              animate={isOpening ? { rotateX: -174 } : { rotateX: 0 }}
              transition={{ duration: 0.72, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className="env-flap-face" />
            </motion.div>
          </div>

          {/* wax seal */}
          <motion.div
            animate={
              phase === 'opening'
                ? { scale: [1, 1.08, 0.7], rotate: [0, -4, 8], opacity: [1, 1, 0] }
                : (phase === 'rising' || phase === 'open')
                ? { opacity: 0 }
                : { scale: 1, rotate: 0, opacity: 1 }
            }
            transition={{ duration: 0.5 }}
            style={{ position: 'absolute', inset: 0 }}
          >
            <WaxSeal />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* scroll cue after open */}
      <AnimatePresence>
        {phase === 'rising' && (
          <motion.div
            className="scroll-cue-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7, y: [0, 6, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span>잠시 후 편지가 열립니다</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EnvelopeScene;
