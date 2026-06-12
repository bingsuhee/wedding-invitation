import React from 'react';
import { motion } from 'framer-motion';

const ScrollAnimationWrapper = ({
  children,
  amount = 0.2,
  delay = 0,
  duration = 0.8,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScrollAnimationWrapper;
