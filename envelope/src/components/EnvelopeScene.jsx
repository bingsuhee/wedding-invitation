import React, { useState } from 'react';
import { motion } from 'framer-motion';

const WaxSeal = () => (
  <div
    className="w-11 h-11 rounded-full flex items-center justify-center"
    style={{
      background: 'radial-gradient(circle at 35% 35%, #a84040, #6b2020)',
      boxShadow: '0 2px 8px rgba(107,32,32,0.45), inset 0 1px 2px rgba(255,255,255,0.15)',
    }}
  >
    <span className="font-dancing text-white text-[18px] font-bold leading-none select-none" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
      W
    </span>
  </div>
);

const EnvelopeScene = ({ onOpen }) => {
  const [flapOpen, setFlapOpen] = useState(false);
  const [exiting, setExiting] = useState(false);

  const handleTap = () => {
    if (flapOpen) return;
    setFlapOpen(true);
    setTimeout(() => {
      setExiting(true);
      setTimeout(onOpen, 380);
    }, 1050);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center cursor-pointer select-none"
      style={{ background: '#f0e8db' }}
      onClick={handleTap}
      animate={exiting ? { opacity: 0, scale: 0.97 } : { opacity: 1, scale: 1 }}
      transition={{ duration: 0.38, ease: 'easeInOut' }}
    >
      {/* Subtle grain texture overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
        }}
      />

      {/* Envelope wrapper */}
      <div className="relative" style={{ width: 300, height: 200 }}>

        {/* ── Envelope body ── */}
        <div
          className="absolute inset-0 rounded-sm"
          style={{ background: '#e8d4b8', boxShadow: '0 24px 64px rgba(0,0,0,0.13), 0 4px 14px rgba(0,0,0,0.08)' }}
        >
          {/* Left fold */}
          <div className="absolute inset-0 rounded-sm" style={{ clipPath: 'polygon(0 0, 0 100%, 52% 52%)', background: '#dfc9ae' }} />
          {/* Right fold */}
          <div className="absolute inset-0 rounded-sm" style={{ clipPath: 'polygon(100% 0, 100% 100%, 48% 52%)', background: '#dfc9ae' }} />
          {/* Bottom fold */}
          <div className="absolute inset-0 rounded-sm" style={{ clipPath: 'polygon(0 100%, 100% 100%, 50% 52%)', background: '#c9a87a' }} />
        </div>

        {/* ── Letter card (slides up on open) ── */}
        <motion.div
          className="absolute left-[10px] right-[10px] rounded-sm overflow-hidden"
          style={{ bottom: 8, height: 162, background: '#fdf9f4', zIndex: 8, boxShadow: '0 -2px 12px rgba(0,0,0,0.07)' }}
          animate={flapOpen ? { y: -165 } : { y: 0 }}
          transition={{ delay: 0.32, duration: 0.88, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="flex flex-col items-center justify-center h-full gap-1.5 pb-4">
            <p className="text-[8px] tracking-[0.35em] uppercase" style={{ color: '#b07d64' }}>청첩장</p>
            <p className="font-dancing text-[19px]" style={{ color: '#3d2010' }}>We invite you to</p>
            <p className="font-dancing text-[19px]" style={{ color: '#3d2010' }}>our wedding</p>
          </div>
        </motion.div>

        {/* ── Flap (3-D rotateX from top edge) ── */}
        <div
          className="absolute top-0 left-0 w-full"
          style={{ height: 108, zIndex: 10, perspective: '1200px' }}
        >
          <motion.div
            className="w-full h-full"
            style={{ transformOrigin: 'top center' }}
            animate={flapOpen ? { rotateX: -174 } : { rotateX: 0 }}
            transition={{ duration: 0.72, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Flap triangle */}
            <div
              className="w-full h-full"
              style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)', background: '#e2cda8' }}
            />
            {/* Wax seal – centered on flap */}
            <motion.div
              className="absolute"
              style={{ bottom: 8, left: '50%', transform: 'translateX(-50%)' }}
              animate={flapOpen ? { opacity: 0, scale: 1.4 } : { opacity: 1, scale: 1 }}
              transition={{ duration: 0.18 }}
            >
              <WaxSeal />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Hint text */}
      <motion.p
        className="mt-10 text-[10px] tracking-[0.35em] uppercase"
        style={{ color: '#8b6b4a' }}
        animate={flapOpen ? { opacity: 0 } : { opacity: [0.45, 1, 0.45] }}
        transition={flapOpen ? {} : { duration: 2.2, repeat: Infinity }}
      >
        탭하여 열어보세요
      </motion.p>
    </motion.div>
  );
};

export default EnvelopeScene;
