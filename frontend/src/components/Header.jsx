import React, { useState } from 'react';

const Header = ({ userName, searchQuery, setSearchQuery, notifications = [], markAsRead }) => {
  const [showNotifs, setShowNotifs] = useState(false);
  const unreadCount = notifications.filter(n => !n.isRead).length;

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
        <div className="flex-1 max-w-md relative group">
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-[#C67347] transition-colors">
            🔍
          </span>
          <input 
            type="text" 
            placeholder="Search your sanctuary..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-stone-200/80 rounded-full py-2.5 px-12 outline-none text-sm transition-all focus:ring-4 focus:ring-[#C67347]/5 focus:border-[#C67347] shadow-sm"
          />
        </div>
        <div className="flex items-center gap-5">
          <div className="relative">
            <button 
              onClick={() => {
                setShowNotifs(!showNotifs);
                if (unreadCount > 0 && !showNotifs) markAsRead(); 
              }}
              className="relative p-2.5 bg-white rounded-full border border-stone-200/50 shadow-sm hover:shadow-md transition-all group"
            >
              <span className="text-lg group-hover:rotate-12 block transition-transform">🔔</span>
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2.5 w-4 h-4 bg-[#C67347] border-2 border-white rounded-full text-[8px] text-white flex items-center justify-center font-bold">
                  {unreadCount}
                </span>
              )}
            </button>
            {showNotifs && (
              <div className="absolute top-14 right-0 w-80 bg-white rounded-[32px] shadow-2xl border border-stone-100 p-6 z-50 animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Sanctuary Logs</h4>
                  {unreadCount > 0 && (
                    <button onClick={markAsRead} className="text-[9px] font-bold text-[#C67347] hover:underline">MARK ALL AS READ</button>
                  )}
                </div>

                <div className="space-y-3 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <div 
                        key={n.id} 
                        className={`p-4 rounded-2xl transition-colors ${n.isRead ? 'bg-stone-50/50 opacity-60' : 'bg-[#F9F7F2] border border-stone-100'}`}
                      >
                        <p className="text-[12px] text-stone-700 leading-snug font-medium">
                          {n.message}
                        </p>
                        <p className="text-[9px] text-stone-400 mt-2 flex justify-between">
                          <span>{new Date(n.createdAt).toLocaleDateString()}</span>
                          <span>{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-xs text-stone-400 italic">No logs in your sanctuary yet.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3 bg-white p-1 pr-5 rounded-full shadow-sm border border-stone-200/50">
            <div className="w-9 h-9 bg-[#C67347] rounded-full flex items-center justify-center text-white text-sm font-bold">
              {userName ? userName[0].toUpperCase() : 'S'}
            </div>
            <div className="hidden lg:block">
              <p className="text-xs font-bold text-stone-800 leading-none">{userName}</p>
              <p className="text-[8px] uppercase tracking-widest font-black text-[#C67347] mt-1">Lvl 12 Seeker</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;