import React from 'react';
import { motion } from 'framer-motion';

/**
 * ScrollAnimationWrapper
 *
 * A reusable component that applies a Fade-in-Up animation
 * when the element enters the viewport.
 *
 * @param {React.ReactNode} children - The content to animate
 * @param {number} amount - Threshold for the animation (0 to 1, default 0.2 as 0.8 might be too high for long sections)
 * @param {number} delay - Animation delay in seconds
 * @param {number} duration - Animation duration in seconds
 */
const ScrollAnimationWrapper = ({
  children,
  amount = 0.2, // Defaulting to 0.2 because 0.8 can be hard to trigger on mobile for long components
  delay = 0,
  duration = 0.8,
  className = ""
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: amount }}
      transition={{
        duration: duration,
        delay: delay,
        ease: [0.21, 0.47, 0.32, 0.98] // Smooth cubic-bezier
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScrollAnimationWrapper;
