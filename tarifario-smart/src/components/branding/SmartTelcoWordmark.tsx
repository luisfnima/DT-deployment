'use client';

import React from 'react';
import { motion } from 'motion/react';

export default function SmartTelcoWordmark() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex items-center gap-3.5 select-none group"
    >
      {/* 1. Logotipo oficial de DreamTeam */}
      <motion.div
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        className="relative shrink-0 flex items-center justify-center"
      >
        <img 
          src="/images/dreamlogo.png" 
          alt="DreamTeam" 
          className="h-9 w-auto object-contain drop-shadow-[0_2px_8px_rgba(254,0,2,0.15)]"
        />
      </motion.div>

      {/* 2. Textos (Wordmark + Badge + Subtexto) */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          {/* Wordmark Principal */}
          <h2 className="font-display font-extrabold text-[15px] tracking-tight leading-none text-slate-900 dark:text-white group-hover:text-[#FE0002] dark:group-hover:text-red-500 transition-colors duration-250 uppercase">
            Tarifario Smart
          </h2>
          
          {/* 3. Badge pill "TELCO" */}
          <span className="text-[7.5px] px-1.8 py-0.5 font-sans font-black tracking-widest bg-red-50 dark:bg-red-950/25 text-[#FE0002] dark:text-red-400 border border-red-100 dark:border-red-900/40 rounded-full uppercase select-none">
            Telco
          </span>
        </div>

        {/* 4. Subtexto premium de identidad del call center */}
        <p className="text-[9px] font-sans font-bold tracking-wider text-slate-400 dark:text-slate-500 mt-1 uppercase">
          DreamTeam Contact Center • Cotizador en Tiempo Real
        </p>
      </div>
    </motion.div>
  );
}
