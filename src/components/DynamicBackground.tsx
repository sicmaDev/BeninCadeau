"use client";

import React from 'react';
import { motion } from 'framer-motion';

export function DynamicBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1] select-none">
      {/* Orb 1: Luxury Purple Blob (Top Left) */}
      <motion.div
        animate={{
          x: [0, 50, -30, 0],
          y: [0, -60, 40, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-[-15%] left-[-15%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-bc-purple/10 to-transparent blur-[120px]"
      />

      {/* Orb 2: Champagne Gold Blob (Bottom Right) */}
      <motion.div
        animate={{
          x: [0, -60, 40, 0],
          y: [0, 70, -50, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-[-10%] right-[-15%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-br from-bc-yellow/8 to-transparent blur-[140px]"
      />

      {/* Orb 3: Soft Purple/Pink Blob (Center Left) */}
      <motion.div
        animate={{
          x: [0, 30, -40, 0],
          y: [0, 50, -30, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-[35%] left-[10%] w-[35vw] h-[35vw] rounded-full bg-gradient-to-br from-bc-purple/5 to-transparent blur-[110px]"
      />
    </div>
  );
}
