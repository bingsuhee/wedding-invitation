import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

const WatercolorHeart = ({ delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0, y: 0 }}
    animate={{
      opacity: [0, 0.6, 0],
      scale: [0.5, 1.2, 0.8],
      y: -40,
      x: Math.random() * 40 - 20
    }}
    transition={{ duration: 2, delay, ease: "easeOut" }}
    className="absolute pointer-events-none"
  >
    <Heart size={16} fill="#FFB7C5" className="text-pink-200 opacity-60" />
  </motion.div>
);

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

        {/* Kakao-style Toast */}
        <div className="bg-[#FAE100] text-[#3C1E1E] p-4 rounded-2xl shadow-xl flex items-start gap-3 border border-yellow-200/50">
          {!iconError && (
            <div className="shrink-0 bg-white p-2 rounded-xl shadow-sm overflow-hidden flex items-center justify-center w-9 h-9">
              <img
                src={iconSrc}
                alt=""
                className="w-full h-full object-contain"
                onError={() => setIconError(true)}
              />
            </div>
          )}
          <div className="flex-1 overflow-hidden">
            <div className="flex justify-between items-center mb-0.5">
              <span className="font-bold text-sm">새로운 축하 메시지</span>
              <span className="text-[10px] opacity-40">지금</span>
            </div>
            <p className="font-bold text-base mb-0.5">{message.name}</p>
            <p className="text-base opacity-80 truncate">{message.content}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NotificationToast;
