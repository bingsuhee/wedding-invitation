/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const WatercolorHeart = ({ delay }) => {
  const [randomX] = useState(() => Math.random() * 40 - 20);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, y: 0 }}
      animate={{
        opacity: [0, 0.6, 0],
        scale: [0.5, 1.2, 0.8],
        y: -40,
        x: randomX
      }}
      transition={{ duration: 2, delay, ease: "easeOut" }}
      className="absolute pointer-events-none"
    >
      <Heart size={16} fill="#FFB7C5" className="text-pink-200 opacity-60" />
    </motion.div>
  );
};

const NotificationToast = ({ message, onDone }) => {
  const [iconError, setIconError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      onDone();
    }, 3500); // 3.5 seconds total (3s display + buffer)
    return () => clearTimeout(timer);
  }, [onDone]);

  const iconSrc = `${import.meta.env.BASE_URL}images/thumb/guestbook_alert_icon.png`;

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-[360px]"
    >
      <div className="relative">
        {/* Watercolor decorative hearts */}
        <WatercolorHeart delay={0.2} />
        <WatercolorHeart delay={0.5} />
        <WatercolorHeart delay={0.8} />
        <div className="absolute -right-4 -top-2">
          <WatercolorHeart delay={0.4} />
        </div>
        <div className="absolute -left-2 -bottom-2">
          <WatercolorHeart delay={0.6} />
        </div>

        {/* Doodle-style Toast */}
        <div className="bg-white text-gray-800 p-4 shadow-xl flex items-start gap-3 sketchy-border relative overflow-hidden">
          {/* Decorative Doodles */}
          <svg className="absolute top-0 right-0 w-16 h-16 text-wedding-accent/10 pointer-events-none -rotate-12" viewBox="0 0 100 100">
            <path d="M20,50 Q40,20 60,50 T100,50" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="80" cy="20" r="5" fill="currentColor" opacity="0.5" />
          </svg>
          <svg className="absolute bottom-1 left-4 w-12 h-4 text-wedding-accent/20 pointer-events-none" viewBox="0 0 100 20">
            <path d="M0,10 Q25,0 50,10 T100,10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>

          {!iconError && (
            <div className="shrink-0 bg-white p-1 rounded-lg sketchy-border-subtle overflow-hidden flex items-center justify-center w-10 h-10 z-10">
              <img
                src={iconSrc}
                alt=""
                className="w-full h-full object-contain"
                onError={() => setIconError(true)}
              />
            </div>
          )}
          <div className="flex-1 overflow-hidden z-10">
            <div className="flex justify-between items-center mb-0.5">
              <span className="text-wedding-accent text-[10px] font-bold marker-highlight inline-block">New Message</span>
              <span className="text-[10px] opacity-40 font-mono">Just now</span>
            </div>
            <p className="font-bold text-base text-gray-800 mb-0.5">{message.name}</p>
            <p className="text-base text-gray-600 truncate italic">{message.content}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NotificationToast;
