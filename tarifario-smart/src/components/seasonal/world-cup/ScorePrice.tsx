'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface ScorePriceProps {
  price: number;
  label?: string;
  accentColor: string;
}

export default function ScorePrice({ price, label = "TOTAL DEL COMBO", accentColor }: ScorePriceProps) {
  const [displayPrice, setDisplayPrice] = useState(price);
  const [isPulse, setIsPulse] = useState(false);

  // Efecto de transición numérica rápida e incremento
  useEffect(() => {
    if (price !== displayPrice) {
      setIsPulse(true);
      const duration = 400; // ms
      const startTime = performance.now();
      const startValue = displayPrice;
      const endValue = price;

      let animationFrameId: number;

      const animate = (currentTime: number) => {
        const elapsedTime = currentTime - startTime;
        if (elapsedTime >= duration) {
          setDisplayPrice(endValue);
          setIsPulse(false);
        } else {
          const progress = elapsedTime / duration;
          // Interpolación suave
          const nextValue = startValue + (endValue - startValue) * progress;
          setDisplayPrice(Math.round(nextValue * 100) / 100);
          animationFrameId = requestAnimationFrame(animate);
        }
      };

      animationFrameId = requestAnimationFrame(animate);

      return () => {
        cancelAnimationFrame(animationFrameId);
      };
    }
  }, [price, displayPrice]);

  return (
    <div className="flex flex-col items-center justify-center p-3.5 bg-slate-900 border border-slate-800 rounded-2xl relative overflow-hidden shadow-inner select-none w-full">
      {/* Decoración del Marcador Deportivo (Líneas LED sutiles de fondo) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100%_4px] opacity-25 pointer-events-none" />
      
      {/* Destello de fondo breve */}
      <AnimatePresence>
        {isPulse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none transition-all duration-300"
            style={{ backgroundColor: accentColor }}
          />
        )}
      </AnimatePresence>

      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest relative z-10 flex items-center gap-1">
        <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
        {label}
      </span>

      <motion.div
        animate={isPulse ? { scale: [1, 1.06, 1] } : {}}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex items-baseline gap-1 mt-1.5 relative z-10"
      >
        <span className="text-3xl font-black text-white tracking-tight font-mono">
          {displayPrice.toFixed(2)}
        </span>
        <span className="text-sm font-black text-slate-400">€</span>
      </motion.div>
      
      {/* Marco metálico / deportivo en la parte inferior */}
      <div 
        className="absolute bottom-0 inset-x-0 h-1" 
        style={{ backgroundColor: accentColor }}
      />
    </div>
  );
}
