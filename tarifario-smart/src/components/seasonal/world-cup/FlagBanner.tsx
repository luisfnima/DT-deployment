'use client';

import React from 'react';
import { motion } from 'motion/react';

export default function FlagBanner() {
  const flags = Array.from({ length: 14 });

  return (
    <div className="absolute top-0 left-0 right-0 h-10 flex justify-center gap-1.5 overflow-hidden z-10 pointer-events-none opacity-90 select-none">
      {flags.map((_, index) => {
        // Alternar colores mundialistas / España (Rojo y Gualda)
        const isRed = index % 2 === 0;
        const color = isRed ? '#E60000' : '#FFC400';
        
        return (
          <motion.div
            key={index}
            initial={{ y: -20, rotate: index % 2 === 0 ? 3 : -3 }}
            animate={{
              y: [0, 2, 0],
              rotate: index % 2 === 0 ? [3, -1, 3] : [-3, 1, -3]
            }}
            transition={{
              duration: 4 + (index % 3) * 0.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-4 h-7 rounded-b shadow-[0_2px_4px_rgba(0,0,0,0.1)] origin-top border-t border-black/10 flex flex-col overflow-hidden"
            style={{ backgroundColor: color }}
          >
            {/* Sutil banda o detalle de bandera */}
            {!isRed && (
              <div className="w-full h-1/3 my-auto bg-[#E60000]/10 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#E60000]/20" />
              </div>
            )}
            {isRed && (
              <div className="w-full h-1/3 my-auto bg-[#FFC400]/20" />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
