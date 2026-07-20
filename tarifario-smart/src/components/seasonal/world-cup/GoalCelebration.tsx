'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface GoalCelebrationProps {
  onComplete: () => void;
}

export default function GoalCelebration({ onComplete }: GoalCelebrationProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 1600); // Duración de ~1.5 segundos
    return () => clearTimeout(timer);
  }, [onComplete]);

  // Generar confeti estático aleatorio que se animará
  const particles = Array.from({ length: 40 }).map((_, i) => {
    const colors = ['#E60000', '#FFC400', '#2b2d31', '#4f46e5', '#10b981'];
    return {
      id: i,
      x: Math.random() * 100 - 50, // De -50vw a +50vw
      y: Math.random() * -100 - 20, // Hacia arriba
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 6,
      delay: Math.random() * 0.2
    };
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none select-none overflow-hidden">
      {/* Texto de GOL / PROPUESTA LISTA */}
      <motion.div
        initial={{ scale: 0.2, y: 50, opacity: 0 }}
        animate={{ 
          scale: [0.2, 1.2, 1],
          y: [50, -10, 0],
          opacity: [0, 1, 1, 0]
        }}
        transition={{ 
          duration: 1.5,
          times: [0, 0.2, 0.8, 1],
          ease: "easeOut"
        }}
        className="px-8 py-5 bg-[#0d0914] border-2 border-[#FFC400] rounded-3xl shadow-[0_20px_50px_rgba(255,196,0,0.3)] text-center relative z-20 flex flex-col gap-1 items-center"
      >
        <span className="text-[10px] font-black uppercase text-[#FFC400] tracking-[0.25em]">¡GOLAZO COMERCIAL!</span>
        <h2 className="text-3xl font-black text-white uppercase tracking-tight italic">¡Propuesta Lista!</h2>
      </motion.div>

      {/* Partículas de Confeti Flotante */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: '50vw', y: '100vh', opacity: 1, rotate: 0 }}
          animate={{
            x: `calc(50vw + ${p.x}vw)`,
            y: `calc(35vh + ${p.y}vh)`,
            opacity: [1, 1, 0],
            rotate: 360
          }}
          transition={{
            duration: 1.4,
            delay: p.delay,
            ease: "easeOut"
          }}
          className="absolute rounded-sm"
          style={{
            backgroundColor: p.color,
            width: `${p.size}px`,
            height: `${p.size}px`,
            zIndex: 15
          }}
        />
      ))}
    </div>
  );
}
