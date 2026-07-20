'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface StadiumGlowProps {
  operatorId: string;
}

export default function StadiumGlow({ operatorId }: StadiumGlowProps) {
  // Configuración de colores de resplandor según operador
  const getGlowConfig = () => {
    switch (operatorId) {
      case 'yoigo':
        return {
          color: 'rgba(176, 38, 255, 0.12)',
          gradient: 'from-[#B026FF]/10 via-[#B026FF]/3 to-transparent'
        };
      case 'orange':
        return {
          color: 'rgba(255, 121, 0, 0.12)',
          gradient: 'from-[#FF7900]/10 via-[#FF7900]/3 to-transparent'
        };
      case 'vodafone':
        return {
          color: 'rgba(230, 0, 0, 0.12)',
          gradient: 'from-[#E60000]/10 via-[#E60000]/3 to-transparent'
        };
      default:
        return {
          color: 'rgba(99, 102, 241, 0.08)',
          gradient: 'from-indigo-500/8 via-transparent to-transparent'
        };
    }
  };

  const glow = getGlowConfig();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={operatorId}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none"
      >
        {/* Efecto de haz de luz / reflector de estadio en diagonal */}
        <div 
          className={`absolute -top-[20%] left-1/4 w-[150%] h-[140%] -rotate-12 bg-gradient-to-b ${glow.gradient} blur-[120px]`}
        />
        <div 
          className={`absolute -top-[20%] right-1/4 w-[150%] h-[140%] rotate-12 bg-gradient-to-b ${glow.gradient} blur-[120px]`}
        />
        
        {/* Red de partículas de luz flotantes (focos de estadio) */}
        <div className="absolute inset-x-0 top-0 h-40 opacity-40 flex justify-between px-10">
          {Array.from({ length: 6 }).map((_, i) => (
            <div 
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-white blur-[1px] animate-pulse"
              style={{ animationDelay: `${i * 0.4}s`, animationDuration: '2.5s' }}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
