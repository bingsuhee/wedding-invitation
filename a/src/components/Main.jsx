/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import { weddingInfo } from '../data/info';
import { Star, Heart } from 'lucide-react';

const Main = () => {
  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i) => {
      const delay = 0.5 + i * 0.3;
      return {
        pathLength: 1,
        opacity: 1,
        transition: {
          pathLength: { delay, type: "spring", duration: 1.5, bounce: 0 },
          opacity: { delay, duration: 0.01 }
        }
      };
    }
  };

  return (
    <div className="relative w-full min-h-dvh flex flex-col items-center justify-center overflow-hidden paper-texture py-20">
      {/* Watercolor bleed effect */}
      <div className="absolute top-0 left-0 w-full h-[30%] bg-gradient-to-b from-pink-100/30 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-[30%] bg-gradient-to-t from-pink-50/40 to-transparent blur-3xl pointer-events-none" />

      {/* Title Area */}
      <div className="mb-8 relative z-10 flex flex-col items-center">
        <div className="relative h-20 w-64 flex items-center justify-center">
          {/* Sketchy SVG strokes */}
          <svg width="200" height="60" viewBox="0 0 200 60" className="absolute">
            <motion.path
              d="M30,40 Q50,10 70,40 T110,40"
              fill="transparent"
              strokeWidth="1.5"
              stroke="#D4AF37"
              variants={draw}
              custom={0}
              initial="hidden"
              animate="visible"
            />
            <motion.path
              d="M120,40 C140,10 160,50 180,30"
              fill="transparent"
              strokeWidth="1.5"
              stroke="#D4AF37"
              variants={draw}
              custom={1}
              initial="hidden"
              animate="visible"
            />
          </svg>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1.5 }}
            className="text-4xl text-wedding-primary"
          >
            Our Wedding
          </motion.h2>
        </div>
      </div>

      {/* Main Illustration */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, delay: 0.2 }}
        className="relative w-80 h-80 mb-10 flex items-center justify-center"
      >
        {/* Watercolor Blobs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-wedding-primary/20 blur-3xl rounded-full mix-blend-multiply animate-pulse-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/3 -translate-y-1/3 w-64 h-64 bg-pink-100/40 blur-3xl rounded-full mix-blend-multiply" />

        {/* Hand-drawn sketch circle */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
          <motion.path
            d="M 50, 50 m -45, 0 a 45,45 0 1,0 90,0 a 45,45 0 1,0 -90,0"
            fill="none"
            stroke="#D4AF37"
            strokeWidth="0.5"
            strokeDasharray="2,2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, ease: "easeInOut" }}
          />
        </svg>

        <div className="relative w-full h-full p-4 z-10">
          <img
            src={`${import.meta.env.BASE_URL}images/main_hero_transparent.png`}
            alt="Wedding Hero"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Floating Icons with 'drawn' feel */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1, y: [0, -15, 0] }}
          transition={{
            scale: { delay: 1.5 },
            y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute top-10 right-6 text-wedding-accent/50"
        >
          <Star size={28} className="animate-wobble" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1, y: [0, 10, 0] }}
          transition={{
            scale: { delay: 2 },
            y: { duration: 5, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute bottom-12 left-4 text-pink-300/40"
        >
          <Heart size={22} fill="currentColor" className="animate-wobble" />
        </motion.div>
      </motion.div>

      {/* Names & Date */}
      <div className="text-center z-10 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <h1 className="text-4xl sm:text-5xl mb-1 text-gray-800 tracking-wide">
            {weddingInfo.groom.name} <span className="text-2xl sm:text-3xl text-wedding-accent/70">&</span> {weddingInfo.bride.name}
          </h1>
          <svg width="150" height="10" viewBox="0 0 150 10" className="mx-auto mb-4 opacity-30">
            <motion.path
              d="M 10 5 Q 75 8 140 5"
              fill="transparent"
              stroke="#D4AF37"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 2.5, duration: 1 }}
            />
          </svg>
          <p className="text-xl sm:text-2xl text-gray-500/80 leading-relaxed">
            {weddingInfo.date}
          </p>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
        className="mt-12 flex flex-col items-center"
      >
        <span className="text-lg text-gray-400 mb-0">Scroll</span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300">
            <path d="M7 13l5 5 5-5" />
            <path d="M7 7l5 5 5-5" opacity="0.5" />
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Main;
