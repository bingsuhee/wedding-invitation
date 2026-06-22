/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Petals = ({ count = 20 }) => {
  const [petals] = useState(() => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 10 + 10,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 10,
      rotate: Math.random() * 360,
      drift: Math.random() * 20 - 10
    }));
  });

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          initial={{
            top: '-5%',
            left: `${petal.left}%`,
            opacity: 0,
            rotate: petal.rotate,
            scale: 0.5
          }}
          animate={{
            top: '105%',
            left: `${petal.left + petal.drift}%`,
            opacity: [0, 0.7, 0.7, 0],
            rotate: petal.rotate + 360,
            scale: 1
          }}
          transition={{
            duration: petal.duration,
            delay: petal.delay,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute text-pink-200/40"
          style={{ width: petal.size, height: petal.size }}
        >
          <svg viewBox="0 0 512 512" fill="currentColor">
            <path d="M461.1 230.1c-13.4-15.3-29.2-26.6-46.1-33.8-16.1-6.8-33.2-10.3-50.6-10.3-15.5 0-30.8 2.8-45.3 8.3-14.5-5.5-29.8-8.3-45.3-8.3-17.4 0-34.5 3.5-50.6 10.3-16.9 7.2-32.7 18.5-46.1 33.8-21.7 24.8-33.6 57.5-33.6 92.1 0 34.6 11.9 67.3 33.6 92.1 13.4 15.3 29.2 26.6 46.1 33.8 16.1 6.8 33.2 10.3 50.6 10.3 15.5 0 30.8-2.8 45.3-8.3 14.5 5.5 29.8 8.3 45.3 8.3 17.4 0 34.5-3.5 50.6-10.3 16.9-7.2 32.7-18.5 46.1-33.8 21.7-24.8 33.6-57.5 33.6-92.1 0-34.6-11.9-67.3-33.6-92.1z"/>
          </svg>
        </motion.div>
      ))}
    </div>
  );
};

export default Petals;
