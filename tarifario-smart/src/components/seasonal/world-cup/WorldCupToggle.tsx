'use client';

import React from 'react';
import { Trophy } from 'lucide-react';

interface WorldCupToggleProps {
  isActive: boolean;
  onToggle: () => void;
}

export default function WorldCupToggle({ isActive, onToggle }: WorldCupToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl border transition-all text-left w-full relative overflow-hidden select-none cursor-pointer ${
        isActive
          ? 'bg-[#FFC400]/10 border-[#FFC400] text-[#FFC400] shadow-[0_0_12px_rgba(255,196,0,0.1)]'
          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-350 hover:bg-slate-50'
      }`}
    >
      <div className="flex items-center gap-2 relative z-10">
        <Trophy className={`h-4.5 w-4.5 ${isActive ? 'text-[#FFC400] animate-bounce' : 'text-slate-400'}`} />
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-wider leading-none">Modo Mundial</span>
          <span className="text-[8px] text-slate-400 font-bold mt-0.5 leading-none">
            {isActive ? 'Activado (Fútbol/Glow)' : 'Desactivado'}
          </span>
        </div>
      </div>
      
      <div className="relative z-10">
        <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md ${
          isActive ? 'bg-[#FFC400] text-black' : 'bg-slate-100 text-slate-500'
        }`}>
          {isActive ? 'ON' : 'OFF'}
        </span>
      </div>
    </button>
  );
}
