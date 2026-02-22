import React, { useState } from 'react';
import alayaLogo from '../assets/images/image copy 2.png';

const Sidebar = ({ onLogout, activeTab, setActiveTab }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const menuItems = [
    { id: 'sanctuary', icon: "🏠", label: "Sanctuary" },
    { id: 'planner', icon: "🧘", label: "Planner" },
    { id: 'nutrition', icon: "📅", label: "Nutrition" },
    { id: 'favorites', icon: "❤️", label: "Favorites" }, 
    { id: 'progress', icon: "📈", label: "Progress" },
  ];

  return (
    <>
      <aside className="w-72 bg-[#F2EFE9] text-stone-800 flex flex-col p-8 fixed h-full shadow-[4px_0_24px_rgba(0,0,0,0.02)] border-r border-stone-200/50 z-40">
        <div className="flex items-center gap-4 mb-12">
          <img src={alayaLogo} alt="Alaya" className="w-10 h-10" />
          <h1 className="text-2xl font-serif italic text-stone-900 tracking-tight">Alaya</h1>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="w-full text-left outline-none border-none bg-transparent"
            >
              <NavItem 
                icon={item.icon} 
                label={item.label} 
                active={activeTab === item.id} 
              />
            </button>
          ))}
        </nav>

        //logout button
        <button 
          onClick={() => setShowLogoutModal(true)}
          className="mt-auto flex items-center gap-3 text-stone-500 hover:text-[#C67347] transition-all font-bold uppercase text-[10px] tracking-widest group border-none bg-transparent cursor-pointer"
        >
          <span className="group-hover:scale-110 transition-transform bg-white/50 p-2 rounded-lg">🚪</span> 
          Logout Sanctuary
        </button>
      </aside>

      // this is logout model
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center animate-fade-in">
          <div 
            className="absolute inset-0 bg-stone-900/30 backdrop-blur-md transition-all"
            onClick={() => setShowLogoutModal(false)}
          ></div>

          <div className="bg-[#F9F8F6] rounded-[40px] p-12 shadow-2xl z-10 w-[420px] text-center border border-stone-200/50 relative transform transition-all scale-100">
             <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner text-3xl">
                ✨
             </div>
             
             <h3 className="text-3xl font-serif text-stone-800 mb-3">Pause your journey?</h3>
             <p className="text-[13px] text-stone-500 mb-10 leading-relaxed px-4">
                Are you sure you want to log out? Your peaceful sanctuary will be waiting for your return.
             </p>

             <div className="flex flex-col gap-4">
                <button 
                  onClick={onLogout}
                  className="w-full bg-[#ae511f] text-white py-4 rounded-2xl font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-[#8e4219] transition-all shadow-lg shadow-[#C67347]/20"
                >
                  Yes, Log out
                </button>
                
                <button 
                  onClick={() => setShowLogoutModal(false)}
                  className="w-full py-4 text-stone-400 font-bold text-[10px] uppercase tracking-widest hover:text-stone-800 transition-colors"
                >
                  Keep Practicing
                </button>
             </div>
          </div>
        </div>
      )}
    </>
  );
};

const NavItem = ({ icon, label, active }) => (
  <div className={`relative flex items-center gap-4 py-3.5 px-6 cursor-pointer transition-all duration-300 group ${active ? 'text-white font-bold' : 'text-stone-500 hover:text-stone-800'}`}>
    <div className={`absolute inset-0 mx-2 rounded-2xl transition-all duration-300 ${active ? 'bg-[#ae511f] shadow-lg shadow-[#C67347]/20' : 'group-hover:bg-stone-200/40'}`}></div>
    <span className={`text-xl relative z-10 ${active ? 'scale-110' : ''} transition-transform`}>{icon}</span>
    <span className="text-[10px] font-black uppercase tracking-[0.25em] relative z-10">{label}</span>
  </div>
);

export default Sidebar;