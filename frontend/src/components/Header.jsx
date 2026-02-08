import React from 'react';

const Header = ({ userName }) => {
  return (
    <header className="sticky top-0 z-30 bg-[#F9F8F6]/80 backdrop-blur-md border-b border-stone-200/60 px-2 py-6 mb-10">
      <div className="flex justify-between items-center gap-8 max-w-400 mx-auto">
        <div className="shrink-0">
          <span className="text-[10px] uppercase tracking-[0.5em] font-black text-[#C67347] opacity-80">
            Welcome back to Alaya
          </span>
          <h2 className="text-3xl font-serif text-stone-900 mt-0.5">
            Namaste, <span className="italic">{userName || 'Seeker'}</span>
          </h2>
        </div>
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-3 bg-white p-1 pr-5 rounded-full shadow-sm border border-stone-200/50">
            <div className="w-9 h-9 bg-[#C67347] rounded-full flex items-center justify-center text-white text-sm font-bold">
              {userName ? userName[0].toUpperCase() : 'S'}
            </div>
            <div className="hidden lg:block">
              <p className="text-xs font-bold text-stone-800 leading-none">
                {userName || 'Seeker'}
              </p>
              <p className="text-[8px] uppercase tracking-widest font-black text-[#C67347] mt-1">
                Lvl 12 Seeker
              </p>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};

export default Header;