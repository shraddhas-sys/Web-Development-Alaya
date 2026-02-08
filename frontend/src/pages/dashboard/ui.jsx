import React from 'react';

export const Card = ({ children, className = "" }) => (
  <div className={`bg-white/60 backdrop-blur-md rounded-[40px] p-8 border border-white/40 shadow-sm ${className}`}>
    {children}
  </div>
);

export const PillButton = ({ children, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 rounded-full text-[10px] uppercase tracking-[0.25em] font-black transition-all active:scale-95 ${
      active ? 'bg-[#C67347] text-white shadow-lg' : 'bg-white/50 text-stone-500 hover:bg-white'
    }`}
  >
    {children}
  </button>
);

export const SmallLabel = ({ children }) => (
  <span className="text-[9px] uppercase tracking-[0.3em] font-black text-stone-400 block mb-2">
    {children}
  </span>
);

